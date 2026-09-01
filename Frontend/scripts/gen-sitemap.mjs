/**
 * #175 — generate sitemap.xml + robots.txt from the SEO route map.
 *
 * Runs as part of the build so the sitemap can never drift from the routes
 * again. It was previously produced by an ad-hoc script run by hand, and the URL
 * rename immediately left it listing 74 stale short URLs — exactly the kind of
 * silent inconsistency (sitemap disagreeing with canonicals) that costs
 * rankings.
 *
 * Excluded: `noindex` routes (auth/profile) and canonical ALIASES — listing an
 * alias would contradict its own canonical tag.
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://legalterminus.com';

const { SEO_META } = await import(pathToFileURL(path.join(ROOT, 'src/data/seoMeta.js')).href);

const indexable = Object.entries(SEO_META)
  .filter(([route, meta]) => !meta.noindex && !meta.canonicalPath && !route.includes(':'))
  .map(([route]) => route)
  .sort();

const today = new Date().toISOString().slice(0, 10);
const urls = indexable
  .map((r) => `  <url><loc>${SITE}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n');

await writeFile(
  path.join(ROOT, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  'utf8',
);

await writeFile(
  path.join(ROOT, 'public/robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /my-profile\nDisallow: /payment/\n\nSitemap: ${SITE}/sitemap.xml\n`,
  'utf8',
);

console.log(`[sitemap] ${indexable.length} urls`);
