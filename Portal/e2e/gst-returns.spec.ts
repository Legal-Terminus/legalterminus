import { test, expect } from './fixtures';
import { apiAs, deleteMatter, getMatter } from './api';
import { env } from './helpers';

/**
 * #219 — GST return reminders.
 *
 * A client set to file GST monthly or quarterly gets, for each period that has
 * ended, one matter and one email. The sweep runs on the 1st (India); in a test
 * environment the run endpoint accepts `asOf` + `clientUid` to act as if it were
 * that day for one client. Far-future years keep every run's periods unique, so
 * the test never collides with a period a person opened on QA.
 */
const clientUid = () => env('E2E_CLIENT_UID');
const matters: string[] = [];

async function setFrequency(value: '' | 'monthly' | 'quarterly') {
  const admin = await apiAs('admin');
  try {
    const res = await admin.patch(`/api/portal/users/${clientUid()}`, { data: { gstReturnFrequency: value } });
    expect(res.ok(), await res.text()).toBeTruthy();
  } finally { await admin.dispose(); }
}

async function runAsOf(asOf: string) {
  const admin = await apiAs('admin');
  try {
    const res = await admin.post('/api/internal/run-gst-returns', { data: { asOf, clientUid: clientUid() } });
    expect(res.ok(), await res.text()).toBeTruthy();
    return (await res.json()) as { opened: { taskId: string; period: string }[]; failed: number; skipped?: string };
  } finally { await admin.dispose(); }
}

/** A GST service made for this run when the database has none; removed afterwards. */
let tempDefId: string | null = null;

test.afterAll(async () => {
  await setFrequency('').catch(() => {});
  for (const id of matters) await deleteMatter(id).catch(() => {});
  if (tempDefId) {
    const admin = await apiAs('admin');
    await admin.delete(`/api/workflow-definitions/${tempDefId}`).catch(() => {});
    await admin.dispose();
  }
});

test('admins can edit both GST email templates', async ({ adminPage }) => {
  const admin = await apiAs('admin');
  const { defs } = await (await admin.get('/api/settings/email-templates')).json();
  await admin.dispose();
  expect(defs.gst_return_monthly.default.subject).toBe('{{companyName}} - GST Return - {{periodTitle}}');
  expect(defs.gst_return_quarterly.placeholders).toEqual(expect.arrayContaining(['period', 'gstr1DueDate', 'gstr3bDueDate']));

  await adminPage.goto('settings/email-templates');
  await expect(adminPage.getByText('Client — GST return (monthly)')).toBeVisible({ timeout: 15_000 });
  await expect(adminPage.getByText('Client — GST return (quarterly)')).toBeVisible();
});

test('the client form sets how often we file a client’s GST returns', async ({ adminPage }) => {
  await adminPage.goto(`users/edit/client/${clientUid()}`);
  const select = adminPage.getByLabel('GST return filing');
  await expect(select).toBeVisible({ timeout: 15_000 });
  await select.selectOption('quarterly');
  // The form requires an address; the test client may not have one yet.
  const address = adminPage.getByPlaceholder('Full address');
  if (!(await address.inputValue())) await address.fill('E2E test address');
  await adminPage.getByRole('button', { name: 'Update Client' }).click();
  await expect(async () => {
    const admin = await apiAs('admin');
    const u = await (await admin.get(`/api/portal/users/${clientUid()}`)).json();
    await admin.dispose();
    const user = u.user ?? u;
    expect(user.gstReturnFrequency).toBe('quarterly');
    expect(user.gstReturnFrequencySetAt).toBeTruthy();
  }).toPass({ timeout: 15_000 });
});

test.describe.serial('the sweep opens one matter per period', () => {
  test.beforeAll(async () => {
    const admin = await apiAs('admin');
    try {
      const defs = await (await admin.get('/api/workflow-definitions')).json() as { serviceKeys?: string[] }[];
      if (defs.some((d) => d.serviceKeys?.includes('gst-returns'))) return;
      // No GST service here (QA starts without one): make a small one for this
      // run whose first step is GSTR-1, due on the statutory date.
      tempDefId = `e2e-gst-${Date.now()}`;
      const res = await admin.post('/api/workflow-definitions', { data: {
        id: tempDefId, name: `E2E GST Return Filing ${tempDefId}`, initialStep: 1, serviceKeys: ['gst-returns'],
        steps: [
          { stepNumber: 1, title: 'GSTR 1 filed', type: 'step', dueRule: { anchor: 'statutory', statutoryKey: 'gstr1', offsetDays: 0 },
            transitions: [{ event: 'COMPLETE_STEP', to: 2 }] },
          { stepNumber: 2, title: 'Done', type: 'final' },
        ],
      } });
      expect(res.ok(), await res.text()).toBeTruthy();
    } finally { await admin.dispose(); }
  });

  const year = 2100 + Math.floor(Math.random() * 800);

  test('monthly: on the 1st, the month just ended — once', async () => {
    await setFrequency('monthly');
    const first = await runAsOf(`${year}-03-01`);
    expect(first.opened.map((o) => o.period)).toEqual([`${year}-02`]);
    const taskId = first.opened[0].taskId;
    matters.push(taskId);

    const m = await getMatter(taskId);
    expect(m.serviceName).toBe(`GST Return - February ${year}`);
    expect(m.filingPeriod).toMatchObject({ frequency: 'monthly', key: `${year}-02`, month: `${year}-02` });
    // Unpaid, like a recurring matter: it waits for an admin's approval.
    expect(m.status).toBe('pending_admin_approval');

    // Approving it starts the clock. When its first step is due on a statutory
    // date, the date is for the matter's period: February's GSTR-1 is due 11 March.
    if (tempDefId) {
      const admin = await apiAs('admin');
      const ok = await admin.post(`/api/tasks/${taskId}/approve`, { data: {} });
      expect(ok.ok(), await ok.text()).toBeTruthy();
      const after = await getMatter(taskId);
      const steps = after.steps as { stepNumber: number; dueAt?: string }[];
      await admin.dispose();
      expect(steps.find((st) => st.stepNumber === 1)?.dueAt?.slice(0, 10),
        `service ${after.workflowDefinitionId} (made ${tempDefId}), period ${JSON.stringify(after.filingPeriod)}, steps ${JSON.stringify(steps.map((x) => [x.stepNumber, x.dueAt]))}`)
        .toBe(`${year}-03-11`);
    }

    // Run again on the same day, or later that month: nothing new.
    expect((await runAsOf(`${year}-03-01`)).opened).toEqual([]);
    expect((await runAsOf(`${year}-03-20`)).opened).toEqual([]);
  });

  test('quarterly: on 1 July, Q1 (April–June) of that financial year', async () => {
    await setFrequency('quarterly');
    const short = String((year + 1) % 100).padStart(2, '0');
    const run = await runAsOf(`${year}-07-01`);
    expect(run.opened.map((o) => o.period)).toEqual([`${year}-${short}-Q1`]);
    matters.push(run.opened[0].taskId);
    const m = await getMatter(run.opened[0].taskId);
    expect(m.serviceName).toBe(`GST Return - Q1 ${year}-${short}`);
    expect(m.filingPeriod).toMatchObject({ frequency: 'quarterly', month: `${year}-06` });
  });

  test('a client not set to file GST gets nothing', async () => {
    await setFrequency('');
    expect((await runAsOf(`${year}-10-01`)).opened).toEqual([]);
  });

  test('only an admin can run the sweep', async () => {
    for (const role of ['manager', 'team', 'client'] as const) {
      const who = await apiAs(role);
      expect((await who.post('/api/internal/run-gst-returns', { data: {} })).status()).toBe(403);
      await who.dispose();
    }
  });
});
