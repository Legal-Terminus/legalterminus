/**
 * #175 — build-time prerendering for the marketing site.
 *
 * WHY: the site is a client-rendered SPA, so `view-source` on every route shows
 * an empty `<div id="root">`. Google usually runs the JS eventually; social
 * link-preview bots (WhatsApp, LinkedIn, X, Slack) never do. Without this, the
 * per-page <title>/<meta> added for #175 are invisible to exactly the crawlers
 * that decide how the site is indexed and shared.
 *
 * WHAT: after `vite build`, serve `dist/`, visit every indexable route with
 * headless Chromium, and write the fully-rendered HTML to
 * `dist/<route>/index.html`. Firebase Hosting serves an exact file match BEFORE
 * the SPA rewrite, so crawlers get real HTML and users still get the SPA
 * (React hydrates over the snapshot on load).
 *
 * CONSTRAINT: this changes no page component and no content — it only captures
 * what the app already renders.
 */
import { chromium } from '@playwright/test';
import { preview } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PORT = 4183;                 // uncommon port: avoids clashing with dev servers
const NAV_TIMEOUT = 45_000;
const CONCURRENCY = 4;             // parallel pages; keeps a full run to ~1-2 min

/** Routes to snapshot: everything in the SEO map except noindex + dynamic ones. */
async function indexableRoutes() {
  const { SEO_META } = await import(path.join(ROOT, 'src/data/seoMeta.js'));
  return Object.entries(SEO_META)
    .filter(([route, meta]) => !meta.noindex && !route.includes(':'))
    .map(([route]) => route);
}

/** Snapshot one route. Returns { route, ok, reason? }. */
async function snapshot(context, route) {
  const page = await context.newPage();
  try {
    const res = await page.goto(`http://localhost:${PORT}${route}`, {
      waitUntil: 'domcontentloaded',
      timeout: NAV_TIMEOUT,
    });
    if (res && res.status() >= 400) return { route, ok: false, reason: `HTTP ${res.status()}` };

    // Wait for the app to have actually rendered rather than for the network to
    // fall idle: `networkidle` never settles on a page with polling or a slow
    // lazy chunk, which timed out two routes even though they render fine.
    await page.waitForFunction(
      () => document.querySelector('#root')?.innerText?.trim().length > 200,
      { timeout: NAV_TIMEOUT },
    );
    // Below-the-fold sections are React.lazy + Suspense; let them settle.
    await page.waitForTimeout(600);

    // React 19 hoists <title>/<meta>/<link> into <head>, but on a CLIENT-SIDE
    // navigation it appends the new tags without removing the previous page's.
    // The snapshot therefore contained the home page's description/canonical
    // FIRST and the correct one second — and crawlers honour the first. Each
    // route now loads in a fresh page (below), and we defensively strip any
    // duplicate head tag, keeping the LAST occurrence (the current route's).
    await page.evaluate(() => {
      const keepLast = (selector, keyOf) => {
        const seen = new Map();
        for (const el of document.head.querySelectorAll(selector)) seen.set(keyOf(el), el);
        const keep = new Set(seen.values());
        for (const el of document.head.querySelectorAll(selector)) if (!keep.has(el)) el.remove();
      };
      keepLast('meta[name]', (el) => `name:${el.getAttribute('name')}`);
      keepLast('meta[property]', (el) => `prop:${el.getAttribute('property')}`);
      keepLast('link[rel="canonical"]', () => 'canonical');
      // Title needs the opposite rule from the meta tags: React 19 INSERTS its
      // hoisted <title> before the static one from index.html, so "keep last"
      // would preserve the generic fallback. document.title is authoritative —
      // collapse to a single element carrying it.
      const current = document.title;
      const titles = [...document.head.querySelectorAll('title')];
      titles.slice(1).forEach((el) => el.remove());
      if (titles[0]) titles[0].textContent = current;
    });

    const html = await page.content();

    // Guard against capturing a blank shell — that would be WORSE than no
    // prerender, because it would serve crawlers an empty page as if it were real.
    const bodyText = await page.locator('body').innerText().catch(() => '');
    if (bodyText.trim().length < 200) return { route, ok: false, reason: 'rendered body looked empty' };
    if (!/<title>/i.test(html)) return { route, ok: false, reason: 'no <title> in output' };

    const outDir = route === '/' ? DIST : path.join(DIST, route);
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, 'index.html'), html, 'utf8');
    return { route, ok: true };
  } catch (err) {
    return { route, ok: false, reason: err.message.split('\n')[0].slice(0, 120) };
  } finally {
    await page.close();
  }
}

async function main() {
  const routes = await indexableRoutes();
  console.log(`[prerender] ${routes.length} routes`);

  // `vite preview` serves dist/ exactly as Firebase will (SPA fallback included).
  const server = await preview({ root: ROOT, preview: { port: PORT, strictPort: true } });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    // Identify as a bot so any analytics/consent scripts can opt out of the snapshot.
    userAgent: 'Mozilla/5.0 (compatible; LegalTerminusPrerender/1.0)',
  });

  const results = [];
  const queue = [...routes];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) {
        const route = queue.shift();
        // Retry once: a lone timeout is usually contention between parallel
        // pages, not a genuinely unrenderable route.
        let r = await snapshot(context, route);
        if (!r.ok) r = await snapshot(context, route);
        results.push(r);
        if (!r.ok) console.warn(`[prerender] SKIP ${r.route} — ${r.reason}`);
      }
    }),
  );

  // #175: snapshot the 404 page to dist/404.html. Firebase serves that file for
  // any path no rewrite claims, so crawlers hitting a dead link get a real
  // "Page Not Found" with noindex — instead of the SPA shell, which (being the
  // home page's HTML) made every dead URL look like a duplicate homepage.
  // It must NOT go through index.html: prerendering snapshots the live DOM, so a
  // noindex placed in the shared shell would be inherited by every prerendered
  // page and de-index the whole site.
  {
    const page = await context.newPage();
    try {
      await page.goto(`http://localhost:${PORT}/__not-found__`, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
      await page.waitForFunction(() => document.title.includes('Not Found'), { timeout: NAV_TIMEOUT });
      await page.waitForTimeout(400);
      // Same head-dedupe as the routes: React 19 leaves the shell's <title> in
      // place alongside its own, and the stale one would win for crawlers.
      await page.evaluate(() => {
        const keepLast = (sel, keyOf) => {
          const seen = new Map();
          for (const el of document.head.querySelectorAll(sel)) seen.set(keyOf(el), el);
          const keep = new Set(seen.values());
          for (const el of document.head.querySelectorAll(sel)) if (!keep.has(el)) el.remove();
        };
        keepLast('meta[name]', (el) => `name:${el.getAttribute('name')}`);
        keepLast('link[rel="canonical"]', () => 'canonical');
        const current = document.title;
        const titles = [...document.head.querySelectorAll('title')];
        titles.slice(1).forEach((el) => el.remove());
        if (titles[0]) titles[0].textContent = current;
      });
      await writeFile(path.join(DIST, '404.html'), await page.content(), 'utf8');
      console.log('[prerender] 404.html written');
    } catch (err) {
      console.error('[prerender] could not snapshot 404.html:', err.message.split('\n')[0]);
      process.exit(1);
    } finally {
      await page.close();
    }
  }

  await context.close();
  await browser.close();
  await server.httpServer.close();


  const failed = results.filter((r) => !r.ok);
  console.log(`[prerender] ${results.length - failed.length}/${results.length} routes written`);

  // Fail the build on ANY miss: a silently unprerendered page looks fine locally
  // and quietly ships an empty shell to crawlers.
  if (failed.length) {
    console.error(`[prerender] FAILED for ${failed.length} route(s):`);
    for (const f of failed) console.error(`  ${f.route} — ${f.reason}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[prerender] fatal:', err);
  process.exit(1);
});
