#!/usr/bin/env node
// E29-S09 — the build guard.
//
//   node scripts/check-bundle.mjs [qa|production] [dir]
//
// Fails (exit 1) when the Portal's mobile bundle carries the wrong environment: a
// production bundle must contain nothing of QA, a QA bundle nothing of production,
// and either must actually point at its own API. Vite reads Portal/.env.local in
// every mode, so a bundle built on a developer's machine bakes in whatever that
// file says unless the environment's values were written first (scripts/app-env.mjs);
// this is what catches it. The environment defaults to the last sync's, then qa.
// Patterns live in environments.json (`forbidInBundle`).
import fs from 'node:fs';
import path from 'node:path';
import { REPO_DIR, describe, loadEnvironments, resolveEnvName } from './lib/appEnv.mjs';

const SCANNED = /\.(js|mjs|css|html|json|txt|map)$/i;

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (SCANNED.test(entry.name)) yield full;
  }
}

/**
 * Scan `dir` for the environment. Pure apart from reading files; returns the problems
 * found (empty = the bundle is clean).
 */
export function checkBundle(dir, { forbidInBundle, requireInBundle }) {
  if (!fs.existsSync(dir)) return [`${dir} does not exist — run the mobile build first`];
  const problems = [];
  const forbidden = forbidInBundle.map((p) => new RegExp(p));
  const required = new Set(requireInBundle);
  for (const file of walk(dir)) {
    const text = fs.readFileSync(file, 'utf8');
    for (const re of forbidden) {
      const m = re.exec(text);
      if (m) problems.push(`${path.relative(dir, file)} contains /${re.source}/ ("${m[0]}")`);
    }
    for (const r of required) if (text.includes(r)) required.delete(r);
  }
  for (const r of required) problems.push(`no file points at ${r} — the bundle was not built for this environment`);
  return problems;
}

function main() {
  const config = loadEnvironments();
  const name = resolveEnvName({ explicit: process.argv[2], config, useSynced: true });
  const dir = path.resolve(process.argv[3] || path.join(REPO_DIR, 'Portal', 'dist-mobile'));
  const problems = checkBundle(dir, describe(name, config));
  if (problems.length) {
    console.error(`check-bundle: the ${name} bundle in ${dir} is wrong:`);
    for (const p of problems) console.error(`  - ${p}`);
    console.error('Rebuild with the right environment: LT_APP_ENV=<env> npm run sync:<platform> (docs/mobile-release.md).');
    process.exit(1);
  }
  console.log(`check-bundle: ${dir} is a clean ${name} bundle.`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
