(() => {
  const supported = ['en', 'de', 'es'];
  const copy = {
    en: { kicker: 'Engineering insights', heading: 'Ideas for building better software', intro: 'Practical, experience-led guidance on custom software, ERP, SaaS, integrations and dependable delivery.', read: 'Read article →', empty: 'No articles have been published yet.', back: '← All insights', unavailable: 'This article is not available.' },
    de: { kicker: 'Einblicke in die Softwareentwicklung', heading: 'Ideen für bessere Software', intro: 'Praxisnahe Orientierung zu Individualsoftware, ERP, SaaS, Integrationen und zuverlässiger Umsetzung.', read: 'Artikel lesen →', empty: 'Es wurden noch keine Artikel veröffentlicht.', back: '← Alle Beiträge', unavailable: 'Dieser Artikel ist nicht verfügbar.' },
    es: { kicker: 'Ideas de ingeniería', heading: 'Ideas para crear mejor software', intro: 'Consejos prácticos sobre software a medida, ERP, SaaS, integraciones y entregas fiables.', read: 'Leer artículo →', empty: 'Todavía no se han publicado artículos.', back: '← Todos los artículos', unavailable: 'Este artículo no está disponible.' }
  };
  function currentLanguage() {
    const query = new URLSearchParams(location.search).get('lang');
    if (supported.includes(query)) return query;
    try { const stored = localStorage.getItem('tecklumo-language'); if (supported.includes(stored)) return stored; } catch {}
    const locales = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
    for (const locale of locales) {
      const language = locale.split('-')[0].toLowerCase();
      if (supported.includes(language)) return language;
      try { const region = new Intl.Locale(locale).region; if (['DE', 'AT', 'CH', 'LI', 'LU'].includes(region)) return 'de'; } catch {}
    }
    return 'en';
  }
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const localized = (post, language) => post?.translations?.[language]?.title ? post.translations[language] : (post?.translations?.en || Object.values(post?.translations || {}).find((value) => value?.title) || {});
  const formatDate = (value, language) => {
    if (!value) return '';
    const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
    return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat({ en: 'en-GB', de: 'de-DE', es: 'es-ES' }[language], { dateStyle: 'medium' }).format(date);
  };
  const renderBody = (body) => String(body || '').split(/\n\s*\n/).filter(Boolean).map((part) => `<p>${escapeHtml(part.trim()).replaceAll('\n', '<br>')}</p>`).join('');
  const language = currentLanguage();

  const list = document.querySelector('[data-blog-list]');
  if (list) {
    document.documentElement.lang = language;
    document.getElementById('blogLanguage').value = language;
    const labels = copy[language];
    document.getElementById('blogKicker').textContent = labels.kicker;
    document.getElementById('blogHeading').textContent = labels.heading;
    document.getElementById('blogIntro').textContent = labels.intro;
    document.getElementById('blogLanguage').addEventListener('change', (event) => {
      try { localStorage.setItem('tecklumo-language', event.target.value); } catch {}
      location.href = `/blog?lang=${event.target.value}`;
    });
    fetch(`/api/blog/posts?lang=${language}`).then((response) => response.ok ? response.json() : Promise.reject()).then(({ posts = [] }) => {
      const grid = document.getElementById('blogPostGrid');
      const visible = posts.filter((post) => localized(post, language).title);
      if (!visible.length) { grid.innerHTML = `<p class="blog-empty">${labels.empty}</p>`; return; }
      grid.innerHTML = visible.map((post) => {
        const content = localized(post, language);
        const url = `/blog/${encodeURIComponent(post.slug)}?lang=${language}`;
        return `<article class="blog-card">${post.coverImage ? `<a href="${url}"><img src="${escapeHtml(post.coverImage)}" alt="${escapeHtml(content.coverAlt || content.title)}" loading="lazy"></a>` : ''}<div class="blog-card-content"><div class="blog-card-meta"><span>${escapeHtml(content.category || post.category || 'Insights')}</span><time datetime="${escapeHtml(String(post.publishedAt || '').slice(0, 10))}">${escapeHtml(formatDate(post.publishedAt, language))}</time></div><h2><a href="${url}">${escapeHtml(content.title)}</a></h2><p>${escapeHtml(content.excerpt || '')}</p><a class="blog-read" href="${url}">${labels.read}</a></div></article>`;
      }).join('');
    }).catch(() => {
      const grid = document.getElementById('blogPostGrid');
      if (grid.dataset.serverRendered !== 'true') grid.innerHTML = `<p class="blog-empty">${language === 'de' ? 'Artikel konnten nicht geladen werden. Bitte versuchen Sie es erneut.' : language === 'es' ? 'No se pudieron cargar los artículos. Inténtalo de nuevo.' : 'Articles could not be loaded. Please try again.'}</p>`;
    });
  }

  const article = document.querySelector('[data-blog-article]');
  if (!article) return;
  const languageSelect = document.getElementById('articleLanguage');
  document.documentElement.lang = language;
  languageSelect.value = language;
  languageSelect.addEventListener('change', (event) => {
    try { localStorage.setItem('tecklumo-language', event.target.value); } catch {}
    const slug = article.dataset.blogSlug || new URLSearchParams(location.search).get('slug') || location.pathname.split('/').filter(Boolean).pop();
    const isPrettyRoute = location.pathname.startsWith('/blog/') && location.pathname !== '/blog-post.html';
    location.href = isPrettyRoute ? `/blog/${encodeURIComponent(slug)}?lang=${event.target.value}` : `/blog-post.html?slug=${encodeURIComponent(slug)}&lang=${event.target.value}`;
  });
  document.getElementById('articleBackLink').textContent = copy[language].back;
  if (article.dataset.blogReady === 'true') {
    const renderedLanguage = article.dataset.blogLanguage || language;
    document.documentElement.lang = renderedLanguage;
    languageSelect.value = renderedLanguage;
    return;
  }
  const slug = new URLSearchParams(location.search).get('slug') || article.dataset.blogSlug;
  if (!slug) { document.getElementById('articleResult').innerHTML = `<p class="article-error">${copy[language].unavailable}</p>`; return; }
  fetch(`/api/blog/posts/${encodeURIComponent(slug)}?lang=${language}`).then((response) => response.ok ? response.json() : Promise.reject()).then(({ post }) => {
    if (!post) throw new Error('missing');
    const content = localized(post, language);
    const metaTitle = content.metaTitle || content.title;
    const metaDescription = content.metaDescription || content.excerpt;
    document.title = `${metaTitle} | RSTechwerk`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', metaDescription);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${location.origin}/blog/${encodeURIComponent(post.slug)}?lang=${language}`);
    document.getElementById('articleResult').innerHTML = `<header class="article-header"><span class="article-category">${escapeHtml(content.category || post.category || 'Insights')}</span><h1>${escapeHtml(content.title)}</h1><p class="article-excerpt">${escapeHtml(content.excerpt || '')}</p><div class="article-meta"><span>${escapeHtml(post.author || 'RSTechwerk')}</span><time datetime="${escapeHtml(String(post.publishedAt || '').slice(0, 10))}">${escapeHtml(formatDate(post.publishedAt, language))}</time></div></header>${post.coverImage ? `<img class="article-cover" src="${escapeHtml(post.coverImage)}" alt="${escapeHtml(content.coverAlt || content.title)}">` : ''}<div class="article-body">${renderBody(content.body)}</div><footer class="article-footer"><a href="/blog?lang=${language}">${copy[language].back}</a> · <a href="/#contact">${language === 'de' ? 'Projekt besprechen' : language === 'es' ? 'Hablar de un proyecto' : 'Discuss a project'} →</a></footer>`;
  }).catch(() => { document.getElementById('articleResult').innerHTML = `<p class="article-error">${copy[language].unavailable}</p>`; });
})();
