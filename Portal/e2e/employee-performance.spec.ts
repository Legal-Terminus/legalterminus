import { test, expect } from './fixtures';
import type { APIRequestContext } from '@playwright/test';
import {
  apiAs, apiAsCredentials, createThrowawayStaff, deleteDefinition, deleteMatter, deleteUser, transition,
} from './api';
import { env } from './helpers';

/**
 * LT #216 — Employee Performance (/reports/team-performance).
 *
 * Provisions its own person and matter so the numbers are KNOWN: a throwaway
 * team member does a task, an admin sends it back once, they redo it, an admin
 * approves, and the next task is theirs. For that person, today:
 *   completed 1 · in progress 1 · not started 0 · returned 1 (once)
 *   first-time right 0% · on time 100% · overdue 0
 * and while the admin approval was waiting: awaiting approval 1.
 *
 * The workflow is a throwaway definition built here — never the live services,
 * which are editable.
 */

const password = `Lt-e2e-${Date.now()}aA1!`;
let staff: { uid: string; name: string; email: string };
let defId = '';
let taskId = '';

/** Today in this machine's local time — the same day the Portal's "Today" means. */
function today() {
  const d = new Date();
  const from = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  const to = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  return { from: from.toISOString(), to: to.toISOString(), tz: -d.getTimezoneOffset() };
}

async function reportFor(api: APIRequestContext, uid?: string) {
  const { from, to, tz } = today();
  const qs = new URLSearchParams({ from, to, tz: String(tz) });
  if (uid) qs.set('uid', uid);
  const res = await api.get(`/api/reports/team-performance?${qs.toString()}`);
  expect(res.status(), await res.text()).toBe(200);
  return res.json();
}

async function staffTransition(event: Record<string, unknown>) {
  const api = await apiAsCredentials(staff.email, password);
  const res = await api.post(`/api/tasks/${taskId}/transition`, { data: { event } });
  expect(res.status(), await res.text()).toBe(200);
  await api.dispose();
}

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
  staff = await createThrowawayStaff({ password });
  const admin = await apiAs('admin');
  defId = `e2e-perf-${Date.now()}`;
  const serviceKey = `e2e-svc-perf-${Date.now()}`;
  const def = {
    id: defId,
    name: `E2E Performance ${defId}`,
    initialStep: 1,
    serviceKeys: [serviceKey],
    steps: [
      { stepNumber: 1, title: 'Prepare draft', type: 'step', defaultAssigneeUid: staff.uid, typicalDurationDays: 5,
        transitions: [{ event: 'COMPLETE_STEP', to: 2 }] },
      // An ADMIN-APPROVAL step (#90): approve, or send the draft back.
      { stepNumber: 2, title: 'Partner approval', type: 'step', assignedRole: 'admin', defaultAssigneeUid: env('E2E_ADMIN_UID'),
        transitions: [{ event: 'COMPLETE_STEP', to: 3 }, { event: 'REWORK', to: 1 }] },
      { stepNumber: 3, title: 'File the form', type: 'step', defaultAssigneeUid: staff.uid, typicalDurationDays: 5,
        transitions: [{ event: 'COMPLETE_STEP', to: 4 }] },
      { stepNumber: 4, title: 'Done', type: 'final' },
    ],
  };
  const dres = await admin.post('/api/workflow-definitions', { data: def });
  expect(dres.ok(), await dres.text()).toBeTruthy();
  const tres = await admin.post('/api/tasks', {
    data: {
      clientUid: env('E2E_CLIENT_UID'), serviceKey,
      paymentStatus: 'fully_paid', totalCost: 10000, amountReceived: 10000, paymentMode: 'E2E',
    },
  });
  expect(tres.ok(), await tres.text()).toBeTruthy();
  taskId = (await tres.json()).id as string;
  await admin.dispose();
});

test.afterAll(async () => {
  await deleteMatter(taskId);
  await deleteDefinition(defId);
  if (staff?.uid) await deleteUser(staff.uid);
});

test('#216: a new person starts with one task in progress and nothing done', async () => {
  const api = await apiAs('admin');
  const r = await reportFor(api, staff.uid);
  expect(r.employee.uid).toBe(staff.uid);
  expect(r.summary.completed).toBe(0);
  expect(r.summary.inProgress).toBe(1);
  // Step 3 is assigned to them but not started yet.
  expect(r.summary.notStarted).toBe(1);
  expect(r.summary.startedInRange).toBe(1);
  expect(r.summary.carriedForward).toBe(0);
  await api.dispose();
});

test('#216: submitting work for approval shows as awaiting approval', async () => {
  await staffTransition({ type: 'COMPLETE_STEP' });
  const api = await apiAs('admin');
  const r = await reportFor(api, staff.uid);
  expect(r.summary.completed).toBe(1);
  expect(r.summary.awaitingApproval).toBe(1);
  const waiting = r.quality.awaitingItems.find((i: { taskId: string }) => i.taskId === taskId);
  expect(waiting?.title).toBe('Prepare draft');
  expect(waiting?.approvalTitle).toBe('Partner approval');
  expect(waiting?.waitingOn).toBe('admin');
  await api.dispose();
});

test('#216: a correction, a redo and an approval give the known numbers', async () => {
  await transition('admin', taskId, { type: 'REWORK', remark: 'Wrong director name' });
  await staffTransition({ type: 'COMPLETE_STEP' });
  await transition('admin', taskId, { type: 'COMPLETE_STEP' });

  const api = await apiAs('admin');
  const r = await reportFor(api, staff.uid);
  // Section 1 + 3
  expect(r.summary.completed).toBe(1);
  expect(r.summary.inProgress).toBe(1);
  expect(r.summary.notStarted).toBe(0);
  expect(r.summary.assigned).toBe(2);
  expect(r.summary.overdue).toBe(0);
  expect(r.summary.awaitingApproval).toBe(0);
  expect(r.summary.completionPct).toBe(50);
  // Section 2 — elapsed time exists for the completed task.
  expect(r.time.count).toBe(1);
  expect(r.time.items[0].elapsedMs).toBeGreaterThanOrEqual(0);
  // Section 5 — finished well inside its 5-day ETA.
  expect(r.deadlines.completedOnTime).toBe(1);
  expect(r.deadlines.completedLate).toBe(0);
  expect(r.deadlines.avgDelayDays).toBeNull();
  // Section 6
  expect(r.trend.current.completed).toBe(1);
  expect(r.trend.current.onTimePct).toBe(100);
  // Section 7 — sent back once, so not first-time right.
  expect(r.quality.completed).toBe(1);
  expect(r.quality.firstTimeRight).toBe(0);
  expect(r.quality.firstTimeRightPct).toBe(0);
  expect(r.quality.returnedSteps).toBe(1);
  expect(r.quality.returnCount).toBe(1);
  expect(r.quality.returnedItems[0].lastComment).toBe('Wrong director name');
  // Section 4 — both tasks, newest first.
  const titles = r.history.rows.map((x: { title: string }) => x.title);
  expect(titles).toEqual(['File the form', 'Prepare draft']);

  // The activity feed: what THEY did — two completions.
  const { from, to } = today();
  const act = await api.get(`/api/reports/team-performance/activity?${new URLSearchParams({ from, to, uid: staff.uid })}`);
  expect(act.status()).toBe(200);
  const feed = await act.json();
  expect(feed.data.filter((e: { type: string }) => e.type === 'COMPLETE_STEP')).toHaveLength(2);
  expect(feed.data.every((e: { byUid: string }) => e.byUid === staff.uid)).toBeTruthy();
  await api.dispose();
});

test('#216: the whole-team overview has a row for the person', async () => {
  const api = await apiAs('manager');
  const r = await reportFor(api);
  expect(r.employee).toBeNull();
  const row = r.overview.find((x: { uid: string }) => x.uid === staff.uid);
  expect(row).toBeTruthy();
  expect(row.completed).toBe(1);
  expect(row.returned).toBe(1);
  expect(row.firstTimeRightPct).toBe(0);
  expect(row.onTimePct).toBe(100);
  await api.dispose();
});

test('#216: the report page shows the person’s figures and says time is elapsed, not worked', async ({ adminPage }) => {
  await adminPage.goto(`reports/team-performance?uid=${staff.uid}&period=today`);
  await expect(adminPage.getByRole('heading', { name: 'Employee Performance' })).toBeVisible();

  const summary = adminPage.getByRole('region', { name: 'Work summary' });
  await expect(summary.getByRole('group', { name: 'Completed', exact: true })).toContainText('1');
  await expect(summary.getByRole('group', { name: 'Assigned' })).toContainText('2');

  const quality = adminPage.getByRole('region', { name: 'Quality & approval' });
  await expect(quality.getByRole('group', { name: 'Returned for corrections' })).toContainText('1');
  await expect(quality.getByRole('group', { name: 'First-time right' })).toContainText('0%');
  await expect(quality).toContainText('Wrong director name');

  await expect(adminPage.getByRole('region', { name: 'Time on tasks' })).toContainText('not hours worked');
  const history = adminPage.getByRole('region', { name: 'Activity & work history' });
  await expect(history.getByRole('link', { name: 'File the form' }).first()).toBeVisible();
  await expect(history.getByRole('list', { name: 'Recorded activity' })).toContainText('Completed a task');

  // Back to the whole team: the person is a row in the overview, and picking them opens their report.
  await adminPage.getByLabel('Team member').selectOption('');
  const overview = adminPage.getByRole('region', { name: 'Team overview' });
  await overview.getByRole('button', { name: staff.name }).click();
  await expect(adminPage).toHaveURL(new RegExp(`uid=${staff.uid}`));
});

test('#216: team members and clients cannot reach the report', async ({ teamPage, clientPage }) => {
  const { from, to } = today();
  const qs = new URLSearchParams({ from, to }).toString();
  for (const role of ['team', 'client'] as const) {
    const api = await apiAs(role);
    expect((await api.get(`/api/reports/team-performance?${qs}`)).status(), `${role} report`).toBe(403);
    expect((await api.get(`/api/reports/team-performance/activity?${qs}`)).status(), `${role} activity`).toBe(403);
    await api.dispose();
  }
  // The throwaway team member cannot read even their OWN report.
  const self = await apiAsCredentials(staff.email, password);
  expect((await self.get(`/api/reports/team-performance?${qs}&uid=${staff.uid}`)).status()).toBe(403);
  await self.dispose();

  for (const page of [teamPage, clientPage]) {
    await page.goto('reports/team-performance');
    await expect(page).not.toHaveURL(/\/reports\/team-performance/);
  }
});

test('#216: a bad range is refused with a readable message', async () => {
  const api = await apiAs('admin');
  const res = await api.get('/api/reports/team-performance?from=2026-10-10T00:00:00Z&to=2026-10-01T00:00:00Z');
  expect(res.status()).toBe(400);
  expect((await res.json()).message).toMatch(/end date is before the start date/i);
  await api.dispose();
});
