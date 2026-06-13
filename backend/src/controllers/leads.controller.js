import { getDb } from '../config/firebase.js';

const LEADS_COLLECTION = 'contactLeads';
const USERS_COLLECTION = 'users';

const toMillis = (ts) =>
  ts?.toMillis?.() ?? (ts ? new Date(ts).getTime() : 0) ?? 0;

const toISO = (ts) => {
  const ms = toMillis(ts);
  return ms ? new Date(ms).toISOString() : null;
};

const LEAD_STATUSES = ['new', 'contacted', 'closed'];

// Short, human-readable reference derived from the Firestore doc id.
// Stable (same id → same ref) and display-only — no schema change needed.
const refIdFor = (docId) => `LD-${String(docId).slice(0, 6).toUpperCase()}`;

/**
 * GET /api/leads
 * Returns all contact leads enriched with `registered` flag indicating whether
 * the lead's email already exists in the users collection (as primary email or
 * in the emailIds[] secondary list). Accessible to admin and team_member.
 */
export const getContactLeadsReport = async (req, res) => {
  try {
    const db = getDb();

    const [leadsSnap, usersSnap] = await Promise.all([
      db.collection(LEADS_COLLECTION).get(),
      db.collection(USERS_COLLECTION).get(),
    ]);

    // Build a lookup of every known user email → { uid, role } for fast matching
    const emailToUser = new Map();
    usersSnap.forEach((doc) => {
      const u = doc.data();
      const entry = { uid: doc.id, role: u.role ?? 'client', name: u.name ?? u.fullName ?? '' };
      if (u.email) emailToUser.set(String(u.email).toLowerCase(), entry);
      if (Array.isArray(u.emailIds)) {
        u.emailIds.forEach((e) => {
          if (e) emailToUser.set(String(e).toLowerCase(), entry);
        });
      }
    });

    const leads = leadsSnap.docs.map((doc) => {
      const data = doc.data();
      const email = String(data.email ?? '').toLowerCase();
      const matched = email ? emailToUser.get(email) : undefined;

      return {
        id: doc.id,
        refId: refIdFor(doc.id),
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

    leads.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));

    res.status(200).json(leads);
  } catch (error) {
    console.error('Error fetching leads report:', error);
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
  return out;
};

/**
 * POST /api/leads
 * Manually add a lead from the portal. Accessible to admin, manager, team_member.
 */
export const createLead = async (req, res) => {
  try {
    const db = getDb();
    const fields = buildEditableFields(req.body);

    if (!fields.fullName || (!fields.email && !fields.phone)) {
      return res.status(400).json({ message: 'Name and at least one of email or phone are required.' });
    }

    const now = new Date();
    const doc = {
      ...fields,
      source: 'manual',
      sourceLabel: fields.sourceLabel || 'Added manually',
      status: 'new',
      notes: req.body.notes ? String(req.body.notes).slice(0, 2000) : '',
      createdBy: req.user?.uid ?? null,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection(LEADS_COLLECTION).add(doc);
    res.status(201).json({ id: ref.id, refId: refIdFor(ref.id), ...doc, createdAt: toISO(now), updatedAt: toISO(now) });
  } catch (error) {
    console.error('Error creating lead:', error);
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

    const updates = { ...buildEditableFields(req.body), updatedAt: new Date() };

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
      refId: refIdFor(id),
      status: d.status ?? 'new',
      notes: d.notes ?? '',
      contactedAt: toISO(d.contactedAt),
      updatedAt: toISO(d.updatedAt),
    });
  } catch (error) {
    console.error('Error updating lead:', error);
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
    console.error('Error deleting lead:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};
