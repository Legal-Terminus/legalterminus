import React, { useState } from "react";
import "./EPFRegTabs.css";

const tabs = [
  { label: "Overview", id: "overview" },
  { label: "Benefits", id: "benefits" },
  { label: "Applicability", id: "applicability" },
  { label: "Documents", id: "documents" },
  { label: "Process", id: "process" },
  { label: "Penalties", id: "penalties" },
  { label: "Why LegalTerminus", id: "why" },
  { label: "FAQ's", id: "faq" },
];

const EPFRegTabs = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index, id) => {
    setActiveIndex(index);

    const section = document.getElementById(id);
    if (section) {
      const tabsEl = document.querySelector(".pvt-tabs-section");
      const offset = tabsEl ? tabsEl.offsetHeight : 104;
      const top = section.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section className="pvt-tabs-section">
      <div className="pvt-tabs-container">
        <div className="pvt-tabs-card">
          <div className="pvt-tabs-list">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                className={`pvt-tab ${index === activeIndex ? "active" : ""}`}
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

export default EPFRegTabs;
