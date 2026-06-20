import { test, expect } from './fixtures';
import { createLead, deleteLead } from './api';

/**
 * E08-S06 — Contact Leads: inline status change + convert-to-client, on a FRESH
 * lead created per run (deleted after). Convert is admin/manager only.
 */
let leadId: string;
let leadName: string;

test.beforeEach(async () => { const l = await createLead(); leadId = l.id; leadName = l.fullName; });
test.afterEach(async () => { await deleteLead(leadId); });

test('admin can change a lead status inline', async ({ adminPage }) => {
  await adminPage.goto('reports/leads');
  await expect(adminPage.getByRole('heading', { name: 'Contact Leads' })).toBeVisible();
  await adminPage.getByPlaceholder(/search by name/i).fill(leadName);
  const statusSelect = adminPage.locator('select').first();
  await statusSelect.selectOption('contacted');
  await expect(statusSelect).toHaveValue('contacted');
});

test('admin can convert an unregistered lead to a client', async ({ adminPage }) => {
  await adminPage.goto('reports/leads');
  await adminPage.getByPlaceholder(/search by name/i).fill(leadName);

  const convert = adminPage.getByRole('button', { name: /convert to client/i }).first();
  await expect(convert).toBeVisible();
  await convert.click();
  await adminPage.getByRole('button', { name: 'Convert', exact: true }).click();
  await expect(adminPage.getByText(/converted to (a )?(new )?client|linked to existing client/i)).toBeVisible();
});

test('team member can view leads but has NO convert action', async ({ teamPage }) => {
  await teamPage.goto('reports/leads');
  await expect(teamPage.getByRole('heading', { name: 'Contact Leads' })).toBeVisible();
  await teamPage.getByPlaceholder(/search by name/i).fill(leadName);
  await expect(teamPage.getByRole('button', { name: /convert to client/i })).toHaveCount(0);
});
