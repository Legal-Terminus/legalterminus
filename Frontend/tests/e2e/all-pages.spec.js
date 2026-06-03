// @ts-check
import { test, expect } from "@playwright/test";

/**
 * All routes defined in Frontend/src/App.jsx.
 * Each entry: { path, label }
 * Skipped routes (auth-gated or redirect-only):
 *   /my-profile  — requires login
 *   /payment/result — needs query params
 *   /blog/:slug  — dynamic, tested separately
 */
const ROUTES = [
  // Core
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/contact/us", label: "Contact Us" },
  { path: "/media", label: "Media" },

  // Auth (public)
  { path: "/login", label: "Login" },
  { path: "/signup", label: "Signup" },
  { path: "/forgot-password", label: "Forgot Password" },

  // Blog
  { path: "/blog", label: "Blog" },
  { path: "/blog/details", label: "Blog Details" },

  // Company registrations
  { path: "/private-limited-company-registration-in-india", label: "Private Limited" },
  { path: "/one-person-company", label: "OPC" },
  { path: "/public-limited-company-registration-in-india", label: "Public Limited" },
  { path: "/incorption-registration-in-india", label: "Incorporation" },
  { path: "/trust", label: "Trust" },
  { path: "/society", label: "Society" },
  { path: "/section-8", label: "Section 8" },
  { path: "/llp", label: "LLP" },
  { path: "/proprietorship", label: "Proprietorship" },
  { path: "/partnership", label: "Partnership" },

  // Tax / compliance
  { path: "/gst-registration", label: "GST Registration" },
  { path: "/gst-return-filing", label: "GST Return Filing" },
  { path: "/epf", label: "EPF Registration" },
  { path: "/udyam", label: "Udyam Registration" },
  { path: "/esic", label: "ESIC Registration" },
  { path: "/professional-tax", label: "Professional Tax" },
  { path: "/shop-establishment", label: "Shop & Establishment" },
  { path: "/itr-individual", label: "ITR Individual" },
  { path: "/itr-business", label: "ITR Business" },
  { path: "/annual-filing-company", label: "Annual Filing Company" },
  { path: "/annual-filing-llp", label: "Annual Filing LLP" },
  { path: "/epf-return", label: "EPF Return" },
  { path: "/esi-return", label: "ESI Return" },
  { path: "/professional-tax-return", label: "Professional Tax Return" },

  // Licenses
  { path: "/iec", label: "IEC" },
  { path: "/food-license", label: "Food License" },
  { path: "/trade-license", label: "Trade License" },
  { path: "/labour-license", label: "Labour License" },
  { path: "/bar-code", label: "Bar Code" },
  { path: "/iso", label: "ISO Certification" },

  // Conversions
  { path: "/conversion/partnership-to-private", label: "Partnership to Private" },
  { path: "/conversion/llp-to-private", label: "LLP to Private" },
  { path: "/conversion/private-to-llp", label: "Private to LLP" },
  { path: "/conversion/proprietorship-to-opc", label: "Proprietorship to OPC" },
  { path: "/conversion/proprietorship-to-private", label: "Proprietorship to Private" },
  { path: "/conversion/partnership-to-llp", label: "Partnership to LLP" },
  { path: "/conversion/private-to-public", label: "Private to Public" },
  { path: "/conversion/public-to-private", label: "Public to Private" },

  // Updations
  { path: "/updation/change-name-company", label: "Change Name Company" },
  { path: "/updation/change-address-llp", label: "Change Address LLP" },
  { path: "/updation/change-object-llp", label: "Change Object LLP" },
  { path: "/updation/change-name-llp", label: "Change Name LLP" },
  { path: "/updation/change-address-company", label: "Change Address Company" },
  { path: "/updation/change-object-company", label: "Change Object Company" },
  { path: "/updation/increase-authorised-capital", label: "Increase Authorised Capital" },
  { path: "/updation/add-remove-director", label: "Add / Remove Director" },
  { path: "/updation/change-name-company-to-company", label: "Change Name Company to Company" },
  { path: "/updation/change-name-llp-to-llp", label: "Change Name LLP to LLP" },

  // Windup
  { path: "/windup/dissolve-private", label: "Dissolve Private" },
  { path: "/windup/dissolve-llp", label: "Dissolve LLP" },
  { path: "/windup/dissolve-partnership", label: "Dissolve Partnership" },
  { path: "/windup/wind-up-plc", label: "Wind Up PLC" },

  // Trademark
  { path: "/trademark/opposition", label: "Trademark Opposition" },
  { path: "/trademark/hearing", label: "Trademark Hearing" },
  { path: "/trademark/renewal", label: "Trademark Renewal" },
  { path: "/trademark/application", label: "Trademark Application" },
  { path: "/trademark/exam-reply", label: "Trademark Exam Reply" },

  // Misc services
  { path: "/olwf", label: "OLWF" },
  { path: "/startup-india", label: "Startup India" },
  { path: "/startup-odisha", label: "Startup Odisha" },

  // Policies
  { path: "/privacy-policy", label: "Privacy Policy" },
  { path: "/terms-conditions", label: "Terms & Conditions" },
  { path: "/refund-policy", label: "Refund Policy" },
  { path: "/confidentiality-policy", label: "Confidentiality Policy" },
];

/** Error indicators injected by React Error Boundary or unhandled exceptions */
const ERROR_PATTERNS = [
  /something went wrong/i,
  /application error/i,
  /unexpected error/i,
  /cannot read propert/i,
  /is not defined/i,
  /loading chunk/i,
];

/** Maximum allowed page load time in milliseconds (2 seconds = 2000ms) */
const MAX_LOAD_TIME_MS = 2000;

for (const { path, label } of ROUTES) {
  test(`[${label}] ${path} — loads with visible content`, async ({ page }) => {
    const consoleErrors = [];
    const jsErrors = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => jsErrors.push(err.message));

    // Track load time from navigation start to page interactive
    const navigationStartTime = Date.now();
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    const domContentLoadedTime = Date.now() - navigationStartTime;

    // 1. HTTP status should be 2xx (Vite SPA always serves 200, but guard anyway)
    expect(response?.status() ?? 200, `HTTP error on ${path}`).toBeLessThan(400);

    // 2. Wait for React to hydrate (use "load" instead of "networkidle")
    // Pages with embedded YouTube videos make continuous XHR requests that prevent networkidle from completing
    await page.waitForLoadState("load");
    const fullLoadTime = Date.now() - navigationStartTime;

    // PERFORMANCE CHECK: Ensure page loads within 2 seconds
    expect(
      fullLoadTime,
      `⚠️ PERF: Page load took ${fullLoadTime}ms (threshold: ${MAX_LOAD_TIME_MS}ms) on ${path}`
    ).toBeLessThanOrEqual(MAX_LOAD_TIME_MS);

    // 3. Page body must have meaningful text (not blank / spinner-only)
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.trim().length, `Page body is empty on ${path}`).toBeGreaterThan(50);

    // 4. No React error boundary / crash messages visible in the DOM
    const pageContent = await page.content();
    for (const pattern of ERROR_PATTERNS) {
      expect(
        pattern.test(pageContent),
        `Error pattern "${pattern}" found in page content of ${path}`
      ).toBe(false);
    }

    // 5. Navbar must be present (shared across all pages)
    await expect(page.locator("nav").first(), `Navbar missing on ${path}`).toBeVisible();

    // 6. No unhandled JS exceptions
    expect(jsErrors, `JS errors on ${path}: ${jsErrors.join("; ")}`).toHaveLength(0);

    // Report performance and console error annotations
    test.info().annotations.push({
      type: "Load Time",
      description: `DCL: ${domContentLoadedTime}ms | Full Load: ${fullLoadTime}ms`,
    });

    if (consoleErrors.length) {
      test.info().annotations.push({
        type: "Console Errors",
        description: consoleErrors.slice(0, 5).join("\n"),
      });
    }
  });
}
