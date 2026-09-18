import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter, getMatter } from './api';

/**
 * #193 — own Discussion messages use a light-green bubble with dark text (the old
 * white-on-blue was hard to read).
 * #194 — the comment editor gains text colour, highlight and three text sizes, and
 * a 1,000-word limit. The limit is ENFORCED SERVER-SIDE: the editor's counter is a
 * convenience and can be bypassed by posting to the API.
 */

test('#194: colour, highlight and font-size survive saving', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    const html = '<p><span style="color: #dc2626">urgent</span> '
      + '<mark style="background-color: #fef08a">important</mark> '
      + '<span style="font-size: 1.25rem">large</span></p>';
    const res = await admin.post(`/api/tasks/${taskId}/messages`, {
      data: { body: html, clientVisible: true },
    });
    expect(res.ok(), 'message accepted').toBeTruthy();

    const list = await (await admin.get(`/api/tasks/${taskId}/messages`)).json();
    const saved = (list.data as Array<{ body: string }>).map((m) => m.body).join('');
    // The formatting is PRESERVED, not silently stripped by the sanitiser.
    expect(saved).toContain('color:#dc2626');
    expect(saved).toContain('background-color:#fef08a');
    expect(saved).toContain('font-size:1.25rem');
    await admin.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#194: dangerous styles are still stripped while colour is kept', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    await admin.post(`/api/tasks/${taskId}/messages`, {
      data: {
        body: '<p><span style="position:fixed;top:0;display:none;color:#dc2626">x</span>'
          + '<span style="font-size:500rem">big</span></p>',
        clientVisible: true,
      },
    });
    const list = await (await admin.get(`/api/tasks/${taskId}/messages`)).json();
    const saved = (list.data as Array<{ body: string }>).map((m) => m.body).join('');
    expect(saved, 'colour survives').toContain('color:#dc2626');
    expect(saved, 'position blocked').not.toContain('position');
    expect(saved, 'display blocked').not.toContain('display');
    expect(saved, 'absurd size blocked').not.toContain('500rem');
    await admin.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#194: a message over 1,000 words is refused by the API', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    const over = `<p>${Array(1001).fill('word').join(' ')}</p>`;
    const res = await admin.post(`/api/tasks/${taskId}/messages`, {
      data: { body: over, clientVisible: true },
    });
    expect(res.status(), 'over the limit is rejected').toBe(400);
    const body = await res.json();
    expect(body.code).toBe('WORD_LIMIT_EXCEEDED');
    expect(body.message, 'error names the real count').toMatch(/1001/);

    // Exactly at the limit is accepted — the boundary is inclusive.
    const at = `<p>${Array(1000).fill('word').join(' ')}</p>`;
    expect((await admin.post(`/api/tasks/${taskId}/messages`, {
      data: { body: at, clientVisible: true },
    })).ok()).toBeTruthy();
    await admin.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#194: an over-limit step COMMENT is refused on transition', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    const res = await admin.post(`/api/tasks/${taskId}/transition`, {
      data: { event: { type: 'COMPLETE_STEP', remark: `<p>${Array(1200).fill('w').join(' ')}</p>` } },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).code).toBe('WORD_LIMIT_EXCEEDED');
    // The matter did not advance on a rejected comment.
    const after = await getMatter(taskId);
    expect(after.currentStepNumber).toBe(1);
    await admin.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#193: the editor exposes colour, highlight and size controls', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Discussion', exact: true }).click();
    await adminPage.waitForTimeout(2000);
    await expect(adminPage.getByLabel(/Text colour: Red/i).first()).toBeVisible();
    await expect(adminPage.getByLabel(/Highlight: Yellow/i).first()).toBeVisible();
    await expect(adminPage.getByLabel('Text size').first()).toBeVisible();
    // Three sizes offered.
    const opts = await adminPage.getByLabel('Text size').first().locator('option').allInnerTexts();
    expect(opts).toEqual(['Small', 'Normal', 'Large']);
  } finally { await deleteMatter(taskId); }
});
