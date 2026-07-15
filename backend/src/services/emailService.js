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

/**
 * Hard kill-switch: force email OFF regardless of whether creds are configured.
 * Used so E2E / test runs NEVER send real mail (the seeded test accounts use fake
 * addresses — sending would bounce and risk flagging the sender). Enabled by
 * `EMAIL_DISABLED=true` (any truthy string) or `NODE_ENV=test`.
 */
function emailForceDisabled() {
  const flag = String(process.env.EMAIL_DISABLED ?? '').toLowerCase();
  return flag === 'true' || flag === '1' || flag === 'yes' || process.env.NODE_ENV === 'test';
}

function getTransporter() {
  if (_checked) return _transporter;
  _checked = true;
  if (emailForceDisabled()) {
    logger.warn('[email] EMAIL_DISABLED / test env — email sending disabled (no-op).');
    _transporter = null;
    return null;
  }
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

/** Is email actually configured AND not force-disabled (vs. no-op)? */
export function isEmailEnabled() {
  return !emailForceDisabled() && Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

/**
 * Diagnostic: verify the SMTP connection + App-Password auth WITHOUT sending an
 * email (nodemailer's transporter.verify). Returns a plain object describing the
 * config + verification result — used by the admin-only email health endpoint so
 * a deployed environment can be checked without triggering a real user action.
 * Never throws.
 */
export async function verifyEmailTransport() {
  const enabled = isEmailEnabled();
  const from = process.env.EMAIL_FROM || process.env.GMAIL_USER || null;
  const user = process.env.GMAIL_USER || null;
  if (!enabled) {
    const reason = emailForceDisabled()
      ? 'Email is force-disabled (EMAIL_DISABLED / test env) — no-op.'
      : 'GMAIL_USER / GMAIL_APP_PASSWORD not set — email disabled (no-op).';
    return { enabled: false, verified: false, from, user, error: reason };
  }
  const transporter = getTransporter();
  if (!transporter) {
    return { enabled: false, verified: false, from, user, error: 'Transport unavailable.' };
  }
  try {
    await transporter.verify();
    return { enabled: true, verified: true, from, user, error: null };
  } catch (err) {
    return { enabled: true, verified: false, from, user, error: err?.message || String(err) };
  }
}

const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

// #97: Legal Terminus brand palette — mirrors the portal's Tailwind tokens so the
// email reads as the product, not a generic template. Email-safe: inline styles,
// table layout, no external CSS/fonts.
const BRAND = {
  primary: '#2563eb',   // brand-600 (CTA / accent)
  primaryDark: '#1d4ed8', // brand-700
  ink: '#111111',
  inkSoft: '#374151',
  inkMuted: '#6b7280',
  inkFaint: '#9ca3af',
  hairline: '#e5e7eb',
  surfaceSoft: '#f8f9fa',
};

/**
 * Build a branded HTML + text body for a notification email (#97).
 * Table-based, inline-styled, dark-mode-tolerant; includes a Legal Terminus
 * wordmark header (a small SVG-free text lockup — image logos are stripped by
 * many clients, so a styled wordmark is the reliable brand cue).
 */
function renderEmail({ title, message, taskId }) {
  const base = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
  const link = taskId && base ? `${base}/portal/tasks/${taskId}` : (base ? `${base}/portal/` : null);
  const cta = link
    ? `<tr><td style="padding:24px 0 4px">
         <a href="${link}" style="background:${BRAND.primary};color:#ffffff;text-decoration:none;padding:11px 20px;border-radius:8px;font-weight:600;font-size:14px;display:inline-block">View in Portal →</a>
       </td></tr>`
    : '';
  // Wordmark: a scales/□ mark box + the name, in brand colours.
  const wordmark = `
    <span style="display:inline-block;vertical-align:middle;width:26px;height:26px;line-height:26px;text-align:center;background:${BRAND.primary};color:#ffffff;border-radius:7px;font-weight:700;font-size:14px">LT</span>
    <span style="display:inline-block;vertical-align:middle;margin-left:8px;font-weight:700;font-size:15px;color:${BRAND.ink};letter-spacing:.2px">Legal Terminus</span>`;

  const html = `<!doctype html><html><body style="margin:0;padding:0;background:${BRAND.surfaceSoft}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.surfaceSoft};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
    <tr><td align="center" style="padding:28px 16px">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid ${BRAND.hairline};border-radius:14px;overflow:hidden">
        <tr><td style="padding:20px 28px;border-bottom:1px solid ${BRAND.hairline}">${wordmark}</td></tr>
        <tr><td style="padding:28px 28px 4px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="font-size:19px;font-weight:700;color:${BRAND.ink};line-height:1.35;padding-bottom:10px">${escapeHtml(title)}</td></tr>
            <tr><td style="font-size:15px;color:${BRAND.inkSoft};line-height:1.6;white-space:pre-wrap">${escapeHtml(message)}</td></tr>
            ${cta}
          </table>
        </td></tr>
        <tr><td style="padding:20px 28px;border-top:1px solid ${BRAND.hairline}">
          <p style="margin:0;font-size:12px;color:${BRAND.inkFaint};line-height:1.5">You're receiving this because you have an account on the Legal Terminus portal.</p>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
  const text = `Legal Terminus\n\n${title}\n\n${message}${link ? `\n\nView in Portal: ${link}` : ''}\n\n— Legal Terminus`;
  return { html, text };
}

/** A short, stable, human id for a matter derived from its taskId (last 6 chars). */
function shortMatterId(taskId) {
  return taskId ? String(taskId).slice(-6) : '';
}

/**
 * #20: send the TEAM an email when a website contact/consultation form is
 * submitted. Recipient = CONTACT_LEADS_EMAIL, else EMAIL_FROM's address, else
 * GMAIL_USER. Fire-and-forget; never throws. Reuses the branded template.
 */
export async function sendContactLeadEmail(lead = {}) {
  try {
    const transporter = getTransporter();
    if (!transporter) {
      logger.info({ source: lead.source }, '[email] (no-op) would send contact-lead email');
      return false;
    }
    const to = process.env.CONTACT_LEADS_EMAIL || process.env.GMAIL_USER;
    if (!to) return false;
    const from = process.env.EMAIL_FROM || process.env.GMAIL_USER;
    const title = `New enquiry: ${lead.fullName || lead.email || 'Website visitor'}`;
    const lines = [
      lead.fullName && `Name: ${lead.fullName}`,
      lead.email && `Email: ${lead.email}`,
      lead.phone && `Phone: ${lead.phone}`,
      lead.company && `Company: ${lead.company}`,
      lead.state && `State: ${lead.state}`,
      lead.preferredCallTime && `Preferred call time: ${lead.preferredCallTime}`,
      typeof lead.whatsapp === 'boolean' && `WhatsApp opt-in: ${lead.whatsapp ? 'yes' : 'no'}`,
      (lead.sourceLabel || lead.source) && `From: ${lead.sourceLabel || lead.source}`,
      lead.subject && `Subject: ${lead.subject}`,
      lead.message && `\nMessage:\n${lead.message}`,
    ].filter(Boolean);
    const message = lines.join('\n');
    // Reuse the branded renderer (no CTA link — internal alert).
    const { html, text } = renderEmail({ title, message });
    // Set replyTo to the enquirer so the team can respond directly.
    await transporter.sendMail({
      from, to, subject: `[Legal Terminus] ${title}`, text, html,
      ...(lead.email ? { replyTo: lead.email } : {}),
    });
    return true;
  } catch (err) {
    logger.warn({ err: err?.message }, '[email] contact-lead email failed (non-fatal)');
    return false;
  }
}

/**
 * Build a STABLE, matter-scoped subject (#98) so Gmail threads all of a matter's
 * emails into one conversation. Same subject for every email on the matter — the
 * per-event detail (assigned / approved / complete / …) lives in the body's
 * heading, not the subject. Falls back to the event title when there's no matter
 * context (e.g. account-level emails like a password-setup link).
 *
 * #104: include the client's ORGANISATION name when known, since one client can
 * have several organisations each with active services — so both sides can tell
 * at a glance which matter an email is about:
 *   [Legal Terminus] ABC Technologies Pvt. Ltd. | Company Incorporation (#9Dr8eq)
 */
function matterSubject({ serviceName, taskId, title, organisation }) {
  const org = organisation && organisation.trim() ? `${organisation.trim()} | ` : '';
  if (serviceName && taskId) return `[Legal Terminus] ${org}${serviceName} (#${shortMatterId(taskId)})`;
  if (serviceName) return `[Legal Terminus] ${org}${serviceName}`;
  return title || 'Legal Terminus';
}

/**
 * Send a notification email. Fire-and-forget friendly: never throws, returns a
 * boolean (sent / skipped-or-failed). Mirrors an in-app notification.
 *
 * #97: branded HTML template. #98: a stable per-matter subject + RFC-5322
 * References/In-Reply-To headers derived from the matter id, so a matter's emails
 * thread in Gmail even if the subject is ever edited.
 */
export async function sendNotificationEmail({ to, title, message, taskId, serviceName, organisation }) {
  try {
    if (!to || !title) return false;
    const transporter = getTransporter();
    if (!transporter) {
      logger.info({ to, title }, '[email] (no-op) would send notification email');
      return false;
    }
    const { html, text } = renderEmail({ title, message, taskId });
    const from = process.env.EMAIL_FROM || process.env.GMAIL_USER;
    const subject = matterSubject({ serviceName, taskId, title, organisation });
    // Threading headers (#98): a stable Message-ID root per matter. Setting the
    // SAME references value on every email of a matter makes Gmail group them.
    const threadRef = taskId ? `<matter-${taskId}@legalterminus>` : undefined;
    await transporter.sendMail({
      from, to, subject, text, html,
      ...(threadRef ? { references: threadRef, inReplyTo: threadRef } : {}),
    });
    return true;
  } catch (err) {
    logger.warn({ err: err?.message, to }, '[email] send failed (non-fatal)');
    return false;
  }
}
