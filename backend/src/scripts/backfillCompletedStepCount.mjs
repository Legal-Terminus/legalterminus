/**
 * #189 — backfill `completedStepCount` (and correct `totalSteps`) on every matter.
 *
 * Progress used to be derived from `currentStepNumber`, which is an identity
 * number and not a flow position, so the list reported nonsense like "20/20" with
 * 9 steps done. The count is now denormalised onto the task doc and refreshed on
 * every step change; this one-off pass seeds it for matters created before that.
 *
 *   node src/scripts/backfillCompletedStepCount.mjs --dry-run
 *   node src/scripts/backfillCompletedStepCount.mjs
 */
import 'dotenv/config';
import { db } from '../config/firebase.js';

const DRY = process.argv.includes('--dry-run');
const DONE = new Set(['completed', 'skipped']);

const tasks = await db.collection('tasks').get();
let changed = 0;
let same = 0;

for (const doc of tasks.docs) {
  const t = doc.data();
  const steps = await doc.ref.collection('steps').get();
  // A matter with no materialised steps (see #94) has nothing to count; leave it
  // alone so the UI's "unknown" state shows rather than a misleading 0.
  if (steps.empty) { same += 1; continue; }

  const completedStepCount = steps.docs.filter((s) => DONE.has(s.data().status)).length;
  const totalSteps = steps.size;

  if (t.completedStepCount === completedStepCount && t.totalSteps === totalSteps) {
    same += 1;
    continue;
  }
  changed += 1;
  const was = t.completedStepCount === undefined ? '(unset)' : t.completedStepCount;
  console.log(`${DRY ? '[dry] ' : ''}${doc.id}  "${t.serviceName ?? t.workflowType}"  `
    + `completed ${was} -> ${completedStepCount}, total ${t.totalSteps ?? '(unset)'} -> ${totalSteps}`);
  if (!DRY) await doc.ref.set({ completedStepCount, totalSteps }, { merge: true });
}

console.log(`\n${DRY ? 'WOULD UPDATE' : 'updated'}: ${changed}   unchanged/skipped: ${same}   total: ${tasks.size}`);
process.exit(0);
