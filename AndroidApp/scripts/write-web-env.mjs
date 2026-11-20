#!/usr/bin/env node
// Record which hosted Portal this Android build opens. Run by `npm run sync` (and by hand):
//
//   LT_APP_ENV=production node scripts/write-web-env.mjs
//
// Writes, for the chosen environment (qa | production; default qa), both ignored by git:
//   - .app-env.json     the choice, read by capacitor.config.ts and android/app/build.gradle
//   - web/*.html        web-src/*.html with __PORTAL_URL__ replaced (the local error page's "Try again"
// The Portal itself is NOT bundled any more: the app opens https://<host>/portal/ (capacitor.config.ts
// server.url), so a website deployment reaches installed apps without a new Play release.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(fs.readFileSync(path.join(appDir, '..', 'MobileShared', 'environments.json'), 'utf8'));

/** The Portal address for one environment. Pure; HTTPS only. */
export function portalUrl(host) {
  if (!/^[a-z0-9.-]+$/i.test(host)) throw new Error(`Invalid host "${host}"`);
  return `https://${host}/portal/`;
}

const name = process.argv[2] || process.env.LT_APP_ENV || config.default;
const target = config.environments[name];
if (!target) {
  console.error(`write-web-env: unknown environment "${name}". Use one of: ${Object.keys(config.environments).join(', ')}.`);
  process.exit(1);
}
const url = portalUrl(target.host);
fs.writeFileSync(
  path.join(appDir, '.app-env.json'),
  `${JSON.stringify({ env: name, appId: `${config.baseAppId}${target.appIdSuffix}`, appName: target.appName, host: target.host }, null, 2)}\n`,
);
fs.mkdirSync(path.join(appDir, 'web'), { recursive: true });
for (const file of fs.readdirSync(path.join(appDir, 'web-src'))) {
  fs.writeFileSync(
    path.join(appDir, 'web', file),
    fs.readFileSync(path.join(appDir, 'web-src', file), 'utf8').replaceAll('__PORTAL_URL__', url),
  );
}
console.log(`write-web-env: ${name} -> ${url}`);
