import React, { useEffect, useRef, useState } from "react";
import "./BCtabs.css";

const tabs = [
  { label: "What is Barcode (GS1)", id: "company" },
  { label: "Types", id: "types" },
  { label: "Benefits", id: "requirements" },
  { label: "Process & Steps", id: "process" },
  { label: "Documents", id: "documents" },
  { label: "FAQ's", id: "faq" },
];

const BCTabs = () => {
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

  const handleTabClick = (index, id) => {
    setActiveIndex(index);
    setSidebarOpen(true);
    scrollToSection(id);
  };

  const handleSidebarNav = (index, id) => {
    setActiveIndex(index);
    scrollToSection(id);
  };

  useEffect(() => {
    const wrapper = document.getElementById("bc-nav-sections");
    if (!wrapper) return;
    wrapper.classList.toggle("bc-sections-shifted", sidebarOpen);
    return () => wrapper.classList.remove("bc-sections-shifted");
  }, [sidebarOpen]);

  useEffect(() => {
    scrollActiveTabIntoView(activeIndex);
  }, [activeIndex]);

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
      <section className={`bc-tabs-section${sidebarOpen ? " bc-sidebar-open-mode" : ""}`}>
        <div className="bc-tabs-container">
          <div className="bc-tabs-card">
            <div
              ref={tabListRef}
              className="bc-tabs-list"
              style={{ justifyContent: "center" }}
            >
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  ref={(el) => (tabRefs.current[index] = el)}
                  type="button"
                  className={`bc-tab${index === activeIndex ? " active" : ""}`}
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
        <aside className="bc-slim-sidebar" role="navigation" aria-label="Page sections">
          <button
            className="bc-slim-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
          <nav className="bc-slim-nav">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                className={`bc-slim-item${index === activeIndex ? " active" : ""}`}
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

export default BCTabs;
