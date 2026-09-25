/**
 * Story 34.1 — client tags and the derived entity profile.
 *
 * Story 34.2 will make workflow steps conditional on these values, so a
 * derivation that disagrees with what the UI shows becomes a step that skips
 * for a client the screen says is GST-registered — a bug nobody can reproduce.
 * These tests pin the derivation and the tag normalisation that rides on it.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  deriveProfile, normaliseTag, normaliseTags, hasTag, mergeManagedTags,
  planTagRename, planTagDelete, ENTITY_TYPES, ENTITY_TYPE_LABELS,
  MAX_TAGS_PER_CLIENT, MAX_TAG_LENGTH,
} from '../services/clientProfile.service.js';

test('tags normalise so "GST" and " gst " are ONE tag', () => {
  // Without this a roster filter silently misses half the clients a firm
  // believes it tagged, and the managed list fills with near-duplicates.
  assert.equal(normaliseTag('GST'), 'gst');
  assert.equal(normaliseTag('  Audit   Risk  '), 'audit risk');
  assert.deepEqual(normaliseTags(['GST', 'gst', ' Gst ']), ['gst']);
});

test('normalisation rejects emptiness and caps length', () => {
  assert.equal(normaliseTag('   '), null);
  assert.equal(normaliseTag(''), null);
  assert.equal(normaliseTag(null), null);
  assert.equal(normaliseTag('x'.repeat(500)).length, MAX_TAG_LENGTH);
});

test('a client cannot accumulate unbounded tags', () => {
  const many = Array.from({ length: 200 }, (_, i) => `tag-${i}`);
  assert.equal(normaliseTags(many).length, MAX_TAGS_PER_CLIENT);
});

test('hasGst and hasPan key off real content, not the field existing', () => {
  // An empty string is a field a form left behind, not a GST registration.
  assert.equal(deriveProfile({ gstNumber: '29ABCDE1234F1Z5' }).hasGst, true);
  assert.equal(deriveProfile({ gstNumber: '   ' }).hasGst, false);
  assert.equal(deriveProfile({ gstNumber: '' }).hasGst, false);
  assert.equal(deriveProfile({}).hasGst, false);
  assert.equal(deriveProfile({ panNumber: 'ABCDE1234F' }).hasPan, true);
});

test('an unknown entityType is null rather than passed through', () => {
  // 34.2 will branch on this; an arbitrary string would make a condition
  // silently never match.
  assert.equal(deriveProfile({ entityType: 'llp' }).entityType, 'llp');
  assert.equal(deriveProfile({ entityType: 'not_a_type' }).entityType, null);
  assert.equal(deriveProfile({}).entityType, null);
});

test('every entity type has a label for the form and the filters', () => {
  for (const t of ENTITY_TYPES) {
    assert.ok(ENTITY_TYPE_LABELS[t]?.length, `${t} needs a label`);
  }
  assert.equal(Object.keys(ENTITY_TYPE_LABELS).length, ENTITY_TYPES.length,
    'no orphan labels');
});

test('hasTag is case-insensitive on both sides', () => {
  const client = { tags: ['Audit Risk', 'GST'] };
  assert.equal(hasTag(client, 'gst'), true);
  assert.equal(hasTag(client, 'GST'), true);
  assert.equal(hasTag(client, 'audit risk'), true);
  assert.equal(hasTag(client, 'nope'), false);
  assert.equal(hasTag(client, ''), false);
});

test('the managed list never hides a tag that is actually in use', () => {
  // Otherwise a roster filter offers fewer options than the data contains, and
  // clients become unreachable through the UI.
  const merged = mergeManagedTags(['gst', 'retainer'], ['audit risk', 'GST']);
  assert.deepEqual(merged, ['audit risk', 'gst', 'retainer']);
});

test('renaming a tag MERGES rather than duplicating when the target exists', () => {
  const clients = [
    { id: 'a', tags: ['gst', 'retainer'] },
    { id: 'b', tags: ['gst'] },
    { id: 'c', tags: ['other'] },
  ];
  const plan = planTagRename(clients, 'gst', 'retainer');
  // 'a' already had 'retainer', so it ends with ONE, not two.
  assert.deepEqual(plan.find((p) => p.id === 'a').tags, ['retainer']);
  assert.deepEqual(plan.find((p) => p.id === 'b').tags, ['retainer']);
  assert.equal(plan.find((p) => p.id === 'c'), undefined, 'untouched clients are not rewritten');
});

test('a rename to the same tag, or from nothing, is a no-op', () => {
  const clients = [{ id: 'a', tags: ['gst'] }];
  assert.deepEqual(planTagRename(clients, 'gst', 'GST'), [], 'case-only rename changes nothing');
  assert.deepEqual(planTagRename(clients, '', 'x'), []);
  assert.deepEqual(planTagRename(clients, 'x', ''), []);
});

test('deleting a tag DETACHES it and leaves the rest alone (AC2)', () => {
  const clients = [
    { id: 'a', tags: ['gst', 'retainer'] },
    { id: 'b', tags: ['retainer'] },
  ];
  const plan = planTagDelete(clients, 'gst');
  assert.equal(plan.length, 1, 'only the client that had it is written');
  assert.deepEqual(plan[0], { id: 'a', tags: ['retainer'] });
});

test('isComplete reports filing-readiness without enforcing it', () => {
  // Reported, never blocking: a half-filled client is still a client.
  assert.equal(deriveProfile({ panNumber: 'ABCDE1234F', entityType: 'llp' }).isComplete, true);
  assert.equal(deriveProfile({ panNumber: 'ABCDE1234F' }).isComplete, false, 'needs an entity type');
  assert.equal(deriveProfile({ entityType: 'llp' }).isComplete, false, 'needs a PAN');
});

test('the Portal entity-type list matches the backend enum exactly', async () => {
  // A form offering a value the schema rejects cannot be submitted, and a
  // schema value missing from the form is unreachable. Both are silent until a
  // user hits them, so the two lists are compared directly.
  const { readFileSync } = await import('node:fs');
  const path = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const here = path.dirname(fileURLToPath(import.meta.url));
  const src = readFileSync(path.join(here, '../../../Portal/src/lib/entityTypes.ts'), 'utf8');

  const uiValues = [...src.matchAll(/value: '([a-z_]+)'/g)].map((m) => m[1]);
  assert.deepEqual([...uiValues].sort(), [...ENTITY_TYPES].sort(),
    'Portal/src/lib/entityTypes.ts and ENTITY_TYPES must agree');

  // Labels too, so the form and any backend-rendered copy read the same.
  for (const v of uiValues) {
    const label = new RegExp(`value: '${v}', label: '([^']+)'`).exec(src)?.[1];
    assert.equal(label, ENTITY_TYPE_LABELS[v], `${v} label must match`);
  }
});
