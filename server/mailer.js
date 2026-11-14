import nodemailer from 'nodemailer';

const configured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.INQUIRY_NOTIFY_EMAIL);
const transporter = configured ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_PORT || '587') === '465',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
}) : null;

export async function sendNotification({ to, subject, text, html }) {
  if (!transporter || !to) {
    console.info(`[mailer] skipped: ${subject}`);
    return { skipped: true };
  }
  try {
    await transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, text, html });
    return { sent: true };
  } catch (error) {
    console.error('[mailer] delivery failed:', error.message);
    return { sent: false };
  }
}

export function emailEnabled() { return Boolean(transporter); }
