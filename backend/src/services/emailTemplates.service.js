import { getDb } from '../config/firebase.js';

/**
 * Editable email templates (#107/#108/#109). Each template has a `subject` and a
 * `body`, both with `{{placeholder}}` tokens filled at send time. Admins edit
 * them from Settings → Email Templates; unset templates fall back to the built-in
 * DEFAULTS below, so every email always has sensible copy even before anyone edits.
 *
 * Stored as ONE Firestore doc `settings/emailTemplates` → { [key]: {subject, body} }.
 * A short in-memory cache avoids a read on every email; writes bust it.
 */

const SETTINGS_COLLECTION = 'settings';
const TEMPLATES_DOC = 'emailTemplates';
const CACHE_TTL_MS = 60 * 1000;

/**
 * Built-in defaults + the placeholder list each template supports (surfaced in the
 * editor UI). `audience` groups them (client vs internal) in the settings page.
 */
export const TEMPLATE_DEFS = {
  client_welcome: {
    label: 'Client — Welcome email',
    audience: 'client',
    description: 'Sent once when a new client account is created (#107).',
    placeholders: ['clientName', 'portalUrl'],
    subject: 'Welcome to Legal Terminus – Your Client Portal is Ready!',
    body:
      'Hello {{clientName}},\n\n' +
      'Welcome to Legal Terminus! Your client portal account has been created successfully.\n\n' +
      'You can log in any time to view your services, track progress, share documents and message our team.\n\n' +
      'We look forward to working with you.\n\n' +
      '— The Legal Terminus Team',
  },
  matter_created: {
    label: 'Client — Matter created',
    audience: 'client',
    description: 'Sent to the client when a new matter is created for them (#108).',
    placeholders: ['clientName', 'organisation', 'serviceName', 'portalUrl'],
    subject: 'Your Matter Has Been Created Successfully',
    body:
      'Hello {{clientName}},\n\n' +
      'Thank you for choosing Legal Terminus.\n\n' +
      'Your matter for {{serviceName}} has been successfully created and assigned to our team. ' +
      'Our team will begin processing your request shortly.\n\n' +
      'You can track the status of your matter anytime by logging into the Client Portal.\n\n' +
      '— The Legal Terminus Team',
  },
  matter_message: {
    label: 'Client — New discussion message',
    audience: 'client',
    description: 'Sent when a message is posted in a matter\'s discussion thread (#123).',
    placeholders: ['clientName', 'organisation', 'serviceName', 'senderName', 'message'],
    subject: 'New message on your service',
    body:
      'Hello {{clientName}},\n\n' +
      'You have a new message from {{senderName}} regarding {{serviceName}}:\n\n' +
      '{{message}}\n\n' +
      'You can reply from the Discussion tab of your matter in the Client Portal.\n\n' +
      '— The Legal Terminus Team',
  },
  approval_needed: {
    label: 'Internal — Matter awaiting approval',
    audience: 'internal',
    description: 'Sent to admins when a manager-created matter needs approval (#109).',
    placeholders: ['clientName', 'organisation', 'serviceName'],
    subject: 'Matter awaiting your approval',
    body: '{{clientName}} · {{serviceName}} was created and needs admin approval.',
  },
  step_assigned: {
    label: 'Internal — Step assigned to you',
    audience: 'internal',
    description: 'Sent to a team member when a step is assigned to them (#109).',
    placeholders: ['clientName', 'serviceName', 'stepName'],
    subject: 'New step assigned to you',
    body: '{{clientName}} · {{serviceName}}: {{stepName}}',
  },
};

let _cache = null;
let _cacheAt = 0;

/** Load stored overrides (merged over defaults). Cached briefly. */
export async function getEmailTemplates() {
  const now = Date.now();
  if (_cache && now - _cacheAt < CACHE_TTL_MS) return _cache;
  let stored = {};
  try {
    const snap = await getDb().collection(SETTINGS_COLLECTION).doc(TEMPLATES_DOC).get();
    if (snap.exists) stored = snap.data() || {};
  } catch { /* fall back to defaults */ }
  const merged = {};
  for (const [key, def] of Object.entries(TEMPLATE_DEFS)) {
    const s = stored[key] || {};
    merged[key] = {
      subject: (typeof s.subject === 'string' && s.subject.trim()) ? s.subject : def.subject,
      body: (typeof s.body === 'string' && s.body.trim()) ? s.body : def.body,
    };
  }
  _cache = merged;
  _cacheAt = now;
  return merged;
}

/** Persist admin edits (only known keys + subject/body). Busts the cache. */
export async function saveEmailTemplates(input) {
  const clean = {};
  for (const key of Object.keys(TEMPLATE_DEFS)) {
    const t = input?.[key];
    if (!t) continue;
    clean[key] = {
      subject: typeof t.subject === 'string' ? t.subject.slice(0, 300) : '',
      body: typeof t.body === 'string' ? t.body.slice(0, 8000) : '',
    };
  }
  await getDb().collection(SETTINGS_COLLECTION).doc(TEMPLATES_DOC).set(clean, { merge: true });
  _cache = null;
  _cacheAt = 0;
  return getEmailTemplates();
}

/** Replace {{token}} occurrences with vars[token] ('' for missing). */
export function fillTemplate(text, vars = {}) {
  return String(text ?? '').replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) =>
    vars[k] == null ? '' : String(vars[k]));
}

/**
 * Resolve a template by key and fill both subject + body. Returns null for an
 * unknown key. Never throws.
 */
export async function renderTemplate(key, vars = {}) {
  if (!TEMPLATE_DEFS[key]) return null;
  const all = await getEmailTemplates();
  const t = all[key] || TEMPLATE_DEFS[key];
  return { subject: fillTemplate(t.subject, vars), body: fillTemplate(t.body, vars) };
}
