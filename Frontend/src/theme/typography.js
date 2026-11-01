/**
 * Theme C typography that CSS alone cannot express (#209 — the firm's review of
 * 13 Oct and their answers of 22 Oct). Loaded only when the switch is on
 * (main.jsx imports it inside the THEME_C branch, so the live build has none of it).
 *
 * 1. "All headlines centre-aligned and on a single line." The centring is CSS
 *    (typography.css). Fitting is here: CSS cannot shrink text to its container.
 *    From 768px up, a section headline that would wrap is set a little smaller,
 *    down to MIN_PX, until it fits on one line; one that still does not fit at
 *    MIN_PX is left to wrap rather than overflow. On phones headlines wrap
 *    normally — a single line there would need unreadably small type. The Home
 *    hero's two lines ("Build Your Business with Passion." / "Run It Smarter
 *    with Legal Terminus.") are fitted together, at every width, so they stay
 *    two lines of one size.
 *
 * Round 4 (the firm, 30 Oct): Home keeps points 2 and 3 as below; on every other
 * page paragraphs are left-aligned and only a one-line description is centred
 * (`lt-home` on <html>, `data-lt-sub="short|long"`, read by typography.css).
 *
 * 2. "All paragraphs justified" (except the Terms & Conditions on the Private
 *    Limited page, which the CSS centres). A paragraph is marked
 *    `data-lt-justify` only when it is left-aligned AND runs to two lines or
 *    more. Justifying a one-line paragraph does nothing visible, and justifying
 *    a CENTRED one would push it to the left — so captions, prices and
 *    sub-headings centred by design are left alone.
 *
 * 3. The small label above a section headline and the short sentence under it
 *    are centred with the headline ("all headlines and short description in
 *    middle align"). They are marked here (`data-lt-eyebrow`, `data-lt-sub`)
 *    because whether a sibling is a short description or a long intro, and
 *    whether a label is inline, can only be read from the page.
 *
 * Everything reruns when React adds sections (they lazy-load as the page
 * scrolls), when the window is resized, and after a click (accordions open).
 * Only attributes and inline font sizes are written; no text is changed.
 */

const MIN_PX = 22;          // smallest size a fitted section headline may get
const HERO_MIN_PX = 20;     // the hero's two lines may go a little smaller on phones
const FIT_FROM = 768;       // below this, section headlines wrap normally
const SUB_MAX_CHARS = 450;  // longer than this, the text under a headline is body copy, not a short description

// the site header (a <header role="banner">), the footer and popups. Not every
// <header>: many sections wrap their headline in one.
const SKIP = ".header-wrapper, nav, .premium-footer, [role='dialog'], .checkout-modal, .modal, .drawer";
const HEADLINE = "#root h2";

function visible(el) {
  if (!el || !el.isConnected) return false;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden";
}

function textWidth(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  return range.getBoundingClientRect().width;
}

function contentWidth(el) {
  const cs = getComputedStyle(el);
  return el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
}

function reset(line) {
  line.removeAttribute("data-lt-line");
  line.style.removeProperty("--lt-fit-size");
}

/**
 * Fit `lines` (each meant to be one line) into `box`'s width, at one shared size.
 * The result is an attribute and a size variable, not inline white-space/font-size:
 * the CSS applies them only where they are valid (`data-lt-line="wide"` from 768px
 * up), so turning a tablet or narrowing a window can never leave a desktop-sized,
 * unwrappable headline sticking out of a phone screen while the refit is pending.
 */
function fit(lines, box, minPx, scope) {
  lines.forEach(reset);
  const avail = contentWidth(box);
  if (avail <= 0) return;
  // measure each line unwrapped (inline, only for the length of this function)
  lines.forEach((l) => l.style.setProperty("white-space", "nowrap"));
  let scale = 1;
  let base = Infinity;
  for (const l of lines) {
    const w = textWidth(l);
    if (w > 0) scale = Math.min(scale, avail / w);
    base = Math.min(base, parseFloat(getComputedStyle(l).fontSize));
  }
  lines.forEach((l) => l.style.removeProperty("white-space"));
  if (scale >= 1) { lines.forEach((l) => l.setAttribute("data-lt-line", scope)); return; }
  const size = Math.floor(base * scale * 0.985 * 10) / 10;
  if (size < minPx) return;                     // cannot fit legibly: let it wrap
  lines.forEach((l) => {
    l.setAttribute("data-lt-line", scope);
    l.style.setProperty("--lt-fit-size", `${size}px`);
  });
}

// A headline is fitted once per viewport width (and again once the web font has
// loaded): the DOM changes constantly (carousels), headlines do not.
let fitKey = "";
function fitHeadlines(force) {
  if (force) fitKey = String(Math.random());
  const key = `${window.innerWidth}|${fitKey}`;
  const wide = window.innerWidth >= FIT_FROM;
  for (const h of document.querySelectorAll(HEADLINE)) {
    if (h.closest(SKIP) || !visible(h) || h.dataset.ltFit === key) continue;
    h.dataset.ltFit = key;
    if (wide) fit([h], h.parentElement, MIN_PX, "wide");
    else reset(h);
  }
  const hero = document.querySelector("#root .hs-hero__title");
  if (hero && visible(hero) && hero.dataset.ltFit !== key) {
    hero.dataset.ltFit = key;
    const lines = [...hero.children].filter((c) => /hs-title-(dark|green)/.test(c.className));
    if (lines.length) fit(lines, hero.parentElement, HERO_MIN_PX, "all");
  }
  // "Discover Our Articles & News" (the firm, #209): one line at every width.
  const blog = document.querySelector("#root .blogpage-banner-heading");
  if (blog && visible(blog) && blog.dataset.ltFit !== key) {
    blog.dataset.ltFit = key;
    fit([blog], blog.parentElement, HERO_MIN_PX, "all");
  }
}

function lineCount(el) {
  const cs = getComputedStyle(el);
  const lh = parseFloat(cs.lineHeight) || 1.2 * parseFloat(cs.fontSize);
  return el.getBoundingClientRect().height / lh;
}

function markAroundHeadlines() {
  for (const h of document.querySelectorAll(HEADLINE)) {
    if (h.closest(SKIP)) continue;
    const prev = h.previousElementSibling;
    // not a decoration laid behind the headline (e.g. a giant faded "Testimonials")
    const decorative = prev && (prev.getAttribute("aria-hidden") === "true"
      || /^(absolute|fixed)$/.test(getComputedStyle(prev).position));
    if (prev && !decorative && !prev.hasAttribute("data-lt-eyebrow") && visible(prev)
        && prev.textContent.trim().length > 0 && prev.textContent.trim().length < 120) {
      // auto margins do not move an inline box, so the CSS needs to know which it is
      const display = getComputedStyle(prev).display;
      prev.setAttribute("data-lt-eyebrow", display.startsWith("inline") ? display : "block");
    }
    let next = h.nextElementSibling;
    // a decorative rule under the headline (no text) is centred with it, and
    // the description is the element after it
    if (next && !next.textContent.trim() && !next.querySelector("img, svg, video, iframe")) {
      next.setAttribute("data-lt-deco", "");
      next = next.nextElementSibling;
    }
    if (next && /^(P|SPAN)$/.test(next.tagName) && visible(next)) {
      const n = next.textContent.trim().length;
      if (n > 0 && n <= SUB_MAX_CHARS) {
        // re-read every run: the same sentence is one line on a laptop and three on a phone
        const value = lineCount(next) < 1.8 ? "short" : "long";
        if (next.getAttribute("data-lt-sub") !== value) next.setAttribute("data-lt-sub", value);
      }
    }
  }
}

function markParagraphs() {
  for (const p of document.querySelectorAll("#root p:not([data-lt-justify]):not([data-lt-sub])")) {
    if (!visible(p) || p.closest(".header-wrapper, nav, [role='dialog']")) continue;
    const cs = getComputedStyle(p);
    if (cs.textAlign !== "left" && cs.textAlign !== "start") continue;
    if (lineCount(p) < 1.8) continue;   // one line: nothing to justify
    p.setAttribute("data-lt-justify", "");
  }
}

function run(force = false) {
  // Home is approved as it stands (the firm, 30 Oct); the CSS keys the
  // justified text and centred intros off this class.
  document.documentElement.classList.toggle("lt-home", window.location.pathname === "/");
  markAroundHeadlines();
  fitHeadlines(force);
  markParagraphs();
}

// A throttle, not a debounce: the client-logo carousel and the testimonials
// change the DOM every few hundred milliseconds, and a debounce that restarts
// on every change would never run.
let queued = 0;
let forceNext = false;
function schedule(delay = 120, force = false) {
  forceNext = forceNext || force;
  if (queued) return;
  queued = setTimeout(() => {
    queued = 0;
    const f = forceNext;
    forceNext = false;
    requestAnimationFrame(() => run(f));
  }, delay);
}

let started = false;
export function startTypography() {
  if (started || typeof window === "undefined") return;
  started = true;
  new MutationObserver(() => schedule()).observe(document.body, { childList: true, subtree: true });
  window.addEventListener("resize", () => schedule(150));
  document.addEventListener("click", () => schedule(400), true);
  // Roboto arrives after first paint and is wider than the fallback: refit then
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => schedule(0, true));
  schedule(0);
}
