import { test, expect } from './fixtures';
import { deleteUserByEmail, findUserByEmail, apiAs } from './api';

/**
 * E09 — User management: grid + role tabs, the self-role-change guard (E09-S03),
 * and END-TO-END create of a team member (E09-S01) and a client (E09-S02). Created
 * users are deleted afterward.
 */

test('admin sees the Users grid with role filter tabs', async ({ adminPage }) => {
  await adminPage.goto('users');
  await expect(adminPage.getByRole('heading', { name: 'Users' })).toBeVisible();
  for (const tab of ['All', 'Admins', 'Managers', 'Team Members', 'Clients']) {
    await expect(adminPage.getByRole('button', { name: new RegExp(`^${tab}`) }).first()).toBeVisible();
  }
});

test('E09-S06: clicking a user row opens a read-only detail view with an Edit action', async ({ adminPage }) => {
  await adminPage.goto('users');
  await expect(adminPage.getByRole('heading', { name: 'Users' })).toBeVisible();
  // Click the first DATA row — a clickable row contains an "Edit" action (sortable
  // column HEADERS are also .cursor-pointer, so don't just take the first one).
  // Click the row's leading avatar/name area (position: left) so we don't land on
  // the trailing Edit/Delete buttons (which navigate instead of opening the drawer).
  const firstRow = adminPage.locator('.cursor-pointer', { has: adminPage.getByRole('button', { name: /^edit$/i }) }).first();
  await firstRow.click({ position: { x: 20, y: 20 } });
  const dialog = adminPage.getByRole('dialog', { name: /user details/i });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('User details')).toBeVisible();
  // The detail view exposes an Edit button; clicking it navigates to the edit form.
  await dialog.getByRole('button', { name: /^edit$/i }).click();
  await expect(adminPage).toHaveURL(/\/users\/edit\//);
});

test('E09-S03: editing your OWN account locks the role selector', async ({ adminPage }) => {
  const adminUid = process.env.E2E_ADMIN_UID!;
  await adminPage.goto(`users/edit/member/${adminUid}`);
  await expect(adminPage.getByText(/can't change your own role/i)).toBeVisible();
});

test('E09-S01: admin creates a team member end-to-end', async ({ adminPage }) => {
  const email = `e2e-newmember-${Date.now()}@legalterminus.test`;
  try {
    await adminPage.goto('users');
    await adminPage.getByRole('button', { name: 'Add Member' }).click();
    await expect(adminPage).toHaveURL(/users\/new\/member/);

    await adminPage.locator('input[name="name"]').fill('E2E New Member');
    await adminPage.locator('input[name="email"]').fill(email);
    await adminPage.locator('input[name="phone"]').fill('9876500001');
    await adminPage.locator('input[name="designation"]').fill('QA Tester');
    await adminPage.getByRole('button', { name: /create member/i }).click();

    // Back to the users list; the new member is findable via search.
    await expect(adminPage).toHaveURL(/\/users(\?|$)/, { timeout: 15_000 });
    await adminPage.getByPlaceholder(/search users/i).fill('E2E New Member');
    await expect(adminPage.getByText('E2E New Member').first()).toBeVisible();
  } finally {
    await deleteUserByEmail(email);
  }
});

test('E09-S02: admin creates a client end-to-end', async ({ adminPage }) => {
  const email = `e2e-newclient-${Date.now()}@legalterminus.test`;
  try {
    await adminPage.goto('users');
    await adminPage.getByRole('button', { name: 'Add Client' }).click();
    await expect(adminPage).toHaveURL(/users\/new\/client/);

    await adminPage.locator('input[name="name"]').fill('E2E New Client');
    await adminPage.locator('input[name="email"]').fill(email);
    await adminPage.locator('input[name="phone"]').fill('9876500002');
    await adminPage.locator('input[name="address"]').fill('123 E2E Street, Test City'); // required for clients
    await adminPage.locator('input[name="professionalName"]').fill('E2E Referrer'); // #183: Reference is required on create
    await adminPage.getByRole('button', { name: /create client/i }).click();

    await expect(adminPage).toHaveURL(/\/users(\?|$)/, { timeout: 15_000 });
    await adminPage.getByPlaceholder(/search users/i).fill('E2E New Client');
    await expect(adminPage.getByText('E2E New Client').first()).toBeVisible();
  } finally {
    await deleteUserByEmail(email);
  }
});

test('#183: Reference is required when creating a client', async ({ adminPage }) => {
  await adminPage.goto('users');
  await adminPage.getByRole('button', { name: 'Add Client' }).click();
  await expect(adminPage).toHaveURL(/users\/new\/client/);

  // Fill everything EXCEPT Reference — the form must refuse to submit.
  await adminPage.locator('input[name="name"]').fill('E2E Missing Ref');
  await adminPage.locator('input[name="email"]').fill(`e2e-noref-${Date.now()}@legalterminus.test`);
  await adminPage.locator('input[name="phone"]').fill('9876500003');
  await adminPage.locator('input[name="address"]').fill('123 E2E Street, Test City');
  await adminPage.getByRole('button', { name: /create client/i }).click();

  // Still on the form (no navigation) — the client was not created.
  await expect(adminPage).toHaveURL(/users\/new\/client/);
});

test('#150: the client form labels the reference field "Reference", not "Professional"', async ({ adminPage }) => {
  await adminPage.goto('users/new/client');
  // The Business Details field is relabelled; the underlying input name is
  // unchanged (professionalName) so existing records keep working.
  const reference = adminPage.locator('input[name="professionalName"]');
  await expect(reference).toBeVisible();
  await expect(adminPage.getByText('Reference', { exact: true })).toBeVisible();
  await expect(adminPage.getByText('Professional', { exact: true })).toHaveCount(0);
  // Group / Parent Company is untouched by the rename.
  await expect(adminPage.locator('input[name="groupCompany"]')).toBeVisible();
});

/* ── #151: Professional field in the Role & Access section ─────────────────── */

test('#151: the Professional dropdown sits in Role & Access and lists staff only', async ({ adminPage }) => {
  await adminPage.goto('users/new/member');

  const professional = adminPage.locator('select[name="professionalUid"]');
  await expect(professional).toBeVisible();

  // It must render BELOW the Role & Access heading — that placement is the ask.
  const heading = adminPage.getByRole('heading', { name: 'Role & Access' });
  await expect(heading).toBeVisible();
  const [headingBox, selectBox] = [await heading.boundingBox(), await professional.boundingBox()];
  expect(selectBox!.y).toBeGreaterThan(headingBox!.y);

  // Defaults to unset, and "None" is a real choice (the field is optional).
  await expect(professional).toHaveValue('');
  await expect(professional.locator('option[value=""]')).toHaveText('None');

  // Options are staff; the seeded client must not be offered as a professional.
  const optionText = (await professional.locator('option').allInnerTexts()).join('|');
  expect(optionText).not.toContain(process.env.E2E_CLIENT_EMAIL ?? '@@no-such-client@@');
});

test('#151: choosing a professional in the form persists it on the user', async ({ adminPage }) => {
  const email = `e2e-prof-${Date.now()}@legalterminus.test`;
  try {
    await adminPage.goto('users/new/member');
    await adminPage.locator('input[name="name"]').fill('E2E Prof Member');
    await adminPage.locator('input[name="email"]').fill(email);
    await adminPage.locator('input[name="phone"]').fill('9876500003');
    await adminPage.locator('input[name="designation"]').fill('QA Tester');

    // Pick a real professional (index 0 is "None").
    const select = adminPage.locator('select[name="professionalUid"]');
    const chosenUid = await select.locator('option').nth(1).getAttribute('value');
    expect(chosenUid, 'need at least one staff user to act as professional').toBeTruthy();
    await select.selectOption(chosenUid!);

    await adminPage.getByRole('button', { name: /create member/i }).click();
    await expect(adminPage).toHaveURL(/\/users(\?|$)/, { timeout: 15_000 });

    // Assert against the stored record rather than re-navigating the grid — the
    // UI round-trip is covered below and kept off this test's critical path.
    const uid = await findUserByEmail(email);
    expect(uid).toBeTruthy();
    const api = await apiAs('admin');
    const saved = await (await api.get(`/api/portal/users/${uid}`)).json();
    await api.dispose();
    expect(saved.professionalUid).toBe(chosenUid);
    // The display name is snapshotted alongside the UID, for lists and exports.
    expect(saved.professionalTitle).toBeTruthy();
  } finally {
    await deleteUserByEmail(email);
  }
});

test('#151: the professional stays editable later and can be cleared', async ({ adminPage }) => {
  const email = `e2e-profedit-${Date.now()}@legalterminus.test`;
  const api = await apiAs('admin');
  try {
    // Seed via the API so the test spends its budget on the EDIT path, which is
    // what "should remain editable later from the user's profile" actually means.
    const staff = await (await api.get('/api/portal/users?role=team_member')).json();
    const pro = (staff.data ?? staff)[0];
    expect(pro, 'need a staff user to act as professional').toBeTruthy();

    const created = await api.post('/api/portal/users', {
      data: {
        name: 'E2E Prof Edit', email, phone: '9876500004',
        role: 'team_member', designation: 'QA Tester',
        professionalUid: pro.uid,
      },
    });
    expect(created.ok()).toBeTruthy();
    const uid = (await created.json()).uid;

    // The edit form loads with the stored professional preselected.
    await adminPage.goto(`users/edit/member/${uid}`);
    const editSelect = adminPage.locator('select[name="professionalUid"]');
    await expect(editSelect).toHaveValue(pro.uid);

    // Clear it back to None — the change must stick.
    await editSelect.selectOption('');
    await adminPage.getByRole('button', { name: /update member/i }).click();
    await expect(adminPage).toHaveURL(/\/users(\?|$)/, { timeout: 15_000 });

    const after = await (await api.get(`/api/portal/users/${uid}`)).json();
    expect(after.professionalUid ?? null).toBeNull();
    expect(after.professionalTitle ?? null).toBeNull();
  } finally {
    await api.dispose();
    await deleteUserByEmail(email);
  }
});

test('#151: a client cannot be assigned as a professional', async () => {
  const api = await apiAs('admin');
  const email = `e2e-profbad-${Date.now()}@legalterminus.test`;
  try {
    const clients = await (await api.get('/api/portal/users?role=client')).json();
    const client = (clients.data ?? clients)[0];
    expect(client, 'need a seeded client').toBeTruthy();

    const res = await api.post('/api/portal/users', {
      data: {
        name: 'E2E Prof Bad', email, phone: '9876500005',
        role: 'team_member', designation: 'QA Tester',
        professionalUid: client.uid,
      },
    });
    expect(res.status()).toBe(400);
  } finally {
    await api.dispose();
    await deleteUserByEmail(email);
  }
});
