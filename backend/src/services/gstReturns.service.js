/**
 * GST return filing reminders (#219).
 *
 * A client whose `gstReturnFrequency` is 'monthly' or 'quarterly' gets, for each
 * period that has just ended, ONE matter opened automatically and ONE email
 * asking for that period's data (the editable `gst_return_monthly` /
 * `gst_return_quarterly` template).
 *
 * WHEN. Like the recurring-matter sweep (#167), this runs "due on read": API
 * traffic fires it in the background at most every half hour, under a lock, and
 * `/api/internal/run-gst-returns` runs it on demand. It does not need to run AT
 * midnight on the 1st — a period is opened on the first sweep on or after its
 * 1st, in India's date. A Cloud Scheduler call to the endpoint makes it prompt.
 *
 * ONCE. `gstReturnRuns/{clientUid}__{periodKey}` is created before the matter,
 * with create() — which fails if it exists — so two instances, two sweeps, or a
 * sweep and a manual run cannot open a period twice. If the matter cannot be
 * opened the claim is removed and the next sweep tries again.
 *
 * WHICH SERVICE. `gst-returns` ("GST Return Filing (Monthly)" on the live
 * site). Quarterly clients use `gst-returns-quarterly` once the firm creates it,
 * and `gst-returns` until then.
 *
 * The matter is opened as an unpaid matter, exactly like a recurring matter:
 * it waits in the admin approval queue, so nothing goes live without a person
 * seeing it. The client's email goes out when it is opened, as the issue asks.
 */
import { getDb } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { getCompiledForServiceKey } from './workflowDefinitions.service.js';
import { renderTemplate } from './emailTemplates.service.js';
import { publicSiteUrl, sendTemplatedEmail } from './emailService.js';
import { getOverrides, makeStatutoryResolver } from './statutoryCalendar.service.js';
import { createNotification } from '../controllers/notifications.controller.js';
import {
  GST_CALENDAR_KEYS, GST_FREQUENCIES, GST_SERVICE_KEYS, GST_TEMPLATE_KEYS,
  companyNameOf, duePeriod, indiaDate, longDate, shouldOpen,
} from '../../../shared/workflows/gstReturns.js';

export const RUNS = 'gstReturnRuns';
const LOCK_MS = 10 * 60 * 1000;
const RECENCY_MS = 30 * 60 * 1000;
const nowIso = () => new Date().toISOString();

/** The service a period's matter is opened with. */
export async function serviceKeyFor(frequency) {
  if (frequency === 'quarterly') {
    try {
      if (await getCompiledForServiceKey(GST_SERVICE_KEYS.quarterly)) return GST_SERVICE_KEYS.quarterly;
    } catch { /* fall back to the monthly service */ }
  }
  return GST_SERVICE_KEYS.monthly;
}

/** The email's fill-ins for one client and period. Due dates follow the firm's statutory calendar. */
export async function emailVars(client, period) {
  const resolve = makeStatutoryResolver(await getOverrides(getDb()));
  const keys = GST_CALENDAR_KEYS[period.frequency];
  return {
    companyName: companyNameOf(client),
    clientName: client.name || client.fullName || '',
    periodTitle: period.title,
    period: period.label,
    gstr1DueDate: longDate(resolve(keys.gstr1, { month: period.month })),
    gstr3bDueDate: longDate(resolve(keys.gstr3b, { month: period.month })),
    portalUrl: `${publicSiteUrl()}/portal/`,
  };
}

/**
 * Open one client's matter for one period and email them. Returns
 * { taskId, emailSent } when it opened one, { skipped } when it already exists,
 * or { error } when it could not (the claim is then released for a retry).
 */
export async function openGstMatter(client, period) {
  const db = getDb();
  const runRef = db.collection(RUNS).doc(`${client.uid}__${period.key}`);
  try {
    await runRef.create({
      clientUid: client.uid, periodKey: period.key, frequency: period.frequency,
      state: 'opening', createdAt: nowIso(),
    });
  } catch (err) {
    if (err?.code === 6 || err?.code === 'already-exists' || /already exists/i.test(err?.message ?? '')) {
      return { skipped: 'already_opened' };
    }
    throw err;
  }

  const release = async (error) => {
    await runRef.delete().catch(() => {});
    return { error };
  };

  const serviceKey = await serviceKeyFor(period.frequency);
  const company = companyNameOf(client);
  const { createTask } = await import('../controllers/tasks.controller.js');
  let created = null;
  const fakeRes = {
    status(code) { this._code = code; return this; },
    json(payload) { created = { code: this._code ?? 200, payload }; return this; },
  };
  await createTask({
    user: { uid: 'system:gst-returns', role: 'admin' },
    body: {
      clientUid: client.uid, serviceKey,
      serviceName: `GST Return - ${period.title}`,
      ...(client.organisation ? { organisation: client.organisation } : {}),
      paymentStatus: 'not_paid',
    },
    // Read only by createTask, from the request object — never from the body.
    gstFilingPeriod: { frequency: period.frequency, key: period.key, month: period.month, title: period.title, label: period.label },
    suppressCreatedEmail: true,
  }, fakeRes);
  if (!created || created.code >= 400 || !created.payload?.id) {
    logger.error({ clientUid: client.uid, period: period.key, code: created?.code, message: created?.payload?.message },
      '#219 could not open the GST return matter');
    return release(created?.payload?.message || 'The matter could not be opened.');
  }
  const taskId = created.payload.id;

  let emailSent = false;
  try {
    const to = client.email || (Array.isArray(client.emailIds) ? client.emailIds[0] : null);
    const rendered = to ? await renderTemplate(GST_TEMPLATE_KEYS[period.frequency], await emailVars(client, period)) : null;
    if (rendered) {
      const cc = (Array.isArray(client.emailIds) ? client.emailIds : []).filter((e) => e && e !== to);
      emailSent = await sendTemplatedEmail({
        to, cc, subject: rendered.subject, body: rendered.body,
        taskId, serviceName: `GST Return - ${period.title}`, organisation: company || undefined,
        keepSubject: true,
      });
    }
  } catch (err) {
    logger.warn({ err: err?.message, taskId }, '#219 GST email failed (the matter is open)');
  }

  await runRef.update({ state: 'opened', taskId, emailSent, openedAt: nowIso() });
  logger.info({ clientUid: client.uid, period: period.key, taskId, emailSent }, '#219 GST return matter opened');
  return { taskId, emailSent };
}

async function staffLeads() {
  const snap = await getDb().collection('users').where('role', 'in', ['admin', 'manager']).get();
  return snap.docs.filter((d) => d.data().status !== 'deactivated').map((d) => d.id);
}

/**
 * Open every GST matter that is due today (India). `force` skips the recency
 * check (a manual run) but never the lock.
 */
export async function runGstReturnSweep({ force = false, now = new Date(), onlyClientUid = null } = {}) {
  const db = getDb();
  const lockRef = db.collection('system').doc('gstReturnSweep');
  const nowMs = now.getTime();
  const claimed = await db.runTransaction(async (tx) => {
    const snap = await tx.get(lockRef);
    const d = snap.exists ? snap.data() : {};
    if (d.lockedAtMs && nowMs - d.lockedAtMs < LOCK_MS) return 'locked';
    if (!force && d.lastRunAtMs && nowMs - d.lastRunAtMs < RECENCY_MS) return 'recent';
    tx.set(lockRef, { lockedAtMs: nowMs }, { merge: true });
    return 'ok';
  });
  if (claimed !== 'ok') return { opened: [], skipped: claimed };

  const opened = [];
  const failed = [];
  try {
    const today = indiaDate(now);
    // Only clients who were given a frequency are read — not every user.
    const snap = await db.collection('users').where('gstReturnFrequency', 'in', GST_FREQUENCIES).get();
    for (const doc of snap.docs) {
      const client = { uid: doc.id, ...doc.data() };
      if (client.role !== 'client' || client.status === 'deactivated') continue;
      if (onlyClientUid && client.uid !== onlyClientUid) continue;
      const period = duePeriod(client.gstReturnFrequency, today);
      if (!shouldOpen(period, client.gstReturnFrequencySetAt)) continue;
      try {
        const r = await openGstMatter(client, period);
        if (r.taskId) opened.push({ ...r, client, period });
        else if (r.error) failed.push({ client, period, error: r.error });
      } catch (err) {
        logger.error({ err, clientUid: client.uid, period: period.key }, '#219 GST sweep failed for a client');
      }
    }

    if (opened.length || failed.length) {
      const leads = await staffLeads().catch(() => []);
      for (const o of opened) {
        const who = companyNameOf(o.client) || o.client.name || 'A client';
        for (const uid of leads) {
          await createNotification({
            recipientUid: uid, type: 'info', title: 'GST return matter opened',
            message: `GST Return - ${o.period.title} for ${who} was opened automatically and is awaiting approval. `
              + (o.emailSent ? 'The client has been emailed for the data.' : 'The client email could NOT be sent — contact them.'),
            taskId: o.taskId,
          }).catch(() => {});
        }
      }
      for (const f of failed) {
        const who = companyNameOf(f.client) || f.client.name || 'A client';
        for (const uid of leads) {
          await createNotification({
            recipientUid: uid, type: 'warning', title: 'GST return matter could not be opened',
            message: `GST Return - ${f.period.title} for ${who}: ${f.error} It will be tried again automatically.`,
          }).catch(() => {});
        }
      }
    }
  } finally {
    await lockRef.set({ lockedAtMs: null, lastRunAtMs: Date.now(), lastOpenedCount: opened.length }, { merge: true });
  }
  return { opened: opened.map((o) => ({ taskId: o.taskId, clientUid: o.client.uid, period: o.period.key, emailSent: o.emailSent })), failed: failed.length };
}

let _lastCheckMs = 0;
/** Express middleware: run the sweep in the background, at most once a minute per instance. */
export function gstReturnSweepTrigger(req, res, next) {
  const t = Date.now();
  if (t - _lastCheckMs > 60_000) {
    _lastCheckMs = t;
    setImmediate(() => {
      runGstReturnSweep().catch((err) => logger.warn({ err: err?.message }, '#219 background GST sweep failed'));
    });
  }
  next();
}
