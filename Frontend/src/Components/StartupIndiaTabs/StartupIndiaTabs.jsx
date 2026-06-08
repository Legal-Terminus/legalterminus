import React, { useState } from "react";
import "../PvtltdTabs/PvtltdTabs.css";

const tabs = [
  { label: "Why Startup India", id: "overview" },
  { label: "Eligible Entities", id: "types" },
  { label: "Benefits", id: "benefits" },
  { label: "Process", id: "process" },
  { label: "Documents", id: "documents" },
  { label: "FAQ's", id: "faq" },
];

const StartupIndiaTabs = () => {
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

export default StartupIndiaTabs;
