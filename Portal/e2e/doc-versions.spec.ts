import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter } from './api';

/**
 * #131 (Option 2) — during a matter, EVERY document version stays visible in the
 * main list; re-uploading no longer archives the prior (already-approved) version.
 * Superseded versions collapse into Version History only when the matter completes
 * (finalizeMatterDocuments — verified by a direct unit check; driving the
 * incorporation workflow to full completion via COMPLETE_STEP alone isn't possible
 * in e2e).
 *
 * API-level so it doesn't depend on cross-page UI refetch timing.
 */

// Upload → confirm → submit a document via the API; returns its docId.
async function uploadAndSubmit(api: import('@playwright/test').APIRequestContext, taskId: string, fileName: string) {
  const su = await api.post(`/api/tasks/${taskId}/documents/signed-upload-url`, {
    data: { fileName, contentType: 'application/pdf', docType: 'PAN', stepNumber: 4 },
  });
  const { docId, signedUrl } = await su.json();
  // PUT the bytes straight to the signed URL (same as the browser does).
  await api.put(signedUrl, { headers: { 'Content-Type': 'application/pdf' }, data: Buffer.from('%PDF-1.4 test') });
  await api.post(`/api/tasks/${taskId}/documents/${docId}/confirm`, { data: { uploaded: true } });
  await api.post(`/api/tasks/${taskId}/documents/submit`, { data: {} });
  return docId as string;
}

test('#131: an approved version and a newer version BOTH stay active (not archived)', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');

    // v1: upload, submit, approve.
    const v1 = await uploadAndSubmit(admin, taskId, `v1-${Date.now()}.pdf`);
    expect((await admin.post(`/api/tasks/${taskId}/documents/${v1}/review`, { data: { action: 'approve' } })).ok()).toBeTruthy();

    // v2: a newer version for the SAME scope, submitted.
    const v2 = await uploadAndSubmit(admin, taskId, `v2-${Date.now()}.pdf`);

    // Both remain visible in the main list — the approved v1 was NOT archived.
    const docs = (await (await admin.get(`/api/tasks/${taskId}/documents`)).json()).data as
      Array<{ docId: string; status: string }>;
    const byId = new Map(docs.map((d) => [d.docId, d.status]));
    expect(byId.get(v1)).toBe('approved');       // still approved, not archived
    expect(byId.get(v2)).toBe('pending_review'); // the new version
    expect(docs.filter((d) => d.status === 'archived')).toHaveLength(0); // nothing in history yet

    await admin.dispose();
  } finally { await deleteMatter(taskId); }
});
