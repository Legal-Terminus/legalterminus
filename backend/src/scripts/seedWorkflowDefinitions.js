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
import { companyIncorporationMachine } from '../../../shared/workflows/companyIncorporation.machine.js';
import { convertMachineToDefinition } from '../../../shared/workflows/convertMachineToDefinition.js';
import { validateDefinition } from '../../../shared/workflows/definitionSchema.js';

// Which legacy machines to seed, and the catalog service keys each one serves.
const SEEDS = [
  {
    machine: companyIncorporationMachine,
    id: 'company-incorporation',
    name: 'Company Incorporation',
    serviceKeys: ['incorporation'],
  },
];

async function seed() {
  const db = getDb();
  const batch = db.batch();

  for (const s of SEEDS) {
    const def = convertMachineToDefinition(s.machine, { id: s.id, name: s.name, version: 1 });
    const errors = validateDefinition(def);
    if (errors.length) {
      throw new Error(`Definition '${s.id}' invalid:\n - ${errors.join('\n - ')}`);
    }
    const ref = db.collection('workflowDefinitions').doc(def.id);
    batch.set(
      ref,
      { ...def, serviceKeys: s.serviceKeys, updatedAt: new Date().toISOString() },
      { merge: true }
    );
    logger.info(`Prepared workflow definition '${def.id}' (${def.steps.length} steps).`);
  }

  await batch.commit();
  logger.info(`✅ Seeded ${SEEDS.length} workflow definition(s) into Firestore workflowDefinitions.`);
}

seed().catch((err) => {
  logger.error({ err }, '❌ Workflow definition seed failed:');
  process.exit(1);
});
