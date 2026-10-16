import { test, expect } from './fixtures';
import { apiAs, deleteDefinition, deleteMatter, getMatter, getMatterAs, transition } from './api';
import { env } from './helpers';

/**
 * #215 — steps deleted from a service still showed on matters; #214 — "Request changes" that loops back to the same step was refused.
 *
 * A matter keeps a record of every step its service had when it was created, but
 * it RUNS on the service as it is now. Steps deleted from the service afterwards
 * were never reached, so they sat at "Pending" for ever — after the final step,
 * on a completed matter, with no stage — and the firm reasonably asked why steps
 * that are not in Service Settings were there.
 *
 * Reproduced on the firm's production data: every Company Incorporation matter
 * created before two steps were removed carries them.
 */

type Row = { stepNumber: number; title?: string; status: string };
const steps = (m: Record<string, unknown>) => (m.steps as Row[]) ?? [];
const titles = (m: Record<string, unknown>) => steps(m).map((s) => s.title);

let defId = '';
const matters: string[] = [];
const serviceKey = `e2e-svc-removed-${Date.now()}`;

/** The service as it was: five steps, the two in the middle later removed. */
const original = {
  name: 'E2E Removed Steps',
  initialStep: 1,
  serviceKeys: [serviceKey],
  steps: [
    { stepNumber: 1, title: 'Collect details', type: 'step', clientVisible: true, transitions: [{ event: 'COMPLETE_STEP', to: 2 }] },
    { stepNumber: 2, title: 'Documents received from Client', type: 'step', clientVisible: true, transitions: [{ event: 'COMPLETE_STEP', to: 3 }] },
    { stepNumber: 3, title: 'Documents shared to client', type: 'step', clientVisible: true, transitions: [{ event: 'COMPLETE_STEP', to: 5 }] },
    { stepNumber: 5, title: 'Master sheet update', type: 'final', clientVisible: true },
  ],
};

/** The same service after the firm deleted step 3 — and, for the first matter, step 2. */
const withoutStep3 = {
  ...original,
  steps: [
    { ...original.steps[0] },
    { ...original.steps[1], transitions: [{ event: 'COMPLETE_STEP', to: 5 }] },
    { ...original.steps[3] },
  ],
};
const withoutSteps2And3 = {
  ...original,
  steps: [
    { ...original.steps[0], transitions: [{ event: 'COMPLETE_STEP', to: 5 }] },
    { ...original.steps[3] },
  ],
};

const save = async (body: Record<string, unknown>) => {
  const api = await apiAs('admin');
  try {
    const res = await api.patch(`/api/workflow-definitions/${defId}`, { data: body });
    expect(res.ok(), await res.text()).toBe(true);
  } finally { await api.dispose(); }
};
const newMatter = async () => {
  const api = await apiAs('admin');
  try {
    const res = await api.post('/api/tasks', {
      data: { clientUid: env('E2E_CLIENT_UID'), serviceKey, paymentStatus: 'fully_paid', totalCost: 1000, amountReceived: 1000, paymentMode: 'E2E' },
    });
    expect(res.ok(), await res.text()).toBe(true);
    const id = (await res.json()).id as string;
    matters.push(id);
    return id;
  } finally { await api.dispose(); }
};

test.describe.serial('#215 #214: steps removed from a service, and a loop back to the same step', () => {
  test.beforeAll(async () => {
    const api = await apiAs('admin');
    try {
      defId = `e2e-removed-${Date.now()}`;
      const res = await api.post('/api/workflow-definitions', { data: { id: defId, ...original } });
      expect(res.ok(), await res.text()).toBe(true);
    } finally { await api.dispose(); }
  });

  test.afterAll(async () => {
    for (const id of matters) await deleteMatter(id);
    await deleteDefinition(defId);
  });

  test('a step deleted before the matter reached it is not shown, and the matter completes cleanly', async () => {
    await save(original);
    const taskId = await newMatter();
    expect(titles(await getMatter(taskId))).toEqual(
      ['Collect details', 'Documents received from Client', 'Documents shared to client', 'Master sheet update'],
    );

    // The firm removes the two middle steps from the service.
    await save(withoutSteps2And3);
    const after = await getMatter(taskId);
    expect(titles(after), 'the removed steps are no longer listed').toEqual(['Collect details', 'Master sheet update']);

    // The matter runs on, through the final step, and is complete with nothing left over.
    await transition('admin', taskId, { type: 'COMPLETE_STEP' });
    await transition('admin', taskId, { type: 'COMPLETE_STEP' });
    const done = await getMatter(taskId);
    expect(done.status).toBe('completed');
    expect(steps(done).filter((s) => s.status === 'pending'), 'no step is left pending on a completed matter').toEqual([]);
    expect(titles(done)).toEqual(['Collect details', 'Master sheet update']);
    // Progress counts only the steps the matter really has.
    expect(done.totalSteps).toBe(2);
    expect(done.completedStepCount).toBe(2);

    // The client sees the same, shorter list.
    const asClient = await getMatterAs('client', taskId);
    expect(asClient.status).toBe(200);
    expect(titles(asClient.body ?? {})).not.toContain('Documents received from Client');
    expect(titles(asClient.body ?? {})).not.toContain('Documents shared to client');
  });

  test('a removed step that was already worked on stays: it is the matter’s history', async () => {
    await save(original);
    const taskId = await newMatter();
    await transition('admin', taskId, { type: 'COMPLETE_STEP' }); // step 1 done, now on step 2
    await transition('admin', taskId, { type: 'COMPLETE_STEP' }); // step 2 done, now on step 3

    // The firm removes step 3 — the step this matter is ON — and step 2, which it has done.
    await save(withoutSteps2And3);
    const m = await getMatter(taskId);
    expect(titles(m), 'done and current steps are never hidden').toEqual(
      ['Collect details', 'Documents received from Client', 'Documents shared to client', 'Master sheet update'],
    );
    expect(steps(m).find((s) => s.stepNumber === 2)?.status).toBe('completed');
    expect(steps(m).find((s) => s.stepNumber === 3)?.status).toBe('active');
  });

  test('only the step that was removed goes; the rest of a running matter is unchanged', async () => {
    await save(original);
    const taskId = await newMatter();
    await save(withoutStep3);
    const m = await getMatter(taskId);
    expect(titles(m)).toEqual(['Collect details', 'Documents received from Client', 'Master sheet update']);
    expect(steps(m).find((s) => s.stepNumber === 1)?.status).toBe('active');
    // The stored count is corrected the next time the matter moves.
    await transition('admin', taskId, { type: 'COMPLETE_STEP' });
    const moved = await getMatter(taskId);
    expect(moved.totalSteps, 'the count follows the service as it is now').toBe(3);
    expect(titles(moved)).toEqual(['Collect details', 'Documents received from Client', 'Master sheet update']);
  });

  test('#214: "Request changes" that loops back to the same step works for the client and on their behalf', async () => {
    // The Trademark Application shape: an approval step whose "request changes"
    // returns to itself, and whose approval moves on.
    await save({
      ...original,
      steps: [
        { stepNumber: 1, title: 'Collect details', type: 'step', clientVisible: true, transitions: [{ event: 'COMPLETE_STEP', to: 44 }] },
        {
          stepNumber: 44, title: 'Awaiting search report approval', type: 'step', clientVisible: true,
          defaultAssigneeUid: '__CLIENT__',
          transitions: [{ event: 'CLIENT_APPROVE', to: 5 }, { event: 'CLIENT_REJECT', to: 44 }],
        },
        { ...original.steps[3] },
      ],
    });
    const taskId = await newMatter();
    await transition('admin', taskId, { type: 'COMPLETE_STEP' });
    expect((await getMatter(taskId)).currentStepNumber).toBe(44);

    // An admin requests changes on the client's behalf: accepted, the matter stays.
    const onBehalf = await transition('admin', taskId, { type: 'CLIENT_REJECT', remark: 'Client wants the name changed to ACME.' });
    expect(onBehalf).toBeTruthy();
    let m = await getMatter(taskId);
    expect(m.currentStepNumber).toBe(44);
    expect(m.status).toBe('active');
    const step44 = () => steps(m).find((s) => s.stepNumber === 44) as Row & { remark?: string };
    expect(step44().status).toBe('active');
    expect(step44().remark ?? '').toContain('ACME');

    // The client can do the same from their own screen.
    const client = await apiAs('client');
    try {
      const res = await client.post(`/api/tasks/${taskId}/transition`, { data: { event: { type: 'CLIENT_REJECT', remark: 'One more change, please.' } } });
      expect(res.status(), await res.text()).toBe(200);
    } finally { await client.dispose(); }
    m = await getMatter(taskId);
    expect(m.currentStepNumber).toBe(44);

    // Both are in the activity.
    const admin = await apiAs('admin');
    try {
      const body = await (await admin.get(`/api/tasks/${taskId}/events`)).json() as { data: { type?: string; comment?: string | null }[] };
      const rejects = body.data.filter((e) => e.type === 'CLIENT_REJECT');
      expect(rejects.length, 'one by the admin on the client\u2019s behalf, one by the client').toBe(2);
      expect(rejects.some((e) => (e.comment ?? '').includes('ACME'))).toBe(true);
    } finally { await admin.dispose(); }

    // Approving on the client's behalf moves the matter on.
    await transition('admin', taskId, { type: 'CLIENT_APPROVE' });
    m = await getMatter(taskId);
    expect(m.currentStepNumber).toBe(5);

    // An event the step does not have is still refused.
    const admin2 = await apiAs('admin');
    try {
      const bad = await admin2.post(`/api/tasks/${taskId}/transition`, { data: { event: { type: 'GOVT_REJECT' } } });
      expect(bad.status()).toBe(400);
    } finally { await admin2.dispose(); }
  });

  test('the matter page does not list a removed step', async ({ adminPage }) => {
    await save(original);
    const taskId = await newMatter();
    await save(withoutSteps2And3);
    await adminPage.goto(`tasks/${taskId}`);
    await expect(adminPage.getByText('Collect details').first()).toBeVisible();
    await expect(adminPage.getByText('Documents received from Client')).toHaveCount(0);
    await expect(adminPage.getByText('Documents shared to client')).toHaveCount(0);
  });
});
