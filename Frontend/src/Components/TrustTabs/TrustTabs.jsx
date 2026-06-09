import React, { useEffect, useRef, useState } from "react";
import "./TrustTabs.css";

const tabs = [
  { label: "Why Choose Trust", id: "company" },
  { label: "Types", id: "types" },
  { label: "Benefits", id: "requirements" },
  { label: "Process & Steps", id: "process" },
  { label: "Documents", id: "documents" },
  { label: "FAQ's", id: "faq" },
];

const TrustTabs = () => {
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
    const wrapper = document.getElementById("trust-nav-sections");
    if (!wrapper) return;
    wrapper.classList.toggle("trust-sections-shifted", sidebarOpen);
    return () => wrapper.classList.remove("trust-sections-shifted");
  }, [sidebarOpen]);

  // Keep horizontal active tab centred when sidebar is closed
  useEffect(() => {
    if (!sidebarOpen) scrollActiveTabIntoView(activeIndex);
  }, [activeIndex, sidebarOpen]);

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
      {/* ── Horizontal sticky bar (compact label when sidebar open) ── */}
      <section className={`new-trusted-tabs-section${sidebarOpen ? " sidebar-open-mode" : ""}`}>
        <div className="new-trusted-tabs-container">
          <div className="new-trusted-tabs-card">
            {sidebarOpen ? (
              <div className="trust-compact-bar">
                <span className="trust-compact-label">
                  {tabs[activeIndex]?.label}
                </span>
              </div>
            ) : (
              <div
                ref={tabListRef}
                className="new-trusted-tabs-list"
                style={{ justifyContent: "center" }}
              >
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    ref={(el) => (tabRefs.current[index] = el)}
                    type="button"
                    className={`new-trusted-tab${index === activeIndex ? " active" : ""}`}
                    onClick={() => handleTabClick(index, tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Slim sticky sidebar ── */}
      {sidebarOpen && (
        <aside className="trust-slim-sidebar" role="navigation" aria-label="Page sections">
          <div className="trust-slim-header">
            <span className="trust-slim-title">Sections</span>
            <button
              className="trust-slim-close"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>
          <nav className="trust-slim-nav">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                className={`trust-slim-item${index === activeIndex ? " active" : ""}`}
                onClick={() => handleSidebarNav(index, tab.id)}
              >
                <span className="trust-slim-dot" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>
      )}
    </>
  );
};

export default TrustTabs;
