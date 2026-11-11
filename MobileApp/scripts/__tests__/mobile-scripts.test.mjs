// E29 — the environment switch, the bundle guard and the app-link files.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, loadEnvironments, resolveEnvName } from '../lib/appEnv.mjs';
import { checkBundle } from '../check-bundle.mjs';
import { appleAppSiteAssociation, assetLinks } from '../app-links.mjs';
import { parseEnvFile, plistString, portalEnv } from '../app-env.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = (name) => path.join(here, 'fixtures', name);
const config = loadEnvironments();

test('the switch defaults to QA, and LT_APP_ENV or an argument picks production', () => {
  assert.equal(resolveEnvName({ env: {}, config }), 'qa');
  assert.equal(resolveEnvName({ env: { LT_APP_ENV: 'production' }, config }), 'production');
  assert.equal(resolveEnvName({ explicit: 'production', env: { LT_APP_ENV: 'qa' }, config }), 'production');
  assert.throws(() => resolveEnvName({ env: { LT_APP_ENV: 'prod' }, config }), /Unknown app environment/);
});

test('a QA build is its own app, on the QA host; production keeps the store ids', () => {
  const qa = describe('qa', config);
  assert.equal(qa.appId, 'com.legalterminus.app.qa');
  assert.equal(qa.appName, 'Legal Terminus QA');
  assert.equal(qa.host, 'legal-terminus-qa.web.app');
  assert.equal(qa.web.VITE_API_BASE_URL, 'https://legal-terminus-qa.web.app');
  assert.equal(qa.web.VITE_FIRESTORE_DATABASE_ID, 'qa-data');
  const prod = describe('production', config);
  assert.equal(prod.appId, 'com.legalterminus.app');
  assert.equal(prod.appName, 'Legal Terminus');
  assert.equal(prod.host, 'legalterminus.com');
  assert.equal(prod.web.VITE_FIRESTORE_DATABASE_ID, '', 'production reads the default database');
});

test('every environment defines the same Portal keys (no value can be left over from another)', () => {
  const keys = Object.values(config.environments).map((e) => Object.keys(e.web).sort().join());
  assert.equal(new Set(keys).size, 1);
});

test('the environment values outrank the off-repo file', () => {
  const merged = portalEnv(parseEnvFile('VITE_FIREBASE_API_KEY=k\nVITE_API_BASE_URL=http://localhost:5001\n# c\n'), describe('production', config).web);
  assert.equal(merged.VITE_FIREBASE_API_KEY, 'k');
  assert.equal(merged.VITE_API_BASE_URL, 'https://legalterminus.com');
});

test('guard: a QA bundle passes as QA and fails as production', () => {
  assert.deepEqual(checkBundle(fixture('qa-bundle'), describe('qa', config)), []);
  const problems = checkBundle(fixture('qa-bundle'), describe('production', config));
  assert.ok(problems.some((p) => p.includes('qa-data')));
  assert.ok(problems.some((p) => p.includes('legal-terminus-qa')));
  assert.ok(problems.some((p) => p.includes('.test')));
  assert.ok(problems.some((p) => p.includes('no file points at https://legalterminus.com')));
});

test('guard: a production bundle passes as production and fails as QA', () => {
  assert.deepEqual(checkBundle(fixture('production-bundle'), describe('production', config)), []);
  const problems = checkBundle(fixture('production-bundle'), describe('qa', config));
  assert.ok(problems.some((p) => p.includes('no file points at https://legal-terminus-qa.web.app')));
});

test('guard: a missing bundle is a failure, not a pass', () => {
  assert.equal(checkBundle(fixture('nope'), describe('qa', config)).length, 1);
});

test('app links: nothing is published until the owner fills the team id / fingerprints', () => {
  const qa = describe('qa', config);
  assert.equal(appleAppSiteAssociation({ ...qa, appleTeamId: '' }), null);
  assert.equal(appleAppSiteAssociation({ ...qa, appleTeamId: 'TEAMID' }), null, 'a placeholder is not a team id');
  assert.equal(assetLinks({ ...qa, androidSha256: [] }), null);
  assert.equal(assetLinks({ ...qa, androidSha256: ['not-a-fingerprint'] }), null);
});

test('app links: each host names only its own environment\'s app', () => {
  const qa = { ...describe('qa', config), appleTeamId: 'ABCDE12345' };
  assert.deepEqual(appleAppSiteAssociation(qa), {
    applinks: { details: [{ appIDs: ['ABCDE12345.com.legalterminus.app.qa'], components: [{ '/': '/portal/account/action*' }] }] },
  });
  const sha = Array(32).fill('AB').join(':');
  const links = assetLinks({ ...describe('qa', config), androidSha256: [sha] });
  assert.equal(links[0].target.package_name, 'com.legalterminus.app.qa');
  assert.deepEqual(links[0].target.sha256_cert_fingerprints, [sha]);
});

test('plist values are read from Apple\'s XML', () => {
  const xml = '<dict><key>BUNDLE_ID</key>\n\t<string>com.legalterminus.app.qa</string><key>REVERSED_CLIENT_ID</key><string>com.googleusercontent.apps.1-x</string></dict>';
  assert.equal(plistString(xml, 'BUNDLE_ID'), 'com.legalterminus.app.qa');
  assert.equal(plistString(xml, 'REVERSED_CLIENT_ID'), 'com.googleusercontent.apps.1-x');
  assert.equal(plistString(xml, 'API_KEY'), null);
});
