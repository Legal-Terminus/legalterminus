import nodemailer from 'nodemailer';
import { logger } from '../config/logger.js';

/**
 * Email transport (E07-S02) — Gmail SMTP via Nodemailer + an App Password.
 *
 * Config (env):
 *   GMAIL_USER          the sending Gmail / Workspace address
 *   GMAIL_APP_PASSWORD  a Google "App Password" (NOT the account password)
 *   EMAIL_FROM          optional display From (defaults to GMAIL_USER)
 *   FRONTEND_URL        base URL for deep links in emails (e.g. https://…web.app)
 *
 * Safe no-op: if GMAIL_USER / GMAIL_APP_PASSWORD are unset, sends are skipped and
 * logged ("would send") so dev / CI / unconfigured environments never break — and
 * a workflow action is NEVER blocked by email. Set the env vars to go live.
 */

let _transporter = null;
let _checked = false;

function getTransporter() {
  if (_checked) return _transporter;
  _checked = true;
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    logger.warn('[email] GMAIL_USER / GMAIL_APP_PASSWORD unset — email sending disabled (no-op).');
    _transporter = null;
    return null;
  }
  _transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });
  logger.info('[email] Gmail SMTP transport configured.');
  return _transporter;
}

/** Is email actually configured (vs. no-op)? Useful for tests/diagnostics. */
export function isEmailEnabled() {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

/** Build a simple branded HTML + text body for a notification email. */
function renderEmail({ title, message, taskId }) {
  const base = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
  const link = taskId && base ? `${base}/portal/tasks/${taskId}` : (base ? `${base}/portal/` : null);
  const cta = link
    ? `<p style="margin:24px 0"><a href="${link}" style="background:#4f46e5;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600;display:inline-block">View in Portal</a></p>`
    : '';
  const html = `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111;line-height:1.5">
    <div style="max-width:560px;margin:0 auto;padding:24px">
      <p style="font-size:13px;color:#6b7280;margin:0 0 8px">Legal Terminus</p>
      <h2 style="font-size:18px;margin:0 0 8px">${escapeHtml(title)}</h2>
      <p style="margin:0;color:#374151">${escapeHtml(message)}</p>
      ${cta}
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
      <p style="font-size:12px;color:#9ca3af;margin:0">You're receiving this because you have an account on the Legal Terminus portal.</p>
    </div></body></html>`;
  const text = `${title}\n\n${message}${link ? `\n\nView in Portal: ${link}` : ''}\n\n— Legal Terminus`;
  return { html, text };
}

/**
 * Send a notification email. Fire-and-forget friendly: never throws, returns a
 * boolean (sent / skipped-or-failed). Mirrors an in-app notification.
 */
export async function sendNotificationEmail({ to, title, message, taskId }) {
  try {
    if (!to || !title) return false;
    const transporter = getTransporter();
    if (!transporter) {
      logger.info({ to, title }, '[email] (no-op) would send notification email');
      return false;
    }
    const { html, text } = renderEmail({ title, message, taskId });
    const from = process.env.EMAIL_FROM || process.env.GMAIL_USER;
    await transporter.sendMail({ from, to, subject: title, text, html });
    return true;
  } catch (err) {
    logger.warn({ err: err?.message, to }, '[email] send failed (non-fatal)');
    return false;
  }
}
