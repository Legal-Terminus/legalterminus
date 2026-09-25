/**
 * Story 34.3 — form steps.
 *
 * The portal is a browser: a determined client can post anything. So these
 * tests are mostly about what the server REFUSES — unasked keys, wrong types,
 * profile fields a firm never exposed — and about a form that could not be
 * filled in being refused when the workflow is saved.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateForm, validateAnswers, profileUpdatesFrom, formForClient, describeForm,
  FIELD_TYPES, MAPPABLE_PROFILE_FIELDS, MAX_FIELDS_PER_FORM,
} from '../../../shared/workflows/forms.js';

const form = {
  title: 'Business details',
  fields: [
    { key: 'gstin', label: 'GSTIN', type: 'text', required: true, mapsTo: 'gstNumber' },
    { key: 'turnover', label: 'Annual turnover', type: 'number' },
    { key: 'incorporated', label: 'Date of incorporation', type: 'date' },
    { key: 'entity', label: 'Entity type', type: 'select', options: ['llp', 'pvt_ltd'], mapsTo: 'entityType' },
    { key: 'exporter', label: 'Do you export?', type: 'yesno' },
    { key: 'notes', label: 'Anything else', type: 'longtext', internalNote: 'staff only' },
  ],
};

test('a form with no fields is refused at SAVE time', () => {
  // Otherwise a client opens the step and finds a blank page.
  assert.deepEqual(validateForm({ fields: [] }), ['a form step must have at least one field']);
  assert.deepEqual(validateForm(null), [], 'a step with no form at all is fine');
  assert.deepEqual(validateForm(form), []);
});

test('duplicate field keys are refused — one answer would overwrite another', () => {
  const dup = { fields: [
    { key: 'a', label: 'A', type: 'text' },
    { key: 'a', label: 'Also A', type: 'text' },
  ] };
  assert.ok(validateForm(dup).some((e) => /duplicate field key/.test(e)));
});

test('a dropdown with no options cannot be answered, so it is refused', () => {
  const bad = { fields: [{ key: 'x', label: 'Pick', type: 'select', options: [] }] };
  assert.ok(validateForm(bad).some((e) => /at least one option/.test(e)));
  const blank = { fields: [{ key: 'x', label: 'Pick', type: 'select', options: ['  ', ''] }] };
  assert.ok(validateForm(blank).some((e) => /at least one option/.test(e)));
});

test('a mapping to a field the firm never exposed is refused', () => {
  // A form must not be a side door into arbitrary profile fields.
  const bad = { fields: [{ key: 'x', label: 'X', type: 'text', mapsTo: 'role' }] };
  assert.ok(validateForm(bad).some((e) => /not a mappable client field/.test(e)));
  for (const f of MAPPABLE_PROFILE_FIELDS) {
    assert.deepEqual(validateForm({ fields: [{ key: 'k', label: 'L', type: 'text', mapsTo: f }] }), []);
  }
});

test('bad keys, missing labels and unknown types are all caught', () => {
  const bad = { fields: [
    { key: 'has space', label: 'X', type: 'text' },
    { key: 'ok', label: '', type: 'text' },
    { key: 'ok2', label: 'Y', type: 'wat' },
  ] };
  const errs = validateForm(bad).join(' | ');
  assert.match(errs, /key must be/);
  assert.match(errs, /label is required/);
  assert.match(errs, /unknown type/);
});

test('the field count is bounded', () => {
  const many = { fields: Array.from({ length: MAX_FIELDS_PER_FORM + 5 }, (_, i) => (
    { key: `f${i}`, label: `F${i}`, type: 'text' })) };
  assert.ok(validateForm(many).some((e) => /at most/.test(e)));
});

test('answers are COERCED to their declared type, not stored as typed', () => {
  const { answers, errors } = validateAnswers(form, {
    gstin: '  29ABCDE1234F1Z5 ', turnover: '4500000', incorporated: '2021-04-01T00:00:00.000Z',
    entity: 'llp', exporter: 'yes', notes: 'none',
  });
  assert.deepEqual(errors, []);
  assert.equal(answers.turnover, 4500000, 'a numeric string becomes a number');
  assert.equal(answers.exporter, true, '"yes" becomes a boolean');
  // A date is stored as a plain date: turning it into a timestamp shifts a
  // birth date by a day for clients in some timezones.
  assert.equal(answers.incorporated, '2021-04-01');
});

test('a text answer is trimmed at the SOURCE, matching what the profile gets', () => {
  // Caught by e2e: the profile mapping trimmed but the stored answer did not,
  // so staff read back "  29ABCDE1234F1Z5  " while the client's profile held it
  // clean. The two must be the same string.
  const { answers } = validateAnswers(form, { gstin: '  29ABCDE1234F1Z5  ', notes: '  hi  ' });
  assert.equal(answers.gstin, '29ABCDE1234F1Z5');
  assert.equal(answers.notes, 'hi');
  assert.equal(answers.gstin, profileUpdatesFrom(form, answers).gstNumber);
});

test('keys the form did not ASK for are dropped, never stored', () => {
  // The portal is a browser; a client posting extra keys must not be able to
  // write arbitrary data onto a matter.
  const { answers } = validateAnswers(form, { gstin: 'X', role: 'admin', __proto__: 'x', anything: 1 });
  assert.deepEqual(Object.keys(answers), ['gstin']);
});

test('required is enforced on submit, and a wrong type is reported per field', () => {
  const { errors } = validateAnswers(form, { turnover: 'not a number', entity: 'not_an_option' });
  const byField = Object.fromEntries(errors.map((e) => [e.field, e.message]));
  assert.match(byField.gstin, /required/, 'the required field is named');
  assert.match(byField.turnover, /number/);
  assert.match(byField.entity, /listed options/);
});

test('a PARTIAL save is allowed — that is what "finish later" means', () => {
  // Only `required` complains; everything else is simply absent.
  const { answers, errors } = validateAnswers(form, { turnover: 100 });
  assert.equal(answers.turnover, 100);
  assert.equal(errors.length, 1, 'only the required field objects');
  assert.equal(errors[0].field, 'gstin');
});

test('profile updates come ONLY from mapped, answered fields', () => {
  const updates = profileUpdatesFrom(form, {
    gstin: ' 29ABCDE1234F1Z5 ', entity: 'llp', turnover: 5, notes: 'x',
  });
  assert.deepEqual(updates, { gstNumber: '29ABCDE1234F1Z5', entityType: 'llp' });
  // An unanswered mapped field must not blank the profile.
  assert.deepEqual(profileUpdatesFrom(form, { turnover: 5 }), {});
});

test('the client view strips internal notes and the mapping (AC5)', () => {
  const view = formForClient(form);
  const s = JSON.stringify(view);
  assert.ok(!s.includes('staff only'), 'internal notes never reach a client');
  // Telling a client which profile field their answer rewrites is not their
  // business either.
  assert.ok(!s.includes('mapsTo'), 'the mapping is internal');
  assert.ok(!s.includes('gstNumber'));
  assert.equal(view.fields.length, form.fields.length, 'every question still shows');
  assert.deepEqual(view.fields[3].options, ['llp', 'pvt_ltd'], 'a dropdown keeps its options');
});

test('every field type round-trips through validation', () => {
  for (const type of FIELD_TYPES) {
    const f = { key: 'k', label: 'L', type, ...(type === 'select' ? { options: ['a'] } : {}) };
    assert.deepEqual(validateForm({ fields: [f] }), [], `${type} must be authorable`);
  }
});

test('the summary reads for the editor row', () => {
  assert.equal(describeForm(form), 'Asks the client 6 questions');
  assert.equal(describeForm({ fields: [{ key: 'a', label: 'A', type: 'text' }] }), 'Asks the client 1 question');
  assert.equal(describeForm(null), null);
});
