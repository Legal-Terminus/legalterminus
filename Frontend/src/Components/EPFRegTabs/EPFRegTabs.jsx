import React, { useEffect, useRef, useState } from "react";
import "./EPFRegTabs.css";

const tabs = [
  { label: "Why Choose EPF", id: "overview" },
  { label: "Applicability", id: "applicability" },
  { label: "Benefits", id: "benefits" },
  { label: "Steps", id: "process" },
  { label: "Documents", id: "documents" },
  { label: "FAQ's", id: "faq" },
];

const EPFRegTabs = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const tabListRef = useRef(null);
  const tabRefs = useRef([]);

  const scrollActiveTabIntoView = (index) => {
    const list = tabListRef.current;
    const btn = tabRefs.current[index];
    if (!list || !btn) return;
    const listWidth = list.offsetWidth;
    const btnLeft = btn.offsetLeft;
    const btnWidth = btn.offsetWidth;
    list.scrollTo({ left: btnLeft - listWidth / 2 + btnWidth / 2, behavior: "smooth" });
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Click on horizontal tab → open sidebar + scroll
  const handleTabClick = (index, id) => {
    setActiveIndex(index);
    setSidebarOpen(true);
    scrollToSection(id);
  };

  // Click inside sidebar → scroll only (sidebar stays open)
  const handleSidebarNav = (index, id) => {
    setActiveIndex(index);
    scrollToSection(id);
  };

  // Shift the sections wrapper right when sidebar opens/closes
  useEffect(() => {
    const wrapper = document.getElementById("epf-nav-sections");
    if (!wrapper) return;
    wrapper.classList.toggle("epf-sections-shifted", sidebarOpen);
    return () => wrapper.classList.remove("epf-sections-shifted");
  }, [sidebarOpen]);

  // Keep horizontal active tab centred
  useEffect(() => {
    scrollActiveTabIntoView(activeIndex);
  }, [activeIndex]);

  // Update active index while scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = tabs.findIndex((t) => t.id === entry.target.id);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { rootMargin: "-50% 0px -40% 0px", threshold: 0 }
    );
    tabs.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ── Horizontal sticky bar (always visible) ── */}
      <section className={`epf-tabs-section${sidebarOpen ? " sidebar-open-mode" : ""}`}>
        <div className="epf-tabs-container">
          <div className="epf-tabs-card">
            <div
              ref={tabListRef}
              className="epf-tabs-list"
              style={{ justifyContent: "center" }}
            >
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  ref={(el) => (tabRefs.current[index] = el)}
                  type="button"
                  className={`epf-tab${index === activeIndex ? " active" : ""}`}
                  onClick={() => handleTabClick(index, tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Slim sidebar card ── */}
      {sidebarOpen && (
        <aside className="epf-slim-sidebar" role="navigation" aria-label="Page sections">
          <button
            className="epf-slim-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
          <nav className="epf-slim-nav">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                className={`epf-slim-item${index === activeIndex ? " active" : ""}`}
                onClick={() => handleSidebarNav(index, tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>
      )}
    </>
  );
};

export default EPFRegTabs;
