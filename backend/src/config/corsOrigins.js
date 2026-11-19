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
 *   - anything deployment-specific comes from CORS_ORIGINS (comma-separated,
 *     exact https/http origins);
 *   - localhost is never allowed, in any environment, and CORS_ORIGINS cannot
 *     add it (owner decision 2026-11-19). The Android and iPhone apps open the
 *     hosted Portal, so their origin IS the site; local development reaches the
 *     API same-origin through the Vite dev server's /api proxy.
 *
 * Ported by content from Ambyflow's config/corsOrigins.js (SEC F-21).
 */

const QA_HOSTING_SITE = "legal-terminus-qa";

const escapeRegExp = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Exact origins only: scheme + host (+ port). Anything else is dropped. */
const isExactOrigin = (value) => /^https?:\/\/[a-z0-9.-]+(:\d+)?$/i.test(value);

/** localhost, a loopback address or a *.localhost name: never an allowed origin. */
const isLocalOrigin = (value) => {
  const host = value.replace(/^https?:\/\//i, "").replace(/:\d+$/, "").toLowerCase();
  return host === "localhost" || host.endsWith(".localhost") || /^127\./.test(host) || host === "0.0.0.0";
};

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

  for (const raw of String(env.CORS_ORIGINS ?? "").split(",")) {
    const origin = raw.trim().replace(/\/$/, "");
    // A wildcard or a bare host here would silently widen the boundary; localhost is refused outright.
    if (origin && isExactOrigin(origin) && !isLocalOrigin(origin)) origins.push(origin);
  }

  return origins;
}

/** Would this Origin header be allowed? Mirrors how the `cors` package matches. */
export function isAllowedOrigin(origin, allowed = buildAllowedOrigins()) {
  return allowed.some((entry) => (entry instanceof RegExp ? entry.test(origin) : entry === origin));
}
