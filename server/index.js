import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import Stripe from 'stripe';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID, randomBytes, createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createReadStream, existsSync, mkdirSync } from 'node:fs';
import { readFile, rename, unlink } from 'node:fs/promises';
import { checkDatabase, initializeDatabase, pool } from './db.js';
import { emailEnabled, sendNotification } from './mailer.js';
import { resolveReceiptData, streamReceiptPdf } from './receipts.js';

const app = express();

// Express 4 does not forward rejected async route-handler promises to its
// error middleware. Wrap route callbacks so database/provider failures return
// a 500 response instead of becoming unhandled rejections that can crash Node.
for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
  const registerRoute = app[method].bind(app);
  app[method] = (...args) => registerRoute(...args.map((handler) => {
    if (typeof handler !== 'function' || handler.constructor.name !== 'AsyncFunction') return handler;
    return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
  }));
}

const port = Number(
  process.env.API_PORT ||
    (process.env.NODE_ENV !== 'production' && process.env.PORT === '8080' ? 4000 : process.env.PORT) ||
    4000
);
const jwtSecret = process.env.JWT_SECRET;
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

if (!jwtSecret || jwtSecret.startsWith('replace-with-')) {
  throw new Error('JWT_SECRET must be configured before starting the API');
}
if (process.env.NODE_ENV === 'production') {
  const missingProductionConfig = ['APP_URL', 'CORS_ORIGINS'].filter((key) => !process.env[key]);
  if (missingProductionConfig.length) {
    throw new Error(`Missing production environment variables: ${missingProductionConfig.join(', ')}`);
  }
  if (!process.env.APP_URL.startsWith('https://')) {
    throw new Error('APP_URL must use HTTPS in production');
  }
  if (jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters in production');
  }
}

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.post('/api/payments/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(503).json({ success: false, message: 'Stripe webhook is not configured.' });
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return res.status(400).json({ success: false, message: `Invalid Stripe webhook: ${error.message}` });
  }
  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object;
    const paymentId = session.metadata?.paymentId;
    const maintenanceInvoiceId = session.metadata?.maintenanceInvoiceId;
    const paymentSucceeded = event.type === 'checkout.session.async_payment_succeeded' || session.payment_status === 'paid';
    if (!paymentSucceeded) return res.json({ received: true, ignored: 'payment_not_complete' });
    if (paymentId) {
      await pool.execute('UPDATE payments SET status = ?, provider_reference = ?, paid_at = NOW() WHERE id = ? AND status <> \'paid\'', ['paid', session.payment_intent || session.id, paymentId]);
      await pool.execute('UPDATE project_milestones m JOIN payments p ON p.milestone_id = m.id SET m.status = \'paid\', m.payment_provider = p.provider, m.payment_reference = p.provider_reference, m.paid_at = NOW() WHERE p.id = ? AND p.status = \'paid\'', [paymentId]);
    }
    if (maintenanceInvoiceId) {
      await pool.execute('UPDATE maintenance_invoices SET status = \'paid\', provider_reference = ?, paid_at = NOW() WHERE id = ? AND status <> \'paid\'', [session.payment_intent || session.id, maintenanceInvoiceId]);
    }
  }
  return res.json({ received: true });
});
app.use(express.json({ limit: '600kb' }));

const loginAttempts = new Map();
const inquiryAttempts = new Map();
function allowRequest(store, key, limit, windowMs) {
  const now = Date.now();
  const current = store.get(key);
  if (!current || now - current.startedAt > windowMs) {
    store.set(key, { startedAt: now, count: 1 });
    return true;
  }
  current.count += 1;
  return current.count <= limit;
}

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.resolve(projectRoot, '..', 'dist');
const uploadDirectory = path.resolve(projectRoot, '..', 'public', 'uploads', 'portfolio');
const documentDirectory = path.resolve(projectRoot, '..', 'private', 'project-files');
mkdirSync(uploadDirectory, { recursive: true });
mkdirSync(documentDirectory, { recursive: true });
const imageUpload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (_req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `${randomUUID()}${extension}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    callback(null, ['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.mimetype));
  }
});

function detectImageFormat(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mimeType: 'image/jpeg', extension: '.jpg' };
  }
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { mimeType: 'image/png', extension: '.png' };
  }
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    return { mimeType: 'image/webp', extension: '.webp' };
  }
  if (buffer.length >= 12 && buffer.toString('ascii', 4, 8) === 'ftyp') {
    const brands = buffer.toString('ascii', 8, Math.min(buffer.length, 64));
    if (brands.includes('avif') || brands.includes('avis')) return { mimeType: 'image/avif', extension: '.avif' };
  }
  return null;
}

const documentUpload = multer({
  storage: multer.diskStorage({ destination: documentDirectory, filename: (_req, file, callback) => callback(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`) }),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => callback(null, ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/zip', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.mimetype))
});
app.use('/uploads', express.static(path.resolve(projectRoot, '..', 'public', 'uploads')));

async function readBlogPosts() {
  const [rows] = await pool.execute('SELECT content_json FROM site_content WHERE content_key = ? LIMIT 1', ['site']);
  if (!rows.length) return [];
  try {
    const site = JSON.parse(rows[0].content_json);
    return Array.isArray(site.blogPosts) ? site.blogPosts : [];
  } catch { return []; }
}

function blogLanguage(req) {
  const requested = String(req.query.lang || '').toLowerCase();
  if (['en', 'de', 'es'].includes(requested)) return requested;
  const locales = String(req.headers['accept-language'] || '').split(',').map((part) => part.trim().split(';')[0]);
  for (const locale of locales) {
    const language = locale.split('-')[0].toLowerCase();
    if (['en', 'de', 'es'].includes(language)) return language;
    try {
      const region = new Intl.Locale(locale).region;
      if (['DE', 'AT', 'CH', 'LI', 'LU'].includes(region)) return 'de';
    } catch {}
  }
  return 'en';
}

function blogTranslation(post, language) {
  const exact = post?.translations?.[language];
  if (exact?.title && exact?.body) return exact;
  return post?.translations?.en?.title ? post.translations.en : Object.values(post?.translations || {}).find((copy) => copy?.title && copy?.body) || {};
}

function escapeBlogHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function blogBodyHtml(body) {
  return String(body || '').split(/\n\s*\n/).filter(Boolean).map((paragraph) => `<p>${escapeBlogHtml(paragraph.trim()).replaceAll('\n', '<br>')}</p>`).join('');
}

function blogDateLabel(value, language) {
  if (!value) return '';
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat({ en: 'en-GB', de: 'de-DE', es: 'es-ES' }[language], { dateStyle: 'medium' }).format(date);
}

function renderBlogCard(post, language) {
  const content = blogTranslation(post, language);
  const url = `/blog/${encodeURIComponent(post.slug)}?lang=${language}`;
  return `<article class="blog-card">${post.coverImage ? `<a href="${url}"><img src="${escapeBlogHtml(post.coverImage)}" alt="${escapeBlogHtml(content.coverAlt || content.title)}" loading="lazy"></a>` : ''}<div class="blog-card-content"><div class="blog-card-meta"><span>${escapeBlogHtml(content.category || post.category || 'Insights')}</span><time datetime="${escapeBlogHtml(String(post.publishedAt || '').slice(0, 10))}">${escapeBlogHtml(blogDateLabel(post.publishedAt, language))}</time></div><h2><a href="${url}">${escapeBlogHtml(content.title)}</a></h2><p>${escapeBlogHtml(content.excerpt || '')}</p><a class="blog-read" href="${url}">${({ en: 'Read article →', de: 'Artikel lesen →', es: 'Leer artículo →' })[language]}</a></div></article>`;
}

if (existsSync(distDirectory)) {
  app.get('/sitemap.xml', async (req, res, next) => {
    try {
      const base = await readFile(path.join(distDirectory, 'sitemap.xml'), 'utf8');
      const posts = (await readBlogPosts()).filter((post) => post.status === 'published' && post.slug);
      const entries = posts.flatMap((post) => {
        const languages = ['en', 'de', 'es'].filter((language) => post.translations?.[language]?.title && post.translations?.[language]?.body);
        const alternates = languages.map((language) => `<xhtml:link rel="alternate" hreflang="${language}" href="https://rstechwerk.com/blog/${encodeURIComponent(post.slug)}?lang=${language}"/>`).join('');
        const fallback = `<xhtml:link rel="alternate" hreflang="x-default" href="https://rstechwerk.com/blog/${encodeURIComponent(post.slug)}?lang=${languages.includes('en') ? 'en' : languages[0]}"/>`;
        return languages.map((language) => `<url><loc>https://rstechwerk.com/blog/${encodeURIComponent(post.slug)}?lang=${language}</loc>${alternates}${fallback}<lastmod>${escapeBlogHtml(String(post.updatedAt || post.publishedAt || '').slice(0, 10))}</lastmod><changefreq>yearly</changefreq><priority>0.65</priority></url>`);
      }).join('');
      const blogLanguages = ['en', 'de', 'es'];
      const blogAlternates = blogLanguages.map((language) => `<xhtml:link rel="alternate" hreflang="${language}" href="https://rstechwerk.com/blog?lang=${language}"/>`).join('');
      const blogEntries = blogLanguages.map((language) => `<url><loc>https://rstechwerk.com/blog?lang=${language}</loc>${blogAlternates}<xhtml:link rel="alternate" hreflang="x-default" href="https://rstechwerk.com/blog?lang=en"/><changefreq>weekly</changefreq><priority>0.7</priority></url>`).join('');
      return res.type('application/xml').send(base.replace('</urlset>', `${blogEntries}${entries}</urlset>`));
    } catch (error) { return next(error); }
  });
  app.get('/blog', async (req, res, next) => {
    try {
      const language = blogLanguage(req);
      const posts = (await readBlogPosts()).filter((post) => post.status === 'published' && blogTranslation(post, language).title).sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')));
      let html = await readFile(path.join(distDirectory, 'blog.html'), 'utf8');
      const languageCopy = {
        en: ['Software Engineering Insights | RSTechwerk', 'Practical guidance on custom software, ERP, SaaS, integrations and software delivery for European businesses.', 'Engineering insights', 'Ideas for building better software', 'Practical, experience-led guidance on custom software, ERP, SaaS, integrations and dependable delivery.'],
        de: ['Einblicke in die Softwareentwicklung | RSTechwerk', 'Praxisnahe Orientierung zu Individualsoftware, ERP, SaaS, Integrationen und zuverlässiger Umsetzung für europäische Unternehmen.', 'Einblicke in die Softwareentwicklung', 'Ideen für bessere Software', 'Praxisnahe Orientierung zu Individualsoftware, ERP, SaaS, Integrationen und zuverlässiger Umsetzung.'],
        es: ['Ideas de ingeniería de software | RSTechwerk', 'Consejos prácticos sobre software a medida, ERP, SaaS, integraciones y desarrollo de software para empresas europeas.', 'Ideas de ingeniería', 'Ideas para crear mejor software', 'Consejos prácticos sobre software a medida, ERP, SaaS, integraciones y entregas fiables.']
      }[language];
      html = html.replace('<html lang="en">', `<html lang="${language}">`).replace('<title>Software Engineering Insights | RSTechwerk</title>', `<title>${escapeBlogHtml(languageCopy[0])}</title>`).replace('content="Practical guidance on custom software, ERP, SaaS, integrations and software delivery for European businesses."', `content="${escapeBlogHtml(languageCopy[1])}"`).replace('href="https://rstechwerk.com/blog"', `href="https://rstechwerk.com/blog?lang=${language}"`).replace('id="blogKicker">Engineering insights', `id="blogKicker">${escapeBlogHtml(languageCopy[2])}`).replace('id="blogHeading">Ideas for building better software', `id="blogHeading">${escapeBlogHtml(languageCopy[3])}`).replace('id="blogIntro">Practical, experience-led guidance on custom software, ERP, SaaS, integrations and dependable delivery.', `id="blogIntro">${escapeBlogHtml(languageCopy[4])}`).replace('<section class="blog-grid" id="blogPostGrid" aria-live="polite"><p class="blog-empty">Loading articles…</p></section>', `<section class="blog-grid" id="blogPostGrid" aria-live="polite" data-server-rendered="true">${posts.length ? posts.map((post) => renderBlogCard(post, language)).join('') : `<p class="blog-empty">${({ en: 'No articles have been published yet.', de: 'Es wurden noch keine Artikel veröffentlicht.', es: 'Todavía no se han publicado artículos.' })[language]}</p>`}</section>`);
      const listingAlternates = ['en', 'de', 'es'].map((item) => `<link rel="alternate" hreflang="${item}" href="https://rstechwerk.com/blog?lang=${item}">`).join('') + '<link rel="alternate" hreflang="x-default" href="https://rstechwerk.com/blog?lang=en">';
      html = html.replace('</head>', `${listingAlternates}</head>`);
      return res.type('html').send(html);
    } catch (error) { return next(error); }
  });
  app.get('/blog/:slug', async (req, res, next) => {
    try {
      const post = (await readBlogPosts()).find((item) => item.status === 'published' && item.slug === req.params.slug);
      const language = blogLanguage(req);
      const hasTranslation = Boolean(post?.translations?.[language]?.title && post?.translations?.[language]?.body);
      const pageLanguage = hasTranslation ? language : 'en';
      const content = blogTranslation(post, pageLanguage);
      if (!post || !content.title || !content.body) return res.status(404).send('Article not found.');
      let html = await readFile(path.join(distDirectory, 'blog-post.html'), 'utf8');
      const title = content.metaTitle || content.title;
      const description = content.metaDescription || content.excerpt || '';
      const canonical = `https://rstechwerk.com/blog/${encodeURIComponent(post.slug)}?lang=${pageLanguage}`;
      const cover = post.coverImage ? `<img class="article-cover" src="${escapeBlogHtml(post.coverImage)}" alt="${escapeBlogHtml(content.coverAlt || content.title)}">` : '';
      const articleHtml = `<header class="article-header"><span class="article-category">${escapeBlogHtml(content.category || post.category || 'Insights')}</span><h1>${escapeBlogHtml(content.title)}</h1><p class="article-excerpt">${escapeBlogHtml(content.excerpt || '')}</p><div class="article-meta"><span>${escapeBlogHtml(post.author || 'RSTechwerk')}</span><time datetime="${escapeBlogHtml(String(post.publishedAt || '').slice(0, 10))}">${escapeBlogHtml(blogDateLabel(post.publishedAt, pageLanguage))}</time></div></header>${cover}<div class="article-body">${blogBodyHtml(content.body)}</div><footer class="article-footer"><a href="/blog?lang=${pageLanguage}">${({ en: '← All insights', de: '← Alle Beiträge', es: '← Todos los artículos' })[pageLanguage]}</a> · <a href="/#contact">${({ en: 'Discuss a project →', de: 'Projekt besprechen →', es: 'Hablar de un proyecto →' })[pageLanguage]}</a></footer>`;
      const schema = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: content.title, description, image: post.coverImage || undefined, datePublished: post.publishedAt || undefined, dateModified: post.updatedAt || post.publishedAt || undefined, articleSection: content.category || post.category || undefined, keywords: Array.isArray(post.tags) ? post.tags.join(', ') : undefined, author: { '@type': post.author ? 'Person' : 'Organization', name: post.author || 'RSTechwerk' }, publisher: { '@type': 'Organization', name: 'RSTechwerk', url: 'https://rstechwerk.com/' }, mainEntityOfPage: canonical, inLanguage: pageLanguage };
      const translatedLanguages = ['en', 'de', 'es'].filter((item) => post.translations?.[item]?.title && post.translations?.[item]?.body);
      const articleAlternates = translatedLanguages.map((item) => `<link rel="alternate" hreflang="${item}" href="https://rstechwerk.com/blog/${encodeURIComponent(post.slug)}?lang=${item}">`).join('') + `<link rel="alternate" hreflang="x-default" href="https://rstechwerk.com/blog/${encodeURIComponent(post.slug)}?lang=${translatedLanguages.includes('en') ? 'en' : translatedLanguages[0]}">`;
      html = html.replace('<html lang="en">', `<html lang="${pageLanguage}">`).replace('<title>Article | RSTechwerk</title>', `<title>${escapeBlogHtml(title)} | RSTechwerk</title>`).replace('content="Software engineering insight from RSTechwerk."', `content="${escapeBlogHtml(description)}"`).replace('href="https://rstechwerk.com/blog"', `href="${escapeBlogHtml(canonical)}"`).replace('id="blogArticle" data-blog-article data-blog-slug="" data-blog-ready="false"', `id="blogArticle" data-blog-article data-blog-slug="${escapeBlogHtml(post.slug)}" data-blog-ready="true" data-blog-language="${pageLanguage}"`).replace('<div id="articleResult"><p>Loading article…</p></div>', `<div id="articleResult">${articleHtml}</div>`).replace('</head>', `${articleAlternates}<meta property="og:title" content="${escapeBlogHtml(title)}"><meta property="og:description" content="${escapeBlogHtml(description)}"><meta property="og:url" content="${escapeBlogHtml(canonical)}">${post.coverImage ? `<meta property="og:image" content="${escapeBlogHtml(post.coverImage)}">` : ''}<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script></head>`);
      if (hasTranslation) html = html.replace('<meta name="robots" content="noindex,follow">', '');
      return res.type('html').send(html);
    } catch (error) { return next(error); }
  });
}
if (existsSync(distDirectory)) {
  app.use(express.static(distDirectory, { index: 'index.html' }));
  app.get(['/admin', '/admin/'], (_req, res) => res.sendFile(path.join(distDirectory, 'admin.html')));
  app.get(['/login', '/login/', '/admin/login'], (_req, res) => res.sendFile(path.join(distDirectory, 'login.html')));
  app.get(['/portal', '/portal/'], (_req, res) => res.sendFile(path.join(distDirectory, 'portal.html')));
  app.get(['/register', '/register/'], (_req, res) => res.sendFile(path.join(distDirectory, 'register.html')));
  app.get(['/reset-password', '/reset-password/'], (_req, res) => res.sendFile(path.join(distDirectory, 'reset-password.html')));
  app.get(['/admin-client', '/admin-client/'], (_req, res) => res.sendFile(path.join(distDirectory, 'admin-client.html')));
  app.get(/^\/(de|es)\/?$/, async (req, res, next) => {
    try {
      const language = req.params[0];
      const [rows] = await pool.execute('SELECT content_key, content_json FROM site_content WHERE content_key IN (?, ?)', ['site', 'i18n']);
      const content = Object.fromEntries(rows.map((row) => {
        try { return [row.content_key, JSON.parse(row.content_json)]; }
        catch { return [row.content_key, {}]; }
      }));
      const site = content.site || {};
      const settings = site.settings || {};
      const sectionSettings = site.translations?.[language]?.settings || {};
      const dictionary = content.i18n?.[language] || {};
      const defaultTitle = 'Custom Software Development | RSTechwerk';
      const defaultDescription = 'Custom software, ERP, SaaS and mobile apps for businesses in Germany and Europe. RSTechwerk delivers product design, engineering and ongoing support.';
      const legacyTitle = 'RSTechwerk – Software Development & Technology Solutions | rstechwerk.com';
      const legacyDescription = 'RSTechwerk turns ideas into reliable digital products—from discovery and UI/UX design to full-stack engineering, cloud deployment, and ongoing maintenance for German and European businesses.';
      const localizedDefaults = {
        de: {
          title: 'Individuelle Softwareentwicklung | RSTechwerk',
          description: 'Individuelle Software, ERP, SaaS und mobile Apps für Unternehmen in Deutschland und Europa. RSTechwerk begleitet Design, Entwicklung und Wartung.'
        },
        es: {
          title: 'Desarrollo de software a medida | RSTechwerk',
          description: 'Software a medida, ERP, SaaS y aplicaciones móviles para empresas de Alemania y Europa. RSTechwerk ofrece diseño, desarrollo y mantenimiento.'
        }
      }[language];
      const rawTitle = !settings.metaTitle || settings.metaTitle === legacyTitle ? defaultTitle : settings.metaTitle;
      const rawDescription = !settings.metaDescription || settings.metaDescription === legacyDescription ? defaultDescription : settings.metaDescription;
      const title = sectionSettings.metaTitle || dictionary[rawTitle] || (rawTitle === defaultTitle ? localizedDefaults.title : rawTitle);
      const description = sectionSettings.metaDescription || dictionary[rawDescription] || (rawDescription === defaultDescription ? localizedDefaults.description : rawDescription);
      const escapeAttribute = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
      const replaceMetaContent = (html, selector, value) => html.replace(selector, (tag) => tag.replace(/content="[^"]*"/, `content="${escapeAttribute(value)}"`));
      const localizedUrl = `https://rstechwerk.com/${language}/`;
      let html = await readFile(path.join(distDirectory, 'index.html'), 'utf8');
      html = html.replace('<html lang="en"', `<html lang="${language}"`);
      html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttribute(title)}</title>`);
      html = replaceMetaContent(html, /<meta name="description"[^>]*>/, description);
      html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${localizedUrl}">`);
      html = replaceMetaContent(html, /<meta property="og:title"[^>]*>/, title);
      html = replaceMetaContent(html, /<meta property="og:description"[^>]*>/, description);
      html = replaceMetaContent(html, /<meta property="og:url"[^>]*>/, localizedUrl);
      html = replaceMetaContent(html, /<meta property="og:locale"[^>]*>/, language === 'de' ? 'de_DE' : 'es_ES');
      html = html.replace(/\s*<meta property="og:locale:alternate"[^>]*>/g, '');
      const alternateLocale = language === 'de' ? 'es_ES' : 'de_DE';
      html = html.replace(/<meta property="og:locale"[^>]*>/, (tag) => `${tag}\n    <meta property="og:locale:alternate" content="en_GB" />\n    <meta property="og:locale:alternate" content="${alternateLocale}" />`);
      html = replaceMetaContent(html, /<meta name="twitter:title"[^>]*>/, title);
      html = replaceMetaContent(html, /<meta name="twitter:description"[^>]*>/, description);
      html = html.replace('"inLanguage": ["en", "de", "es"]', `"inLanguage": "${language}"`);
      const alternates = [
        '<link rel="alternate" hreflang="en" href="https://rstechwerk.com/">',
        '<link rel="alternate" hreflang="de" href="https://rstechwerk.com/de/">',
        '<link rel="alternate" hreflang="es" href="https://rstechwerk.com/es/">',
        '<link rel="alternate" hreflang="x-default" href="https://rstechwerk.com/">'
      ].join('\n    ');
      html = html.replace(/\s*<link rel="alternate" hreflang="[^"]+"[^>]*>/g, '');
      html = html.replace('</head>', `    ${alternates}\n  </head>`);
      res.type('html').send(html);
    } catch (error) {
      return next(error);
    }
  });
}

function issueToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '8h' });
}

async function requireAuth(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ success: false, message: 'Authentication required.' });

  let claims;
  try {
    claims = jwt.verify(token, jwtSecret);
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }

  const [rows] = await pool.execute('SELECT id, email, role, status FROM admin_users WHERE id = ? LIMIT 1', [claims.sub]);
  const account = rows[0];
  if (!account || account.status !== 'active') {
    return res.status(401).json({ success: false, message: 'Account is unavailable. Please sign in again or contact an administrator.' });
  }
  // Use current database permissions so role changes take effect immediately.
  req.user = { ...claims, sub: account.id, email: account.email, role: account.role };
  return next();
}

const STAFF_ROLES = ['Administrator', 'admin', 'sub_admin', 'manager', 'developer'];
const STAFF_ROLE_SET = new Set(STAFF_ROLES);
const ADMIN_MANAGER_ROLE_SET = new Set(['Administrator', 'admin', 'sub_admin']);
const TOP_ADMIN_ROLE_SET = new Set(['Administrator', 'admin']);
const ASSIGNABLE_STAFF_ROLES = new Set(['sub_admin', 'developer', 'manager', 'admin']);

function isStaffRole(role) {
  return STAFF_ROLE_SET.has(role);
}

function requireStaff(req, res, next) {
  if (!isStaffRole(req.user?.role)) {
    return res.status(403).json({ success: false, message: 'Staff access required.' });
  }
  return next();
}

function requireAdminManager(req, res, next) {
  if (!ADMIN_MANAGER_ROLE_SET.has(req.user?.role)) {
    return res.status(403).json({ success: false, message: 'Administrator or sub-admin access required.' });
  }
  return next();
}

function cleanString(value, max = 5000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

app.get('/api/health', async (_req, res) => {
  try {
    await checkDatabase();
    res.json({ success: true, service: 'rstechwerk-api', database: 'connected' });
  } catch (error) {
    console.error('Database health check failed:', error.message);
    res.status(503).json({ success: false, service: 'rstechwerk-api', database: 'unavailable' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const clientKey = req.ip || 'unknown';
  if (!allowRequest(loginAttempts, clientKey, 10, 15 * 60 * 1000)) {
    return res.status(429).json({ success: false, message: 'Too many login attempts. Please try again later.' });
  }
  const email = cleanString(req.body?.email, 255).toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required.' });

  const [rows] = await pool.execute('SELECT id, email, full_name AS fullName, password_hash, role, status FROM admin_users WHERE email = ? LIMIT 1', [email]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }
  if (user.status === 'suspended') {
    return res.status(403).json({ success: false, message: 'Your account access has been suspended. Please contact an administrator.' });
  }
  if (user.role === 'client') {
    const [clientRows] = await pool.execute('SELECT status FROM clients WHERE user_id = ? LIMIT 1', [user.id]);
    if (clientRows[0]?.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your client portal access is currently suspended.' });
    }
  }

  return res.json({
    success: true,
    token: issueToken(user),
    user: {
      id: user.id,
      email: user.email,
      name: user.fullName || user.email,
      fullName: user.fullName || null,
      role: user.role,
      status: user.status || 'active'
    }
  });
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const email = cleanString(req.body?.email, 255).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  const [rows] = await pool.execute('SELECT id, email FROM admin_users WHERE email = ? LIMIT 1', [email]);
  if (rows[0]) {
    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    await pool.execute('UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL', [rows[0].id]);
    await pool.execute('INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 MINUTE))', [randomUUID(), rows[0].id, tokenHash]);
    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password.html?token=${rawToken}`;
    await sendNotification({ to: email, subject: 'Reset your RSTechwerk password', text: `Use this link within 30 minutes to set a new password: ${resetUrl}`, html: `<p>Use this secure link within 30 minutes to set a new password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>` });
    if (!emailEnabled()) console.log(`[password-reset] Configure SMTP to email reset link for ${email}. Link generated: ${resetUrl}`);
  }
  return res.json({ success: true, message: 'If an account exists, a password reset link has been sent.' });
});

app.post('/api/auth/reset-password', async (req, res) => {
  const rawToken = cleanString(req.body?.token, 100);
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!rawToken || password.length < 10) return res.status(400).json({ success: false, message: 'A valid reset token and 10+ character password are required.' });
  const tokenHash = createHash('sha256').update(rawToken).digest('hex');
  const [rows] = await pool.execute('SELECT id, user_id AS userId FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW() LIMIT 1', [tokenHash]);
  if (!rows[0]) return res.status(400).json({ success: false, message: 'This reset link is invalid or expired.' });
  await pool.execute('UPDATE admin_users SET password_hash = ? WHERE id = ?', [await bcrypt.hash(password, 12), rows[0].userId]);
  await pool.execute('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?', [rows[0].id]);
  return res.json({ success: true, message: 'Password reset successfully.' });
});

app.post('/api/auth/register', async (req, res) => {
  const clientKey = req.ip || 'unknown';
  if (!allowRequest(inquiryAttempts, `register:${clientKey}`, 5, 60 * 60 * 1000)) return res.status(429).json({ success: false, message: 'Too many registration attempts. Please try again later.' });
  const companyName = cleanString(req.body?.companyName, 255);
  const contactName = cleanString(req.body?.contactName, 180);
  const email = cleanString(req.body?.email, 255).toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!companyName || !contactName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 10) return res.status(400).json({ success: false, message: 'Company, contact, valid email and a 10+ character password are required.' });
  const userId = randomUUID(); const clientId = randomUUID(); const hash = await bcrypt.hash(password, 12);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute('INSERT INTO admin_users (id, email, password_hash, role) VALUES (?, ?, ?, ?)', [userId, email, hash, 'client']);
    await connection.execute('INSERT INTO clients (id, user_id, company_name, contact_name, email, phone, country) VALUES (?, ?, ?, ?, ?, ?, ?)', [clientId, userId, companyName, contactName, email, cleanString(req.body?.phone, 30) || null, cleanString(req.body?.country, 100) || null]);
    await connection.execute('INSERT INTO client_profiles (client_id, timezone, preferred_language) VALUES (?, ?, ?)', [clientId, cleanString(req.body?.timezone, 80) || 'Europe/Berlin', cleanString(req.body?.preferredLanguage, 2) || 'en']);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    throw error;
  } finally { connection.release(); }
  const user = { id: userId, email, role: 'client' };
  return res.status(201).json({ success: true, token: issueToken(user), user, clientId, message: 'Account created successfully.' });
});

app.get('/api/notifications/status', requireAuth, requireStaff, (_req, res) => res.json({ success: true, emailEnabled: emailEnabled() }));

app.get('/api/auth/me', requireAuth, async (req, res) => {
  const [rows] = await pool.execute('SELECT id, email, full_name AS fullName, role, status FROM admin_users WHERE id = ? LIMIT 1', [req.user.sub]);
  const user = rows[0];
  if (!user) return res.status(401).json({ success: false, message: 'User account not found.' });
  if (user.status === 'suspended') return res.status(403).json({ success: false, message: 'Account access is suspended.' });
  return res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.fullName || user.email,
      fullName: user.fullName || null,
      role: user.role,
      status: user.status || 'active'
    }
  });
});

app.get('/api/client/profile', requireAuth, async (req, res) => {
  const [rows] = await pool.execute(`SELECT c.id AS clientId, c.company_name AS companyName, c.contact_name AS contactName, c.email, c.phone, c.country, c.status, p.website, p.address, p.city, p.postal_code AS postalCode, p.timezone, p.preferred_language AS preferredLanguage, p.avatar_url AS avatarUrl FROM clients c LEFT JOIN client_profiles p ON p.client_id = c.id WHERE c.user_id = ? LIMIT 1`, [req.user.sub]);
  if (!rows[0]) return res.status(404).json({ success: false, message: 'Client profile not found.' });
  return res.json({ success: true, profile: rows[0] });
});

app.patch('/api/client/profile', requireAuth, async (req, res) => {
  const fields = { companyName: cleanString(req.body?.companyName, 255), contactName: cleanString(req.body?.contactName, 180), phone: cleanString(req.body?.phone, 30), country: cleanString(req.body?.country, 100), website: cleanString(req.body?.website, 255), address: cleanString(req.body?.address, 500), city: cleanString(req.body?.city, 120), postalCode: cleanString(req.body?.postalCode, 30), timezone: cleanString(req.body?.timezone, 80), preferredLanguage: cleanString(req.body?.preferredLanguage, 2) || 'en' };
  if (!fields.companyName || !fields.contactName) return res.status(400).json({ success: false, message: 'Company name and contact name are required.' });
  const [clientRows] = await pool.execute('SELECT id FROM clients WHERE user_id = ? LIMIT 1', [req.user.sub]);
  if (!clientRows[0]) return res.status(404).json({ success: false, message: 'Client profile not found.' });
  const clientId = clientRows[0].id;
  await pool.execute('UPDATE clients SET company_name = ?, contact_name = ?, phone = ?, country = ? WHERE id = ?', [fields.companyName, fields.contactName, fields.phone || null, fields.country || null, clientId]);
  await pool.execute('INSERT INTO client_profiles (client_id, website, address, city, postal_code, timezone, preferred_language) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE website=VALUES(website), address=VALUES(address), city=VALUES(city), postal_code=VALUES(postal_code), timezone=VALUES(timezone), preferred_language=VALUES(preferred_language)', [clientId, fields.website || null, fields.address || null, fields.city || null, fields.postalCode || null, fields.timezone || null, fields.preferredLanguage]);
  return res.json({ success: true, message: 'Profile updated.' });
});

app.post('/api/client/password', requireAuth, async (req, res) => {
  const currentPassword = typeof req.body?.currentPassword === 'string' ? req.body.currentPassword : '';
  const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';
  if (newPassword.length < 10) return res.status(400).json({ success: false, message: 'New password must be at least 10 characters.' });
  const [rows] = await pool.execute('SELECT password_hash FROM admin_users WHERE id = ? LIMIT 1', [req.user.sub]);
  if (!rows[0] || !(await bcrypt.compare(currentPassword, rows[0].password_hash))) return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
  await pool.execute('UPDATE admin_users SET password_hash = ? WHERE id = ?', [await bcrypt.hash(newPassword, 12), req.user.sub]);
  return res.json({ success: true, message: 'Password changed. Please sign in again on other devices.' });
});

app.post('/api/inquiries', async (req, res) => {
  const clientKey = req.ip || 'unknown';
  if (!allowRequest(inquiryAttempts, clientKey, 12, 60 * 60 * 1000)) {
    return res.status(429).json({ success: false, message: 'Too many inquiries from this connection. Please try again later.' });
  }
  const body = req.body || {};
  const fullName = cleanString(body.fullName, 180);
  const email = cleanString(body.email, 255).toLowerCase();
  const phone = cleanString(body.phone, 30).replace(/[^\d+]/g, '');
  const service = cleanString(body.service, 120);
  const description = cleanString(body.description, 5000);
  if (!fullName || !email || !phone || phone.replace(/\D/g, '').length < 6 || !service || description.length < 20 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide valid inquiry details.' });
  }

  const id = randomUUID();
  await pool.execute(
    `INSERT INTO inquiries (id, full_name, email, phone, company, service, budget, custom_budget, currency, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, fullName, email, phone, cleanString(body.company, 255) || null, service, cleanString(body.budget, 120) || null,
      body.customBudget ? Number(body.customBudget) : null, cleanString(body.currency, 3) || null, description]
  );
  return res.status(201).json({ success: true, inquiryId: id, message: 'Inquiry received successfully.' });
});

app.get('/api/inquiries', requireAuth, requireStaff, async (_req, res) => {
  const [rows] = await pool.query(`
    SELECT id, full_name AS fullName, email, phone, company, service, budget, custom_budget AS customBudget,
           currency, description, status, internal_notes AS internalNotes, created_at AS createdAt, updated_at AS updatedAt
    FROM inquiries ORDER BY created_at DESC
  `);
  return res.json({ success: true, inquiries: rows });
});

app.get('/api/dashboard/stats', requireAuth, requireStaff, async (_req, res) => {
  const [rows] = await pool.query(`
    SELECT COUNT(*) AS total,
      SUM(status = 'new') AS newCount,
      SUM(status = 'discovery') AS discoveryCount,
      SUM(status = 'proposal') AS proposalCount,
      SUM(status = 'won') AS wonCount
    FROM inquiries
  `);
  return res.json({ success: true, stats: rows[0] });
});

app.patch('/api/inquiries/:id', requireAuth, requireStaff, async (req, res) => {
  const status = cleanString(req.body?.status, 40);
  const internalNotes = cleanString(req.body?.internalNotes, 5000);
  const allowedStatuses = new Set(['new', 'discovery', 'proposal', 'won', 'lost']);
  if (!allowedStatuses.has(status)) return res.status(400).json({ success: false, message: 'Invalid inquiry status.' });
  const [result] = await pool.execute('UPDATE inquiries SET status = ?, internal_notes = ? WHERE id = ?', [status, internalNotes || null, req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
  return res.json({ success: true });
});

app.delete('/api/inquiries/:id', requireAuth, requireStaff, async (req, res) => {
  const [result] = await pool.execute('DELETE FROM inquiries WHERE id = ?', [req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
  return res.json({ success: true });
});

app.get('/api/clients', requireAuth, requireStaff, async (_req, res) => {
  const [rows] = await pool.query(`SELECT c.id, c.user_id AS userId, c.company_name AS companyName, c.contact_name AS contactName, c.email, c.phone, c.country, c.status, c.created_at AS createdAt, COUNT(p.id) AS projectCount, COALESCE(SUM(p.status IN ('active','in_progress','development','testing')), 0) AS activeProjectCount FROM clients c LEFT JOIN projects p ON p.client_id = c.id GROUP BY c.id ORDER BY c.created_at DESC`);
  return res.json({ success: true, clients: rows });
});

app.post('/api/clients', requireAuth, requireStaff, async (req, res) => {
  const companyName = cleanString(req.body?.companyName, 255);
  const contactName = cleanString(req.body?.contactName, 180);
  const email = cleanString(req.body?.email, 255).toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!companyName || !contactName || !email || password.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Company, contact, valid email and a 10+ character password are required.' });
  }
  const userId = randomUUID();
  const clientId = randomUUID();
  const hash = await bcrypt.hash(password, 12);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute('INSERT INTO admin_users (id, email, password_hash, role) VALUES (?, ?, ?, ?)', [userId, email, hash, 'client']);
    await connection.execute('INSERT INTO clients (id, user_id, company_name, contact_name, email, phone, country) VALUES (?, ?, ?, ?, ?, ?, ?)', [clientId, userId, companyName, contactName, email, cleanString(req.body?.phone, 30) || null, cleanString(req.body?.country, 100) || null]);
    await connection.execute('INSERT INTO client_profiles (client_id, timezone, preferred_language) VALUES (?, ?, ?)', [clientId, 'Europe/Berlin', 'en']);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'A user with this email already exists.' });
    throw error;
  } finally { connection.release(); }
  await sendNotification({ to: email, subject: 'Your RSTechwerk client portal access', text: `Hello ${contactName},\n\nYour client portal account for ${companyName} has been created. Sign in at ${process.env.APP_URL || 'http://localhost:3000'}/login.html?redirect=portal.\n\nYour temporary password was provided separately.`, html: `<p>Hello ${contactName},</p><p>Your RSTechwerk client portal account for <strong>${companyName}</strong> has been created.</p><p>Sign in at <a href="${process.env.APP_URL || 'http://localhost:3000'}/login.html?redirect=portal">your client portal</a>.</p><p>Your temporary password was provided separately.</p>` });
  return res.status(201).json({ success: true, clientId });
});

app.patch('/api/clients/:id', requireAuth, requireStaff, async (req, res) => {
  const [existingRows] = await pool.execute('SELECT id, user_id AS userId, company_name AS companyName, contact_name AS contactName, phone, country FROM clients WHERE id = ? LIMIT 1', [req.params.id]);
  const existing = existingRows[0];
  if (!existing) return res.status(404).json({ success: false, message: 'Client not found.' });
  const companyName = cleanString(req.body?.companyName, 255) || existing.companyName;
  const contactName = cleanString(req.body?.contactName, 180) || existing.contactName;
  const phone = req.body?.phone !== undefined ? (cleanString(req.body.phone, 30) || null) : existing.phone;
  const country = req.body?.country !== undefined ? (cleanString(req.body.country, 100) || null) : existing.country;
  const status = ['active', 'inactive', 'suspended'].includes(req.body?.status) ? req.body.status : 'active';
  await pool.execute('UPDATE clients SET company_name = ?, contact_name = ?, phone = ?, country = ?, status = ? WHERE id = ?', [companyName, contactName, phone, country, status, req.params.id]);
  if (existing.userId) {
    await pool.execute('UPDATE admin_users SET status = ? WHERE id = ?', [status === 'suspended' ? 'suspended' : 'active', existing.userId]);
  }
  return res.json({ success: true });
});

app.post('/api/clients/:id/reset-password', requireAuth, requireStaff, async (req, res) => {
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (password.length < 10) return res.status(400).json({ success:false, message:'Password must be at least 10 characters.' });
  const [rows] = await pool.execute('SELECT user_id AS userId FROM clients WHERE id = ? LIMIT 1', [req.params.id]);
  if (!rows[0]?.userId) return res.status(404).json({ success:false, message:'Client account not found.' });
  await pool.execute('UPDATE admin_users SET password_hash = ? WHERE id = ?', [await bcrypt.hash(password, 12), rows[0].userId]);
  return res.json({ success:true, message:'Client password reset.' });
});

app.get('/api/staff', requireAuth, requireStaff, async (req, res) => {
  const [rows] = await pool.query(`
    SELECT id, email, full_name AS fullName, role, status, created_at AS createdAt
    FROM admin_users
    WHERE role <> 'client'
    ORDER BY created_at DESC
  `);
  return res.json({
    success: true,
    canManageTeam: ADMIN_MANAGER_ROLE_SET.has(req.user.role),
    canAssignAdmin: TOP_ADMIN_ROLE_SET.has(req.user.role),
    staff: rows
  });
});

app.post('/api/staff', requireAuth, requireAdminManager, async (req, res) => {
  const fullName = cleanString(req.body?.fullName, 180);
  const email = cleanString(req.body?.email, 255).toLowerCase();
  const role = cleanString(req.body?.role, 50) || 'developer';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!fullName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 10) {
    return res.status(400).json({ success: false, message: 'Full name, valid email, and a 10+ character password are required.' });
  }
  if (!ASSIGNABLE_STAFF_ROLES.has(role)) {
    return res.status(400).json({ success: false, message: 'Invalid team role.' });
  }
  if (role === 'admin' && !TOP_ADMIN_ROLE_SET.has(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Only primary administrators can create full admin accounts.' });
  }
  const staffId = randomUUID();
  const hash = await bcrypt.hash(password, 12);
  try {
    await pool.execute(
      'INSERT INTO admin_users (id, email, full_name, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?)',
      [staffId, email, fullName, hash, role, 'active']
    );
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }
    throw error;
  }
  const consoleUrl = `${process.env.APP_URL || 'http://localhost:3000'}/login.html?redirect=admin`;
  await sendNotification({
    to: email,
    subject: 'Your RSTechwerk team console access',
    text: `Hello ${fullName},\n\nYour RSTechwerk internal console account (${role}) has been created. Sign in at ${consoleUrl}.`,
    html: `<p>Hello ${fullName},</p><p>Your RSTechwerk internal console account (<strong>${role}</strong>) has been created.</p><p>Sign in at <a href="${consoleUrl}">${consoleUrl}</a>.</p>`
  });
  return res.status(201).json({ success: true, staffId });
});

app.patch('/api/staff/:id', requireAuth, requireAdminManager, async (req, res) => {
  const [rows] = await pool.execute('SELECT id, email, full_name AS fullName, role, status FROM admin_users WHERE id = ? AND role <> ? LIMIT 1', [req.params.id, 'client']);
  const target = rows[0];
  if (!target) return res.status(404).json({ success: false, message: 'Team member not found.' });
  if (TOP_ADMIN_ROLE_SET.has(target.role) && !TOP_ADMIN_ROLE_SET.has(req.user.role)) {
    return res.status(403).json({ success: false, message: 'You cannot modify a primary administrator account.' });
  }
  const fullName = req.body?.fullName !== undefined ? (cleanString(req.body.fullName, 180) || target.fullName) : target.fullName;
  const nextRole = req.body?.role ? cleanString(req.body.role, 50) : target.role;
  const nextStatus = ['active', 'suspended'].includes(req.body?.status) ? req.body.status : (target.status || 'active');
  if (nextRole !== target.role && !ASSIGNABLE_STAFF_ROLES.has(nextRole)) {
    return res.status(400).json({ success: false, message: 'Invalid team role.' });
  }
  if (nextRole === 'admin' && !TOP_ADMIN_ROLE_SET.has(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Only primary administrators can assign full admin role.' });
  }
  if (target.id === req.user.sub && (nextStatus !== 'active' || nextRole !== target.role)) {
    return res.status(400).json({ success: false, message: 'You cannot suspend or demote your own active account.' });
  }
  await pool.execute('UPDATE admin_users SET full_name = ?, role = ?, status = ? WHERE id = ?', [fullName || null, nextRole, nextStatus, target.id]);
  return res.json({ success: true });
});

app.post('/api/staff/:id/reset-password', requireAuth, requireAdminManager, async (req, res) => {
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (password.length < 10) return res.status(400).json({ success: false, message: 'Password must be at least 10 characters.' });
  const [rows] = await pool.execute('SELECT id, role FROM admin_users WHERE id = ? AND role <> ? LIMIT 1', [req.params.id, 'client']);
  const target = rows[0];
  if (!target) return res.status(404).json({ success: false, message: 'Team member not found.' });
  if (TOP_ADMIN_ROLE_SET.has(target.role) && !TOP_ADMIN_ROLE_SET.has(req.user.role)) {
    return res.status(403).json({ success: false, message: 'You cannot reset a primary administrator password.' });
  }
  await pool.execute('UPDATE admin_users SET password_hash = ? WHERE id = ?', [await bcrypt.hash(password, 12), target.id]);
  return res.json({ success: true, message: 'Team member password reset.' });
});

app.delete('/api/staff/:id', requireAuth, requireAdminManager, async (req, res) => {
  const [rows] = await pool.execute('SELECT id, role FROM admin_users WHERE id = ? AND role <> ? LIMIT 1', [req.params.id, 'client']);
  const target = rows[0];
  if (!target) return res.status(404).json({ success: false, message: 'Team member not found.' });
  if (target.id === req.user.sub) return res.status(400).json({ success: false, message: 'You cannot remove your own account.' });
  if (TOP_ADMIN_ROLE_SET.has(target.role) && !TOP_ADMIN_ROLE_SET.has(req.user.role)) {
    return res.status(403).json({ success: false, message: 'You cannot remove a primary administrator account.' });
  }
  await pool.execute('DELETE FROM admin_users WHERE id = ?', [target.id]);
  return res.json({ success: true });
});

app.get('/api/proposals', requireAuth, async (req, res) => {
  const staff = isStaffRole(req.user.role);
  const [rows] = await pool.query(`SELECT p.id, p.client_id AS clientId, c.company_name AS companyName, p.title, p.scope, p.terms, p.currency, p.total_amount AS totalAmount, p.status, p.expires_at AS expiresAt, p.sent_at AS sentAt, p.accepted_at AS acceptedAt, p.created_at AS createdAt FROM proposals p JOIN clients c ON c.id = p.client_id ${staff ? '' : 'WHERE c.user_id = ?'} ORDER BY p.created_at DESC`, staff ? [] : [req.user.sub]);
  return res.json({ success: true, proposals: rows });
});

app.get('/api/maintenance', requireAuth, async (req, res) => {
  const staff = isStaffRole(req.user.role);
  const [rows] = await pool.query(`SELECT m.id, m.client_id AS clientId, m.project_id AS projectId, m.title, m.description, m.billing_type AS billingType, m.amount, m.currency, m.status, m.started_at AS startedAt, m.next_billing_date AS nextBillingDate, m.renewal_date AS renewalDate, p.name AS projectName FROM maintenance_contracts m LEFT JOIN projects p ON p.id = m.project_id ${staff ? '' : 'WHERE m.client_id = (SELECT id FROM clients WHERE user_id = ? LIMIT 1)'} ORDER BY m.status = 'active' DESC, m.created_at DESC`, staff ? [] : [req.user.sub]);
  return res.json({ success: true, maintenance: rows });
});

app.post('/api/maintenance', requireAuth, requireStaff, async (req, res) => {
  const clientId = cleanString(req.body?.clientId, 36); const projectId = cleanString(req.body?.projectId, 36) || null; const title = cleanString(req.body?.title, 255); const amount = Number(req.body?.amount || 0); const billingType = ['monthly', 'one_time', 'annual'].includes(req.body?.billingType) ? req.body.billingType : 'monthly'; const currency = cleanString(req.body?.currency, 3).toUpperCase() || 'EUR';
  if (!clientId || !title || !Number.isFinite(amount) || amount < 0) return res.status(400).json({ success: false, message: 'Client, title and valid charge are required.' });
  const id = randomUUID();
  await pool.execute('INSERT INTO maintenance_contracts (id, client_id, project_id, title, description, billing_type, amount, currency, status, started_at, next_billing_date, renewal_date, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, clientId, projectId, title, cleanString(req.body?.description, 5000) || null, billingType, amount, currency, cleanString(req.body?.status, 30) || 'active', req.body?.startedAt || null, req.body?.nextBillingDate || null, req.body?.renewalDate || null, req.user.sub]);
  return res.status(201).json({ success: true, maintenanceId: id });
});

app.patch('/api/maintenance/:id', requireAuth, requireStaff, async (req, res) => {
  const [result] = await pool.execute('UPDATE maintenance_contracts SET title = COALESCE(NULLIF(?, ""), title), description = ?, billing_type = ?, amount = ?, currency = ?, status = ?, next_billing_date = ?, renewal_date = ? WHERE id = ?', [cleanString(req.body?.title, 255), cleanString(req.body?.description, 5000) || null, req.body?.billingType || 'monthly', Number(req.body?.amount || 0), cleanString(req.body?.currency, 3).toUpperCase() || 'EUR', req.body?.status || 'active', req.body?.nextBillingDate || null, req.body?.renewalDate || null, req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Maintenance record not found.' });
  return res.json({ success: true });
});

app.get('/api/maintenance/invoices', requireAuth, async (req, res) => {
  const staff = isStaffRole(req.user.role);
  const [rows] = await pool.query(`SELECT i.id, i.contract_id AS contractId, i.client_id AS clientId, i.invoice_number AS invoiceNumber, i.period_start AS periodStart, i.period_end AS periodEnd, i.amount, i.currency, i.status, i.due_date AS dueDate, i.paid_at AS paidAt, i.provider AS paymentProvider, i.provider_reference AS providerReference, m.title, m.billing_type AS billingType, p.name AS projectName FROM maintenance_invoices i JOIN maintenance_contracts m ON m.id = i.contract_id LEFT JOIN projects p ON p.id = m.project_id ${staff ? '' : 'WHERE i.client_id = (SELECT id FROM clients WHERE user_id = ? LIMIT 1)'} ORDER BY i.created_at DESC`, staff ? [] : [req.user.sub]);
  return res.json({ success: true, invoices: rows });
});

app.post('/api/maintenance/:id/invoices', requireAuth, requireStaff, async (req, res) => {
  const [contracts] = await pool.execute('SELECT id, client_id AS clientId, amount, currency FROM maintenance_contracts WHERE id = ? LIMIT 1', [req.params.id]);
  if (!contracts[0]) return res.status(404).json({ success: false, message: 'Maintenance contract not found.' });
  const invoiceId = randomUUID(); const invoiceNumber = `MNT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  await pool.execute('INSERT INTO maintenance_invoices (id, contract_id, client_id, invoice_number, period_start, period_end, amount, currency, status, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [invoiceId, contracts[0].id, contracts[0].clientId, invoiceNumber, req.body?.periodStart || null, req.body?.periodEnd || null, Number(req.body?.amount ?? contracts[0].amount), cleanString(req.body?.currency, 3).toUpperCase() || contracts[0].currency, 'pending', req.body?.dueDate || null]);
  return res.status(201).json({ success: true, invoiceId, invoiceNumber });
});

app.post('/api/maintenance/generate-due-invoices', requireAuth, requireStaff, async (_req, res) => {
  const [contracts] = await pool.query("SELECT id, client_id AS clientId, title, amount, currency, billing_type AS billingType, next_billing_date AS nextBillingDate FROM maintenance_contracts WHERE status = 'active' AND billing_type IN ('monthly','annual') AND next_billing_date IS NOT NULL AND next_billing_date <= CURDATE()");
  let generated = 0;
  for (const contract of contracts) {
    const [existing] = await pool.execute('SELECT id FROM maintenance_invoices WHERE contract_id = ? AND period_start = ? LIMIT 1', [contract.id, contract.nextBillingDate]);
    if (existing[0]) continue;
    const invoiceNumber = `MNT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}-${generated + 1}`;
    const interval = contract.billingType === 'annual' ? '1 YEAR' : '1 MONTH';
    await pool.execute(`INSERT INTO maintenance_invoices (id, contract_id, client_id, invoice_number, period_start, period_end, amount, currency, status, due_date) VALUES (?, ?, ?, ?, ?, DATE_SUB(DATE_ADD(?, INTERVAL ${interval}), INTERVAL 1 DAY), ?, ?, 'pending', ?)`, [randomUUID(), contract.id, contract.clientId, invoiceNumber, contract.nextBillingDate, contract.nextBillingDate, contract.amount, contract.currency, contract.nextBillingDate]);
    await pool.execute(`UPDATE maintenance_contracts SET next_billing_date = DATE_ADD(next_billing_date, INTERVAL ${interval}) WHERE id = ?`, [contract.id]);
    generated += 1;
  }
  return res.json({ success: true, generated, message: `${generated} maintenance invoice(s) generated.` });
});

app.post('/api/maintenance/invoices/:id/checkout', requireAuth, async (req, res) => {
  const staffFlag = isStaffRole(req.user.role) ? 1 : 0;
  const [rows] = await pool.execute('SELECT i.id, i.invoice_number AS invoiceNumber, i.amount, i.currency, i.status, i.client_id AS clientId, m.title FROM maintenance_invoices i JOIN maintenance_contracts m ON m.id = i.contract_id WHERE i.id = ? AND (? = 1 OR i.client_id = (SELECT id FROM clients WHERE user_id = ? LIMIT 1)) LIMIT 1', [req.params.id, staffFlag, req.user.sub]);
  const invoice = rows[0];
  if (!invoice) return res.status(404).json({ success: false, message: 'Maintenance invoice not found.' });
  if (invoice.status === 'paid') return res.status(400).json({ success: false, message: 'This invoice is already paid.' });
  const provider = cleanString(req.body?.provider, 20).toLowerCase();
  if (provider === 'stripe') {
    if (!stripe) return res.status(503).json({ success: false, message: 'Stripe is not configured.' });
    const session = await stripe.checkout.sessions.create({ mode:'payment', line_items:[{ price_data:{ currency:invoice.currency.toLowerCase(), product_data:{ name:`Maintenance invoice ${invoice.invoiceNumber}` }, unit_amount:Math.round(Number(invoice.amount)*100) }, quantity:1 }], success_url:`${process.env.APP_URL || 'http://localhost:3000'}/portal.html?maintenancePayment=success&invoice=${encodeURIComponent(invoice.id)}&session_id={CHECKOUT_SESSION_ID}`, cancel_url:`${process.env.APP_URL || 'http://localhost:3000'}/portal.html?maintenancePayment=cancelled`, metadata:{ maintenanceInvoiceId: invoice.id } });
    await pool.execute('UPDATE maintenance_invoices SET provider = ?, provider_reference = ? WHERE id = ?', ['stripe', session.id, invoice.id]);
    return res.json({ success:true, checkoutUrl:session.url });
  }
  if (provider === 'paypal') {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) return res.status(503).json({ success:false, message:'PayPal is not configured.' });
    const base = process.env.PAYPAL_ENV === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
    const basic = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
    const tokenResponse = await fetch(`${base}/v1/oauth2/token`, { method:'POST', headers:{ Authorization:`Basic ${basic}`, 'Content-Type':'application/x-www-form-urlencoded' }, body:'grant_type=client_credentials' });
    const tokenData = await tokenResponse.json(); if (!tokenResponse.ok) return res.status(502).json({ success:false, message:'PayPal authentication failed.' });
    const orderResponse = await fetch(`${base}/v2/checkout/orders`, { method:'POST', headers:{ Authorization:`Bearer ${tokenData.access_token}`, 'Content-Type':'application/json' }, body:JSON.stringify({ intent:'CAPTURE', purchase_units:[{ reference_id:invoice.id, description:`Maintenance invoice ${invoice.invoiceNumber}`, amount:{ currency_code:invoice.currency, value:Number(invoice.amount).toFixed(2) } }], application_context:{ return_url:`${process.env.APP_URL || 'http://localhost:3000'}/portal.html?paypalMaintenance=success&invoice=${invoice.id}`, cancel_url:`${process.env.APP_URL || 'http://localhost:3000'}/portal.html?paypalMaintenance=cancelled` } }) });
    const order = await orderResponse.json(); if (!orderResponse.ok) return res.status(502).json({ success:false, message:order.message || 'PayPal order creation failed.' });
    await pool.execute('UPDATE maintenance_invoices SET provider = ?, provider_reference = ? WHERE id = ?', ['paypal', order.id, invoice.id]);
    return res.json({ success:true, approvalUrl:order.links?.find((link) => link.rel === 'approve')?.href || null });
  }
  return res.status(400).json({ success:false, message:'Choose Stripe or PayPal.' });
});

app.post('/api/maintenance/invoices/:id/paypal/capture', requireAuth, async (req, res) => {
  const [rows] = await pool.execute('SELECT id, client_id AS clientId, provider_reference AS providerReference, amount, currency, status FROM maintenance_invoices WHERE id = ? LIMIT 1', [req.params.id]);
  const invoice = rows[0]; if (!invoice || (!isStaffRole(req.user.role) && invoice.clientId !== (await pool.query('SELECT id FROM clients WHERE user_id = ? LIMIT 1', [req.user.sub]))[0][0]?.id)) return res.status(404).json({ success:false, message:'Maintenance invoice not found.' });
  if (!invoice.providerReference || invoice.status === 'paid') return res.status(400).json({ success:false, message:'PayPal order is unavailable.' });
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) return res.status(503).json({ success:false, message:'PayPal is not configured.' });
  const base = process.env.PAYPAL_ENV === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'; const basic = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const tokenResponse = await fetch(`${base}/v1/oauth2/token`, { method:'POST', headers:{ Authorization:`Basic ${basic}`, 'Content-Type':'application/x-www-form-urlencoded' }, body:'grant_type=client_credentials' }); const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenData.access_token) return res.status(502).json({ success:false, message:'PayPal authentication failed.' });
  const captureResponse = await fetch(`${base}/v2/checkout/orders/${encodeURIComponent(invoice.providerReference)}/capture`, { method:'POST', headers:{ Authorization:`Bearer ${tokenData.access_token}`, 'Content-Type':'application/json' } }); const capture = await captureResponse.json();
  if (!captureResponse.ok) return res.status(502).json({ success:false, message:capture.message || 'PayPal capture failed.' });
  if (!isPayPalCaptureConfirmed(capture, invoice.providerReference, invoice.amount, invoice.currency)) return res.status(409).json({ success:false, message:'PayPal has not confirmed the expected invoice amount yet.' });
  await pool.execute('UPDATE maintenance_invoices SET status = \'paid\', paid_at = NOW() WHERE id = ?', [invoice.id]); return res.json({ success:true, status:'paid' });
});

app.post('/api/proposals', requireAuth, requireStaff, async (req, res) => {
  const clientId = cleanString(req.body?.clientId, 36);
  const title = cleanString(req.body?.title, 255);
  const scope = cleanString(req.body?.scope, 10000);
  const currency = cleanString(req.body?.currency, 3) || 'EUR';
  const totalAmount = Number(req.body?.totalAmount || 0);
  if (!clientId || !title || !scope || !Number.isFinite(totalAmount) || totalAmount < 0) return res.status(400).json({ success: false, message: 'Client, title, scope and a valid amount are required.' });
  const id = randomUUID();
  await pool.execute('INSERT INTO proposals (id, client_id, title, scope, terms, currency, total_amount, status, expires_at, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, clientId, title, scope, cleanString(req.body?.terms, 10000) || null, currency, totalAmount, 'draft', req.body?.expiresAt || null, req.user.sub]);
  return res.status(201).json({ success: true, proposalId: id });
});

app.patch('/api/proposals/:id/status', requireAuth, async (req, res) => {
  const status = cleanString(req.body?.status, 30);
  if (!['draft', 'sent', 'accepted', 'rejected', 'expired'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid proposal status.' });
  const staff = isStaffRole(req.user.role);
  const [rows] = await pool.query(`SELECT p.id, p.client_id AS clientId, c.user_id AS clientUserId FROM proposals p JOIN clients c ON c.id = p.client_id WHERE p.id = ? LIMIT 1`, [req.params.id]);
  const proposal = rows[0];
  if (!proposal || (!staff && proposal.clientUserId !== req.user.sub) || (!staff && !['accepted', 'rejected'].includes(status))) return res.status(403).json({ success: false, message: 'You cannot update this proposal.' });
  const wasSent = Boolean((await pool.execute('SELECT sent_at AS sentAt FROM proposals WHERE id = ? LIMIT 1', [req.params.id]))[0][0]?.sentAt);
  await pool.execute('UPDATE proposals SET status = ?, sent_at = CASE WHEN ? = 1 THEN COALESCE(sent_at, NOW()) ELSE sent_at END, accepted_at = CASE WHEN ? = 1 THEN NOW() ELSE accepted_at END WHERE id = ?', [status, status === 'sent' ? 1 : 0, status === 'accepted' ? 1 : 0, req.params.id]);
  const [proposalContact] = await pool.execute('SELECT c.email, c.contact_name AS contactName, p.title, p.scope, p.terms, p.currency, p.total_amount AS totalAmount, p.expires_at AS expiresAt FROM proposals p JOIN clients c ON c.id = p.client_id WHERE p.id = ? LIMIT 1', [req.params.id]);
  if (proposalContact[0] && status === 'sent' && !wasSent) {
    const proposal = proposalContact[0]; const portalUrl = `${process.env.APP_URL || 'http://localhost:3000'}/login.html?redirect=portal`;
    await sendNotification({ to: proposal.email, subject: `Your RSTechwerk proposal: ${proposal.title}`, text: `Hello ${proposal.contactName},\n\nYour proposal is ready to review.\n\nOffer: ${proposal.title}\nAmount: ${proposal.currency} ${Number(proposal.totalAmount).toFixed(2)}\nScope: ${proposal.scope}\n${proposal.terms ? `Terms: ${proposal.terms}\n` : ''}${proposal.expiresAt ? `Valid until: ${proposal.expiresAt}\n` : ''}\nReview and respond securely in your client portal: ${portalUrl}\n\nPayment requests will be issued as project milestones or invoices after the proposal is accepted.`, html: `<p>Hello ${proposal.contactName},</p><p>Your proposal is ready to review in the client portal.</p><h3>${proposal.title}</h3><p><strong>Offer amount:</strong> ${proposal.currency} ${Number(proposal.totalAmount).toFixed(2)}</p><p><strong>Scope:</strong><br>${proposal.scope.replaceAll('\n', '<br>')}</p>${proposal.terms ? `<p><strong>Terms:</strong><br>${proposal.terms.replaceAll('\n', '<br>')}</p>` : ''}${proposal.expiresAt ? `<p><strong>Valid until:</strong> ${proposal.expiresAt}</p>` : ''}<p><a href="${portalUrl}">Review proposal in client portal</a></p><p>After acceptance, payment requests will be issued through project milestones or invoices.</p>` });
  }
  if (proposalContact[0] && status === 'accepted') await sendNotification({ to: proposalContact[0].email, subject: `Proposal accepted: ${proposalContact[0].title}`, text: `Your proposal has been accepted. We will now prepare the project workspace and payment milestones.`, html: `<p>Hello ${proposalContact[0].contactName},</p><p>Your proposal <strong>${proposalContact[0].title}</strong> has been accepted.</p><p>We will now prepare the project workspace and payment milestones.</p>` });
  return res.json({ success: true, status });
});

app.get('/api/projects', requireAuth, async (req, res) => {
  const [rows] = await pool.query(`
    SELECT p.id, p.client_id AS clientId, c.company_name AS companyName, p.name, p.description, p.status, p.start_date AS startDate, p.due_date AS dueDate, p.progress, p.created_at AS createdAt
    FROM projects p JOIN clients c ON c.id = p.client_id
    ${isStaffRole(req.user.role) ? '' : 'WHERE c.user_id = ?'}
    ORDER BY p.created_at DESC`, isStaffRole(req.user.role) ? [] : [req.user.sub]);
  return res.json({ success: true, projects: rows });
});

app.post('/api/projects', requireAuth, requireStaff, async (req, res) => {
  const clientId = cleanString(req.body?.clientId, 36);
  const name = cleanString(req.body?.name, 255);
  const proposalId = cleanString(req.body?.proposalId, 36) || null;
  if (!clientId || !name) return res.status(400).json({ success: false, message: 'Client and project name are required.' });
  const id = randomUUID();
  const values = [id, clientId, proposalId, name, cleanString(req.body?.description, 5000) || null, cleanString(req.body?.status, 40) || 'draft', req.body?.startDate || null, req.body?.dueDate || null];

  if (proposalId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [proposalRows] = await connection.execute('SELECT client_id AS clientId, status FROM proposals WHERE id = ? FOR UPDATE', [proposalId]);
      const proposal = proposalRows[0];
      if (!proposal || proposal.clientId !== clientId || proposal.status !== 'accepted') {
        await connection.rollback();
        return res.status(400).json({ success: false, message: 'Project must reference an accepted proposal belonging to this client.' });
      }
      const [existingProjects] = await connection.execute('SELECT id FROM projects WHERE proposal_id = ? LIMIT 1', [proposalId]);
      if (existingProjects[0]) {
        await connection.commit();
        return res.status(200).json({ success: true, projectId: existingProjects[0].id, alreadyExists: true });
      }
      await connection.execute('INSERT INTO projects (id, client_id, proposal_id, name, description, status, start_date, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', values);
      await connection.commit();
    } catch (error) {
      await connection.rollback().catch(() => {});
      throw error;
    } finally {
      connection.release();
    }
    return res.status(201).json({ success: true, projectId: id });
  }

  await pool.execute('INSERT INTO projects (id, client_id, proposal_id, name, description, status, start_date, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', values);
  return res.status(201).json({ success: true, projectId: id });
});

app.patch('/api/projects/:id', requireAuth, requireStaff, async (req, res) => {
  const status = cleanString(req.body?.status, 40);
  const progress = Number(req.body?.progress);
  const allowedStatuses = new Set(['draft', 'active', 'on_hold', 'client_review', 'testing', 'completed', 'maintenance', 'cancelled']);
  if (!allowedStatuses.has(status) || !Number.isInteger(progress) || progress < 0 || progress > 100) return res.status(400).json({ success: false, message: 'Provide a valid project status and progress from 0 to 100.' });
  const [result] = await pool.execute('UPDATE projects SET status = ?, progress = ? WHERE id = ?', [status, progress, req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Project not found.' });
  return res.json({ success: true });
});

app.get('/api/projects/:id/milestones', requireAuth, async (req, res) => {
  const [rows] = await pool.query('SELECT m.id, m.project_id AS projectId, m.title, m.description, m.amount, m.currency, m.due_date AS dueDate, m.status, m.payment_provider AS paymentProvider, m.payment_reference AS paymentReference, m.paid_at AS paidAt, m.sort_order AS sortOrder FROM project_milestones m JOIN projects p ON p.id = m.project_id JOIN clients c ON c.id = p.client_id WHERE m.project_id = ? AND (? IN (\'Administrator\', \'admin\', \'sub_admin\', \'manager\', \'developer\') OR c.user_id = ?) ORDER BY m.sort_order, m.created_at', [req.params.id, req.user.role, req.user.sub]);
  return res.json({ success: true, milestones: rows });
});

app.post('/api/projects/:id/milestones', requireAuth, requireStaff, async (req, res) => {
  const title = cleanString(req.body?.title, 255);
  if (!title) return res.status(400).json({ success: false, message: 'Milestone title is required.' });
  const id = randomUUID();
  await pool.execute('INSERT INTO project_milestones (id, project_id, title, description, amount, currency, due_date, status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, req.params.id, title, cleanString(req.body?.description, 5000) || null, Number(req.body?.amount || 0), cleanString(req.body?.currency, 3) || 'EUR', req.body?.dueDate || null, 'payment_pending', Number(req.body?.sortOrder || 0)]);
  return res.status(201).json({ success: true, milestoneId: id });
});

app.patch('/api/projects/:id/milestones/:milestoneId/status', requireAuth, async (req, res) => {
  const status = cleanString(req.body?.status, 40);
  const staff = isStaffRole(req.user.role);
  const allowedStatuses = new Set(['payment_pending', 'paid', 'in_progress', 'submitted', 'approved', 'revision_requested', 'completed']);
  if (!allowedStatuses.has(status)) return res.status(400).json({ success: false, message: 'Invalid milestone status.' });
  const milestone = await getMilestoneForUser(req.params.id, req.params.milestoneId, req.user);
  if (!milestone || (!staff && !['approved', 'revision_requested'].includes(status))) return res.status(403).json({ success: false, message: 'You cannot update this milestone.' });
  if (status === 'paid') {
    const provider = cleanString(req.body?.paymentProvider, 40) || 'manual';
    const ref = cleanString(req.body?.paymentReference, 120) || `SET-${req.params.milestoneId.slice(0, 8).toUpperCase()}`;
    await pool.execute(
      `UPDATE project_milestones
       SET status = 'paid',
           paid_at = COALESCE(paid_at, NOW()),
           payment_provider = COALESCE(payment_provider, ?),
           payment_reference = COALESCE(payment_reference, ?)
       WHERE id = ? AND project_id = ?`,
      [provider, ref, req.params.milestoneId, req.params.id]
    );
  } else {
    await pool.execute('UPDATE project_milestones SET status = ? WHERE id = ? AND project_id = ?', [status, req.params.milestoneId, req.params.id]);
  }
  return res.json({ success: true, status });
});

app.get('/api/projects/:id/files', requireAuth, async (req, res) => {
  const [rows] = await pool.query(`SELECT f.id, f.project_id AS projectId, f.original_name AS originalName, f.mime_type AS mimeType, f.file_size AS fileSize, f.visible_to_client AS visibleToClient, f.created_at AS createdAt FROM project_files f JOIN projects p ON p.id = f.project_id JOIN clients c ON c.id = p.client_id WHERE f.project_id = ? AND (? IN ('Administrator', 'admin', 'sub_admin', 'manager', 'developer') OR (c.user_id = ? AND f.visible_to_client = TRUE)) ORDER BY f.created_at DESC`, [req.params.id, req.user.role, req.user.sub]);
  return res.json({ success: true, files: rows });
});

app.get('/api/projects/:id/invoices', requireAuth, async (req, res) => {
  const [rows] = await pool.query(`SELECT i.id, i.project_id AS projectId, i.invoice_number AS invoiceNumber, i.description, i.amount, i.currency, i.status, i.due_date AS dueDate, i.paid_at AS paidAt, i.created_at AS createdAt FROM invoices i JOIN projects p ON p.id = i.project_id JOIN clients c ON c.id = p.client_id WHERE i.project_id = ? AND (? IN ('Administrator', 'admin', 'sub_admin', 'manager', 'developer') OR c.user_id = ?) ORDER BY i.created_at DESC`, [req.params.id, req.user.role, req.user.sub]);
  return res.json({ success: true, invoices: rows });
});

app.post('/api/projects/:id/invoices', requireAuth, requireStaff, async (req, res) => {
  const description = cleanString(req.body?.description, 5000);
  const amount = Number(req.body?.amount || 0);
  const currency = cleanString(req.body?.currency, 3) || 'EUR';
  if (!description || !Number.isFinite(amount) || amount <= 0) return res.status(400).json({ success: false, message: 'Invoice description and a valid amount are required.' });
  const [projectRows] = await pool.execute('SELECT client_id AS clientId FROM projects WHERE id = ? LIMIT 1', [req.params.id]);
  if (!projectRows[0]) return res.status(404).json({ success: false, message: 'Project not found.' });
  const id = randomUUID();
  const invoiceNumber = `RST-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  await pool.execute('INSERT INTO invoices (id, project_id, client_id, invoice_number, description, amount, currency, status, due_date, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, req.params.id, projectRows[0].clientId, invoiceNumber, description, amount, currency, 'draft', req.body?.dueDate || null, req.user.sub]);
  return res.status(201).json({ success: true, invoiceId: id, invoiceNumber });
});

app.patch('/api/invoices/:id/status', requireAuth, requireStaff, async (req, res) => {
  const status = cleanString(req.body?.status, 30);
  if (!['draft', 'sent', 'paid', 'overdue', 'cancelled'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid invoice status.' });
  const [result] = status === 'paid'
    ? await pool.execute('UPDATE invoices SET status = \'paid\', paid_at = COALESCE(paid_at, NOW()) WHERE id = ?', [req.params.id])
    : await pool.execute('UPDATE invoices SET status = ? WHERE id = ?', [status, req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Invoice not found.' });
  return res.json({ success: true, status });
});

app.post('/api/projects/:id/files', requireAuth, requireStaff, documentUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Choose a supported file up to 15MB.' });
  const id = randomUUID();
  await pool.execute('INSERT INTO project_files (id, project_id, original_name, stored_name, mime_type, file_size, visible_to_client, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [id, req.params.id, req.file.originalname.slice(0, 255), req.file.filename, req.file.mimetype, req.file.size, req.body.visibleToClient === 'true', req.user.sub]);
  return res.status(201).json({ success: true, fileId: id });
});

app.get('/api/projects/:id/files/:fileId/download', requireAuth, async (req, res) => {
  const [rows] = await pool.query(`SELECT f.* FROM project_files f JOIN projects p ON p.id = f.project_id JOIN clients c ON c.id = p.client_id WHERE f.id = ? AND f.project_id = ? AND (? IN ('Administrator', 'admin', 'sub_admin', 'manager', 'developer') OR (c.user_id = ? AND f.visible_to_client = TRUE)) LIMIT 1`, [req.params.fileId, req.params.id, req.user.role, req.user.sub]);
  const file = rows[0];
  if (!file) return res.status(404).json({ success: false, message: 'File not found.' });
  res.setHeader('Content-Disposition', `attachment; filename="${file.original_name.replace(/[^a-zA-Z0-9._-]/g, '_')}"`);
  res.setHeader('Content-Type', file.mime_type);
  return createReadStream(path.join(documentDirectory, file.stored_name)).pipe(res);
});

async function getMilestoneForUser(projectId, milestoneId, user) {
  const [rows] = await pool.execute(`SELECT m.id, m.title, m.amount, m.currency, p.name AS projectName, c.company_name AS companyName, c.user_id AS clientUserId FROM project_milestones m JOIN projects p ON p.id = m.project_id JOIN clients c ON c.id = p.client_id WHERE m.id = ? AND m.project_id = ? LIMIT 1`, [milestoneId, projectId]);
  const item = rows[0];
  if (!item || (!isStaffRole(user.role) && item.clientUserId !== user.sub)) return null;
  return item;
}

function isPayPalCaptureConfirmed(order, expectedOrderId, expectedAmount, expectedCurrency) {
  if (order?.id !== expectedOrderId || order.status !== 'COMPLETED') return false;
  const captures = (order.purchase_units || []).flatMap((unit) => unit.payments?.captures || []);
  const expectedMinorUnits = Math.round(Number(expectedAmount) * 100);
  return captures.some((capture) =>
    capture.status === 'COMPLETED' &&
    String(capture.amount?.currency_code || '').toUpperCase() === String(expectedCurrency).toUpperCase() &&
    Math.round(Number(capture.amount?.value) * 100) === expectedMinorUnits
  );
}

app.post('/api/projects/:id/milestones/:milestoneId/checkout', requireAuth, async (req, res) => {
  const provider = cleanString(req.body?.provider, 20).toLowerCase();
  const milestone = await getMilestoneForUser(req.params.id, req.params.milestoneId, req.user);
  if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found.' });
  if (!Number(milestone.amount) || milestone.amount <= 0) return res.status(400).json({ success: false, message: 'This milestone has no payable amount.' });
  const paymentId = randomUUID();
  await pool.execute('INSERT INTO payments (id, project_id, milestone_id, provider, amount, currency) VALUES (?, ?, ?, ?, ?, ?)', [paymentId, req.params.id, req.params.milestoneId, provider, milestone.amount, milestone.currency]);
  try {
    if (provider === 'stripe') {
      if (!stripe) return res.status(503).json({ success: false, message: 'Stripe is not configured.' });
      const session = await stripe.checkout.sessions.create({ mode: 'payment', line_items: [{ price_data: { currency: milestone.currency.toLowerCase(), product_data: { name: `${milestone.projectName} — ${milestone.title}` }, unit_amount: Math.round(Number(milestone.amount) * 100) }, quantity: 1 }], success_url: `${process.env.APP_URL || 'http://localhost:3000'}/portal.html?payment=success&project=${encodeURIComponent(req.params.id)}&milestone=${encodeURIComponent(req.params.milestoneId)}&session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/portal.html?payment=cancelled`, metadata: { paymentId, projectId: req.params.id, milestoneId: req.params.milestoneId } });
      await pool.execute('UPDATE payments SET provider_reference = ? WHERE id = ?', [session.id, paymentId]);
      return res.json({ success: true, provider: 'stripe', checkoutUrl: session.url });
    }
    if (provider === 'paypal') {
      if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) return res.status(503).json({ success: false, message: 'PayPal is not configured.' });
      const base = process.env.PAYPAL_ENV === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
      const basic = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
      const tokenResponse = await fetch(`${base}/v1/oauth2/token`, { method: 'POST', headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials' });
      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok) throw new Error('PayPal authentication failed.');
      const orderResponse = await fetch(`${base}/v2/checkout/orders`, { method: 'POST', headers: { Authorization: `Bearer ${tokenData.access_token}`, 'Content-Type': 'application/json', 'PayPal-Request-Id': paymentId }, body: JSON.stringify({ intent: 'CAPTURE', purchase_units: [{ reference_id: paymentId, description: `${milestone.projectName} — ${milestone.title}`, amount: { currency_code: milestone.currency, value: Number(milestone.amount).toFixed(2) } }], application_context: { return_url: `${process.env.APP_URL || 'http://localhost:3000'}/portal.html?paypal=success&project=${encodeURIComponent(req.params.id)}&milestone=${encodeURIComponent(req.params.milestoneId)}`, cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/portal.html?paypal=cancelled` } }) });
      const order = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(order.message || 'PayPal order creation failed.');
      await pool.execute('UPDATE payments SET provider_reference = ? WHERE id = ?', [order.id, paymentId]);
      return res.json({ success: true, provider: 'paypal', orderId: order.id, approvalUrl: order.links?.find((link) => link.rel === 'approve')?.href || null });
    }
    return res.status(400).json({ success: false, message: 'Choose Stripe or PayPal.' });
  } catch (error) {
    await pool.execute('UPDATE payments SET status = ? WHERE id = ?', ['failed', paymentId]);
    return res.status(502).json({ success: false, message: error.message || 'Payment checkout could not be created.' });
  }
});

app.post('/api/projects/:id/milestones/:milestoneId/paypal/capture', requireAuth, async (req, res) => {
  const milestone = await getMilestoneForUser(req.params.id, req.params.milestoneId, req.user);
  if (!milestone || !process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) return res.status(404).json({ success: false, message: 'PayPal payment is unavailable.' });
  const [payments] = await pool.execute('SELECT id, provider_reference AS providerReference, amount, currency FROM payments WHERE milestone_id = ? AND provider = \'paypal\' AND status = \'pending\' ORDER BY created_at DESC LIMIT 1', [req.params.milestoneId]);
  const payment = payments[0];
  if (!payment?.providerReference) return res.status(404).json({ success: false, message: 'PayPal order not found.' });
  const base = process.env.PAYPAL_ENV === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
  const basic = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const tokenResponse = await fetch(`${base}/v1/oauth2/token`, { method: 'POST', headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials' });
  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenData.access_token) return res.status(502).json({ success: false, message: 'PayPal authentication failed.' });
  const captureResponse = await fetch(`${base}/v2/checkout/orders/${encodeURIComponent(payment.providerReference)}/capture`, { method: 'POST', headers: { Authorization: `Bearer ${tokenData.access_token}`, 'Content-Type': 'application/json' } });
  const capture = await captureResponse.json();
  if (!captureResponse.ok) return res.status(502).json({ success: false, message: capture.message || 'PayPal capture failed.' });
  if (!isPayPalCaptureConfirmed(capture, payment.providerReference, payment.amount, payment.currency)) return res.status(409).json({ success: false, message: 'PayPal has not confirmed the expected milestone amount yet.' });
  await pool.execute('UPDATE payments SET status = \'paid\', paid_at = NOW() WHERE id = ?', [payment.id]);
  await pool.execute('UPDATE project_milestones SET status = \'paid\', payment_provider = \'paypal\', payment_reference = ?, paid_at = NOW() WHERE id = ?', [payment.providerReference, req.params.milestoneId]);
  return res.json({ success: true, status: 'paid' });
});

app.post('/api/payments/stripe/verify-session', requireAuth, async (req, res) => {
  if (!stripe) return res.status(503).json({ success: false, message: 'Stripe verification is unavailable.' });
  const sessionId = cleanString(req.body?.sessionId, 200);
  if (!sessionId) return res.status(400).json({ success: false, message: 'Stripe session ID is required.' });
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Unable to verify Stripe checkout session.' });
  }
  if (session.payment_status !== 'paid') {
    return res.json({ success: true, verified: false, paymentStatus: session.payment_status });
  }
  const paymentId = cleanString(session.metadata?.paymentId, 36);
  const milestoneId = cleanString(session.metadata?.milestoneId, 36);
  const projectId = cleanString(session.metadata?.projectId, 36);
  const maintenanceInvoiceId = cleanString(session.metadata?.maintenanceInvoiceId, 36);
  const txRef = cleanString(typeof session.payment_intent === 'string' ? session.payment_intent : session.id, 255);
  const staff = isStaffRole(req.user.role);

  if (milestoneId && projectId) {
    const milestone = await getMilestoneForUser(projectId, milestoneId, req.user);
    if (!milestone) return res.status(404).json({ success: false, message: 'Milestone payment record not found.' });
    if (paymentId) {
      await pool.execute(
        'UPDATE payments SET status = \'paid\', provider_reference = COALESCE(?, provider_reference), paid_at = COALESCE(paid_at, NOW()) WHERE id = ?',
        [txRef, paymentId]
      );
    }
    await pool.execute(
      'UPDATE project_milestones SET status = \'paid\', payment_provider = \'stripe\', payment_reference = ?, paid_at = COALESCE(paid_at, NOW()) WHERE id = ?',
      [txRef, milestoneId]
    );
    return res.json({ success: true, verified: true, receiptType: 'milestone', receiptId: milestoneId });
  }

  if (maintenanceInvoiceId) {
    const [rows] = await pool.execute(
      `SELECT i.id, c.user_id AS clientUserId
       FROM maintenance_invoices i
       JOIN clients c ON c.id = i.client_id
       WHERE i.id = ? LIMIT 1`,
      [maintenanceInvoiceId]
    );
    const inv = rows[0];
    if (!inv || (!staff && inv.clientUserId !== req.user.sub)) {
      return res.status(404).json({ success: false, message: 'Maintenance invoice not found.' });
    }
    await pool.execute(
      'UPDATE maintenance_invoices SET status = \'paid\', provider = \'stripe\', provider_reference = ?, paid_at = COALESCE(paid_at, NOW()) WHERE id = ?',
      [txRef, maintenanceInvoiceId]
    );
    return res.json({ success: true, verified: true, receiptType: 'maintenance', receiptId: maintenanceInvoiceId });
  }

  return res.status(404).json({ success: false, message: 'No linked payment item found in session metadata.' });
});

app.get('/api/receipts/:type/:id', requireAuth, async (req, res) => {
  const result = await resolveReceiptData(req.params.type, req.params.id, req.user, isStaffRole(req.user.role));
  if (result.errorStatus) {
    return res.status(result.errorStatus).json({ success: false, message: result.errorMessage });
  }
  return res.json({ success: true, receipt: result.receipt });
});

app.get('/api/receipts/:type/:id/pdf', requireAuth, async (req, res) => {
  const result = await resolveReceiptData(req.params.type, req.params.id, req.user, isStaffRole(req.user.role));
  if (result.errorStatus) {
    return res.status(result.errorStatus).json({ success: false, message: result.errorMessage });
  }
  return streamReceiptPdf(result.receipt, res);
});

app.get('/api/projects/:id/updates', requireAuth, async (req, res) => {
  const [rows] = await pool.query('SELECT u.id, u.project_id AS projectId, u.title, u.body, u.progress, u.created_at AS createdAt FROM project_updates u JOIN projects p ON p.id = u.project_id JOIN clients c ON c.id = p.client_id WHERE u.project_id = ? AND (? IN (\'Administrator\', \'admin\', \'sub_admin\', \'manager\', \'developer\') OR (c.user_id = ? AND u.visible_to_client = TRUE)) ORDER BY u.created_at DESC', [req.params.id, req.user.role, req.user.sub]);
  return res.json({ success: true, updates: rows });
});

app.post('/api/projects/:id/updates', requireAuth, requireStaff, async (req, res) => {
  const title = cleanString(req.body?.title, 255);
  const body = cleanString(req.body?.body, 10000);
  if (!title || !body) return res.status(400).json({ success: false, message: 'Update title and body are required.' });
  const id = randomUUID();
  await pool.execute('INSERT INTO project_updates (id, project_id, title, body, progress, visible_to_client, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, req.params.id, title, body, req.body?.progress == null ? null : Number(req.body.progress), req.body?.visibleToClient !== false, req.user.sub]);
  const [updateContact] = await pool.execute('SELECT c.email, c.contact_name AS contactName, p.name FROM projects p JOIN clients c ON c.id = p.client_id WHERE p.id = ? LIMIT 1', [req.params.id]);
  if (updateContact[0] && req.body?.visibleToClient !== false) await sendNotification({ to: updateContact[0].email, subject: `Project update: ${updateContact[0].name}`, text: `${title}\n\n${body}`, html: `<p>Hello ${updateContact[0].contactName},</p><p><strong>${title}</strong></p><p>${body}</p>` });
  return res.status(201).json({ success: true, updateId: id });
});

app.post('/api/uploads/portfolio', requireAuth, requireStaff, imageUpload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Please select a valid image (JPG, PNG, WebP, or AVIF).' });
  const format = detectImageFormat(await readFile(req.file.path));
  if (!format || format.mimeType !== req.file.mimetype) {
    await unlink(req.file.path);
    return res.status(400).json({ success: false, message: 'The uploaded file content does not match a supported image format.' });
  }
  const safeFilename = `${path.basename(req.file.filename, path.extname(req.file.filename))}${format.extension}`;
  const safePath = path.join(uploadDirectory, safeFilename);
  if (safePath !== req.file.path) await rename(req.file.path, safePath);
  return res.status(201).json({ success: true, imageUrl: `/uploads/portfolio/${safeFilename}` });
});

app.get('/api/content', async (_req, res) => {
  const [rows] = await pool.query('SELECT content_key AS contentKey, content_json AS contentJson, updated_at AS updatedAt FROM site_content');
  const content = {};
  for (const row of rows) {
    try {
      content[row.contentKey] = JSON.parse(row.contentJson);
    } catch {
      content[row.contentKey] = row.contentJson;
    }
  }
  if (content.site?.settings) {
    const { backendBaseUrl, webhookUrl, ...publicSettings } = content.site.settings;
    if (publicSettings.legalDocuments) {
      publicSettings.legalDocuments = { ...publicSettings.legalDocuments };
      delete publicSettings.legalDocuments.dpa;
    }
    content.site.settings = publicSettings;
  }
  if (content.site) delete content.site.blogPosts;
  return res.json({ success: true, content, updatedAt: rows[0]?.updatedAt || null });
});

app.get('/api/blog/posts', async (req, res) => {
  const language = blogLanguage(req);
  const posts = (await readBlogPosts()).filter((post) => post.status === 'published' && post.slug && blogTranslation(post, language).title).sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')));
  const summaries = posts.map((post) => ({
    slug: post.slug, category: post.category, tags: post.tags, author: post.author,
    coverImage: post.coverImage, publishedAt: post.publishedAt,
    translations: Object.fromEntries(Object.entries(post.translations || {}).filter(([, copy]) => copy?.title && copy?.excerpt && copy?.body).map(([locale, copy]) => [locale, {
      title: copy.title, excerpt: copy.excerpt, coverAlt: copy.coverAlt, category: copy.category
    }]))
  }));
  res.vary('Accept-Language');
  res.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');
  return res.json({ success: true, posts: summaries });
});

app.get('/api/blog/posts/:slug', async (req, res) => {
  const post = (await readBlogPosts()).find((item) => item.status === 'published' && item.slug === req.params.slug);
  if (!post) return res.status(404).json({ success: false, message: 'Article not found.' });
  const language = blogLanguage(req);
  const effectiveLanguage = post.translations?.[language]?.title && post.translations?.[language]?.excerpt && post.translations?.[language]?.body ? language : 'en';
  const translation = post.translations?.[effectiveLanguage] || {};
  if (!translation.title || !translation.body) return res.status(404).json({ success: false, message: 'Article translation not found.' });
  const publicPost = {
    slug: post.slug, category: post.category, tags: post.tags, author: post.author,
    coverImage: post.coverImage, publishedAt: post.publishedAt, updatedAt: post.updatedAt,
    translations: { [effectiveLanguage]: translation }
  };
  res.vary('Accept-Language');
  res.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');
  return res.json({ success: true, post: publicPost });
});

app.get('/api/admin/content/site', requireAuth, requireStaff, async (_req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT content_json AS contentJson, updated_at AS updatedAt FROM site_content WHERE content_key = ? LIMIT 1', ['site']);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Published site content was not found.' });
    return res.json({ success: true, site: JSON.parse(rows[0].contentJson), updatedAt: rows[0].updatedAt });
  } catch (error) {
    return next(error);
  }
});

app.patch('/api/content/site/translations/:language/:section', requireAuth, requireStaff, async (req, res, next) => {
  const { language, section } = req.params;
  if (!['de', 'es'].includes(language) || !['hero', 'services', 'portfolio', 'process', 'maintenance', 'techStack', 'faqs', 'settings'].includes(section)) return res.status(400).json({ success: false, message: 'Invalid language or content section.' });
  const value = req.body;
  if (!value || Array.isArray(value) || typeof value !== 'object' || JSON.stringify(value).length > 250000) return res.status(400).json({ success: false, message: 'Invalid translation content.' });
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    const [rows] = await connection.execute('SELECT content_json FROM site_content WHERE content_key = ? FOR UPDATE', ['site']);
    if (!rows.length) { await connection.rollback(); return res.status(409).json({ success: false, message: 'Publish the site content before saving translations.' }); }
    const site = JSON.parse(rows[0].content_json);
    site.translations ||= {};
    site.translations[language] ||= {};
    site.translations[language][section] = value;
    const serialized = JSON.stringify(site);
    if (serialized.length > 500000) { await connection.rollback(); return res.status(413).json({ success: false, message: 'Content payload is too large.' }); }
    await connection.execute('UPDATE site_content SET content_json = ?, updated_by = ? WHERE content_key = ?', [serialized, req.user.sub, 'site']);
    await connection.commit();
    return res.json({ success: true });
  } catch (error) {
    if (connection) await connection.rollback().catch(() => {});
    return next(error);
  } finally { if (connection) connection.release(); }
});

app.put('/api/content/:key', requireAuth, requireStaff, async (req, res, next) => {
  const key = cleanString(req.params.key, 100);
  if (!/^[a-zA-Z0-9_-]+$/.test(key)) return res.status(400).json({ success: false, message: 'Invalid content key.' });
  if (req.body === undefined) return res.status(400).json({ success: false, message: 'Content payload is required.' });
  const serialized = JSON.stringify(req.body);
  if (serialized.length > 500000) return res.status(413).json({ success: false, message: 'Content payload is too large.' });
  if (key === 'site') {
    if (!req.body || Array.isArray(req.body) || typeof req.body !== 'object') return res.status(400).json({ success: false, message: 'Site content must be an object.' });
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();
      await connection.execute('INSERT IGNORE INTO site_content (content_key, content_json, updated_by) VALUES (?, ?, ?)', [key, '{}', req.user.sub]);
      const [rows] = await connection.execute('SELECT content_json FROM site_content WHERE content_key = ? FOR UPDATE', [key]);
      const current = JSON.parse(rows[0].content_json);
      const nextSite = { ...req.body, translations: current.translations || req.body.translations || {} };
      const merged = JSON.stringify(nextSite);
      if (merged.length > 500000) { await connection.rollback(); return res.status(413).json({ success: false, message: 'Content payload is too large.' }); }
      await connection.execute('UPDATE site_content SET content_json = ?, updated_by = ? WHERE content_key = ?', [merged, req.user.sub, key]);
      await connection.commit();
      return res.json({ success: true, contentKey: key });
    } catch (error) {
      if (connection) await connection.rollback().catch(() => {});
      return next(error);
    } finally { if (connection) connection.release(); }
  }
  try {
    await pool.execute(
      `INSERT INTO site_content (content_key, content_json, updated_by) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE content_json = VALUES(content_json), updated_by = VALUES(updated_by)`,
      [key, serialized, req.user.sub]
    );
    return res.json({ success: true, contentKey: key });
  } catch (error) { return next(error); }
});

function sanitizeHttpUrl(value) {
  const cleaned = cleanString(value, 500);
  if (!cleaned) return null;
  try {
    const parsed = new URL(cleaned);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString() : null;
  } catch {
    return null;
  }
}

const OFFICE_SELECT_FIELDS = `
  id, slug, country, city, office_label AS officeLabel, role_subtitle AS roleSubtitle,
  street_address AS streetAddress, postal_city AS postalCity, phone, email,
  business_hours AS businessHours, timezone, map_url AS mapUrl,
  is_primary AS isPrimary, is_active AS isActive, sort_order AS sortOrder,
  created_at AS createdAt, updated_at AS updatedAt
`;

app.get('/api/offices', async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT ${OFFICE_SELECT_FIELDS} FROM office_locations WHERE is_active = TRUE ORDER BY sort_order ASC, is_primary DESC, created_at ASC`
  );
  return res.json({
    success: true,
    offices: rows.map((row) => ({ ...row, isPrimary: Boolean(row.isPrimary), isActive: Boolean(row.isActive) }))
  });
});

app.get('/api/admin/offices', requireAuth, requireStaff, async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT ${OFFICE_SELECT_FIELDS} FROM office_locations ORDER BY sort_order ASC, is_primary DESC, created_at ASC`
  );
  return res.json({
    success: true,
    offices: rows.map((row) => ({ ...row, isPrimary: Boolean(row.isPrimary), isActive: Boolean(row.isActive) }))
  });
});

app.post('/api/offices', requireAuth, requireStaff, async (req, res, next) => {
  const country = cleanString(req.body?.country, 100);
  const city = cleanString(req.body?.city, 100);
  const officeLabel = cleanString(req.body?.officeLabel, 160);
  const roleSubtitle = cleanString(req.body?.roleSubtitle, 200) || null;
  const streetAddress = cleanString(req.body?.streetAddress, 255);
  const postalCity = cleanString(req.body?.postalCity, 180);
  const phone = cleanString(req.body?.phone, 60) || null;
  const email = cleanString(req.body?.email, 255) || null;
  const businessHours = cleanString(req.body?.businessHours, 160) || null;
  const timezone = cleanString(req.body?.timezone, 80) || null;
  const rawMapUrl = cleanString(req.body?.mapUrl, 500);
  const mapUrl = sanitizeHttpUrl(rawMapUrl);
  if (rawMapUrl && !mapUrl) {
    return res.status(400).json({ success: false, message: 'Map URL must start with http:// or https://.' });
  }
  if (!country || !city || !officeLabel || !streetAddress || !postalCity) {
    return res.status(400).json({ success: false, message: 'Country, city, office title, street address, and postal/city line are required.' });
  }
  const isPrimary = Boolean(req.body?.isPrimary);
  const isActive = req.body?.isActive !== false;
  const sortOrder = Number.isFinite(Number(req.body?.sortOrder)) ? Number(req.body.sortOrder) : 0;
  const id = randomUUID();
  const baseSlug = `${country}-${city}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'office';
  const slug = `${baseSlug}-${id.slice(0, 6)}`;

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    if (isPrimary) {
      await connection.execute('UPDATE office_locations SET is_primary = FALSE');
    }
    await connection.execute(
      `INSERT INTO office_locations
       (id, slug, country, city, office_label, role_subtitle, street_address, postal_city, phone, email, business_hours, timezone, map_url, is_primary, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, slug, country, city, officeLabel, roleSubtitle, streetAddress, postalCity, phone, email, businessHours, timezone, mapUrl, isPrimary, isActive, sortOrder]
    );
    const [created] = await connection.execute(`SELECT ${OFFICE_SELECT_FIELDS} FROM office_locations WHERE id = ? LIMIT 1`, [id]);
    await connection.commit();
    return res.status(201).json({
      success: true,
      office: { ...created[0], isPrimary: Boolean(created[0].isPrimary), isActive: Boolean(created[0].isActive) }
    });
  } catch (error) {
    if (connection) await connection.rollback().catch(() => {});
    return next(error);
  } finally {
    if (connection) connection.release();
  }
});

app.put('/api/offices/:id', requireAuth, requireStaff, async (req, res, next) => {
  const [existingRows] = await pool.execute('SELECT * FROM office_locations WHERE id = ? LIMIT 1', [req.params.id]);
  const existing = existingRows[0];
  if (!existing) return res.status(404).json({ success: false, message: 'Office location not found.' });

  const country = req.body?.country !== undefined ? cleanString(req.body.country, 100) : existing.country;
  const city = req.body?.city !== undefined ? cleanString(req.body.city, 100) : existing.city;
  const officeLabel = req.body?.officeLabel !== undefined ? cleanString(req.body.officeLabel, 160) : existing.office_label;
  const roleSubtitle = req.body?.roleSubtitle !== undefined ? (cleanString(req.body.roleSubtitle, 200) || null) : existing.role_subtitle;
  const streetAddress = req.body?.streetAddress !== undefined ? cleanString(req.body.streetAddress, 255) : existing.street_address;
  const postalCity = req.body?.postalCity !== undefined ? cleanString(req.body.postalCity, 180) : existing.postal_city;
  const phone = req.body?.phone !== undefined ? (cleanString(req.body.phone, 60) || null) : existing.phone;
  const email = req.body?.email !== undefined ? (cleanString(req.body.email, 255) || null) : existing.email;
  const businessHours = req.body?.businessHours !== undefined ? (cleanString(req.body.businessHours, 160) || null) : existing.business_hours;
  const timezone = req.body?.timezone !== undefined ? (cleanString(req.body.timezone, 80) || null) : existing.timezone;
  let mapUrl = existing.map_url;
  if (req.body?.mapUrl !== undefined) {
    const rawMapUrl = cleanString(req.body.mapUrl, 500);
    mapUrl = sanitizeHttpUrl(rawMapUrl);
    if (rawMapUrl && !mapUrl) {
      return res.status(400).json({ success: false, message: 'Map URL must start with http:// or https://.' });
    }
  }
  if (!country || !city || !officeLabel || !streetAddress || !postalCity) {
    return res.status(400).json({ success: false, message: 'Country, city, office title, street address, and postal/city line are required.' });
  }
  const isPrimary = req.body?.isPrimary !== undefined ? Boolean(req.body.isPrimary) : Boolean(existing.is_primary);
  const isActive = req.body?.isActive !== undefined ? Boolean(req.body.isActive) : Boolean(existing.is_active);
  const sortOrder = req.body?.sortOrder !== undefined && Number.isFinite(Number(req.body.sortOrder))
    ? Number(req.body.sortOrder)
    : existing.sort_order;

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    if (isPrimary) {
      await connection.execute('UPDATE office_locations SET is_primary = FALSE WHERE id <> ?', [req.params.id]);
    }
    await connection.execute(
      `UPDATE office_locations
       SET country = ?, city = ?, office_label = ?, role_subtitle = ?, street_address = ?, postal_city = ?,
           phone = ?, email = ?, business_hours = ?, timezone = ?, map_url = ?, is_primary = ?, is_active = ?, sort_order = ?
       WHERE id = ?`,
      [country, city, officeLabel, roleSubtitle, streetAddress, postalCity, phone, email, businessHours, timezone, mapUrl, isPrimary, isActive, sortOrder, req.params.id]
    );
    const [updated] = await connection.execute(`SELECT ${OFFICE_SELECT_FIELDS} FROM office_locations WHERE id = ? LIMIT 1`, [req.params.id]);
    await connection.commit();
    return res.json({
      success: true,
      office: { ...updated[0], isPrimary: Boolean(updated[0].isPrimary), isActive: Boolean(updated[0].isActive) }
    });
  } catch (error) {
    if (connection) await connection.rollback().catch(() => {});
    return next(error);
  } finally {
    if (connection) connection.release();
  }
});

app.delete('/api/offices/:id', requireAuth, requireStaff, async (req, res) => {
  const [result] = await pool.execute('DELETE FROM office_locations WHERE id = ?', [req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Office location not found.' });
  return res.json({ success: true });
});

app.use((error, _req, res, _next) => {
  console.error('Unhandled API error:', error);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

async function start() {
  await initializeDatabase();
  await checkDatabase();
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_INITIAL_PASSWORD) {
    const email = process.env.ADMIN_EMAIL.toLowerCase();
    const hash = await bcrypt.hash(process.env.ADMIN_INITIAL_PASSWORD, 12);
    await pool.execute(
      `INSERT INTO admin_users (id, email, password_hash) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE email = VALUES(email)`,
      [randomUUID(), email, hash]
    );
  }
  const server = app.listen(port, '0.0.0.0', () => console.log(`RSTechwerk API listening on port ${port}`));
  const shutdown = (signal) => {
    console.log(`${signal} received; shutting down API`);
    server.close(() => pool.end().finally(() => process.exit(0)));
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.once('SIGTERM', () => shutdown('SIGTERM'));
  process.once('SIGINT', () => shutdown('SIGINT'));
}

start().catch((error) => {
  console.error('API startup failed:', error.message);
  process.exit(1);
});
