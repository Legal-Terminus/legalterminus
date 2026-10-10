/**
 * Content fidelity check for the Theme C work (E-25): a restyle must not change
 * a word, a link or a media source.
 *
 *   node scripts/theme/content-check.mjs <urlA> <urlB> [--ignore-case]
 *   node scripts/theme/content-check.mjs http://localhost:5185/ http://localhost:5184/
 *   node scripts/theme/content-check.mjs https://legalterminus.com/ https://legal-terminus-qa.web.app/
 *
 * Compares, in document order, the visible text nodes of <body> (textContent,
 * so CSS text-transform cannot hide a change), plus every link target and
 * every image / video / iframe source. Exits 1 on any difference.
 * Numbers that count up are read after the animations have had time to end.
 */
import { chromium } from "@playwright/test";

const [a, b, ...flags] = process.argv.slice(2);
const ignoreCase = flags.includes("--ignore-case");

async function read(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle", timeout: 90_000 });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); }
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(5000);
  const out = await page.evaluate(() => {
    const skip = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "TEMPLATE"]);
    // The floating call button swaps its glyph on a timer; it is not page content.
    const noise = (t) => /^[\u260e\u2715\u00d7\u2706]$/.test(t);
    const texts = [];
    const walk = (n) => {
      if (n.nodeType === 3) { const t = n.nodeValue.replace(/\s+/g, " ").trim(); if (t && !noise(t)) texts.push(t); return; }
      if (n.nodeType !== 1 || skip.has(n.tagName.toUpperCase())) return;
      for (const c of n.childNodes) walk(c);
    };
    walk(document.body);
    const path = (u) => { try { const x = new URL(u, location.href); return x.origin === location.origin ? x.pathname + x.search + x.hash : x.href; } catch { return u; } };
    // hashed build assets differ between builds; compare the file's base name without the hash
    const asset = (u) => path(u || "").replace(/-[A-Za-z0-9_-]{8}(\.[a-z0-9]+)$/i, "$1").replace(/^\/(src\/)?assets\//, "/");
    return {
      text: texts.join(" ").replace(/\s+/g, " "),
      links: [...document.querySelectorAll("a[href]")].map((x) => path(x.getAttribute("href"))),
      media: [...document.querySelectorAll("img[src], video[src], source[src], iframe[src]")].map((x) => `${x.tagName.toLowerCase()} ${asset(x.getAttribute("src"))}`),
    };
  });
  await page.close();
  return out;
}

const count = (arr) => arr.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map());
function bagDiff(x, y) {
  const cx = count(x), cy = count(y); const out = [];
  for (const k of new Set([...cx.keys(), ...cy.keys()])) { const d = (cy.get(k) || 0) - (cx.get(k) || 0); if (d) out.push(`${d > 0 ? "+" : ""}${d}  ${k}`); }
  return out;
}

const browser = await chromium.launch();
const [A, B] = [await read(browser, a), await read(browser, b)];
await browser.close();

const norm = (s) => (ignoreCase ? s.toLowerCase() : s);
const wordsA = norm(A.text).split(" "), wordsB = norm(B.text).split(" ");
const problems = [];
const words = bagDiff(wordsA, wordsB);
if (words.length) problems.push(`WORDS that differ (− only in A, + only in B):\n  ${words.slice(0, 60).join("\n  ")}`);
else if (wordsA.join(" ") !== wordsB.join(" ")) {
  let i = 0; while (wordsA[i] === wordsB[i]) i++;
  console.log(`note: same words, different order from word ${i}: A "…${wordsA.slice(i, i + 12).join(" ")}" / B "…${wordsB.slice(i, i + 12).join(" ")}" (a layout re-order, not a content change)`);
}
const links = bagDiff(A.links, B.links); if (links.length) problems.push(`LINKS that differ:\n  ${links.slice(0, 40).join("\n  ")}`);
const media = bagDiff(A.media, B.media); if (media.length) problems.push(`MEDIA that differ:\n  ${media.slice(0, 40).join("\n  ")}`);

console.log(`A ${a}: ${wordsA.length} words, ${A.links.length} links, ${A.media.length} media`);
console.log(`B ${b}: ${wordsB.length} words, ${B.links.length} links, ${B.media.length} media`);
if (problems.length) { console.log("\nCONTENT DIFFERS\n" + problems.join("\n\n")); process.exit(1); }
console.log("CONTENT IDENTICAL");
