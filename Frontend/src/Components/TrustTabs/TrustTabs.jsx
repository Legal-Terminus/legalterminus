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
    const targetScroll = btnLeft - listWidth / 2 + btnWidth / 2;
    list.scrollTo({ left: targetScroll, behavior: "smooth" });
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Click on horizontal tab bar → open sidebar and navigate
  const handleTabClick = (index, id) => {
    setActiveIndex(index);
    setSidebarOpen(true);
    scrollToSection(id);
  };

  // Click inside sidebar → navigate then close
  const handleSidebarNav = (index, id) => {
    setActiveIndex(index);
    scrollToSection(id);
    setTimeout(() => setSidebarOpen(false), 350);
  };

  const closeSidebar = () => setSidebarOpen(false);

  // Keep horizontal bar's active tab in view when sidebar is closed
  useEffect(() => {
    if (!sidebarOpen) scrollActiveTabIntoView(activeIndex);
  }, [activeIndex, sidebarOpen]);

  // Intersection observer: update active tab as user scrolls
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = tabs.findIndex((tab) => tab.id === entry.target.id);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { rootMargin: "-50% 0px -40% 0px", threshold: 0 }
    );

    tabs.forEach((tab) => {
      const section = document.getElementById(tab.id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ── Horizontal sticky tab bar ── */}
      <section className="new-trusted-tabs-section">
        <div className="new-trusted-tabs-container">
          <div className="new-trusted-tabs-card">
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
                  className={`new-trusted-tab ${index === activeIndex ? "active" : ""}`}
                  onClick={() => handleTabClick(index, tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Sidebar overlay ── */}
      {sidebarOpen && (
        <>
          <div
            className="trust-sidebar-backdrop"
            onClick={closeSidebar}
            aria-hidden="true"
          />
          <aside className="trust-sidebar" role="navigation" aria-label="Page sections">
            <div className="trust-sidebar-header">
              <div className="trust-sidebar-header-left">
                <span className="trust-sidebar-icon">☰</span>
                <span className="trust-sidebar-title">Sections</span>
              </div>
              <button
                className="trust-sidebar-close"
                onClick={closeSidebar}
                aria-label="Close navigation"
              >
                ✕
              </button>
            </div>

            <nav className="trust-sidebar-nav">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`trust-sidebar-item ${index === activeIndex ? "active" : ""}`}
                  onClick={() => handleSidebarNav(index, tab.id)}
                >
                  <span className="trust-sidebar-dot" />
                  <span className="trust-sidebar-label">{tab.label}</span>
                  {index === activeIndex && (
                    <span className="trust-sidebar-arrow">›</span>
                  )}
                </button>
              ))}
            </nav>

            <div className="trust-sidebar-footer">
              <span>Tap a section to navigate</span>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default TrustTabs;
