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
import { checkDatabase, initializeDatabase, pool } from './db.js';
import { emailEnabled, sendNotification } from './mailer.js';

const app = express();
const port = Number(process.env.PORT || 4000);
const jwtSecret = process.env.JWT_SECRET;
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

if (!jwtSecret || jwtSecret.startsWith('replace-with-')) {
  throw new Error('JWT_SECRET must be configured before starting the API');
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
    if (paymentId) {
      await pool.execute('UPDATE payments SET status = ?, provider_reference = ?, paid_at = NOW() WHERE id = ? AND status <> \'paid\'', ['paid', session.payment_intent || session.id, paymentId]);
      await pool.execute('UPDATE project_milestones m JOIN payments p ON p.milestone_id = m.id SET m.status = \'paid\', m.payment_reference = p.provider_reference, m.paid_at = NOW() WHERE p.id = ? AND p.status = \'paid\'', [paymentId]);
      await pool.execute('UPDATE maintenance_invoices SET status = \'paid\', provider_reference = ?, paid_at = NOW() WHERE id = ? AND status <> \'paid\'', [session.payment_intent || session.id, session.metadata?.maintenanceInvoiceId || '']);
    }
  }
  return res.json({ received: true });
});
app.use(express.json({ limit: '100kb' }));

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
const documentUpload = multer({
  storage: multer.diskStorage({ destination: documentDirectory, filename: (_req, file, callback) => callback(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`) }),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => callback(null, ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/zip', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.mimetype))
});
app.use('/uploads', express.static(path.resolve(projectRoot, '..', 'public', 'uploads')));
if (existsSync(distDirectory)) {
  app.use(express.static(distDirectory, { index: 'index.html' }));
  app.get(['/admin', '/admin/'], (_req, res) => res.sendFile(path.join(distDirectory, 'admin.html')));
  app.get(['/login', '/login/', '/admin/login'], (_req, res) => res.sendFile(path.join(distDirectory, 'login.html')));
  app.get(['/portal', '/portal/'], (_req, res) => res.sendFile(path.join(distDirectory, 'portal.html')));
  app.get(['/register', '/register/'], (_req, res) => res.sendFile(path.join(distDirectory, 'register.html')));
  app.get(['/reset-password', '/reset-password/'], (_req, res) => res.sendFile(path.join(distDirectory, 'reset-password.html')));
  app.get(['/admin-client', '/admin-client/'], (_req, res) => res.sendFile(path.join(distDirectory, 'admin-client.html')));
}

function issueToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '8h' });
}

function requireAuth(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ success: false, message: 'Authentication required.' });

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }
}

function requireStaff(req, res, next) {
  if (!['Administrator', 'admin', 'manager'].includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: 'Staff access required.' });
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

  const [rows] = await pool.execute('SELECT id, email, password_hash, role FROM admin_users WHERE email = ? LIMIT 1', [email]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  return res.json({ success: true, token: issueToken(user), user: { id: user.id, email: user.email, role: user.role } });
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
  const [rows] = await pool.execute('SELECT id, email, role FROM admin_users WHERE id = ? LIMIT 1', [req.user.sub]);
  if (!rows[0]) return res.status(401).json({ success: false, message: 'User account not found.' });
  return res.json({ success: true, user: rows[0] });
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

app.get('/api/inquiries', requireAuth, async (_req, res) => {
  const [rows] = await pool.query(`
    SELECT id, full_name AS fullName, email, phone, company, service, budget, custom_budget AS customBudget,
           currency, description, status, internal_notes AS internalNotes, created_at AS createdAt, updated_at AS updatedAt
    FROM inquiries ORDER BY created_at DESC
  `);
  return res.json({ success: true, inquiries: rows });
});

app.get('/api/dashboard/stats', requireAuth, async (_req, res) => {
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

app.patch('/api/inquiries/:id', requireAuth, async (req, res) => {
  const status = cleanString(req.body?.status, 40);
  const internalNotes = cleanString(req.body?.internalNotes, 5000);
  const allowedStatuses = new Set(['new', 'discovery', 'proposal', 'won', 'lost']);
  if (!allowedStatuses.has(status)) return res.status(400).json({ success: false, message: 'Invalid inquiry status.' });
  const [result] = await pool.execute('UPDATE inquiries SET status = ?, internal_notes = ? WHERE id = ?', [status, internalNotes || null, req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
  return res.json({ success: true });
});

app.delete('/api/inquiries/:id', requireAuth, async (req, res) => {
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
  const companyName = cleanString(req.body?.companyName, 255);
  const contactName = cleanString(req.body?.contactName, 180);
  const phone = cleanString(req.body?.phone, 30) || null;
  const country = cleanString(req.body?.country, 100) || null;
  const status = ['active', 'inactive', 'suspended'].includes(req.body?.status) ? req.body.status : 'active';
  if (!companyName || !contactName) return res.status(400).json({ success:false, message:'Company name and contact name are required.' });
  const [result] = await pool.execute('UPDATE clients SET company_name = ?, contact_name = ?, phone = ?, country = ?, status = ? WHERE id = ?', [companyName, contactName, phone, country, status, req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ success:false, message:'Client not found.' });
  return res.json({ success:true });
});

app.post('/api/clients/:id/reset-password', requireAuth, requireStaff, async (req, res) => {
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (password.length < 10) return res.status(400).json({ success:false, message:'Password must be at least 10 characters.' });
  const [rows] = await pool.execute('SELECT user_id AS userId FROM clients WHERE id = ? LIMIT 1', [req.params.id]);
  if (!rows[0]?.userId) return res.status(404).json({ success:false, message:'Client account not found.' });
  await pool.execute('UPDATE admin_users SET password_hash = ? WHERE id = ?', [await bcrypt.hash(password, 12), rows[0].userId]);
  return res.json({ success:true, message:'Client password reset.' });
});

app.get('/api/proposals', requireAuth, async (req, res) => {
  const staff = ['Administrator', 'admin', 'manager'].includes(req.user.role);
  const [rows] = await pool.query(`SELECT p.id, p.client_id AS clientId, c.company_name AS companyName, p.title, p.scope, p.terms, p.currency, p.total_amount AS totalAmount, p.status, p.expires_at AS expiresAt, p.sent_at AS sentAt, p.accepted_at AS acceptedAt, p.created_at AS createdAt FROM proposals p JOIN clients c ON c.id = p.client_id ${staff ? '' : 'WHERE c.user_id = ?'} ORDER BY p.created_at DESC`, staff ? [] : [req.user.sub]);
  return res.json({ success: true, proposals: rows });
});

app.get('/api/maintenance', requireAuth, async (req, res) => {
  const staff = ['Administrator', 'admin', 'manager'].includes(req.user.role);
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
  const staff = ['Administrator', 'admin', 'manager'].includes(req.user.role);
  const [rows] = await pool.query(`SELECT i.id, i.contract_id AS contractId, i.client_id AS clientId, i.invoice_number AS invoiceNumber, i.period_start AS periodStart, i.period_end AS periodEnd, i.amount, i.currency, i.status, i.due_date AS dueDate, i.paid_at AS paidAt, m.title FROM maintenance_invoices i JOIN maintenance_contracts m ON m.id = i.contract_id ${staff ? '' : 'WHERE i.client_id = (SELECT id FROM clients WHERE user_id = ? LIMIT 1)'} ORDER BY i.created_at DESC`, staff ? [] : [req.user.sub]);
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
  const [rows] = await pool.execute(`SELECT i.id, i.invoice_number AS invoiceNumber, i.amount, i.currency, i.status, i.client_id AS clientId, m.title FROM maintenance_invoices i JOIN maintenance_contracts m ON m.id = i.contract_id WHERE i.id = ? AND (? IN ('Administrator','admin','manager') OR i.client_id = (SELECT id FROM clients WHERE user_id = ? LIMIT 1)) LIMIT 1`, [req.params.id, req.user.role, req.user.sub]);
  const invoice = rows[0];
  if (!invoice) return res.status(404).json({ success: false, message: 'Maintenance invoice not found.' });
  if (invoice.status === 'paid') return res.status(400).json({ success: false, message: 'This invoice is already paid.' });
  const provider = cleanString(req.body?.provider, 20).toLowerCase();
  if (provider === 'stripe') {
    if (!stripe) return res.status(503).json({ success: false, message: 'Stripe is not configured.' });
    const session = await stripe.checkout.sessions.create({ mode:'payment', line_items:[{ price_data:{ currency:invoice.currency.toLowerCase(), product_data:{ name:`Maintenance invoice ${invoice.invoiceNumber}` }, unit_amount:Math.round(Number(invoice.amount)*100) }, quantity:1 }], success_url:`${process.env.APP_URL || 'http://localhost:3000'}/portal.html?maintenancePayment=success`, cancel_url:`${process.env.APP_URL || 'http://localhost:3000'}/portal.html?maintenancePayment=cancelled`, metadata:{ maintenanceInvoiceId: invoice.id } });
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
  const [rows] = await pool.execute('SELECT id, client_id AS clientId, provider_reference AS providerReference, status FROM maintenance_invoices WHERE id = ? LIMIT 1', [req.params.id]);
  const invoice = rows[0]; if (!invoice || (!['Administrator','admin','manager'].includes(req.user.role) && invoice.clientId !== (await pool.query('SELECT id FROM clients WHERE user_id = ? LIMIT 1', [req.user.sub]))[0][0]?.id)) return res.status(404).json({ success:false, message:'Maintenance invoice not found.' });
  if (!invoice.providerReference || invoice.status === 'paid') return res.status(400).json({ success:false, message:'PayPal order is unavailable.' });
  const base = process.env.PAYPAL_ENV === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'; const basic = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const tokenResponse = await fetch(`${base}/v1/oauth2/token`, { method:'POST', headers:{ Authorization:`Basic ${basic}`, 'Content-Type':'application/x-www-form-urlencoded' }, body:'grant_type=client_credentials' }); const tokenData = await tokenResponse.json();
  const captureResponse = await fetch(`${base}/v2/checkout/orders/${encodeURIComponent(invoice.providerReference)}/capture`, { method:'POST', headers:{ Authorization:`Bearer ${tokenData.access_token}`, 'Content-Type':'application/json' } }); const capture = await captureResponse.json();
  if (!captureResponse.ok) return res.status(502).json({ success:false, message:capture.message || 'PayPal capture failed.' });
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
  const staff = ['Administrator', 'admin', 'manager'].includes(req.user.role);
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
    ${['Administrator', 'admin', 'manager'].includes(req.user.role) ? '' : 'WHERE c.user_id = ?'}
    ORDER BY p.created_at DESC`, ['Administrator', 'admin', 'manager'].includes(req.user.role) ? [] : [req.user.sub]);
  return res.json({ success: true, projects: rows });
});

app.post('/api/projects', requireAuth, requireStaff, async (req, res) => {
  const clientId = cleanString(req.body?.clientId, 36);
  const name = cleanString(req.body?.name, 255);
  if (!clientId || !name) return res.status(400).json({ success: false, message: 'Client and project name are required.' });
  const id = randomUUID();
  await pool.execute('INSERT INTO projects (id, client_id, proposal_id, name, description, status, start_date, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [id, clientId, cleanString(req.body?.proposalId, 36) || null, name, cleanString(req.body?.description, 5000) || null, cleanString(req.body?.status, 40) || 'draft', req.body?.startDate || null, req.body?.dueDate || null]);
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
  const [rows] = await pool.query('SELECT m.id, m.project_id AS projectId, m.title, m.description, m.amount, m.currency, m.due_date AS dueDate, m.status, m.paid_at AS paidAt, m.sort_order AS sortOrder FROM project_milestones m JOIN projects p ON p.id = m.project_id JOIN clients c ON c.id = p.client_id WHERE m.project_id = ? AND (? IN (\'Administrator\', \'admin\', \'manager\') OR c.user_id = ?) ORDER BY m.sort_order, m.created_at', [req.params.id, req.user.role, req.user.sub]);
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
  const staff = ['Administrator', 'admin', 'manager'].includes(req.user.role);
  const allowedStatuses = new Set(['payment_pending', 'paid', 'in_progress', 'submitted', 'approved', 'revision_requested', 'completed']);
  if (!allowedStatuses.has(status)) return res.status(400).json({ success: false, message: 'Invalid milestone status.' });
  const milestone = await getMilestoneForUser(req.params.id, req.params.milestoneId, req.user);
  if (!milestone || (!staff && !['approved', 'revision_requested'].includes(status))) return res.status(403).json({ success: false, message: 'You cannot update this milestone.' });
  await pool.execute('UPDATE project_milestones SET status = ?, paid_at = IF(? = \'paid\', NOW(), paid_at) WHERE id = ? AND project_id = ?', [status, status, req.params.milestoneId, req.params.id]);
  return res.json({ success: true, status });
});

app.get('/api/projects/:id/files', requireAuth, async (req, res) => {
  const [rows] = await pool.query(`SELECT f.id, f.project_id AS projectId, f.original_name AS originalName, f.mime_type AS mimeType, f.file_size AS fileSize, f.visible_to_client AS visibleToClient, f.created_at AS createdAt FROM project_files f JOIN projects p ON p.id = f.project_id JOIN clients c ON c.id = p.client_id WHERE f.project_id = ? AND (? IN ('Administrator', 'admin', 'manager') OR (c.user_id = ? AND f.visible_to_client = TRUE)) ORDER BY f.created_at DESC`, [req.params.id, req.user.role, req.user.sub]);
  return res.json({ success: true, files: rows });
});

app.get('/api/projects/:id/invoices', requireAuth, async (req, res) => {
  const [rows] = await pool.query(`SELECT i.id, i.project_id AS projectId, i.invoice_number AS invoiceNumber, i.description, i.amount, i.currency, i.status, i.due_date AS dueDate, i.paid_at AS paidAt, i.created_at AS createdAt FROM invoices i JOIN projects p ON p.id = i.project_id JOIN clients c ON c.id = i.client_id WHERE i.project_id = ? AND (? IN ('Administrator', 'admin', 'manager') OR c.user_id = ?) ORDER BY i.created_at DESC`, [req.params.id, req.user.role, req.user.sub]);
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
  const [result] = await pool.execute('UPDATE invoices SET status = ?, paid_at = IF(? = \'paid\', NOW(), paid_at) WHERE id = ?', [status, status, req.params.id]);
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
  const [rows] = await pool.query(`SELECT f.* FROM project_files f JOIN projects p ON p.id = f.project_id JOIN clients c ON c.id = p.client_id WHERE f.id = ? AND f.project_id = ? AND (? IN ('Administrator', 'admin', 'manager') OR (c.user_id = ? AND f.visible_to_client = TRUE)) LIMIT 1`, [req.params.fileId, req.params.id, req.user.role, req.user.sub]);
  const file = rows[0];
  if (!file) return res.status(404).json({ success: false, message: 'File not found.' });
  res.setHeader('Content-Disposition', `attachment; filename="${file.original_name.replace(/[^a-zA-Z0-9._-]/g, '_')}"`);
  res.setHeader('Content-Type', file.mime_type);
  return createReadStream(path.join(documentDirectory, file.stored_name)).pipe(res);
});

async function getMilestoneForUser(projectId, milestoneId, user) {
  const [rows] = await pool.execute(`SELECT m.id, m.title, m.amount, m.currency, p.name AS projectName, c.company_name AS companyName, c.user_id AS clientUserId FROM project_milestones m JOIN projects p ON p.id = m.project_id JOIN clients c ON c.id = p.client_id WHERE m.id = ? AND m.project_id = ? LIMIT 1`, [milestoneId, projectId]);
  const item = rows[0];
  if (!item || (!['Administrator', 'admin', 'manager'].includes(user.role) && item.clientUserId !== user.sub)) return null;
  return item;
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
      const session = await stripe.checkout.sessions.create({ mode: 'payment', line_items: [{ price_data: { currency: milestone.currency.toLowerCase(), product_data: { name: `${milestone.projectName} — ${milestone.title}` }, unit_amount: Math.round(Number(milestone.amount) * 100) }, quantity: 1 }], success_url: `${process.env.APP_URL || 'http://localhost:3000'}/portal.html?payment=success`, cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/portal.html?payment=cancelled`, metadata: { paymentId, projectId: req.params.id, milestoneId: req.params.milestoneId } });
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
      const orderResponse = await fetch(`${base}/v2/checkout/orders`, { method: 'POST', headers: { Authorization: `Bearer ${tokenData.access_token}`, 'Content-Type': 'application/json', 'PayPal-Request-Id': paymentId }, body: JSON.stringify({ intent: 'CAPTURE', purchase_units: [{ reference_id: paymentId, description: `${milestone.projectName} — ${milestone.title}`, amount: { currency_code: milestone.currency, value: Number(milestone.amount).toFixed(2) } }], application_context: { return_url: `${process.env.APP_URL || 'http://localhost:3000'}/portal.html?paypal=success`, cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/portal.html?paypal=cancelled` } }) });
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
  const [payments] = await pool.execute('SELECT id, provider_reference AS providerReference FROM payments WHERE milestone_id = ? AND provider = \'paypal\' AND status = \'pending\' ORDER BY created_at DESC LIMIT 1', [req.params.milestoneId]);
  const payment = payments[0];
  if (!payment?.providerReference) return res.status(404).json({ success: false, message: 'PayPal order not found.' });
  const base = process.env.PAYPAL_ENV === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
  const basic = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const tokenResponse = await fetch(`${base}/v1/oauth2/token`, { method: 'POST', headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials' });
  const tokenData = await tokenResponse.json();
  const captureResponse = await fetch(`${base}/v2/checkout/orders/${encodeURIComponent(payment.providerReference)}/capture`, { method: 'POST', headers: { Authorization: `Bearer ${tokenData.access_token}`, 'Content-Type': 'application/json' } });
  const capture = await captureResponse.json();
  if (!captureResponse.ok) return res.status(502).json({ success: false, message: capture.message || 'PayPal capture failed.' });
  await pool.execute('UPDATE payments SET status = \'paid\', paid_at = NOW() WHERE id = ?', [payment.id]);
  await pool.execute('UPDATE project_milestones SET status = \'paid\', payment_reference = ?, paid_at = NOW() WHERE id = ?', [payment.providerReference, req.params.milestoneId]);
  return res.json({ success: true, status: 'paid' });
});

app.get('/api/projects/:id/updates', requireAuth, async (req, res) => {
  const [rows] = await pool.query('SELECT u.id, u.project_id AS projectId, u.title, u.body, u.progress, u.created_at AS createdAt FROM project_updates u JOIN projects p ON p.id = u.project_id JOIN clients c ON c.id = p.client_id WHERE u.project_id = ? AND (? IN (\'Administrator\', \'admin\', \'manager\') OR (c.user_id = ? AND u.visible_to_client = TRUE)) ORDER BY u.created_at DESC', [req.params.id, req.user.role, req.user.sub]);
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

app.post('/api/uploads/portfolio', requireAuth, imageUpload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Please select a valid image (JPG, PNG, WebP, or AVIF).' });
  return res.status(201).json({ success: true, imageUrl: `/uploads/portfolio/${req.file.filename}` });
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
    content.site.settings = publicSettings;
  }
  return res.json({ success: true, content, updatedAt: rows[0]?.updatedAt || null });
});

app.put('/api/content/:key', requireAuth, async (req, res) => {
  const key = cleanString(req.params.key, 100);
  if (!/^[a-zA-Z0-9_-]+$/.test(key)) return res.status(400).json({ success: false, message: 'Invalid content key.' });
  if (req.body === undefined) return res.status(400).json({ success: false, message: 'Content payload is required.' });
  const serialized = JSON.stringify(req.body);
  if (serialized.length > 500000) return res.status(413).json({ success: false, message: 'Content payload is too large.' });
  await pool.execute(
    `INSERT INTO site_content (content_key, content_json, updated_by) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE content_json = VALUES(content_json), updated_by = VALUES(updated_by)`,
    [key, serialized, req.user.sub]
  );
  return res.json({ success: true, contentKey: key });
});

app.use((error, _req, res, _next) => {
  console.error('Unhandled API error:', error);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

async function start() {
  await initializeDatabase();
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_INITIAL_PASSWORD) {
    const email = process.env.ADMIN_EMAIL.toLowerCase();
    const hash = await bcrypt.hash(process.env.ADMIN_INITIAL_PASSWORD, 12);
    await pool.execute(
      `INSERT INTO admin_users (id, email, password_hash) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE email = VALUES(email)`,
      [randomUUID(), email, hash]
    );
  }
  app.listen(port, () => console.log(`RSTechwerk API listening on http://localhost:${port}`));
}

start().catch((error) => {
  console.error('API startup failed:', error.message);
  process.exit(1);
});
