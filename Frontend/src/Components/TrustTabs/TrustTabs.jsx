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
  const tabListRef = useRef(null);
  const tabRefs = useRef([]);

  const scrollActiveTabIntoView = (index) => {
    const list = tabListRef.current;
    const btn = tabRefs.current[index];
    if (!list || !btn) return;
    const listLeft = list.scrollLeft;
    const listWidth = list.offsetWidth;
    const btnLeft = btn.offsetLeft;
    const btnWidth = btn.offsetWidth;
    const targetScroll = btnLeft - listWidth / 2 + btnWidth / 2;
    list.scrollTo({ left: targetScroll, behavior: "smooth" });
  };

  const handleClick = (index, id) => {
    setActiveIndex(index);
    scrollActiveTabIntoView(index);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = tabs.findIndex(
              (tab) => tab.id === entry.target.id
            );
            if (index !== -1) {
              setActiveIndex(index);
              scrollActiveTabIntoView(index);
            }
          }
        });
      },
      {
        rootMargin: "-50% 0px -40% 0px",
        threshold: 0,
      }
    );

    tabs.forEach((tab) => {
      const section = document.getElementById(tab.id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
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
                className={`new-trusted-tab ${
                  index === activeIndex ? "active" : ""
                }`}
                onClick={() => handleClick(index, tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustTabs;
