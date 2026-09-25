import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter, getMatter, resolveServiceKey } from './api';
import { env } from './helpers';

/**
 * API-level coverage for the additive matter features:
 *   #77 — Excel (.xlsx/.xls) content types are accepted by the upload allow-list.
 *   #78 — payment details are editable (admin/manager); amounts + status recompute.
 *         #202: only the total cost, mode and description — the amount paid
 *         is the payment history's total.
 *   #79 — an uploaded document carries a `docType` (PAN, TAN, …), returned on read.
 *
 * Fresh matter per test; deleted after.
 */
let taskId: string;
test.beforeEach(async () => { taskId = await createMatter(); });
test.afterEach(async () => { await deleteMatter(taskId); });

const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const XLS = 'application/vnd.ms-excel';

test('#77: upload allow-list accepts Excel content types; rejects unknown', async () => {
  const api = await apiAs('admin');
  for (const contentType of [XLSX, XLS]) {
    const res = await api.post(`/api/tasks/${taskId}/documents/signed-upload-url`, {
      data: { fileName: contentType === XLS ? 'book.xls' : 'book.xlsx', contentType },
    });
    expect(res.ok(), `${contentType} should be allowed`).toBeTruthy();
  }
  // A disallowed type is rejected.
  const bad = await api.post(`/api/tasks/${taskId}/documents/signed-upload-url`, {
    data: { fileName: 'evil.exe', contentType: 'application/x-msdownload' },
  });
  expect(bad.status()).toBe(400);
  await api.dispose();
});

test('#79: a document carries its docType and it is returned on list', async () => {
  const api = await apiAs('admin');
  const create = await api.post(`/api/tasks/${taskId}/documents/signed-upload-url`, {
    data: { fileName: 'pan.pdf', contentType: 'application/pdf', docType: 'PAN' },
  });
  expect(create.ok()).toBeTruthy();
  const list = await (await api.get(`/api/tasks/${taskId}/documents`)).json();
  const doc = list.data.find((d: { fileName: string }) => d.fileName === 'pan.pdf');
  expect(doc).toBeTruthy();
  expect(doc.docType).toBe('PAN');
  await api.dispose();
});

test('#78: admin edits payment; amounts + status recompute; manager allowed, client forbidden', async () => {
  const api = await apiAs('admin');
  // createMatter() took ₹10,000 of ₹10,000. Raising the total re-opens a balance:
  // paid 10000 of 14000 → due 4000, part_paid.
  const patch = await api.patch(`/api/tasks/${taskId}/payment`, {
    data: { totalCost: 14000, paymentMode: 'UPI' },
  });
  expect(patch.ok()).toBeTruthy();
  const body = await patch.json();
  expect(body.amountPaid).toBe(10000);
  expect(body.amountDue).toBe(4000);
  expect(body.paymentStatus).toBe('part_paid');
  expect(body.paymentMode).toBe('UPI');

  const m = await getMatter(taskId);
  expect(m.amountDue).toBe(4000);
  expect(m.paymentMode).toBe('UPI');

  // Receiving the balance — recorded in the history — → fully_paid.
  const paid = await api.post(`/api/tasks/${taskId}/payments`, { data: { amount: 4000, mode: 'UPI' } });
  expect((await paid.json()).paymentStatus).toBe('fully_paid');

  // The total can't drop below what was paid, and paid can't be typed at all.
  expect((await api.patch(`/api/tasks/${taskId}/payment`, { data: { totalCost: 9000 } })).status()).toBe(400);
  expect((await api.patch(`/api/tasks/${taskId}/payment`, { data: { amountPaid: 99999 } })).status()).toBe(400);
  await api.dispose();

  // A manager may edit; a client may not.
  const mgr = await apiAs('manager');
  expect((await mgr.patch(`/api/tasks/${taskId}/payment`, { data: { paymentMode: 'Cash' } })).ok()).toBeTruthy();
  await mgr.dispose();

  const client = await apiAs('client');
  const forbidden = await client.patch(`/api/tasks/${taskId}/payment`, { data: { paymentMode: 'Cash' } });
  expect(forbidden.status()).toBe(403);
  await client.dispose();
});

test('#147: payment description is saved at creation, editable, and clearable', async () => {
  const api = await apiAs('admin');
  const serviceKey = await resolveServiceKey();

  // Saved at CREATION alongside the other payment fields.
  const created = await api.post('/api/tasks', {
    data: {
      clientUid: env('E2E_CLIENT_UID'), serviceKey,
      paymentStatus: 'part_paid', totalCost: 10000, amountReceived: 1500, paymentMode: 'UPI',
      paymentDescription: 'Received ₹1,000 via UPI and ₹500 in Cash.',
    },
  });
  expect(created.ok()).toBeTruthy();
  const newId = (await created.json()).id as string;

  try {
    expect((await getMatter(newId)).paymentDescription)
      .toBe('Received ₹1,000 via UPI and ₹500 in Cash.');
    // #202: the creation payment is the first history row, carrying the note.
    const hist = await (await api.get(`/api/tasks/${newId}/payments`)).json();
    expect(hist.payments).toHaveLength(1);
    expect(hist.payments[0].amount).toBe(1500);
    expect(hist.payments[0].mode).toBe('UPI');
    expect(hist.payments[0].notes).toBe('Received ₹1,000 via UPI and ₹500 in Cash.');

    // Editable after creation.
    const patch = await api.patch(`/api/tasks/${newId}/payment`, {
      data: { paymentDescription: 'Balance ₹8,500 pending — cheque promised.' },
    });
    expect(patch.ok()).toBeTruthy();
    expect((await patch.json()).paymentDescription).toBe('Balance ₹8,500 pending — cheque promised.');

    // Untouched by an unrelated payment edit (preserved, not wiped).
    await api.patch(`/api/tasks/${newId}/payment`, { data: { totalCost: 12000 } });
    expect((await getMatter(newId)).paymentDescription).toBe('Balance ₹8,500 pending — cheque promised.');

    // Explicitly clearable.
    await api.patch(`/api/tasks/${newId}/payment`, { data: { paymentDescription: '' } });
    expect((await getMatter(newId)).paymentDescription).toBeFalsy();
  } finally {
    await api.dispose();
    await deleteMatter(newId);
  }
});

test('#145: create-matter accepts the dropdown payment modes', async () => {
  const api = await apiAs('admin');
  const serviceKey = await resolveServiceKey();
  // The mode the Create Matter dropdown submits is stored verbatim on the matter.
  const res = await api.post('/api/tasks', {
    data: {
      clientUid: env('E2E_CLIENT_UID'), serviceKey,
      paymentStatus: 'part_paid', totalCost: 5000, amountReceived: 2000, paymentMode: 'Bank Transfer',
    },
  });
  expect(res.ok()).toBeTruthy();
  const newId = (await res.json()).id as string;
  try {
    expect((await getMatter(newId)).paymentMode).toBe('Bank Transfer');
  } finally {
    await api.dispose();
    await deleteMatter(newId);
  }
});
