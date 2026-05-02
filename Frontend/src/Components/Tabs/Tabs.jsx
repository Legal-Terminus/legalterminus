import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Tabs.css";

import Incorporation from "../Incorporation/Incorporation";
import Steps from "../Steps/Steps";
import Documents from "../Documents/Documents";
import Faq from "../Faq/Faq";
import WhyUs from "../WhyUs/WhyUs";
import OurClients from "../OurClients/OurClients";
import BlogDetailsTestimonial from "../BlogDetailsTestimonial/BlogDetailsTestimonial";

/**
 * Tab items — keep these as you had them
 */
const TAB_ITEMS = [
  { id: "inc", label: "Incorporation of wholly owned" },
  { id: "steps", label: "Steps of incorporation" },
  { id: "docs", label: "Document Required" },
  { id: "faq", label: "Faq" },
  { id: "why", label: "Why we stand out" },
  { id: "test", label: "Testimonial" },
  { id: "clients", label: "Our client" }
];

// Component references — instantiated only when their tab is active
const PanelsMap = {
  inc: Incorporation,
  steps: Steps,
  docs: Documents,
  faq: Faq,
  why: WhyUs,
  test: BlogDetailsTestimonial,
  clients: OurClients,
};

const Tabs = () => {
  const [active, setActive] = useState(TAB_ITEMS[0].id);

  // refs for each tab button and the scrolling row
  const tabsRef = useRef([]);
  const rowRef = useRef(null);

  // sticky-on-scroll state and measurements
  const [isFixed, setIsFixed] = useState(false);
  const rowTopRef = useRef(0);
  const rowHeightRef = useRef(0);

  // Shared measurement function — used by both scroll and resize handlers
  const updateMeasurements = useCallback(() => {
    const rowEl = rowRef.current;
    if (!rowEl) return;
    const rect = rowEl.getBoundingClientRect();
    rowHeightRef.current = rect.height;
    rowTopRef.current = rect.top + window.scrollY;
    const wrap = rowEl.closest(".TabSec-wrap");
    if (wrap) wrap.style.setProperty("--tabsec-sticky-height", `${Math.ceil(rect.height + 12)}px`);
  }, []);

  // Keep active tab visible inside horizontal scroller (buffered)
  useEffect(() => {
    const activeIndex = TAB_ITEMS.findIndex((t) => t.id === active);
    const el = tabsRef.current[activeIndex];
    const container = rowRef.current;
    if (!el || !container) return;
    const buffer = 14;
    const elLeft = el.offsetLeft;
    const elRight = elLeft + el.offsetWidth;
    const viewLeft = container.scrollLeft;
    const viewRight = viewLeft + container.clientWidth;
    if (elLeft - buffer < viewLeft) {
      container.scrollTo({ left: Math.max(0, elLeft - buffer), behavior: "smooth" });
    } else if (elRight + buffer > viewRight) {
      container.scrollTo({
        left: elRight - container.clientWidth + buffer,
        behavior: "smooth"
      });
    }
  }, [active]);

  // keyboard navigation: ArrowLeft/ArrowRight/Home/End/Enter/Space
  const onKeyDown = (e, index) => {
    const max = TAB_ITEMS.length;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (index + 1) % max;
      tabsRef.current[next].focus();
      setActive(TAB_ITEMS[next].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (index - 1 + max) % max;
      tabsRef.current[prev].focus();
      setActive(TAB_ITEMS[prev].id);
    } else if (e.key === "Home") {
      e.preventDefault();
      tabsRef.current[0].focus();
      setActive(TAB_ITEMS[0].id);
    } else if (e.key === "End") {
      e.preventDefault();
      tabsRef.current[max - 1].focus();
      setActive(TAB_ITEMS[max - 1].id);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const id = TAB_ITEMS[index].id;
      const panel = document.getElementById(`panel-${id}`);
      if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(id);
    }
  };

  // click behavior: set active, scroll to panel, focus button without scrolling viewport
  const handleTabClick = (id, index) => {
    setActive(id);
    const panel = document.getElementById(`panel-${id}`);
    if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
    const btn = tabsRef.current[index];
    if (btn) btn.focus({ preventScroll: true });
  };

  // Single effect: registers scroll + resize once on mount; uses refs to avoid stale closure
  const isFixedRef = useRef(isFixed);
  isFixedRef.current = isFixed;

  useEffect(() => {
    if (typeof window === "undefined") return;

    updateMeasurements();
    window.addEventListener("load", updateMeasurements, { once: true });

    const handleScroll = () => {
      if (!rowTopRef.current) return;
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY >= rowTopRef.current && !isFixedRef.current) setIsFixed(true);
      else if (scrollY < rowTopRef.current && isFixedRef.current) setIsFixed(false);
    };

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateMeasurements, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateMeasurements]);

  return (
    <div className="TabSec-outer">
      <div className="TabSec-wrap full-width">
        <header className="TabSec-header">
          <div className="TabSec-title">
            <h1>Company Formation</h1>
            <p className="TabSec-sub">Clear steps, documents and support for wholly owned incorporation</p>
          </div>
          <div className="TabSec-meta" aria-hidden="true">
            <div className="TabSec-pill">Trusted · Transparent · Fast</div>
          </div>
        </header>

        <div aria-hidden="true" className="TabSec-visuallyHidden">Navigation tabs for company information</div>

        {/* Spacer prevents page jump when the row becomes fixed */}
        {isFixed && (
          <div
            className="TabSec-spacer"
            style={{ height: rowHeightRef.current ? `${rowHeightRef.current}px` : undefined }}
            aria-hidden="true"
          />
        )}

        <nav
          ref={rowRef}
          className={`TabSec-row ${isFixed ? "TabSec-fixed" : ""}`}
          role="tablist"
          aria-label="Company information tabs"
        >
          <div className="TabSec-inner" role="presentation">
            {TAB_ITEMS.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => (tabsRef.current[i] = el)}
                id={`tab-${t.id}`}
                role="tab"
                aria-controls={`panel-${t.id}`}
                aria-selected={active === t.id}
                tabIndex={active === t.id ? 0 : -1}
                className={`TabSec-tab ${active === t.id ? "TabSec-active" : ""}`}
                onClick={() => handleTabClick(t.id, i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                title={t.label}
                type="button"
              >
                <span className="TabSec-tabIcon" aria-hidden="true" />
                <span className="TabSec-tabLabel">{t.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <main className="TabSec-panel" role="region" aria-live="polite">
          {TAB_ITEMS.map((t) => {
            const ActivePanel = PanelsMap[t.id];
            return (
              <section
                key={t.id}
                id={`panel-${t.id}`}
                role="region"
                aria-labelledby={`tab-${t.id}`}
                className="TabSec-panelContent TabSec-isActive"
                hidden={active !== t.id}
              >
                <div className="TabSec-panelInner">
                  <div className="TabSec-panelHeading">
                    <h2>{t.label}</h2>
                  </div>
                  <div className="TabSec-panelBody">
                    {active === t.id && <ActivePanel />}
                  </div>
                </div>
              </section>
            );
          })}
        </main>
      </div>
    </div>
  );
};

export default Tabs;
