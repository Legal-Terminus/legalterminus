/**
 * What this build IS — surfaced so a deployment can be identified from outside.
 *
 * WHY THIS EXISTS. "Is the fix deployed yet?" had no answer. A bug was
 * reported from production, the fix was already on `main`, and the only way to
 * tell whether the running deploy included it was to guess — which cost real
 * time twice in one day. No git tags existed and nothing reported what was
 * running.
 *
 * ── Where the numbers come from ──
 *
 * `version` is the ROOT package.json, which is the single source of truth for
 * the product version. The per-package versions are deliberately left alone:
 * they describe npm workspaces, not the shipped product, and keeping three
 * numbers in sync by hand is how they drifted in the first place.
 *
 * `commit` and `builtAt` are injected at BUILD time, not read at runtime. The
 * Dockerfile does not copy `.git` into the image (correctly — it would bloat
 * the layer and leak history), so there is no repository to interrogate once
 * the container is running. A deploy that forgets to pass them reports
 * 'unknown' rather than lying or crashing.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/** Root package.json — the product version. */
function readRootVersion() {
  // Two candidates because the layout differs between the repo (backend/src/…)
  // and the image (the Dockerfile flattens to /app). Try both, fail soft.
  const candidates = [
    path.resolve(here, '../../../package.json'),
    path.resolve(here, '../../package.json'),
  ];
  for (const p of candidates) {
    try {
      const pkg = JSON.parse(readFileSync(p, 'utf8'));
      if (pkg?.name && pkg?.version) return pkg.version;
    } catch { /* try the next candidate */ }
  }
  return '0.0.0';
}

export const VERSION = process.env.APP_VERSION || readRootVersion();

/** Short git SHA, injected at build time. */
export const COMMIT = (process.env.GIT_SHA || 'unknown').slice(0, 12);

/** ISO timestamp of the build, injected at build time. */
export const BUILT_AT = process.env.BUILT_AT || null;

/**
 * Which environment this is, so a report names the right one.
 */
export const DEPLOYMENT = process.env.DEPLOYMENT_MODE || 'production';

/** The payload served on /health. Safe to expose: no secrets, no internals. */
export function versionInfo() {
  return {
    version: VERSION,
    commit: COMMIT,
    builtAt: BUILT_AT,
    deployment: DEPLOYMENT,
  };
}
