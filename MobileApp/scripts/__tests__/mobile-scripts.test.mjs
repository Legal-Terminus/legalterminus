// E29 — the environment switch (one app, the hosted Portal) and the app-link files.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { describe, loadEnvironments, resolveEnvName } from '../lib/appEnv.mjs';
import { appleAppSiteAssociation, assetLinks } from '../app-links.mjs';
import { plistString } from '../app-env.mjs';

const config = loadEnvironments();

test('the switch defaults to QA, and LT_APP_ENV or an argument picks production', () => {
  assert.equal(resolveEnvName({ env: {}, config }), 'qa');
  assert.equal(resolveEnvName({ env: { LT_APP_ENV: 'production' }, config }), 'production');
  assert.equal(resolveEnvName({ explicit: 'production', env: { LT_APP_ENV: 'qa' }, config }), 'production');
  assert.throws(() => resolveEnvName({ env: { LT_APP_ENV: 'prod' }, config }), /Unknown app environment/);
});

test('one app: QA and production share the store id and name; only the hosted Portal changes', () => {
  const qa = describe('qa', config);
  const prod = describe('production', config);
  assert.equal(qa.appId, 'com.legalterminus.app');
  assert.equal(prod.appId, 'com.legalterminus.app');
  assert.equal(qa.appName, prod.appName);
  assert.equal(qa.portalUrl, 'https://legal-terminus-qa.web.app/portal/');
  assert.equal(prod.portalUrl, 'https://legalterminus.com/portal/');
  assert.equal(qa.host, 'legal-terminus-qa.web.app');
  assert.equal(prod.host, 'legalterminus.com');
});

test('every Portal URL is https on its own host, under /portal/ (never localhost)', () => {
  for (const name of Object.keys(config.environments)) {
    const { portalUrl, host } = describe(name, config);
    const url = new URL(portalUrl);
    assert.equal(url.protocol, 'https:', name);
    assert.equal(url.host, host, name);
    assert.equal(url.pathname, '/portal/', name);
    assert.doesNotMatch(portalUrl, /localhost|127\.0\.0\.1/, name);
  }
});

test('app links: nothing is published until the owner fills the team id / fingerprints', () => {
  const qa = describe('qa', config);
  assert.equal(appleAppSiteAssociation({ ...qa, appleTeamId: '' }), null);
  assert.equal(appleAppSiteAssociation({ ...qa, appleTeamId: 'TEAMID' }), null, 'a placeholder is not a team id');
  assert.equal(assetLinks({ ...qa, androidSha256: [] }), null);
  assert.equal(assetLinks({ ...qa, androidSha256: ['not-a-fingerprint'] }), null);
});

test('app links: every host names the one app', () => {
  const qa = { ...describe('qa', config), appleTeamId: 'ABCDE12345' };
  assert.deepEqual(appleAppSiteAssociation(qa), {
    applinks: { details: [{ appIDs: ['ABCDE12345.com.legalterminus.app'], components: [{ '/': '/portal/account/action*' }] }] },
  });
  const sha = Array(32).fill('AB').join(':');
  const links = assetLinks({ ...describe('qa', config), androidSha256: [sha] });
  assert.equal(links[0].target.package_name, 'com.legalterminus.app');
  assert.deepEqual(links[0].target.sha256_cert_fingerprints, [sha]);
});

test('plist values are read from Apple\'s XML', () => {
  const xml = '<dict><key>BUNDLE_ID</key>\n\t<string>com.legalterminus.app</string><key>REVERSED_CLIENT_ID</key><string>com.googleusercontent.apps.1-x</string></dict>';
  assert.equal(plistString(xml, 'BUNDLE_ID'), 'com.legalterminus.app');
  assert.equal(plistString(xml, 'REVERSED_CLIENT_ID'), 'com.googleusercontent.apps.1-x');
  assert.equal(plistString(xml, 'API_KEY'), null);
});
