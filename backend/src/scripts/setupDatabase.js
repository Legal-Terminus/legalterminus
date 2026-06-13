/**
 * setupDatabase.js — one command to provision a fresh (or refresh an existing)
 * environment's Firestore data + indexes.
 *
 * Runs, in order:
 *   1. seedServiceConfig.js        → serviceCategories (service catalog)
 *   2. seedWorkflowDefinitions.js  → workflowDefinitions (data-driven workflows)
 *   3. firestore index deploy      → composite indexes (firestore.indexes.json)
 *
 * All seeds are IDEMPOTENT (merge upserts) — safe to re-run on a populated DB.
 *
 * Usage:
 *   node backend/src/scripts/setupDatabase.js              # seeds + index deploy
 *   node backend/src/scripts/setupDatabase.js --seeds-only # skip the firebase deploy
 *
 * Notes:
 * - Seeds use the backend's Firebase Admin creds (.env*), so they target whatever
 *   project those creds point at.
 * - The index deploy uses the Firebase CLI, which needs interactive auth and a
 *   selected project (`firebase login`, `firebase use <project>`). If the CLI is
 *   missing/unauthenticated it is skipped with a clear message rather than failing
 *   the whole setup. Use --seeds-only in CI/non-interactive contexts.
 */

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../../');

const seedsOnly = process.argv.includes('--seeds-only');

function run(label, cmd, args, opts = {}) {
  process.stdout.write(`\n▶ ${label}\n`);
  const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  if (r.status !== 0) {
    throw new Error(`${label} failed (exit ${r.status ?? 'signal'})`);
  }
}

function tryRun(label, cmd, args, opts = {}) {
  process.stdout.write(`\n▶ ${label}\n`);
  const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  if (r.error || r.status !== 0) {
    process.stdout.write(`⚠ Skipped: ${label} — ${r.error?.message ?? `exit ${r.status}`}\n`);
    return false;
  }
  return true;
}

async function main() {
  // ── 1 & 2: data seeds (idempotent upserts) ──
  run('Seed service catalog', 'node', [path.join(__dirname, 'seedServiceConfig.js')]);
  run('Seed workflow definitions', 'node', [path.join(__dirname, 'seedWorkflowDefinitions.js')]);

  // ── 3: Firestore composite indexes ──
  if (seedsOnly) {
    process.stdout.write('\n⏭  --seeds-only: skipping Firestore index deploy.\n');
  } else {
    tryRun(
      'Deploy Firestore indexes',
      'firebase',
      ['deploy', '--only', 'firestore:indexes', '--non-interactive'],
      { cwd: repoRoot },
    );
  }

  process.stdout.write('\n✅ Database setup complete.\n');
}

main().catch((err) => {
  process.stderr.write(`\n❌ Database setup failed: ${err.message}\n`);
  process.exit(1);
});
