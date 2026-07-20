import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter } from './api';

/**
 * #122 — rich text in comments / discussion messages.
 * The security-critical assertions are the XSS ones: content is sanitised on the
 * SERVER on write, so posting malicious HTML directly to the API (bypassing our
 * editor entirely) must still be neutralised.
 */

test('#122: formatting and tables survive a round-trip', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    const html = '<p><strong>Bold</strong> and <em>italic</em></p>'
      + '<ul><li>one</li><li>two</li></ul>'
      + '<table><tbody><tr><th>Name</th><th>Value</th></tr><tr><td>A</td><td>1</td></tr></tbody></table>';
    const res = await admin.post(`/api/tasks/${taskId}/messages`, { data: { body: html, clientVisible: true } });
    expect(res.ok()).toBeTruthy();

    const seen = await (await admin.get(`/api/tasks/${taskId}/messages`)).json();
    const stored = seen.data[0].body as string;
    // The structure the team pastes from Word/Excel is preserved.
    expect(stored).toContain('<strong>Bold</strong>');
    expect(stored).toContain('<li>one</li>');
    expect(stored).toContain('<table>');
    expect(stored).toContain('<td>A</td>');
    await admin.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#122 SECURITY: script tags and event handlers are stripped server-side', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    const malicious = '<p>hello</p><script>alert("xss")</script>'
      + '<img src=x onerror="alert(1)">'
      + '<a href="javascript:alert(1)">click</a>'
      + '<iframe src="//evil.com"></iframe>';
    const res = await admin.post(`/api/tasks/${taskId}/messages`, { data: { body: malicious, clientVisible: true } });
    expect(res.ok()).toBeTruthy();

    const seen = await (await admin.get(`/api/tasks/${taskId}/messages`)).json();
    const stored = (seen.data[0].body as string).toLowerCase();

    // Nothing executable survives.
    expect(stored).not.toContain('<script');
    expect(stored).not.toContain('onerror');
    expect(stored).not.toContain('javascript:');
    expect(stored).not.toContain('<iframe');
    // The legitimate part is kept.
    expect(stored).toContain('hello');
    await admin.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#122 SECURITY: a script-only message is rejected as empty', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    const res = await admin.post(`/api/tasks/${taskId}/messages`, {
      data: { body: '<script>alert(1)</script>' },
    });
    // Nothing remains once stripped → treated as an empty message.
    expect(res.status()).toBe(400);
    await admin.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#122: step comments are sanitised too', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    await admin.post(`/api/tasks/${taskId}/transition`, {
      data: { event: { type: 'COMPLETE_STEP', remark: '<b>done</b><script>alert(1)</script>' } },
    });
    const events = await (await admin.get(`/api/tasks/${taskId}/events`)).json();
    const withComment = (events.data ?? []).find((e: { comment: string | null }) => e.comment);
    expect(withComment).toBeTruthy();
    expect(withComment.comment).toContain('<b>done</b>');
    expect(String(withComment.comment).toLowerCase()).not.toContain('<script');
    await admin.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#122: the discussion composer offers formatting controls', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Discussion', exact: true }).click();
    await expect(adminPage.getByRole('button', { name: 'Bold' })).toBeVisible();
    await expect(adminPage.getByRole('button', { name: 'Insert table' })).toBeVisible();

    // Type + send through the rich editor.
    const box = adminPage.getByRole('textbox', { name: 'Message' });
    await box.click();
    await box.pressSequentially('Hello rich world');
    await adminPage.getByRole('button', { name: /^Send$/ }).click();
    await expect(adminPage.getByText('Hello rich world')).toBeVisible();
  } finally { await deleteMatter(taskId); }
});
