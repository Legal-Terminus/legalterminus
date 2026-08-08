/**
 * One-time backfill for #144 — materialise the AUTHORED final step on existing matters.
 *
 * Background. A workflow step with `type: 'final'` used to be filtered out of a
 * matter's step subcollection entirely, because `'final'` was read as "the end
 * marker". But two different things share that type:
 *
 *   - a SYNTHETIC marker (stepNumber 9999 / titled "Completed" or "Done"),
 *     auto-appended by the machine→definition converter — nobody performs it; and
 *   - an AUTHORED last step that is REAL internal work, e.g. "Final Incorporation
 *     Master Sheet update" (internal-only).
 *
 * Filtering both meant the authored one was never created, never shown to the
 * internal team, and the matter auto-completed one step early. The runtime now
 * materialises authored final steps (see `materialisableSteps`), but matters
 * created BEFORE that change are missing the step document.
 *
 * What this script does, per matter whose pinned definition has an authored final:
 *   1. creates the missing step doc, and
 *   2. corrects the denormalised `totalSteps` count.
 *
 * Status assigned to the created step:
 *   - matter ACTIVE and parked ON that step   → 'active'  (it is the live step)
 *   - matter ACTIVE and not yet there          → 'pending'
 *   - matter COMPLETED/ARCHIVED/CANCELLED      → 'completed', flagged
 *     `backfilled: true` with no completedBy. These matters were closed by the
 *     old behaviour without anyone doing the work; we do NOT reopen them —
 *     silently reviving finished matters would be far more disruptive than the
 *     missing record. The flag marks them as never actually performed, so the
 *     timeline is honest about it. Reopen individually if the work is still owed.
 *
 * Usage (from backend/):
 *   node scripts/backfill-final-step-instances.js --dry-run   # report only
 *   node scripts/backfill-final-step-instances.js             # apply
 *
 * Safe to re-run (idempotent): a matter whose final step doc already exists is
 * skipped, and `totalSteps` is only rewritten when it disagrees.
 *
 * ⚠️ NOT RUN — pre-existing matters were deliberately left untouched (#144).
 * This script is OPTIONAL and provided for the case where someone later wants
 * historical matters to carry the step record. Nothing depends on it:
 *   - an ACTIVE matter self-heals when the flow reaches its final step (the
 *     transition writes with `{ merge: true }`, creating the doc on arrival);
 *   - only the denormalised `totalSteps` count and the pre-arrival step listing
 *     stay stale until then;
 *   - matters already CLOSED by the old behaviour keep their history as-is.
 * The fix itself is forward-looking: every NEW matter materialises the authored
 * final step from creation.
 */
import { getDb } from '../src/config/firebase.js';
import { materialisableSteps, isSyntheticFinalStep } from '../../shared/workflows/definitionSchema.js';

const DRY_RUN = process.argv.includes('--dry-run');
const TERMINAL = ['completed', 'cancelled', 'archived', 'rejected'];

async function main() {
  const db = getDb();

  // Cache definitions — many matters share one.
  const defCache = new Map();
  const loadDef = async (id) => {
    if (!id) return null;
    if (defCache.has(id)) return defCache.get(id);
    const snap = await db.collection('workflowDefinitions').doc(id).get();
    const def = snap.exists ? snap.data() : null;
    defCache.set(id, def);
    return def;
  };

  const tasks = await db.collection('tasks').get();
  let created = 0;
  let countsFixed = 0;
  let skipped = 0;

  for (const doc of tasks.docs) {
    const task = doc.data();
    const def = await loadDef(task.workflowDefinitionId);
    if (!def) {
      console.log(`- ${doc.id}: definition '${task.workflowDefinitionId}' unavailable — skipped`);
      skipped += 1;
      continue;
    }

    // The authored final step (if any). Synthetic markers stay excluded.
    const authoredFinal = (def.steps ?? []).find(
      (s) => s.type === 'final' && !isSyntheticFinalStep(s),
    );
    if (!authoredFinal) { skipped += 1; continue; }

    const stepRef = doc.ref.collection('steps').doc(String(authoredFinal.stepNumber));
    const exists = (await stepRef.get()).exists;

    const expectedTotal = materialisableSteps(def.steps).length;
    const totalWrong = task.totalSteps !== expectedTotal;

    if (exists && !totalWrong) { skipped += 1; continue; }

    const isTerminal = TERMINAL.includes(task.status);
    const status = isTerminal
      ? 'completed'
      : task.currentStepNumber === authoredFinal.stepNumber ? 'active' : 'pending';

    if (!exists) {
      const now = new Date().toISOString();
      const record = {
        stepNumber: authoredFinal.stepNumber,
        title: authoredFinal.title,
        clientTitle: authoredFinal.clientTitle ?? null,
        assignedRole: authoredFinal.assignedRole ?? null,
        assignedTo: authoredFinal.defaultAssigneeUid ?? null,
        status,
        // Marks a record this script invented rather than one a person drove, so
        // a completed-by-backfill step is never mistaken for real performed work.
        backfilled: true,
        ...(status === 'completed' ? { completedAt: task.updatedAt ?? now, completedBy: null } : {}),
        ...(status === 'active' ? { startedAt: task.updatedAt ?? now } : {}),
      };
      console.log(
        `${DRY_RUN ? '[dry-run] ' : ''}+ ${doc.id} (${task.status}): create step `
        + `${authoredFinal.stepNumber} "${authoredFinal.title}" as '${status}'`,
      );
      if (!DRY_RUN) await stepRef.set(record, { merge: true });
      created += 1;
    }

    if (totalWrong) {
      console.log(
        `${DRY_RUN ? '[dry-run] ' : ''}~ ${doc.id}: totalSteps ${task.totalSteps} → ${expectedTotal}`,
      );
      if (!DRY_RUN) await doc.ref.set({ totalSteps: expectedTotal }, { merge: true });
      countsFixed += 1;
    }
  }

  console.log(
    `\n${DRY_RUN ? '[dry-run] ' : ''}Done. matters=${tasks.size} `
    + `stepsCreated=${created} totalStepsFixed=${countsFixed} skipped=${skipped}`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[backfill-final-step-instances] failed:', err);
    process.exit(1);
  });
