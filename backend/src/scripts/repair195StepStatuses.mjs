/**
 * #195 — repair matters whose steps were marked completed at CREATION.
 *
 * `createTask` used to mark every step with a lower NUMBER than the resolved
 * first step as completed, which on a workflow whose initialStep is not its
 * lowest number wrongly completed real future work (11 steps on Trademark,
 * "Payment" among them).
 *
 * This resets those steps to `pending` and recomputes `completedStepCount`.
 *
 * SAFETY — it only touches a step when ALL of these hold:
 *   • the step is authored AFTER the matter's resolved first step, and
 *   • its completedAt equals the matter's creation instant (to the millisecond),
 *     so it was batch-stamped rather than completed by a person, and
 *   • it has no completedBy, so nobody is recorded as having done it.
 * A step someone genuinely completed is never altered.
 *
 *   node src/scripts/repair195StepStatuses.mjs            # dry run
 *   node src/scripts/repair195StepStatuses.mjs --write     # apply
 */
import { db } from '../config/firebase.js';
import { getCompiledById } from '../services/workflowDefinitions.service.js';

const WRITE = process.argv.includes('--write');

const iso = (v) => (v && typeof v.toDate === 'function' ? v.toDate().toISOString() : String(v ?? ''));

async function main() {
  const tasks = await db.collection('tasks').get();
  let touchedMatters = 0;
  let touchedSteps = 0;

  for (const taskDoc of tasks.docs) {
    const task = taskDoc.data();
    const defId = task.workflowDefinitionId;
    if (!defId) continue;

    let steps;
    try {
      const compiled = await getCompiledById(defId);
      steps = compiled?.definition?.steps;
    } catch { continue; }
    if (!Array.isArray(steps) || !steps.length) continue;

    const order = steps.map((s) => s.stepNumber);
    const firstPos = order.indexOf(task.currentStepNumber);
    // Only definitions where a LOWER-numbered step is authored later can be hit.
    const suspectNumbers = order.filter((n, i) =>
      typeof n === 'number' && order.some((m, j) => j < i && typeof m === 'number' && m > n));
    if (!suspectNumbers.length) continue;

    const created = iso(task.createdAt);
    const stepDocs = await taskDoc.ref.collection('steps').get();
    const fixes = [];

    for (const sd of stepDocs.docs) {
      const s = sd.data();
      if (s.status !== 'completed') continue;
      const pos = order.indexOf(s.stepNumber);
      if (pos < 0) continue;
      // Authored at or after the matter's own resolved position → not behind it.
      if (firstPos >= 0 && pos < firstPos) continue;
      // Batch-stamped at creation, and nobody is recorded as having done it.
      const at = iso(s.completedAt);
      if (!at || !created || at.slice(0, 23) !== created.slice(0, 23)) continue;
      if (s.completedBy) continue;
      fixes.push({ ref: sd.ref, stepNumber: s.stepNumber, title: s.title });
    }

    if (!fixes.length) continue;
    touchedMatters += 1;
    touchedSteps += fixes.length;
    console.log(`\n${taskDoc.id}  ${task.serviceName ?? task.workflowType ?? ''}`);
    console.log(`  created ${created} · on step ${task.currentStepNumber} · resetting ${fixes.length}:`);
    for (const f of fixes) console.log(`    step ${f.stepNumber}  ${f.title ?? ''}`);

    if (WRITE) {
      const batch = db.batch();
      for (const f of fixes) {
        batch.set(f.ref, { status: 'pending', completedAt: null }, { merge: true });
      }
      await batch.commit();
      // Recompute from the steps themselves so the counter cannot drift (#189).
      const after = await taskDoc.ref.collection('steps').get();
      const completedStepCount = after.docs.filter((d) => {
        const st = d.data().status;
        return st === 'completed' || st === 'skipped';
      }).length;
      await taskDoc.ref.set({ completedStepCount, totalSteps: after.size }, { merge: true });
      console.log(`  ✓ written · completedStepCount now ${completedStepCount}/${after.size}`);
    }
  }

  console.log(`\n${WRITE ? 'REPAIRED' : 'DRY RUN'}: ${touchedSteps} steps across ${touchedMatters} matters.`);
  if (!WRITE && touchedSteps) console.log('Re-run with --write to apply.');
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
