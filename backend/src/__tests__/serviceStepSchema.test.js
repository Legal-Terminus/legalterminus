/**
 * The Service editor offers step conditions, forms and actions; saving one
 * used to strip them silently (the schema did not list them). 2026-11-05.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createDefinitionSchema, updateDefinitionSchema } from '../schemas/workflow.schema.js';
import { validateDefinition } from '../../../shared/workflows/definitionSchema.js';

const extras = {
  condition: { field: 'hasGst', op: 'is_true' },
  form: { title: 'Your details', fields: [{ key: 'turnover', label: 'Annual turnover', type: 'number', required: true }] },
  actions: [{ type: 'notify', on: 'entry', to: 'client', title: 'Your step is ready' }],
};
const def = (step) => ({
  id: 'svc', name: 'Service', initialStep: 1,
  steps: [
    { stepNumber: 1, title: 'Collect details', type: 'step', transitions: [{ event: 'COMPLETE_STEP', to: 2 }], ...step },
    { stepNumber: 2, title: 'Done', type: 'final' },
  ],
});

test('a step keeps its condition, form and actions when the Service is saved', () => {
  const created = createDefinitionSchema.parse(def(extras));
  for (const k of Object.keys(extras)) assert.deepEqual(created.steps[0][k], extras[k], k);
  const updated = updateDefinitionSchema.parse({ ...def(extras), id: undefined });
  for (const k of Object.keys(extras)) assert.deepEqual(updated.steps[0][k], extras[k], k);
});

test('malformed ones are refused, not dropped', () => {
  // Unknown action type, unknown form field type, unknown condition field.
  assert.equal(createDefinitionSchema.safeParse(def({ actions: [{ type: 'launch_rocket' }] })).success, false);
  assert.equal(createDefinitionSchema.safeParse(def({ form: { fields: [{ key: 'x', label: 'X', type: 'photo' }] } })).success, false);
  assert.equal(createDefinitionSchema.safeParse(def({ condition: { field: 'shoeSize', op: 'is_true' } })).success, false);
});

test('a condition whose operator cannot apply to its field is refused at save', () => {
  const parsed = createDefinitionSchema.parse(def({ condition: { field: 'hasGst', op: 'equals', value: 'yes' } }));
  const result = validateDefinition(parsed);
  const errors = Array.isArray(result) ? result : (result?.errors ?? []);
  assert.ok(errors.some((e) => /does not apply to Client has GST/.test(e)), JSON.stringify(result));
});
