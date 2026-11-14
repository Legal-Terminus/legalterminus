import { request, type APIRequestContext } from '@playwright/test';
import { test, expect } from './fixtures';
import {
  apiAs, idToken, createMatter, deleteMatter, getDefinitionForMatter, firstPlainStep,
  advanceUntil, getMatter, transition,
} from './api';
import type { RoleKey } from './helpers';

/**
 * #122 follow-up — paste or upload images in step comments and the Discussion.
 *
 * An image is uploaded to the matter and the comment stores only a reference
 * (`<img data-lt-image="{id}">`, never a src). Viewing streams the bytes through
 * the authenticated API; a client sees an image only when it sits in something
 * shared with the client (or they uploaded it).
 *
 * Each test provisions and deletes its own matter.
 */

const API_BASE = process.env.E2E_API_BASE ?? 'http://localhost:5001';

/** A valid 1×1 PNG. */
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

/**
 * A request context with ONLY the bearer token. `apiAs` pins
 * Content-Type: application/json, which would clobber the multipart boundary.
 */
async function multipartAs(role: RoleKey): Promise<APIRequestContext> {
  return request.newContext({
    baseURL: API_BASE,
    extraHTTPHeaders: { Authorization: `Bearer ${await idToken(role)}` },
  });
}

async function uploadAs(role: RoleKey, taskId: string, file: { name: string; mimeType: string; buffer: Buffer }) {
  const api = await multipartAs(role);
  const res = await api.post(`/api/tasks/${taskId}/comment-images`, { multipart: { image: file } });
  const status = res.status();
  const body = await res.json().catch(() => ({}));
  await api.dispose();
  return { status, body: body as { imageId?: string; message?: string; code?: string } };
}

async function uploadPng(role: RoleKey, taskId: string): Promise<string> {
  const { status, body } = await uploadAs(role, taskId, { name: 'shot.png', mimeType: 'image/png', buffer: PNG });
  expect(status, `upload as ${role}`).toBe(201);
  expect(body.imageId).toMatch(/^[0-9a-f]{32}$/);
  return body.imageId!;
}

async function fetchImageAs(role: RoleKey, taskId: string, imageId: string) {
  const api = await multipartAs(role);
  const res = await api.get(`/api/tasks/${taskId}/comment-images/${imageId}`);
  const out = { status: res.status(), type: res.headers()['content-type'] ?? '', cache: res.headers()['cache-control'] ?? '' };
  await api.dispose();
  return out;
}

const ref = (id: string) => `<img data-lt-image="${id}" alt="screenshot">`;

/** Walk a fresh matter to a staff "Complete Step" step, or skip. */
async function atPlainStep(taskId: string): Promise<number> {
  const plain = firstPlainStep(await getDefinitionForMatter(taskId));
  test.skip(!plain, 'No plain COMPLETE_STEP step in this workflow.');
  await advanceUntil(taskId, (s) => s.stepNumber === plain!.stepNumber);
  const at = (await getMatter(taskId)).currentStepNumber as number;
  test.skip(at !== plain!.stepNumber, `Could not reach the plain step (at ${at}).`);
  return at;
}

test('an image in an INTERNAL step comment is staff-only; sharing it in a client-visible message opens it to the client', async () => {
  const taskId = await createMatter();
  try {
    await atPlainStep(taskId);
    const imageId = await uploadPng('admin', taskId);

    // Internal comment (explicitly not shared).
    await transition('admin', taskId, {
      type: 'COMPLETE_STEP', remark: `<p>internal look ${ref(imageId)}</p>`, commentClientVisible: false,
    });

    // Stored as a reference — the id survives, no src was added.
    const admin = await apiAs('admin');
    const events = await (await admin.get(`/api/tasks/${taskId}/events`)).json();
    const stored = JSON.stringify(events);
    expect(stored).toContain(`data-lt-image=\\"${imageId}\\"`);
    expect(stored).not.toMatch(/<img[^>]*src=/);

    // Staff stream it, privately.
    const staff = await fetchImageAs('admin', taskId, imageId);
    expect(staff.status).toBe(200);
    expect(staff.type).toContain('image/png');
    expect(staff.cache).toContain('private');

    // The client may not — and is not told whether it exists.
    expect((await fetchImageAs('client', taskId, imageId)).status).toBe(404);

    // Staff now share the same image in a client-visible Discussion message.
    expect((await admin.post(`/api/tasks/${taskId}/messages`, {
      data: { body: `<p>for you ${ref(imageId)}</p>`, clientVisible: true },
    })).status()).toBe(201);
    expect((await fetchImageAs('client', taskId, imageId)).status).toBe(200);
    await admin.dispose();
  } finally { await deleteMatter(taskId); }
});

test('a client-visible step comment shares its image; an internal message does not', async () => {
  const taskId = await createMatter();
  try {
    await atPlainStep(taskId);
    const shared = await uploadPng('manager', taskId);
    const internal = await uploadPng('manager', taskId);

    await transition('admin', taskId, {
      type: 'COMPLETE_STEP', remark: `<p>shared ${ref(shared)}</p>`, commentClientVisible: true,
    });
    const admin = await apiAs('admin');
    expect((await admin.post(`/api/tasks/${taskId}/messages`, {
      data: { body: `<p>internal ${ref(internal)}</p>` },
    })).status()).toBe(201);
    await admin.dispose();

    expect((await fetchImageAs('client', taskId, shared)).status).toBe(200);
    expect((await fetchImageAs('client', taskId, internal)).status).toBe(404);
    // Unknown id / malformed id.
    expect((await fetchImageAs('client', taskId, 'f'.repeat(32))).status).toBe(404);
    expect((await fetchImageAs('admin', taskId, 'not-an-id')).status).toBe(404);
  } finally { await deleteMatter(taskId); }
});

test('a client can add their own image to a message and see it; quoting an internal image id is dropped', async () => {
  const taskId = await createMatter();
  try {
    const own = await uploadPng('client', taskId);
    expect((await fetchImageAs('client', taskId, own)).status, 'uploader sees their own upload').toBe(200);

    const internal = await uploadPng('admin', taskId);
    const client = await apiAs('client');
    const res = await client.post(`/api/tasks/${taskId}/messages`, {
      data: { body: `<p>mine ${ref(own)} and theirs ${ref(internal)}</p>` },
    });
    expect(res.status()).toBe(201);
    const saved = (await res.json()).body as string;
    expect(saved).toContain(own);
    expect(saved, 'an internal image cannot be published by quoting its id').not.toContain(internal);
    expect((await fetchImageAs('client', taskId, internal)).status).toBe(404);
    await client.dispose();
  } finally { await deleteMatter(taskId); }
});

test('wrong type and over 5 MB are refused with a reason', async () => {
  const taskId = await createMatter();
  try {
    const pdf = await uploadAs('admin', taskId, { name: 'x.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 x') });
    expect(pdf.status).toBe(415);
    expect(pdf.body.message).toMatch(/JPEG, PNG or WebP/);

    // Declared as PNG, but the bytes are not an image.
    const fake = await uploadAs('admin', taskId, { name: 'x.png', mimeType: 'image/png', buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>') });
    expect(fake.status).toBe(415);

    const svg = await uploadAs('admin', taskId, { name: 'x.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg/>') });
    expect(svg.status).toBe(415);

    const big = Buffer.concat([PNG, Buffer.alloc(5 * 1024 * 1024 + 10)]);
    const tooBig = await uploadAs('admin', taskId, { name: 'big.png', mimeType: 'image/png', buffer: big });
    expect(tooBig.status).toBe(413);
    expect(tooBig.body.message).toMatch(/5 MB/);

    // A professional is view-only; no upload.
    const pro = await uploadAs('pro', taskId, { name: 'p.png', mimeType: 'image/png', buffer: PNG });
    expect(pro.status).toBe(403);
  } finally { await deleteMatter(taskId); }
});

test('an <img src> posted straight to the API is stripped; a reference to another matter\'s image is dropped', async () => {
  const taskId = await createMatter();
  const otherId = await createMatter();
  try {
    const foreign = await uploadPng('admin', otherId);
    const admin = await apiAs('admin');
    const res = await admin.post(`/api/tasks/${taskId}/messages`, {
      data: {
        body: '<p>a<img src="https://evil.test/pixel.png">'
          + '<img src="data:image/png;base64,AAAA">'
          + `<img src="/x.png" data-lt-image="${'a'.repeat(32)}">`
          + `<img data-lt-image="${foreign}" alt="other matter">b</p>`,
        clientVisible: true,
      },
    });
    expect(res.status()).toBe(201);
    const saved = (await res.json()).body as string;
    expect(saved).not.toContain('<img');
    expect(saved).not.toContain('evil.test');
    expect(saved).not.toContain('data:image');
    // The foreign image is not readable through THIS matter either.
    expect((await fetchImageAs('admin', taskId, foreign)).status).toBe(404);
    await admin.dispose();
  } finally { await deleteMatter(taskId); await deleteMatter(otherId); }
});

test('UI: staff upload an image into a step comment and it renders', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await atPlainStep(taskId);
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
    const completeBtn = adminPage.getByRole('button', { name: /^complete step$/i });
    test.skip(!(await completeBtn.count()), 'Current step is not a staff Complete-Step turn.');

    const note = `IMG-COMMENT-${Date.now()}`;
    await adminPage.getByRole('textbox', { name: 'Add a comment' }).first().pressSequentially(note);
    // The current step's composer is first in DOM order.
    await adminPage.getByTestId('comment-image-input').first()
      .setInputFiles({ name: 'shot.png', mimeType: 'image/png', buffer: PNG });
    // The image appears in the editor, loaded from a local object URL.
    const inEditor = adminPage.getByRole('textbox', { name: 'Add a comment' }).first().locator('img[data-lt-image]');
    await expect(inEditor).toHaveAttribute('src', /^blob:/, { timeout: 15_000 });

    await completeBtn.first().click();
    const showPrev = adminPage.getByRole('button', { name: /show previous steps/i });
    if (await showPrev.count()) await showPrev.first().click();
    await expect(adminPage.getByText(note).first()).toBeAttached({ timeout: 15_000 });
    // Rendered in the activity — again via an authenticated fetch, never a src in the stored HTML.
    await expect(adminPage.locator('.rich-text img[data-lt-image][src^="blob:"]').first()).toBeAttached({ timeout: 15_000 });
  } finally { await deleteMatter(taskId); }
});

test('UI: a wrong-type file in the Discussion composer shows a friendly error', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Chat', exact: true }).click();
    await adminPage.getByTestId('comment-image-input').first()
      .setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') });
    await expect(adminPage.getByRole('alert').filter({ hasText: /JPEG, PNG or WebP/ })).toBeVisible();
  } finally { await deleteMatter(taskId); }
});

test('UI: the client sees an image shared in the Discussion, rendered', async ({ adminPage, clientPage }) => {
  const taskId = await createMatter();
  try {
    // Staff add it through the composer and share the message.
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Chat', exact: true }).click();
    const msg = `IMG-MSG-${Date.now()}`;
    await adminPage.getByLabel('Message', { exact: true }).pressSequentially(msg);
    await adminPage.getByTestId('comment-image-input').first()
      .setInputFiles({ name: 'shot.png', mimeType: 'image/png', buffer: PNG });
    await expect(adminPage.getByLabel('Message', { exact: true }).locator('img[data-lt-image]')).toHaveAttribute('src', /^blob:/, { timeout: 15_000 });
    await adminPage.getByLabel('Visible to client').check();
    await adminPage.getByRole('button', { name: /^Send$/ }).click();
    // A message shared with the client asks for confirmation first.
    await adminPage.getByRole('button', { name: 'Send to client' }).click();
    await expect(adminPage.getByText(msg)).toBeVisible();

    await clientPage.goto(`tasks/${taskId}`);
    await clientPage.getByRole('button', { name: 'Chat', exact: true }).click();
    await expect(clientPage.getByText(msg)).toBeVisible({ timeout: 15_000 });
    const shown = clientPage.locator('.rich-text img[data-lt-image][src^="blob:"]').first();
    await expect(shown).toBeVisible({ timeout: 15_000 });
    await expect(clientPage.getByText('Image unavailable')).toHaveCount(0);

    // Clicking opens it full size in a new tab, and opens it DURING the click: a tab
    // opened after an await has lost the click, and Safari blocks it as a pop-up.
    await clientPage.evaluate(() => {
      const w = window as unknown as { __inClick: boolean; __openedInClick: boolean | null };
      w.__inClick = false; w.__openedInClick = null;
      window.addEventListener('click', () => { w.__inClick = true; }, true);
      window.addEventListener('click', () => { w.__inClick = false; });
      const open = window.open.bind(window);
      window.open = (...a: Parameters<typeof window.open>) => { w.__openedInClick = w.__inClick; return open(...a); };
    });
    const popup = clientPage.waitForEvent('popup');
    await shown.click();
    await popup;
    expect(await clientPage.evaluate(() => (window as unknown as { __openedInClick: boolean | null }).__openedInClick)).toBe(true);
  } finally { await deleteMatter(taskId); }
});
