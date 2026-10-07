import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter, getMatter } from './api';
import { openMatter } from './helpers';

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
    // Capture where the matter actually STARTS rather than assuming step 1.
    // The default service now resolves to a workflow whose initialStep is 45
    // (#195), and a hardcoded 1 asserted the fixture, not the behaviour.
    const before = await getMatter(taskId);
    const admin = await apiAs('admin');
    const res = await admin.post(`/api/tasks/${taskId}/transition`, {
      data: { event: { type: 'COMPLETE_STEP', remark: `<p>${Array(1200).fill('w').join(' ')}</p>` } },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).code).toBe('WORD_LIMIT_EXCEEDED');
    // The matter did not advance on a rejected comment.
    const after = await getMatter(taskId);
    expect(after.currentStepNumber).toBe(before.currentStepNumber);
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

// ── #194 reopened: the limit must be REACHABLE with real words ──────────────
//
// `words()` above makes two-character "words", so 1,000 of them is ~5,000
// characters and never met the character caps. Real prose did: a Discussion
// message was cut to 4,000 characters (about 400 words kept), a comment to
// 8,000, and a note was refused by its schema. These use ordinary words.

const VOCAB = ('the registration application requires supporting documents including incorporation '
  + 'certificate director identification and registered office address proof before submission').split(' ');
const realWords = (n: number, offset = 0) =>
  Array.from({ length: n }, (_, i) => VOCAB[(i + offset) % VOCAB.length]).join(' ');
/** n words as ten paragraphs, one coloured — what the editor actually sends. */
const realisticHtml = (n: number) => Array.from({ length: 10 }, (_, p) => {
  const text = realWords(p === 9 ? n - Math.floor(n / 10) * 9 : Math.floor(n / 10), p);
  return p === 3 ? `<p><span style="color: #dc2626">${text}</span></p>` : `<p>${text}</p>`;
}).join('');
const countWords = (html: string) =>
  html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;

test('#194: a realistic 1,000-word Discussion message is stored whole, not cut', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    const html = realisticHtml(1000);
    expect(html.length, 'long enough to have hit the old 4,000-char cap').toBeGreaterThan(8000);
    const res = await admin.post(`/api/tasks/${taskId}/messages`, { data: { body: html } });
    expect(res.status()).toBe(201);
    const { id } = await res.json();

    const list = await (await admin.get(`/api/tasks/${taskId}/messages`)).json();
    const stored = (list.data ?? list).find((m: { id: string }) => m.id === id);
    await admin.dispose();
    expect(stored, 'the message can be read back').toBeTruthy();
    expect(countWords(stored.body), 'every one of the 1,000 words was saved').toBe(1000);
  } finally { await deleteMatter(taskId); }
});

test('#194: a realistic 1,000-word step note is accepted, and 1,001 is refused with the count', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    const step = (await getMatter(taskId)).currentStepNumber as number;

    const ok = await admin.post(`/api/tasks/${taskId}/steps/${step}/note`, { data: { note: realisticHtml(1000) } });
    expect(ok.status(), 'used to be 400 "Validation failed" — the schema capped a note at 8,000 characters').toBeLessThan(300);

    const over = await admin.post(`/api/tasks/${taskId}/steps/${step}/note`, { data: { note: realisticHtml(1001) } });
    expect(over.status()).toBe(400);
    const body = await over.json();
    expect(body.code).toBe('WORD_LIMIT_EXCEEDED');
    expect(body.message).toContain('1001');
    await admin.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#194: a realistic 1,000-word step comment advances the matter and is kept whole', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    const res = await admin.post(`/api/tasks/${taskId}/transition`, {
      data: { event: { type: 'COMPLETE_STEP', remark: realisticHtml(1000) } },
    });
    // The first step may not accept COMPLETE_STEP in every workflow; the point is
    // that a 1,000-word comment is never the reason for a refusal.
    if (res.status() === 400) {
      const body = await res.json();
      expect(body.code, JSON.stringify(body)).not.toBe('WORD_LIMIT_EXCEEDED');
      expect(body.code).not.toBe('RICH_TEXT_TOO_LARGE');
      expect(body.message).not.toBe('Validation failed');
    } else {
      expect(res.status()).toBe(200);
      const events = await (await admin.get(`/api/tasks/${taskId}/events`)).json();
      // Nothing else on a brand-new matter carries a comment this long.
      const withComment = (events.data ?? events).find((e: { comment?: string }) =>
        (e.comment ?? '').length > 1000);
      expect(withComment, 'the step comment is on the activity').toBeTruthy();
      expect(countWords(withComment.comment)).toBe(1000);
    }
    await admin.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#194: a long message is folded behind "Read more" and opens in full', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    // A recognisable last word proves the END of the message is on the page.
    const html = `${realisticHtml(990)}<p>and finally the closing marker zzlastwordzz</p>`;
    expect((await admin.post(`/api/tasks/${taskId}/messages`, { data: { body: html } })).status()).toBe(201);
    // A short one must NOT get a toggle.
    expect((await admin.post(`/api/tasks/${taskId}/messages`, { data: { body: '<p>short reply</p>' } })).status()).toBe(201);
    await admin.dispose();

    await openMatter(adminPage, taskId, 'Discussion');
    const more = adminPage.getByRole('button', { name: 'Read more' });
    await expect(more, 'exactly one message is long enough to fold').toHaveCount(1, { timeout: 20_000 });
    await expect(adminPage.getByText('short reply')).toBeVisible();

    await more.click();
    await expect(adminPage.getByText('zzlastwordzz'), 'the whole message is readable').toBeVisible();
    await expect(adminPage.getByRole('button', { name: 'Show less' })).toBeVisible();
  } finally { await deleteMatter(taskId); }
});

