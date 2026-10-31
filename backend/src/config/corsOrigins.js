/**
 * The CORS allowlist, a security boundary.
 *
 * This list used to contain `/\.firebaseapp\.com$/`, `/\.web\.app$/` and
 * `/legalterminus\.com$/`. Unanchored at the front, they matched every site
 * hosted on Firebase by anyone, and hosts like evillegalterminus.com. With
 * `credentials: true` that is a boundary with no wall. Now:
 *
 *   - every pattern is anchored and pins the scheme and full host;
 *   - Firebase hosts are limited to this project's own and the QA site's,
 *     including their preview channels;
 *   - localhost is allowed only outside production;
 *   - anything deployment-specific comes from CORS_ORIGINS (comma-separated,
 *     exact origins). The Android app's origin is added this way (deploy-qa.yml).
 *
 * Ported by content from Ambyflow's config/corsOrigins.js (SEC F-21).
 */

const QA_HOSTING_SITE = "legal-terminus-qa";

const escapeRegExp = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Exact origins only: scheme + host (+ port). Anything else is dropped. */
const isExactOrigin = (value) => /^https?:\/\/[a-z0-9.-]+(:\d+)?$/i.test(value);

const firebaseHosts = (site) => new RegExp(
  `^https:\\/\\/${escapeRegExp(site)}(--[a-z0-9-]+)?\\.(web\\.app|firebaseapp\\.com)$`,
);

export function buildAllowedOrigins(env = process.env) {
  const origins = [
    // The website and portal call the API cross-origin from these.
    /^https:\/\/(www\.|portal\.)?legalterminus\.com$/,
    firebaseHosts(QA_HOSTING_SITE),
  ];

  const projectId = env.FIREBASE_PROJECT_ID || env.GCLOUD_PROJECT || env.GOOGLE_CLOUD_PROJECT;
  if (projectId && /^[a-z0-9-]+$/.test(projectId)) origins.push(firebaseHosts(projectId));

  // Local development only.
  if (env.NODE_ENV !== "production") {
    origins.push(/^http:\/\/localhost(:\d+)?$/, /^http:\/\/127\.0\.0\.1(:\d+)?$/);
  }

  for (const raw of String(env.CORS_ORIGINS ?? "").split(",")) {
    const origin = raw.trim().replace(/\/$/, "");
    // A wildcard or a bare host here would silently widen the boundary.
    if (origin && isExactOrigin(origin)) origins.push(origin);
  }

  return origins;
}

/** Would this Origin header be allowed? Mirrors how the `cors` package matches. */
export function isAllowedOrigin(origin, allowed = buildAllowedOrigins()) {
  return allowed.some((entry) => (entry instanceof RegExp ? entry.test(origin) : entry === origin));
}
