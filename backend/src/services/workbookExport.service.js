/**
 * Story 37.4 — the customer-readable export.
 *
 * WHY THIS EXISTS. A firm's data belongs to the firm, and "export my data"
 * has to mean something a person can actually open. A Firestore export is a
 * restore artifact — full fidelity, natively importable, and unreadable to a
 * chartered accountant.
 *
 * So this is one .xlsx workbook with a sheet per thing the firm thinks it
 * owns. It is not restorable and does not try to be; the two serve different
 * readers.
 *
 * Ported from Ambyflow (Story 37.4). The build is unchanged — it takes the
 * Firestore handle as a parameter, so nothing here depends on how the caller
 * resolves it.
 *
 * ── Shape ──
 *
 * Sheets are named for what the USER calls things, not what the code does
 * (see the vocabulary table in CLAUDE.md): a `tasks` document is a "Matter",
 * a `workflowDefinition` is a "Service", a step is a "Task". Getting this
 * wrong would hand someone a spreadsheet describing a product they do not
 * recognise.
 *
 * ── Cost ──
 *
 * Reads scale with the workspace, so this is deliberately NOT on a request
 * path a user can hammer: it is an operator action at the end of a trial, or
 * an admin asking for their own data. Steps, documents and payments are
 * subcollections per matter, so they are fetched with a bounded concurrency
 * rather than one sequential await per matter.
 */
import * as XLSX from 'xlsx';

/** Matters fetched in parallel for their subcollections. */
const CONCURRENCY = 10;

/** A cell Excel will not try to interpret as a formula. */
const safe = (v) => {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'object') return JSON.stringify(v);
  const s = String(v);
  // Leading =, +, -, @ make Excel evaluate the cell. Prefix so the text is
  // shown verbatim: an export that silently rewrites a client's data is worse
  // than no export.
  return /^[=+\-@]/.test(s) ? `'${s}` : s;
};

const iso = (v) => {
  if (!v) return '';
  if (typeof v === 'string') return v;
  if (typeof v?.toDate === 'function') return v.toDate().toISOString();
  if (v instanceof Date) return v.toISOString();
  return String(v);
};

/** Run `fn` over `items` with bounded parallelism, preserving order. */
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return out;
}

const sheetFromRows = (rows, headers) => {
  const ws = XLSX.utils.json_to_sheet(rows, { header: headers });
  // Column widths from the content, so the file opens readable rather than
  // as a wall of ### and truncated names.
  ws['!cols'] = headers.map((h) => ({
    wch: Math.min(60, Math.max(h.length + 2, ...rows.map((r) => String(r[h] ?? '').length + 2), 10)),
  }));
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };
  return ws;
};

/**
 * Build the workbook for one workspace.
 *
 * @param {object} db        the Firestore handle
 * @param {object} meta      { firmName, generatedAt, generatedFor }
 * @returns {Promise<{ buffer: Buffer, counts: object }>}
 */
export async function buildFirmWorkbook(db, meta = {}) {
  const [usersSnap, tasksSnap] = await Promise.all([
    db.collection('users').get(),
    db.collection('tasks').get(),
  ]);

  const userById = new Map();
  usersSnap.forEach((d) => userById.set(d.id, d.data() || {}));
  const nameOf = (uid) => (uid && userById.get(uid)?.name) || (uid ? String(uid) : '');

  const taskDocs = tasksSnap.docs;

  // Subcollections, bounded-parallel per matter.
  const perMatter = await mapLimit(taskDocs, CONCURRENCY, async (doc) => {
    const [steps, documents, payments] = await Promise.all([
      doc.ref.collection('steps').get(),
      doc.ref.collection('documents').get(),
      doc.ref.collection('payments').get(),
    ]);
    return { id: doc.id, data: doc.data() || {}, steps, documents, payments };
  });

  // ── Matters ──
  const matterHeaders = [
    'Matter ID', 'Client', 'Organisation', 'Service', 'Status', 'Current task',
    'Total tasks', 'Assigned to', 'Professional', 'Total fees', 'Amount paid',
    'Amount due', 'Payment status', 'Created', 'Last updated',
  ];
  const matters = perMatter.map(({ id, data: t }) => {
    const paid = Number(t.amountPaid ?? 0);
    const cost = Number(t.totalCost ?? 0);
    return {
      'Matter ID': safe(id),
      Client: safe(t.clientName || nameOf(t.clientUid)),
      Organisation: safe(t.organisation),
      Service: safe(t.serviceName || t.serviceType || t.workflowDefinitionId),
      Status: safe(t.status),
      'Current task': safe(t.currentStepNumber),
      'Total tasks': safe(t.totalSteps),
      'Assigned to': safe(nameOf(t.assignedTo)),
      Professional: safe(t.professionalName),
      'Total fees': cost,
      'Amount paid': paid,
      'Amount due': Math.max(0, cost - paid),
      'Payment status': safe(t.paymentStatus),
      Created: safe(iso(t.createdAt)),
      'Last updated': safe(iso(t.updatedAt)),
    };
  });

  // ── Tasks (steps) ──
  const taskHeaders = [
    'Matter ID', 'Client', 'Task #', 'Task', 'Status', 'Owner', 'Assigned to',
    'Started', 'Completed', 'Due',
  ];
  const tasks = [];
  for (const m of perMatter) {
    const client = m.data.clientName || nameOf(m.data.clientUid);
    m.steps.forEach((s) => {
      const st = s.data() || {};
      tasks.push({
        'Matter ID': safe(m.id),
        Client: safe(client),
        'Task #': Number(st.stepNumber ?? s.id) || safe(s.id),
        Task: safe(st.title || st.name),
        Status: safe(st.status),
        // ownerType is what makes "waiting on the department" visible — the
        // distinction the whole product is sold on, so it belongs in the export.
        Owner: safe(st.ownerType),
        'Assigned to': safe(nameOf(st.assignedTo)),
        Started: safe(iso(st.startedAt)),
        Completed: safe(iso(st.completedAt)),
        Due: safe(iso(st.dueAt || st.dueDate)),
      });
    });
  }
  tasks.sort((a, b) => String(a['Matter ID']).localeCompare(String(b['Matter ID']))
    || (Number(a['Task #']) || 0) - (Number(b['Task #']) || 0));

  // ── Clients ──
  const clientHeaders = ['Client ID', 'Name', 'Organisation', 'Email', 'Phone', 'Tags', 'Created'];
  const clients = [];
  userById.forEach((u, id) => {
    if (u.role !== 'client') return;
    clients.push({
      'Client ID': safe(id),
      Name: safe(u.name),
      Organisation: safe(u.organisation),
      Email: safe(u.email),
      Phone: safe(u.phone),
      Tags: safe(Array.isArray(u.tags) ? u.tags.join(', ') : u.tags),
      Created: safe(iso(u.createdAt)),
    });
  });

  // ── Team ──
  const teamHeaders = ['User ID', 'Name', 'Email', 'Role', 'Status', 'Created'];
  const team = [];
  userById.forEach((u, id) => {
    if (u.role === 'client') return;
    team.push({
      'User ID': safe(id),
      Name: safe(u.name),
      Email: safe(u.email),
      Role: safe(u.role),
      Status: safe(u.status),
      Created: safe(iso(u.createdAt)),
    });
  });

  // ── Documents (the index, not the bytes) ──
  const docHeaders = [
    'Matter ID', 'Client', 'Document', 'Status', 'Version', 'Uploaded by',
    'Uploaded', 'Shared with client', 'File name',
  ];
  const documents = [];
  for (const m of perMatter) {
    const client = m.data.clientName || nameOf(m.data.clientUid);
    m.documents.forEach((d) => {
      const doc = d.data() || {};
      documents.push({
        'Matter ID': safe(m.id),
        Client: safe(client),
        Document: safe(doc.title || doc.name || d.id),
        Status: safe(doc.status),
        Version: safe(doc.version),
        'Uploaded by': safe(nameOf(doc.uploadedBy)),
        Uploaded: safe(iso(doc.uploadedAt || doc.createdAt)),
        'Shared with client': doc.visibleToClient ? 'Yes' : 'No',
        'File name': safe(doc.fileName || doc.originalName),
      });
    });
  }

  // ── Payments ──
  const payHeaders = ['Matter ID', 'Client', 'Amount', 'Mode', 'Reference', 'Description', 'Recorded', 'Recorded by'];
  const payments = [];
  for (const m of perMatter) {
    const client = m.data.clientName || nameOf(m.data.clientUid);
    m.payments.forEach((p) => {
      const pay = p.data() || {};
      payments.push({
        'Matter ID': safe(m.id),
        Client: safe(client),
        Amount: Number(pay.amount ?? 0),
        Mode: safe(pay.mode || pay.paymentMode),
        Reference: safe(pay.reference || pay.txnId),
        Description: safe(pay.description),
        Recorded: safe(iso(pay.createdAt || pay.paidAt)),
        'Recorded by': safe(nameOf(pay.createdBy)),
      });
    });
  }

  // ── Read me ──
  // A bare workbook of ids invites "what am I looking at?". This says what the
  // file is, when it was taken, and what it does NOT contain — the document
  // FILES are the obvious omission and must be stated, not discovered.
  const readme = [
    { Field: 'Firm', Value: safe(meta.firmName) },
    { Field: 'Exported', Value: safe(meta.generatedAt || new Date().toISOString()) },
    { Field: 'Exported by', Value: safe(meta.generatedFor) },
    { Field: '', Value: '' },
    { Field: 'Matters', Value: matters.length },
    { Field: 'Tasks', Value: tasks.length },
    { Field: 'Clients', Value: clients.length },
    { Field: 'Team members', Value: team.length },
    { Field: 'Documents', Value: documents.length },
    { Field: 'Payments', Value: payments.length },
    { Field: '', Value: '' },
    {
      Field: 'Note',
      Value: 'This workbook lists your document records. The document FILES themselves are not in this spreadsheet — ask us and we will provide them separately.',
    },
    {
      Field: 'Vocabulary',
      Value: 'A "Matter" is one piece of client work. A "Task" is one step within a matter. A "Service" is the workflow a matter follows.',
    },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheetFromRows(readme, ['Field', 'Value']), 'Read me');
  XLSX.utils.book_append_sheet(wb, sheetFromRows(matters, matterHeaders), 'Matters');
  XLSX.utils.book_append_sheet(wb, sheetFromRows(tasks, taskHeaders), 'Tasks');
  XLSX.utils.book_append_sheet(wb, sheetFromRows(clients, clientHeaders), 'Clients');
  XLSX.utils.book_append_sheet(wb, sheetFromRows(team, teamHeaders), 'Team');
  XLSX.utils.book_append_sheet(wb, sheetFromRows(documents, docHeaders), 'Documents');
  XLSX.utils.book_append_sheet(wb, sheetFromRows(payments, payHeaders), 'Payments');

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return {
    buffer,
    counts: {
      matters: matters.length,
      tasks: tasks.length,
      clients: clients.length,
      team: team.length,
      documents: documents.length,
      payments: payments.length,
    },
  };
}
