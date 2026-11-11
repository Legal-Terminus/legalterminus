// The mobile apps' environment switch (E29, owner decision 2026-11-11: QA first).
//
// ONE value picks the environment a build targets: LT_APP_ENV = qa | production,
// default qa. Everything origin-dependent is derived from MobileApp/environments.json
// for that value — the app id and name, the API/site host, the Universal Link and
// App Link host, the Firebase values baked into the Portal bundle, the bundle guard.
//
// `npm run sync:*` records the choice in MobileApp/.app-env.json (ignored by git), so
// a later Gradle or Xcode build follows what was synced instead of guessing.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const MOBILE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const REPO_DIR = path.resolve(MOBILE_DIR, '..');
export const STATE_FILE = path.join(MOBILE_DIR, '.app-env.json');

export function loadEnvironments(file = path.join(MOBILE_DIR, 'environments.json')) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/** The environment last synced into the native projects, or null. */
export function syncedEnv(stateFile = STATE_FILE) {
  try { return JSON.parse(fs.readFileSync(stateFile, 'utf8')).env ?? null; } catch { return null; }
}

/**
 * Which environment, in order: an explicit value (CLI argument), LT_APP_ENV, then —
 * only when `useSynced` — the last sync, then the file's default (qa).
 */
export function resolveEnvName({ explicit, env = process.env, useSynced = false, config = loadEnvironments() } = {}) {
  const name = explicit || env.LT_APP_ENV || (useSynced ? syncedEnv() : null) || config.default;
  if (!config.environments[name]) {
    throw new Error(`Unknown app environment "${name}". Use one of: ${Object.keys(config.environments).join(', ')}.`);
  }
  return name;
}

/** Everything a build needs to know about one environment. Pure. */
export function describe(name, config = loadEnvironments()) {
  const e = config.environments[name];
  if (!e) throw new Error(`Unknown app environment "${name}"`);
  return {
    env: name,
    appId: `${config.baseAppId}${e.appIdSuffix}`,
    appName: e.appName,
    host: e.host,
    web: { ...e.web },
    forbidInBundle: [...e.forbidInBundle],
    // The bundle must positively point at this environment's API.
    requireInBundle: [e.web.VITE_API_BASE_URL],
    linkPath: config.appLinks.path,
    appleTeamId: config.appLinks.appleTeamId,
    androidSha256: [...(config.appLinks.androidSha256[name] ?? [])],
  };
}

/** Where the off-repo release material lives (docs/mobile-release.md). */
export const releaseDir = (env = process.env) => env.LT_RELEASE_DIR || path.join(os.homedir(), 'lt-android-release');
