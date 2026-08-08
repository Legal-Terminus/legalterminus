import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter, getMatter, resolveServiceKey } from './api';
import { env } from './helpers';

/**
 * API-level coverage for the additive matter features:
 *   #77 — Excel (.xlsx/.xls) content types are accepted by the upload allow-list.
 *   #78 — payment details are editable (admin/manager); amounts + status recompute.
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
  // Set part payment: total 10000, paid 4000 → due 6000, part_paid.
  const patch = await api.patch(`/api/tasks/${taskId}/payment`, {
    data: { totalCost: 10000, amountPaid: 4000, paymentMode: 'UPI' },
  });
  expect(patch.ok()).toBeTruthy();
  const body = await patch.json();
  expect(body.amountDue).toBe(6000);
  expect(body.paymentStatus).toBe('part_paid');
  expect(body.paymentMode).toBe('UPI');

  const m = await getMatter(taskId);
  expect(m.amountDue).toBe(6000);
  expect(m.paymentMode).toBe('UPI');

  // Receiving the balance → fully_paid.
  const paid = await api.patch(`/api/tasks/${taskId}/payment`, { data: { amountPaid: 10000 } });
  expect((await paid.json()).paymentStatus).toBe('fully_paid');

  // Overpay is rejected.
  const over = await api.patch(`/api/tasks/${taskId}/payment`, { data: { amountPaid: 99999 } });
  expect(over.status()).toBe(400);
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

    // Editable after creation.
    const patch = await api.patch(`/api/tasks/${newId}/payment`, {
      data: { paymentDescription: 'Balance ₹8,500 pending — cheque promised.' },
    });
    expect(patch.ok()).toBeTruthy();
    expect((await patch.json()).paymentDescription).toBe('Balance ₹8,500 pending — cheque promised.');

    // Untouched by an unrelated payment edit (preserved, not wiped).
    await api.patch(`/api/tasks/${newId}/payment`, { data: { amountPaid: 2000 } });
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
