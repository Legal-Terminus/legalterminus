import React, { useState } from "react";
import "./CICtabs.css";

const tabs = [
  { label: "Why Choose pvt Ltd", id: "company" },
  { label: "Types", id: "types" },
  { label: "Requirements", id: "requirements" },
  // { label: "Process & Steps", id: "process" },
  // { label: "Documents", id: "documents" },
  { label: "FAQ's", id: "faq" },
];

const cicTabs = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index, id) => {
    setActiveIndex(index);

    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="cic-tabs-section">
      <div className="cic-tabs-container">
        <div className="cic-tabs-card">
          <div className="cic-tabs-list">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                className={`cic-tab ${index === activeIndex ? "active" : ""}`}
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

export default cicTabs;
