import { useEffect, useRef, useState } from "react";

/**
 * Theme C count-up (E-25, #209 Home 7): counts from 0 to `to` once, when the
 * number scrolls into view, and lands on `final` — the exact source string
 * ("98%", "1K+"), so the content never differs from the page without the theme.
 * Renders `final` straight away for the prerender, for no-JS and under
 * prefers-reduced-motion. Always one text node.
 */
export default function CountUp({ to, suffix = "", final, duration = 1500 }) {
  const ref = useRef(null);
  const [text, setText] = useState(final);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setText(p < 1 ? `${Math.round(to * eased).toLocaleString("en-IN")}${suffix}` : final);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      setText(`0${suffix}`);
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, suffix, final, duration]);

  return <span ref={ref} className="lt-count">{text}</span>;
}
