/**
 * seedWorkflowDefinitions.js
 *
 * Seeds the `workflowDefinitions` Firestore collection by converting the legacy
 * hardcoded XState machine(s) into data definitions (see
 * shared/workflows/convertMachineToDefinition.js). After this runs, workflows are
 * DATA — editable/versionable without code, and new flows are documents.
 *
 * Structure:
 *   workflowDefinitions/{definitionId}
 *     - id           {string}   e.g. 'company-incorporation'
 *     - name         {string}
 *     - version      {number}   bumped on every published edit (immutable per task)
 *     - initialStep  {number}
 *     - steps        {array}    WorkflowStepDef[] (see definitionSchema.js)
 *     - serviceKeys  {array}    catalog service keys this workflow serves
 *     - updatedAt    {string}
 *
 * Run: node backend/src/scripts/seedWorkflowDefinitions.js
 */

import { getDb } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { companyIncorporationDefinition } from '../../../shared/workflows/companyIncorporation.definition.js';
import { validateDefinition } from '../../../shared/workflows/definitionSchema.js';

// Hand-authored data definitions to seed. Company Incorporation reflects the
// 44-step business sheet incl. per-step client visibility (clientVisible). Other
// flows are authored from the UI (E10-S01) once needed.
const SEEDS = [companyIncorporationDefinition];

async function seed() {
  const db = getDb();
  const batch = db.batch();

  for (const def of SEEDS) {
    const errors = validateDefinition(def);
    if (errors.length) {
      throw new Error(`Definition '${def.id}' invalid:\n - ${errors.join('\n - ')}`);
    }
    const ref = db.collection('workflowDefinitions').doc(def.id);
    batch.set(
      ref,
      { ...def, updatedAt: new Date().toISOString() },
      { merge: true }
    );
    const clientVisible = def.steps.filter((s) => s.clientVisible).length;
    logger.info(`Prepared workflow definition '${def.id}' (${def.steps.length} steps, ${clientVisible} client-visible).`);
  }

  await batch.commit();
  logger.info(`✅ Seeded ${SEEDS.length} workflow definition(s) into Firestore workflowDefinitions.`);
}

seed().catch((err) => {
  logger.error({ err }, '❌ Workflow definition seed failed:');
  process.exit(1);
});
