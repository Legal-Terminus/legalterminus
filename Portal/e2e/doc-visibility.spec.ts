import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter } from './api';
import type { APIRequestContext } from '@playwright/test';

/**
 * #112 (client can submit their own uploads) + #125 (internal team controls which
 * documents the client can see).
 *
 * Rules under test:
 *  • A CLIENT's own upload is visible to them at every stage (draft included) and
 *    they can SUBMIT it themselves — no staff action required (#112).
 *  • A STAFF upload is INTERNAL-ONLY by default; the client can't see it until
 *    staff shares it via the visibility toggle (#125).
 *  • Staff can hide a client-visible doc again ("Make internal"); a client can
 *    never toggle visibility.
 *
 * API-level so it doesn't depend on cross-page UI refetch timing.
 */

// Upload + confirm a document (leaves it a DRAFT). Returns docId.
async function uploadDraft(api: APIRequestContext, taskId: string, fileName: string) {
  const su = await api.post(`/api/tasks/${taskId}/documents/signed-upload-url`, {
    data: { fileName, contentType: 'application/pdf', docType: 'PAN', stepNumber: 4 },
  });
  expect(su.ok()).toBeTruthy();
  const { docId, signedUrl } = await su.json();
  await api.put(signedUrl, { headers: { 'Content-Type': 'application/pdf' }, data: Buffer.from('%PDF-1.4 test') });
  await api.post(`/api/tasks/${taskId}/documents/${docId}/confirm`, { data: { uploaded: true } });
  return docId as string;
}

const listAs = async (api: APIRequestContext, taskId: string) =>
  ((await (await api.get(`/api/tasks/${taskId}/documents`)).json()).data ?? []) as
    Array<{ docId: string; status: string; clientVisible?: boolean; uploaderRole?: string }>;

test('#112: a client uploads, SEES their own draft, and submits it themselves', async () => {
  const taskId = await createMatter();
  try {
    const client = await apiAs('client');

    const docId = await uploadDraft(client, taskId, `client-${Date.now()}.pdf`);

    // The client can see their OWN draft (previously hidden → no Submit button).
    let mine = await listAs(client, taskId);
    expect(mine.find((d) => d.docId === docId)?.status).toBe('draft');

    // The client submits it themselves — no staff action.
    const sub = await client.post(`/api/tasks/${taskId}/documents/submit`, { data: {} });
    expect(sub.ok()).toBeTruthy();

    // Now it's pending_review and visible to the internal team.
    mine = await listAs(client, taskId);
    expect(mine.find((d) => d.docId === docId)?.status).toBe('pending_review');

    const admin = await apiAs('admin');
    const staffSees = await listAs(admin, taskId);
    expect(staffSees.find((d) => d.docId === docId)?.status).toBe('pending_review');

    await client.dispose(); await admin.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#125: a STAFF upload is internal-only until shared; the client sees it only after', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    const client = await apiAs('client');

    // Staff uploads and submits a working document.
    const docId = await uploadDraft(admin, taskId, `staff-${Date.now()}.pdf`);
    await admin.post(`/api/tasks/${taskId}/documents/submit`, { data: {} });

    // Default: staff upload is internal-only → client does NOT see it.
    let clientSees = await listAs(client, taskId);
    expect(clientSees.find((d) => d.docId === docId)).toBeUndefined();
    // Staff sees it with clientVisible=false.
    const staffDoc = (await listAs(admin, taskId)).find((d) => d.docId === docId);
    expect(staffDoc?.clientVisible).toBe(false);

    // Staff SHARES it.
    const share = await admin.patch(`/api/tasks/${taskId}/documents/${docId}/visibility`, { data: { clientVisible: true } });
    expect(share.ok()).toBeTruthy();

    // Now the client sees it.
    clientSees = await listAs(client, taskId);
    expect(clientSees.find((d) => d.docId === docId)?.status).toBe('pending_review');

    // Staff hides it again → client loses sight of it.
    await admin.patch(`/api/tasks/${taskId}/documents/${docId}/visibility`, { data: { clientVisible: false } });
    clientSees = await listAs(client, taskId);
    expect(clientSees.find((d) => d.docId === docId)).toBeUndefined();

    await admin.dispose(); await client.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#125: a client CANNOT change document visibility (staff-only)', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    const client = await apiAs('client');

    // Client uploads + submits their own doc (visible to them by ownership).
    const docId = await uploadDraft(client, taskId, `client-${Date.now()}.pdf`);
    await client.post(`/api/tasks/${taskId}/documents/submit`, { data: {} });

    // The client may not toggle sharing — the endpoint is staff-only (403).
    const res = await client.patch(`/api/tasks/${taskId}/documents/${docId}/visibility`, { data: { clientVisible: false } });
    expect(res.status()).toBe(403);

    await admin.dispose(); await client.dispose();
  } finally { await deleteMatter(taskId); }
});
