import React, { useEffect, useRef, useState } from "react";
import "./TmhearTabs.css";

const tabs = [
  { label: "Why Hearing Matters", id: "company" },
  { label: "Types", id: "types" },
  { label: "Benefits", id: "requirements" },
  { label: "Steps", id: "process" },
  { label: "Documents", id: "documents" },
  { label: "FAQ's", id: "faq" },
];

const TmhearTabs = () => {
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
    const wrapper = document.getElementById("tmhear-nav-sections");
    if (!wrapper) return;
    wrapper.classList.toggle("tmhear-sections-shifted", sidebarOpen);
    return () => wrapper.classList.remove("tmhear-sections-shifted");
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
      <section className={`tmhear-tabs-section${sidebarOpen ? " sidebar-open-mode" : ""}`}>
        <div className="tmhear-tabs-container">
          <div className="tmhear-tabs-card">
            <div
              ref={tabListRef}
              className="tmhear-tabs-list"
              style={{ justifyContent: "center" }}
            >
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  ref={(el) => (tabRefs.current[index] = el)}
                  type="button"
                  className={`tmhear-tab${index === activeIndex ? " active" : ""}`}
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
        <aside className="tmhear-slim-sidebar" role="navigation" aria-label="Page sections">
          <button
            className="tmhear-slim-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
          <nav className="tmhear-slim-nav">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                className={`tmhear-slim-item${index === activeIndex ? " active" : ""}`}
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

export default TmhearTabs;
