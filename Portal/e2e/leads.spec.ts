import { test, expect } from './fixtures';
import { createLead, deleteLead, deleteUserByEmail, getReportingGrants, setReportingGrants, withGrant, type SectionGrants } from './api';
import { env } from './helpers';

/**
 * E08-S06 — Leads: inline outcome change + convert-to-client, on a FRESH lead
 * created per run (deleted after). Convert is admin/manager only.
 * #196: the page is the Lead Dashboard, and a team member reaches it only with
 * an admin's grant — the firm's grant table is snapshotted and restored.
 */
let originalGrants: SectionGrants;
test.beforeAll(async () => { originalGrants = await getReportingGrants(); });
test.afterAll(async () => { if (originalGrants) await setReportingGrants(originalGrants); });
let leadId: string;
let leadName: string;
let leadEmail: string;
// Set when a test converts the lead into a client, so teardown removes the
// converted client too (otherwise each run orphans a client account that owns no
// matters but lingers in the users list).
let convertedClientEmail: string | null = null;

test.beforeEach(async () => {
  const l = await createLead();
  leadId = l.id; leadName = l.fullName; leadEmail = l.email; convertedClientEmail = null;
});
test.afterEach(async () => {
  await deleteLead(leadId);
  if (convertedClientEmail) await deleteUserByEmail(convertedClientEmail);
});

test('admin can change a lead outcome inline', async ({ adminPage }) => {
  await adminPage.goto('reports/leads');
  await expect(adminPage.getByRole('heading', { name: 'Lead Dashboard' })).toBeVisible();
  await adminPage.getByPlaceholder(/search by name/i).fill(leadName);
  const outcomeSelect = adminPage.getByLabel(`Outcome for ${leadName}`);
  await outcomeSelect.selectOption('converted');
  await expect(outcomeSelect).toHaveValue('converted');
});

test('admin can convert an unregistered lead to a client', async ({ adminPage }) => {
  await adminPage.goto('reports/leads');
  await adminPage.getByPlaceholder(/search by name/i).fill(leadName);

  const convert = adminPage.getByRole('button', { name: /create client account/i }).first();
  await expect(convert).toBeVisible();
  await convert.click();
  await adminPage.getByRole('button', { name: 'Convert', exact: true }).click();
  await expect(adminPage.getByText(/converted to (a )?(new )?client|linked to existing client/i)).toBeVisible();
  // Convert links the new client by the lead's email — mark it for teardown cleanup.
  convertedClientEmail = leadEmail;
});

test('team member with EDIT access still has NO convert action', async ({ teamPage }) => {
  await setReportingGrants(withGrant(originalGrants, env('E2E_TEAM_UID'), { leads: 'edit' }));
  await teamPage.goto('reports/leads');
  await expect(teamPage.getByRole('heading', { name: 'Lead Dashboard' })).toBeVisible();
  await teamPage.getByPlaceholder(/search by name/i).fill(leadName);
  await expect(teamPage.getByText(leadName).first()).toBeVisible();
  await expect(teamPage.getByRole('button', { name: /create client account/i })).toHaveCount(0);
});
