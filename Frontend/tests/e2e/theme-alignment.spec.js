// @ts-check
/* global process, document, window, getComputedStyle */
import { test, expect } from "@playwright/test";
import fs from "node:fs";

/**
 * #209, the firm's decision of 30 Oct: Home stays as it is; elsewhere paragraphs
 * are left-aligned, Terms & Conditions keep a centred heading over left-aligned
 * terms, and the policy pages are one centred column. Theme C only:
 *
 *   VITE_THEME_C=true npx vite --port 5184
 *   E2E_BASE_URL=http://localhost:5184 npx playwright test theme-alignment
 */
const BASE = process.env.E2E_BASE_URL || "";
const PVT = "/setting-up-a-business/profit-making-structures/private-limited-company-registration-in-india";
const POLICIES = ["privacy", "terms", "refund", "confidentiality"];
const app = fs.readFileSync(new URL("../../src/App.jsx", import.meta.url), "utf8");
const ROUTES = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1])
  .filter((p, i, a) => a.indexOf(p) === i && !p.includes(":") && !p.includes("*") && !/my-profile|payment\/result/.test(p));
const align = (loc) => loc.evaluate((e) => getComputedStyle(e).textAlign);

async function open(page, path) {
  await page.goto(BASE + path);
  await page.waitForLoadState("load");
  // the live build has none of this
  test.skip(!(await page.evaluate(() => document.documentElement.classList.contains("theme-c"))), "Theme C is off");
}
async function waitMarked(page) {
  await expect(page.locator("[data-lt-sub]").first()).toBeAttached({ timeout: 15_000 });
}

test("Home keeps its justified paragraphs", async ({ page }) => {
  await open(page, "/");
  await waitMarked(page);
  await expect(page.locator("html")).toHaveClass(/lt-home/);
  const p = page.locator("[data-lt-justify]").first();
  await expect(p).toBeAttached();
  expect(await align(p)).toBe("justify");
});

test("Private Limited: Terms are left-aligned under a centred heading, Why Choose is not justified", async ({ page }) => {
  await open(page, PVT);
  await waitMarked(page);
  await expect(page.locator("html")).not.toHaveClass(/lt-home/);
  const section = page.locator(".pvtltd-tc-section");
  await section.scrollIntoViewIfNeeded();
  expect(await align(section.locator("h2").first())).toBe("center");
  const items = section.locator(".pvtltd-tc-item");
  expect(await align(items.first())).toBe("left");
  const lefts = await items.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));
  expect(new Set(lefts).size).toBe(1);

  const intro = page.locator(".pvt-intro-text").first();
  await intro.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  expect(await align(intro)).toBe("left");
});

test("Legal Terminus Priority: a long intro is left-aligned", async ({ page }) => {
  await open(page, PVT);
  const sub = page.locator(".zp-subtitle").first();
  await sub.scrollIntoViewIfNeeded();
  await expect(sub).toHaveAttribute("data-lt-sub", "long");
  expect(await align(sub)).toBe("left");
});

for (const name of POLICIES) {
  for (const width of [1280, 390]) {
    test(`policy ${name} at ${width}px is one centred column`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await open(page, `/policies/${name}`);
      const box = await page.locator(".policy-content").boundingBox();
      const section = await page.locator(".policy-section").first().boundingBox();
      expect(box && section).toBeTruthy();
      expect(Math.abs(section.x - box.x)).toBeLessThan(1);
      expect(Math.abs(section.width - box.width)).toBeLessThan(1);
      const vw = await page.evaluate(() => document.documentElement.clientWidth);
      expect(Math.abs(box.x + box.width / 2 - vw / 2)).toBeLessThan(2);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    });
  }
}

// Every service page has its own copy of this section under its own class prefix,
// so walk the routes: the first version of this fix reached only one family.
test("Terms & Conditions read the same on every page", async ({ page }) => {
  test.setTimeout(600_000);
  let seen = 0;
  // the policy page of that name is a long-form document, covered above
  for (const route of ROUTES.filter((r) => !/policies|-policy|terms-conditions/.test(r))) {
    await open(page, route);
    // sections lazy-load as the page scrolls
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 800) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(50);
    }
    await page.waitForTimeout(300);
    const heading = page.locator("#root h2").filter({ hasText: /terms\s*(&|and)\s*conditions/i }).first();
    if (!(await heading.count())) continue;
    await heading.scrollIntoViewIfNeeded();
    const r = await heading.evaluate((h) => {
      const list = h.closest("section").querySelector('[class*="tc-list" i]');
      if (!list) return { route: "no list" };
      const box = list.getBoundingClientRect();
      const items = [...list.children];
      return {
        heading: getComputedStyle(h).textAlign,
        centred: Math.abs(box.left + box.width / 2 - document.documentElement.clientWidth / 2) < 2,
        aligns: [...new Set(items.map((i) => getComputedStyle(i).textAlign))],
        lefts: new Set(items.map((i) => Math.round(i.getBoundingClientRect().left))).size,
        numbered: items.every((i) => getComputedStyle(i, "::before").content.includes("counter")),
      };
    });
    expect(r, route).toEqual({ heading: "center", centred: true, aligns: ["left"], lefts: 1, numbered: true });
    seen += 1;
  }
  expect(seen).toBeGreaterThan(50);
});

for (const width of [1440, 1024, 768, 390, 360]) {
  test(`the Blog headline stays on one line at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await open(page, "/blog");
    const h = page.locator(".blogpage-banner-heading");
    await expect(h).toHaveAttribute("data-lt-line", "all", { timeout: 15_000 });
    const m = await h.evaluate((e) => {
      const r = document.createRange();
      r.selectNodeContents(e);
      return {
        lines: new Set([...r.getClientRects()].map((c) => Math.round(c.top))).size,
        left: r.getBoundingClientRect().left,
        right: r.getBoundingClientRect().right,
        vw: document.documentElement.clientWidth,
        size: parseFloat(getComputedStyle(e).fontSize),
      };
    });
    expect(m.lines).toBe(1);
    expect(m.left).toBeGreaterThanOrEqual(0);
    expect(m.right).toBeLessThanOrEqual(m.vw);
    expect(m.size).toBeGreaterThanOrEqual(20);
  });
}
