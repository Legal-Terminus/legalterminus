/**
 * #313 — invoices on a matter's Payments tab.
 *
 * The security of the feature rests on a few pure rules, tested here:
 *   1. who may manage / read invoices (deny by default; a client only a
 *      matter they can see; team members and professionals never — #148);
 *   2. an upload is accepted only when its bytes are a PDF within the cap;
 *   3. the API shape never carries the object path, and a client is not told
 *      which member of staff uploaded it;
 * plus source checks that the routes carry the guards and the download is
 * streamed, never a signed READ URL.
 *
 * Run: npm test (from backend/)
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  INVOICE_MAX_BYTES,
  canManageInvoices,
  canReadInvoices,
  checkUploadedInvoice,
  invoiceForViewer,
  invoiceObjectPath,
  isInvoiceId,
  listableInvoices,
  looksLikePdf,
  newInvoiceId,
  safeInvoiceFileName,
} from '../services/invoices.service.js';
import { invoiceUploadUrlSchema } from '../schemas/invoice.schema.js';
import { isPaymentLedgerEvent } from '../../../shared/payments/ledgerEvents.js';

const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(here, p), 'utf8');
const PDF = Buffer.from('%PDF-1.4\n');

// ── 1. Access ─────────────────────────────────────────────────────────────

test('only admin and manager manage invoices', () => {
  assert.equal(canManageInvoices('admin'), true);
  assert.equal(canManageInvoices('manager'), true);
  for (const r of ['team_member', 'client', 'professional', '', undefined, 'superadmin']) {
    assert.equal(canManageInvoices(r), false, `${r} must not manage invoices`);
  }
});

test('a client reads invoices only of a matter they can see', () => {
  assert.equal(canReadInvoices({ role: 'client', clientCanSee: true }), true);
  assert.equal(canReadInvoices({ role: 'client', clientCanSee: false }), false);
  assert.equal(canReadInvoices({ role: 'client' }), false);
  // A truthy non-boolean must not count as "can see".
  assert.equal(canReadInvoices({ role: 'client', clientCanSee: 'yes' }), false);
});

test('staff with payment access read any matter; team, professionals and unknown roles never', () => {
  assert.equal(canReadInvoices({ role: 'admin' }), true);
  assert.equal(canReadInvoices({ role: 'manager' }), true);
  for (const role of ['team_member', 'professional', undefined, 'auditor']) {
    assert.equal(canReadInvoices({ role, clientCanSee: true }), false, `${role} must not read invoices`);
  }
});

test('invoice activity is hidden wherever payment entries are (#148)', () => {
  for (const t of ['INVOICE_UPLOADED', 'INVOICE_REPLACED', 'INVOICE_DELETED']) {
    assert.equal(isPaymentLedgerEvent(t), true, t);
  }
  const ctrl = read('../controllers/invoices.controller.js');
  const written = [...ctrl.matchAll(/'(INVOICE_[A-Z_]+)'/g)].map((m) => m[1]);
  assert.ok(written.length >= 3);
  for (const t of new Set(written)) assert.equal(isPaymentLedgerEvent(t), true, `${t} must be on the list`);
});

// ── 2. Upload checks ──────────────────────────────────────────────────────

test('the bytes must start like a PDF', () => {
  assert.equal(looksLikePdf(PDF), true);
  assert.equal(looksLikePdf(Buffer.from('<html><script>')), false);
  assert.equal(looksLikePdf(Buffer.from('%PDF')), false);
  assert.equal(looksLikePdf(Buffer.from('')), false);
  assert.equal(looksLikePdf(null), false);
  assert.equal(looksLikePdf(Buffer.from('\x89PNG\r\n')), false);
});

test('an uploaded object is refused when missing, too large or not a PDF', () => {
  assert.equal(checkUploadedInvoice({ size: 1234, head: PDF }), null);
  assert.equal(checkUploadedInvoice({ size: INVOICE_MAX_BYTES, head: PDF }), null);
  assert.equal(checkUploadedInvoice({ size: 0 }).code, 'INVOICE_NOT_UPLOADED');
  assert.equal(checkUploadedInvoice({ size: undefined }).code, 'INVOICE_NOT_UPLOADED');
  assert.equal(checkUploadedInvoice({ size: INVOICE_MAX_BYTES + 1, head: PDF }).code, 'INVOICE_TOO_LARGE');
  assert.equal(checkUploadedInvoice({ size: 100, head: Buffer.from('PK\x03\x04zip') }).code, 'INVOICE_NOT_PDF');
  assert.equal(checkUploadedInvoice({ size: 100, head: Buffer.from('<html>') }).status, 415);
});

test('the upload request accepts PDF only, and no unknown fields', () => {
  assert.equal(invoiceUploadUrlSchema.safeParse({ fileName: 'inv.pdf', contentType: 'application/pdf' }).success, true);
  assert.equal(invoiceUploadUrlSchema.safeParse({ fileName: 'inv.png', contentType: 'image/png' }).success, false);
  assert.equal(invoiceUploadUrlSchema.safeParse({ fileName: 'a.pdf', contentType: 'application/pdf', taskId: 'x' }).success, false);
  assert.equal(invoiceUploadUrlSchema.safeParse({ fileName: 'a.pdf', contentType: 'application/pdf', replaces: '../etc' }).success, false);
  assert.equal(invoiceUploadUrlSchema.safeParse({ fileName: 'a.pdf', contentType: 'application/pdf', replaces: newInvoiceId() }).success, true);
  assert.equal(invoiceUploadUrlSchema.safeParse({ fileName: '', contentType: 'application/pdf' }).success, false);
});

test('ids and file names are safe to put in an object path', () => {
  const id = newInvoiceId();
  assert.equal(isInvoiceId(id), true);
  for (const bad of ['', '../x', 'A'.repeat(32), 'a'.repeat(31), null, 42]) assert.equal(isInvoiceId(bad), false);
  assert.equal(safeInvoiceFileName('Invoice #12 / March.pdf'), 'Invoice _12 _ March.pdf');
  assert.equal(safeInvoiceFileName('../../secret'), '.._.._secret.pdf');
  assert.equal(safeInvoiceFileName(''), 'invoice.pdf');
  assert.ok(safeInvoiceFileName('x'.repeat(500)).length <= 200);
  assert.match(safeInvoiceFileName('x'.repeat(500)), /\.pdf$/);
  assert.equal(invoiceObjectPath('T1', id, 'a.pdf'), `tasks/T1/invoices/${id}/a.pdf`);
});

// ── 3. API shape ──────────────────────────────────────────────────────────

test('the API never carries the object path; a client is not told who uploaded', () => {
  const d = { fileName: 'a.pdf', size: 10, objectPath: 'tasks/T/invoices/x/a.pdf', uploadedAt: new Date('2026-11-01T10:00:00Z'), uploadedBy: 'u1', uploadedByName: 'Staff' };
  const staff = invoiceForViewer('x', d);
  assert.equal(staff.objectPath, undefined);
  assert.equal(staff.uploadedBy, 'u1');
  assert.equal(staff.uploadedAt, '2026-11-01T10:00:00.000Z');
  const client = invoiceForViewer('x', d, { client: true });
  assert.equal(client.objectPath, undefined);
  assert.equal(client.uploadedBy, undefined);
  assert.equal(client.uploadedByName, undefined);
  assert.deepEqual(Object.keys(client).sort(), ['fileName', 'id', 'size', 'uploadedAt']);
});

test('the list shows uploaded invoices only, newest first', () => {
  const rows = listableInvoices([
    { id: 'old', data: { status: 'uploaded', uploadedAt: new Date('2026-10-01') } },
    { id: 'pending', data: { status: 'awaiting_upload', createdAt: new Date('2026-11-05') } },
    { id: 'new', data: { status: 'uploaded', uploadedAt: new Date('2026-11-01') } },
  ]);
  assert.deepEqual(rows.map((r) => r.id), ['new', 'old']);
});

// ── 4. Wiring ─────────────────────────────────────────────────────────────

test('every invoice route carries an explicit role guard', () => {
  const src = read('../routes/tasks.routes.js');
  const lines = src.split('\n').filter((l) => l.includes("'/:taskId/invoices"));
  assert.equal(lines.length, 5);
  for (const l of lines) assert.match(l, /requireRole\(/, l);
  for (const l of lines) assert.doesNotMatch(l, /team_member|professional/, `team/professional must not reach: ${l}`);
  const writes = lines.filter((l) => /router\.(post|delete|patch|put)/.test(l));
  for (const l of writes) assert.match(l, /requireRole\('admin', 'manager'\)/, l);
});

test('the download streams through the backend; only an upload URL is ever signed', () => {
  const src = read('../controllers/invoices.controller.js');
  assert.match(src, /createReadStream\(\)/);
  const signed = [...src.matchAll(/getSignedUrl\(\{[\s\S]*?\}\)/g)].map((m) => m[0]);
  assert.equal(signed.length, 1);
  assert.match(signed[0], /action: 'write'/);
});

test('deleting a matter removes its invoices', () => {
  const src = read('../controllers/tasks.controller.js');
  assert.match(src, /for \(const sub of \[[^\]]*'invoices'[^\]]*\]\)/);
});

test('firestore.rules keeps invoices backend-only', () => {
  const rules = read('../../../firestore.rules');
  assert.match(rules, /match \/invoices\/\{invoiceId\} \{\s*allow read, write: if false;/);
});
