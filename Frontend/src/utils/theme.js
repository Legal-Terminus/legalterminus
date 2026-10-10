/**
 * The Theme C switch (E-25, #209).
 *
 * The website is being restyled to the approved "Theme C" design, page family by
 * page family. Trunk delivery means that work sits on `main` long before the
 * whole site is done, so it is OFF unless the build sets VITE_THEME_C=true —
 * which only the QA build does. The live build renders exactly as before.
 *
 * On: `theme-c` is put on <html> and the Figtree typeface is loaded. Every rule
 * in src/theme/ is scoped under `html.theme-c`, so with the switch off the
 * stylesheet is inert. Removed, with the scope, in E25-S11 once the firm signs off.
 */
export const THEME_C = import.meta.env.VITE_THEME_C === "true";

const FIGTREE = "https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&display=swap";

export function applyTheme(doc = document) {
  if (!THEME_C) return;
  doc.documentElement.classList.add("theme-c");
  if (doc.querySelector('link[data-theme-font]')) return;
  for (const [rel, href, cross] of [
    ["preconnect", "https://fonts.googleapis.com"],
    ["preconnect", "https://fonts.gstatic.com", true],
    ["stylesheet", FIGTREE],
  ]) {
    const link = doc.createElement("link");
    link.rel = rel; link.href = href;
    if (cross) link.crossOrigin = "anonymous";
    if (rel === "stylesheet") link.dataset.themeFont = "figtree";
    doc.head.appendChild(link);
  }
}
