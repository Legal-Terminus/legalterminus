import { getDb } from '../config/firebase.js';
import { logger } from "../config/logger.js";
import { upsertUser } from '../services/userService.js';
import { LEAD_SOURCES, LEAD_SERVICES, LEAD_OUTCOMES, outcomeNeedsRemarks } from '../config/leadFields.js';

const LEADS_COLLECTION = 'contactLeads';
const USERS_COLLECTION = 'users';

const toMillis = (ts) =>
  ts?.toMillis?.() ?? (ts ? new Date(ts).getTime() : 0) ?? 0;

const toISO = (ts) => {
  const ms = toMillis(ts);
  return ms ? new Date(ms).toISOString() : null;
};

const LEAD_STATUSES = ['new', 'contacted', 'closed'];

// Short, human-readable reference derived from the Firestore doc id — the
// fallback for leads created before #196 gave every lead a sequential Ref No.
const refIdFor = (docId) => `LD-${String(docId).slice(0, 6).toUpperCase()}`;

/**
 * #196: the next sequential lead Ref No. (LD-0001, LD-0002, …), allocated in a
 * transaction so two leads saved at once can never share a number. Shared by
 * staff-added leads and the website's contact form.
 */
export async function nextLeadRefNo(db) {
  const ref = db.collection('counters').doc('leads');
  const n = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const next = (snap.exists ? Number(snap.data().value) || 0 : 0) + 1;
    tx.set(ref, { value: next, updatedAt: new Date().toISOString() });
    return next;
  });
  return `LD-${String(n).padStart(4, '0')}`;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

/**
 * GET /api/leads
 * Returns all contact leads enriched with `registered` flag indicating whether
 * the lead's email already exists in the users collection (as primary email or
 * in the emailIds[] secondary list). Accessible to admin and team_member.
 */
// Split an array into chunks of `size` (Firestore `in`/`array-contains-any`
// accept at most 30 values per query).
const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

export const getContactLeadsReport = async (req, res) => {
  try {
    const db = getDb();

    // Ordered + capped in Firestore. (Pagination of the report itself is tracked
    // separately; this bounds the read so it can't grow unbounded.)
    const leadsSnap = await db
      .collection(LEADS_COLLECTION)
      .orderBy('createdAt', 'desc')
      .limit(1000)
      .get();

    // Collect the DISTINCT emails actually present in the leads. We only need to
    // resolve those against the users collection — not scan every user. This makes
    // the cost scale with the number of leads, not the size of the user base.
    const leadEmails = [
      ...new Set(
        leadsSnap.docs
          .map((d) => String(d.data().email ?? '').toLowerCase())
          .filter(Boolean)
      ),
    ];

    // Look up matching users by primary email and by emailIds[] (secondary),
    // in chunks of 30. Build email → { uid, role, name }.
    const emailToUser = new Map();
    if (leadEmails.length) {
      const queries = [];
      for (const c of chunk(leadEmails, 30)) {
        queries.push(db.collection(USERS_COLLECTION).where('email', 'in', c).get());
        queries.push(db.collection(USERS_COLLECTION).where('emailIds', 'array-contains-any', c).get());
      }
      const snaps = await Promise.all(queries);
      for (const snap of snaps) {
        snap.forEach((doc) => {
          const u = doc.data();
          const entry = { uid: doc.id, role: u.role ?? 'client', name: u.name ?? u.fullName ?? '' };
          if (u.email) emailToUser.set(String(u.email).toLowerCase(), entry);
          if (Array.isArray(u.emailIds)) {
            u.emailIds.forEach((e) => { if (e) emailToUser.set(String(e).toLowerCase(), entry); });
          }
        });
      }
    }

    const leads = leadsSnap.docs.map((doc) => {
      const data = doc.data();
      const email = String(data.email ?? '').toLowerCase();
      const matched = email ? emailToUser.get(email) : undefined;

      return {
        id: doc.id,
        refId: data.refNo || refIdFor(doc.id),
        // #196: the lead-sheet fields. A lead from before them reads its date
        // from when it arrived.
        leadDate: data.leadDate || (toISO(data.createdAt) ?? '').slice(0, 10),
        leadSource: data.leadSource ?? '',
        organisationObjects: data.organisationObjects ?? '',
        serviceRequired: data.serviceRequired ?? '',
        proposalSentOn: data.proposalSentOn ?? '',
        lastFollowUp: data.lastFollowUp ?? '',
        outcome: data.outcome ?? '',
        outcomeRemarks: data.outcomeRemarks ?? '',
        fullName: data.fullName ?? '',
        company: data.company ?? '',
        email: data.email ?? '',
        phone: data.phone ?? '',
        subject: data.subject ?? '',
        message: data.message ?? '',
        state: data.state ?? '',
        preferredCallTime: data.preferredCallTime ?? '',
        source: data.source ?? 'unknown',
        sourceLabel: data.sourceLabel ?? '',
        whatsapp: data.whatsapp ?? false,
        status: data.status ?? 'new',
        notes: data.notes ?? '',
        createdAt: toISO(data.createdAt),
        updatedAt: toISO(data.updatedAt),
        contactedAt: toISO(data.contactedAt),
        // enrichment
        registered: !!matched,
        registeredUid: matched?.uid ?? null,
        registeredRole: matched?.role ?? null,
      };
    });

    // Already ordered by createdAt desc in the Firestore query above.
    res.status(200).json(leads);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching leads report:');
    res.status(500).json({ message: "Internal server error" });
  }
};

const stripTags = (s) => (typeof s === 'string' ? s.replace(/<[^>]*>/g, '').trim() : '');
const digitsOnly = (s) => (typeof s === 'string' ? s.replace(/\D/g, '') : '');

// Fields a staff user may set when creating/editing a lead manually.
const buildEditableFields = (body) => {
  const out = {};
  if (body.fullName !== undefined)          out.fullName = stripTags(body.fullName).slice(0, 100);
  if (body.company !== undefined)           out.company = stripTags(body.company).slice(0, 100);
  if (body.email !== undefined)             out.email = stripTags(body.email).toLowerCase().slice(0, 254);
  if (body.phone !== undefined)             out.phone = digitsOnly(body.phone).slice(0, 15);
  if (body.subject !== undefined)           out.subject = stripTags(body.subject).slice(0, 200);
  if (body.message !== undefined)           out.message = stripTags(body.message).slice(0, 2000);
  if (body.state !== undefined)             out.state = stripTags(body.state).slice(0, 60);
  if (body.preferredCallTime !== undefined) out.preferredCallTime = stripTags(body.preferredCallTime).slice(0, 50);
  if (body.sourceLabel !== undefined)       out.sourceLabel = stripTags(body.sourceLabel).slice(0, 200);
  // #196: lead-sheet fields. Option lists are enforced by the schema; checked
  // again here so a direct caller can never store an off-list value.
  for (const k of ['leadDate', 'proposalSentOn', 'lastFollowUp']) {
    if (body[k] !== undefined) out[k] = /^\d{4}-\d{2}-\d{2}$/.test(body[k]) ? body[k] : '';
  }
  if (body.leadSource !== undefined) out.leadSource = LEAD_SOURCES.includes(body.leadSource) ? body.leadSource : '';
  if (body.serviceRequired !== undefined) out.serviceRequired = LEAD_SERVICES.includes(body.serviceRequired) ? body.serviceRequired : '';
  if (body.organisationObjects !== undefined) out.organisationObjects = stripTags(body.organisationObjects).slice(0, 1000);
  if (body.outcome !== undefined) out.outcome = LEAD_OUTCOMES.includes(body.outcome) ? body.outcome : '';
  if (body.outcomeRemarks !== undefined) out.outcomeRemarks = stripTags(body.outcomeRemarks).slice(0, 2000);
  return out;
};

/**
 * #196: remarks belong to a lead that did NOT convert. When the outcome is (or
 * becomes) Converted or blank, any remark is cleared rather than left behind,
 * so the sheet never shows a reason next to a converted lead.
 */
const applyOutcomeRule = (fields, currentOutcome) => {
  const outcome = fields.outcome !== undefined ? fields.outcome : currentOutcome;
  if (!outcomeNeedsRemarks(outcome) && (fields.outcome !== undefined || fields.outcomeRemarks !== undefined)) {
    fields.outcomeRemarks = '';
  }
  return fields;
};

/**
 * POST /api/leads
 * Manually add a lead from the portal. Accessible to admin, manager, team_member.
 */
export const createLead = async (req, res) => {
  try {
    const db = getDb();
    const fields = applyOutcomeRule(buildEditableFields(req.body), '');

    if (!fields.fullName || (!fields.email && !fields.phone)) {
      return res.status(400).json({ message: 'Name and at least one of email or phone are required.' });
    }

    const now = new Date();
    const doc = {
      leadDate: todayISO(),
      ...fields,
      refNo: await nextLeadRefNo(db),
      source: 'manual',
      sourceLabel: fields.sourceLabel || 'Added manually',
      status: 'new',
      notes: req.body.notes ? String(req.body.notes).slice(0, 2000) : '',
      createdBy: req.user?.uid ?? null,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection(LEADS_COLLECTION).add(doc);
    res.status(201).json({ id: ref.id, refId: doc.refNo, ...doc, createdAt: toISO(now), updatedAt: toISO(now) });
  } catch (error) {
    logger.error({ err: error }, 'Error creating lead:');
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * PATCH /api/leads/:id
 * Update a lead's status, notes, and/or editable fields.
 * Body: { status?, notes?, fullName?, company?, email?, phone?, ... }
 */
export const updateLead = async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { status, notes } = req.body;

    const ref = db.collection(LEADS_COLLECTION).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ message: 'Lead not found' });

    const updates = { ...applyOutcomeRule(buildEditableFields(req.body), snap.data()?.outcome ?? ''), updatedAt: new Date() };

    if (status !== undefined) {
      if (!LEAD_STATUSES.includes(status)) {
        return res.status(400).json({ message: `status must be one of: ${LEAD_STATUSES.join(', ')}` });
      }
      updates.status = status;
      // Stamp when first moved to contacted (don't overwrite an existing stamp).
      if (status === 'contacted' && !snap.data()?.contactedAt) {
        updates.contactedAt = new Date();
      }
    }

    if (notes !== undefined) {
      updates.notes = String(notes).slice(0, 2000);
    }

    await ref.set(updates, { merge: true });

    const updated = await ref.get();
    const d = updated.data();
    res.status(200).json({
      id,
      refId: d.refNo || refIdFor(id),
      outcome: d.outcome ?? '',
      outcomeRemarks: d.outcomeRemarks ?? '',
      status: d.status ?? 'new',
      notes: d.notes ?? '',
      contactedAt: toISO(d.contactedAt),
      updatedAt: toISO(d.updatedAt),
    });
  } catch (error) {
    logger.error({ err: error }, 'Error updating lead:');
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /api/leads/:id/convert  — convert a lead into a CLIENT user (E08-S06).
 * Creates (or links, if the email already exists) a client account from the
 * lead's details via the same upsert path used by user management, so the new
 * client appears on the Users page and the lead immediately reads as
 * `registered` (the flag is derived live from the users collection).
 * Requires the lead to have an email (a client account is keyed by email).
 * Idempotent: converting an already-registered lead just returns the existing user.
 */
export const convertLeadToClient = async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const ref = db.collection(LEADS_COLLECTION).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ message: 'Lead not found' });

    const lead = snap.data();
    const email = String(lead.email ?? '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ message: 'This lead has no email — add one before converting to a client.' });
    }

    // Build a client profile from the lead. clean-ish: only carry fields we have.
    const profileData = {
      name: lead.fullName || email,
      email,
      phone: lead.phone || undefined,
      businessName: lead.company || undefined,
      state: lead.state || undefined,
      emailIds: [email],
    };

    const result = await upsertUser(email, 'client', profileData, {
      sendEmail: true,
      authProvider: 'email',
      createdBy: req.user?.uid ?? null,
    });

    // Stamp the lead so we know it was converted + by whom (the `registered`
    // flag itself is derived from the users collection at read time).
    await ref.set({
      convertedAt: new Date(),
      convertedBy: req.user?.uid ?? null,
      convertedUid: result.uid,
      updatedAt: new Date(),
    }, { merge: true });

    res.status(result.isUpdate ? 200 : 201).json({
      message: result.isUpdate ? 'Lead linked to existing client.' : 'Lead converted to a new client.',
      uid: result.uid,
      email: result.email,
      isUpdate: !!result.isUpdate,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error converting lead to client:');
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * DELETE /api/leads/:id  — remove a lead.
 */
export const deleteLead = async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const ref = db.collection(LEADS_COLLECTION).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ message: 'Lead not found' });

    await ref.delete();
    res.status(200).json({ message: 'Lead deleted', id });
  } catch (error) {
    logger.error({ err: error }, 'Error deleting lead:');
    res.status(500).json({ message: "Internal server error" });
  }
};
