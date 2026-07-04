import { test, expect } from './fixtures';
import { apiAs, deleteMatter, getMatter, resolveServiceKey } from './api';

/**
 * #85 — optional "Professional" (a staff member) on a matter. Set at creation,
 * editable after, snapshotted name for display, and restricted to staff users.
 */
let serviceKey: string;
test.beforeAll(async () => { serviceKey = await resolveServiceKey(); });

async function createWith(professionalUid?: string): Promise<string> {
  const api = await apiAs('admin');
  const res = await api.post('/api/tasks', {
    data: {
      clientUid: process.env.E2E_CLIENT_UID, serviceKey,
      paymentStatus: 'fully_paid', totalCost: 1000, amountReceived: 1000, paymentMode: 'E2E',
      ...(professionalUid ? { professionalUid } : {}),
    },
  });
  expect(res.ok(), await res.text()).toBeTruthy();
  const id = (await res.json()).id as string;
  await api.dispose();
  return id;
}

test('professional is optional at creation (matter works without one)', async () => {
  const taskId = await createWith();
  try {
    const m = await getMatter(taskId);
    expect(m.professionalUid ?? null).toBeNull();
  } finally { await deleteMatter(taskId); }
});

test('creating with a staff professional stores uid + name snapshot', async () => {
  const taskId = await createWith(process.env.E2E_TEAM_UID!);
  try {
    const m = await getMatter(taskId);
    expect(m.professionalUid).toBe(process.env.E2E_TEAM_UID);
    expect(typeof m.professionalName).toBe('string');
    expect((m.professionalName as string).length).toBeGreaterThan(0);
  } finally { await deleteMatter(taskId); }
});

test('professional is editable after creation and can be cleared', async () => {
  const taskId = await createWith();
  try {
    const api = await apiAs('admin');
    expect((await api.patch(`/api/tasks/${taskId}`, { data: { professionalUid: process.env.E2E_MANAGER_UID } })).ok()).toBeTruthy();
    let m = await getMatter(taskId);
    expect(m.professionalUid).toBe(process.env.E2E_MANAGER_UID);
    // Clear it.
    expect((await api.patch(`/api/tasks/${taskId}`, { data: { professionalUid: null } })).ok()).toBeTruthy();
    m = await getMatter(taskId);
    expect(m.professionalUid ?? null).toBeNull();
    await api.dispose();
  } finally { await deleteMatter(taskId); }
});

test('a client cannot be set as professional', async () => {
  const api = await apiAs('admin');
  const res = await api.post('/api/tasks', {
    data: {
      clientUid: process.env.E2E_CLIENT_UID, serviceKey,
      paymentStatus: 'fully_paid', totalCost: 1000, amountReceived: 1000, paymentMode: 'E2E',
      professionalUid: process.env.E2E_CLIENT_UID,
    },
  });
  expect(res.status()).toBe(400);
  await api.dispose();
});
