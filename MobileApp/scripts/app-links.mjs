#!/usr/bin/env node
// E29-S07 — the files that let emailed links open the app, for ONE environment's host.
//
//   node MobileApp/scripts/app-links.mjs <qa|production> <hosting dir>
//
// Writes <dir>/.well-known/apple-app-site-association (iOS Universal Links) and
// <dir>/.well-known/assetlinks.json (Android App Links) naming THAT environment's app
// (com.legalterminus.app.qa on QA, com.legalterminus.app on production), so a QA build
// is opened only by QA's links. deploy-qa.yml runs it for the QA site.
//
// A file is written only when its inputs exist in environments.json → appLinks
// (the Apple team id; the app's signing SHA-256 fingerprints). Until the owner fills
// them, nothing is written and no host claims the app. Production is NOT wired to
// this script: its files go live only when the app's launch is approved (2026-11-03).
import fs from 'node:fs';
import path from 'node:path';
import { describe, loadEnvironments, resolveEnvName } from './lib/appEnv.mjs';

/** apple-app-site-association for one app id, or null when the team id is unknown. Pure. */
export function appleAppSiteAssociation({ appleTeamId, appId, linkPath }) {
  if (!/^[A-Z0-9]{10}$/.test(appleTeamId || '')) return null;
  return {
    applinks: {
      details: [{ appIDs: [`${appleTeamId}.${appId}`], components: [{ '/': `${linkPath}*` }] }],
    },
  };
}

/** assetlinks.json for one package, or null when no fingerprint is known. Pure. */
export function assetLinks({ appId, androidSha256 }) {
  const prints = (androidSha256 || []).filter((s) => /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/.test(s));
  if (!prints.length) return null;
  return [{
    relation: ['delegate_permission/common.handle_all_urls'],
    target: { namespace: 'android_app', package_name: appId, sha256_cert_fingerprints: prints },
  }];
}

function main() {
  const [, , envArg, outArg] = process.argv;
  if (!envArg || !outArg) {
    console.error('usage: app-links.mjs <qa|production> <hosting dir>');
    process.exit(2);
  }
  const config = loadEnvironments();
  const d = describe(resolveEnvName({ explicit: envArg, config }), config);
  const dir = path.join(path.resolve(outArg), '.well-known');
  const files = {
    'apple-app-site-association': appleAppSiteAssociation(d),
    'assetlinks.json': assetLinks(d),
  };
  for (const [file, body] of Object.entries(files)) {
    if (!body) { console.log(`app-links: ${file} not written for ${d.env} (appLinks in environments.json is not filled in)`); continue; }
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, file), `${JSON.stringify(body)}\n`);
    console.log(`app-links: wrote ${path.join(dir, file)} for ${d.appId}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main();
