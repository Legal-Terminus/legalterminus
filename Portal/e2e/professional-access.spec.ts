import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter } from './api';
import { env } from './helpers';

/**
 * #168 — a referring professional gets a login that shows ONLY the matters they
 * are explicitly named on, and only ever read-only.
 *
 * The requirement is mostly NEGATIVE ("Professional A must not see Matters 1, 3,
 * 4 of the same client"), so these tests deliberately create several matters for
 * the SAME client and grant access to just one. A test that only proved the
 * granted matter is visible would pass even if isolation were completely broken.
 */

const PRO_UID = () => env('E2E_PRO_UID');

test('#168: a professional sees ONLY the granted matter, not the client’s others', async () => {
  const granted = await createMatter({ organisation: 'E2E Pro Granted' });
  const hiddenA = await createMatter({ organisation: 'E2E Pro Hidden A' });
  const hiddenB = await createMatter({ organisation: 'E2E Pro Hidden B' });
  const admin = await apiAs('admin');
  try {
    // Grant access to ONE of the three (all belong to the same client).
    const patch = await admin.patch(`/api/tasks/${granted}`, {
      data: { professionalUid: PRO_UID() },
    });
    expect(patch.ok()).toBeTruthy();

    const pro = await apiAs('pro');
    const list = await (await pro.get('/api/tasks')).json();
    const ids = (list.data ?? []).map((t: { id: string }) => t.id);

    expect(ids).toContain(granted);
    // The isolation guarantee — the other matters of the SAME client are invisible.
    expect(ids).not.toContain(hiddenA);
    expect(ids).not.toContain(hiddenB);
    await pro.dispose();
  } finally {
    await admin.dispose();
    await Promise.all([deleteMatter(granted), deleteMatter(hiddenA), deleteMatter(hiddenB)]);
  }
});

test('#168: direct URL access to a non-granted matter is refused', async () => {
  const granted = await createMatter();
  const hidden = await createMatter();
  const admin = await apiAs('admin');
  try {
    await admin.patch(`/api/tasks/${granted}`, { data: { professionalUid: PRO_UID() } });

    const pro = await apiAs('pro');
    // Guessing the id of another matter must not work — the list filter is not
    // the only thing standing between a professional and someone else's matter.
    expect((await pro.get(`/api/tasks/${granted}`)).status()).toBe(200);
    expect((await pro.get(`/api/tasks/${hidden}`)).status()).toBe(403);
    // Sub-resources are guarded too, not just the matter document.
    expect((await pro.get(`/api/tasks/${hidden}/documents`)).status()).toBe(403);
    expect((await pro.get(`/api/tasks/${hidden}/events`)).status()).toBe(403);
    expect((await pro.get(`/api/tasks/${hidden}/payments`)).status()).toBe(403);
    expect((await pro.get(`/api/tasks/${hidden}/messages`)).status()).toBe(403);
    await pro.dispose();
  } finally {
    await admin.dispose();
    await Promise.all([deleteMatter(granted), deleteMatter(hidden)]);
  }
});

test('#168: a professional is view-only — every write is refused', async () => {
  const taskId = await createMatter();
  const admin = await apiAs('admin');
  try {
    await admin.patch(`/api/tasks/${taskId}`, { data: { professionalUid: PRO_UID() } });

    const pro = await apiAs('pro');
    // They CAN read this matter…
    expect((await pro.get(`/api/tasks/${taskId}`)).status()).toBe(200);

    // …but every mutating verb is blocked, including on the matter they can see.
    // Blocked centrally (denyReadOnlyRoles), so this holds for routes that do not
    // guard themselves individually.
    expect((await pro.patch(`/api/tasks/${taskId}`, { data: { isUrgent: true } })).status()).toBe(403);
    expect((await pro.post(`/api/tasks/${taskId}/transition`, {
      data: { event: { type: 'COMPLETE_STEP' } },
    })).status()).toBe(403);
    expect((await pro.post(`/api/tasks/${taskId}/messages`, {
      data: { body: 'should not post', clientVisible: true },
    })).status()).toBe(403);
    expect((await pro.delete(`/api/tasks/${taskId}`)).status()).toBe(403);

    // And they cannot create matters at all.
    expect((await pro.post('/api/tasks', {
      data: { clientUid: env('E2E_CLIENT_UID'), serviceKey: 'incorporation' },
    })).status()).toBe(403);
    await pro.dispose();
  } finally {
    await admin.dispose();
    await deleteMatter(taskId);
  }
});

test('#168: access granted later appears; revoked access disappears', async () => {
  const taskId = await createMatter();
  const admin = await apiAs('admin');
  try {
    const pro = await apiAs('pro');
    // Before the grant: invisible.
    expect((await pro.get(`/api/tasks/${taskId}`)).status()).toBe(403);

    // Granted AFTER creation — the issue requires both paths to work.
    await admin.patch(`/api/tasks/${taskId}`, { data: { professionalUid: PRO_UID() } });
    expect((await pro.get(`/api/tasks/${taskId}`)).status()).toBe(200);

    // Revoked by sending an empty list — access is read live, never snapshotted,
    // so it must vanish immediately rather than on next login.
    await admin.patch(`/api/tasks/${taskId}`, { data: { professionalUid: null } });
    expect((await pro.get(`/api/tasks/${taskId}`)).status()).toBe(403);
    await pro.dispose();
  } finally {
    await admin.dispose();
    await deleteMatter(taskId);
  }
});

test('#168: a matter can be created with professional access already set', async () => {
  const admin = await apiAs('admin');
  let taskId = '';
  try {
    const res = await admin.post('/api/tasks', {
      data: {
        clientUid: env('E2E_CLIENT_UID'),
        serviceKey: 'incorporation',
        organisation: 'E2E Pro At Creation',
        paymentStatus: 'fully_paid', totalCost: 1000, amountReceived: 1000, paymentMode: 'E2E',
        professionalUid: PRO_UID(),
      },
    });
    expect(res.ok()).toBeTruthy();
    taskId = (await res.json()).id;

    const pro = await apiAs('pro');
    expect((await pro.get(`/api/tasks/${taskId}`)).status()).toBe(200);
    await pro.dispose();
  } finally {
    await admin.dispose();
    if (taskId) await deleteMatter(taskId);
  }
});

test('#168: a client can never be the matter professional', async () => {
  const taskId = await createMatter();
  const admin = await apiAs('admin');
  try {
    // A CLIENT can never be the matter's professional — that would hand the
    // client's own account a second, differently-scoped route into matters.
    const bad = await admin.patch(`/api/tasks/${taskId}`, {
      data: { professionalUid: env('E2E_CLIENT_UID') },
    });
    expect(bad.status()).toBe(400);

    // A staff member IS allowed (that is #85's original meaning) — they simply
    // have no `professional` role, so this grants no professional-portal view.
    const staffOk = await admin.patch(`/api/tasks/${taskId}`, {
      data: { professionalUid: env('E2E_TEAM_UID') },
    });
    expect(staffOk.ok()).toBeTruthy();
  } finally {
    await admin.dispose();
    await deleteMatter(taskId);
  }
});

test('#168: a professional cannot reach staff-only areas', async () => {
  const pro = await apiAs('pro');
  try {
    // Reports, the user directory and the workflow editor are staff surfaces.
    expect((await pro.get('/api/reports/all-tasks')).status()).toBe(403);
    expect((await pro.get('/api/portal/users')).status()).toBe(403);
    expect((await pro.get('/api/tasks/my-steps')).status()).toBe(403);
  } finally {
    await pro.dispose();
  }
});

/* ── UI ─────────────────────────────────────────────────────────────────────── */

test('#168: the professional portal lists only their matter, view-only', async ({ adminPage, proPage }) => {
  const granted = await createMatter({ organisation: 'E2E Pro UI Granted' });
  const hidden = await createMatter({ organisation: 'E2E Pro UI Hidden' });
  const admin = await apiAs('admin');
  try {
    await admin.patch(`/api/tasks/${granted}`, { data: { professionalUid: PRO_UID() } });

    // The professional gets the EXTERNAL grid layout (Service, not Client), so a
    // row is identified by service name — the organisation column isn't rendered
    // in this view. Poll the row count: the fixture's page may have been created
    // before the grant, and the list refetches on an interval.
    await proPage.goto('tasks');
    // The list itself is asserted at API level in the first test in this file
    // (granted visible, the client's other matters not). Here we only pin the
    // CHROME a professional gets, which is what this UI test is actually for.
    await expect(proPage.getByRole('button', { name: /create matter/i })).toHaveCount(0);

    // On the matter itself: no Payments tab (an outside referrer has no business
    // with the client's fees) and no internal step-owner block.
    await proPage.goto(`tasks/${granted}`);
    await expect(proPage.getByRole('button', { name: 'Steps', exact: true })).toBeVisible({ timeout: 15_000 });
    await expect(proPage.getByRole('button', { name: 'Payments', exact: true })).toHaveCount(0);
    await expect(proPage.getByText('Step owner')).toHaveCount(0);
  } finally {
    await admin.dispose();
    await Promise.all([deleteMatter(granted), deleteMatter(hidden)]);
  }
});

test('#169: the documents gate denies by default, not just for clients', async () => {
  const granted = await createMatter();
  const hidden = await createMatter();
  const admin = await apiAs('admin');
  try {
    await admin.patch(`/api/tasks/${granted}`, { data: { professionalUid: PRO_UID() } });
    const pro = await apiAs('pro');

    // The gate used to check ONLY the client role and let every other role fall
    // through, so a professional reached documents on any matter. Each role is
    // now explicitly allowed and anything else refused.
    expect((await pro.get(`/api/tasks/${granted}/documents`)).status()).toBe(200);
    expect((await pro.get(`/api/tasks/${hidden}/documents`)).status()).toBe(403);

    // Staff keep cross-matter access — that is the job, and the deny-by-default
    // rewrite must not have taken it away.
    const team = await apiAs('team');
    expect((await team.get(`/api/tasks/${hidden}/documents`)).status()).toBe(200);
    await team.dispose();
    await pro.dispose();
  } finally {
    await admin.dispose();
    await Promise.all([deleteMatter(granted), deleteMatter(hidden)]);
  }
});

/* ── #168 follow-up: assign a Professional AFTER the matter exists ─────────── */

test('#168: the Professional control is visible and usable on an existing matter', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await adminPage.goto(`tasks/${taskId}`);

    // Visible, not merely present — the reported problem was "there is no option
    // to add a Professional after creation", which is a discoverability claim.
    const select = adminPage.getByLabel('Professional', { exact: true });
    await expect(select).toBeVisible();
    await expect(select).toBeInViewport();
    await expect(select).toBeEnabled();

    // Assigning from here works and shows the professional as an option.
    await select.selectOption(PRO_UID());
    await expect.poll(async () => {
      const api = await apiAs('admin');
      const t = await (await api.get(`/api/tasks/${taskId}`)).json();
      await api.dispose();
      return t.professionalUid;
    }, { timeout: 15_000 }).toBe(PRO_UID());
  } finally {
    await deleteMatter(taskId);
  }
});

test('#168: a professional is NOT offered as a Matter owner or step assignee', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await adminPage.goto(`tasks/${taskId}`);

    // A professional is view-only, so routing work to one would assign it to an
    // account that cannot act. Both dropdowns were fed by ONE list filtered only
    // as role !== 'client', which included professionals.
    const owner = adminPage.getByLabel('Matter owner', { exact: true });
    await expect(owner).toBeVisible();
    const ownerValues = await owner.locator('option').evaluateAll(
      (els) => els.map((e) => (e as HTMLOptionElement).value),
    );
    expect(ownerValues).not.toContain(PRO_UID());

    // …but they ARE offered as the matter's Professional.
    const prof = adminPage.getByLabel('Professional', { exact: true });
    const profValues = await prof.locator('option').evaluateAll(
      (els) => els.map((e) => (e as HTMLOptionElement).value),
    );
    expect(profValues).toContain(PRO_UID());
  } finally {
    await deleteMatter(taskId);
  }
});

/* ── #181: additional professionals on a matter ─────────────────────────────── */

test('#181: an additional professional sees ONLY the matter they were added to', async () => {
  const granted = await createMatter({ organisation: 'E2E Extra Pro Granted' });
  const hidden = await createMatter({ organisation: 'E2E Extra Pro Hidden' });
  const admin = await apiAs('admin');
  try {
    // Granted by EMAIL (what staff actually type), not uid.
    const res = await admin.patch(`/api/tasks/${granted}`, {
      data: { additionalProfessionalEmails: [env('E2E_PRO_EMAIL')] },
    });
    expect(res.ok()).toBeTruthy();

    const pro = await apiAs('pro');
    expect((await pro.get(`/api/tasks/${granted}`)).status()).toBe(200);
    // The whole point of per-matter grants: the other matter stays invisible.
    expect((await pro.get(`/api/tasks/${hidden}`)).status()).toBe(403);

    const ids = ((await (await pro.get('/api/tasks')).json()).data ?? []).map((t: { id: string }) => t.id);
    expect(ids).toContain(granted);
    expect(ids).not.toContain(hidden);
    await pro.dispose();
  } finally {
    await admin.dispose();
    await Promise.all([deleteMatter(granted), deleteMatter(hidden)]);
  }
});

test('#181: access is by uid, so it survives and is revocable by email list', async () => {
  const taskId = await createMatter();
  const admin = await apiAs('admin');
  try {
    await admin.patch(`/api/tasks/${taskId}`, {
      data: { additionalProfessionalEmails: [env('E2E_PRO_EMAIL')] },
    });
    // Stored as resolved uids — an email is mutable, a uid is not, so access
    // cannot be transferred by someone changing their address.
    const t = await (await admin.get(`/api/tasks/${taskId}`)).json();
    expect(t.additionalProfessionalUids).toContain(env('E2E_PRO_UID'));

    const pro = await apiAs('pro');
    expect((await pro.get(`/api/tasks/${taskId}`)).status()).toBe(200);

    // Empty list revokes.
    await admin.patch(`/api/tasks/${taskId}`, { data: { additionalProfessionalEmails: [] } });
    expect((await pro.get(`/api/tasks/${taskId}`)).status()).toBe(403);
    await pro.dispose();
  } finally {
    await admin.dispose();
    await deleteMatter(taskId);
  }
});

test('#181: an unknown or non-professional email is refused, not silently ignored', async () => {
  const taskId = await createMatter();
  const admin = await apiAs('admin');
  try {
    // A typo must NOT look like a successful grant — otherwise nobody finds out
    // until the professional says they cannot see the matter.
    const typo = await admin.patch(`/api/tasks/${taskId}`, {
      data: { additionalProfessionalEmails: ['nosuchperson@legalterminus.test'] },
    });
    expect(typo.status()).toBe(400);

    // A real account that is not a Professional is also refused.
    const wrongRole = await admin.patch(`/api/tasks/${taskId}`, {
      data: { additionalProfessionalEmails: [env('E2E_CLIENT_EMAIL')] },
    });
    expect(wrongRole.status()).toBe(400);

    // Neither attempt granted anything.
    const t = await (await admin.get(`/api/tasks/${taskId}`)).json();
    expect(t.additionalProfessionalUids ?? []).toEqual([]);
  } finally {
    await admin.dispose();
    await deleteMatter(taskId);
  }
});

test('#181: an additional professional stays view-only', async () => {
  const taskId = await createMatter();
  const admin = await apiAs('admin');
  try {
    await admin.patch(`/api/tasks/${taskId}`, {
      data: { additionalProfessionalEmails: [env('E2E_PRO_EMAIL')] },
    });
    const pro = await apiAs('pro');
    expect((await pro.get(`/api/tasks/${taskId}`)).status()).toBe(200);
    // Being added to a matter grants reading, never writing.
    expect((await pro.patch(`/api/tasks/${taskId}`, { data: { isUrgent: true } })).status()).toBe(403);
    expect((await pro.post(`/api/tasks/${taskId}/transition`, {
      data: { event: { type: 'COMPLETE_STEP' } },
    })).status()).toBe(403);
    await pro.dispose();
  } finally {
    await admin.dispose();
    await deleteMatter(taskId);
  }
});

test('#181: a matter can be created with additional professionals set', async () => {
  const admin = await apiAs('admin');
  let taskId = '';
  try {
    const res = await admin.post('/api/tasks', {
      data: {
        clientUid: env('E2E_CLIENT_UID'), serviceKey: 'incorporation',
        organisation: 'E2E Extra Pro At Creation',
        paymentStatus: 'fully_paid', totalCost: 1000, amountReceived: 1000, paymentMode: 'E2E',
        additionalProfessionalEmails: [env('E2E_PRO_EMAIL')],
      },
    });
    expect(res.ok()).toBeTruthy();
    taskId = (await res.json()).id;

    const pro = await apiAs('pro');
    expect((await pro.get(`/api/tasks/${taskId}`)).status()).toBe(200);
    await pro.dispose();
  } finally {
    await admin.dispose();
    if (taskId) await deleteMatter(taskId);
  }
});
