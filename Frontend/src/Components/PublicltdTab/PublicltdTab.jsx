import React, { useState } from "react";
import "./PublicltdTab.css";

const tabs = [
  { label: "Why Choose Public ltd", id: "company" },
  { label: "Types", id: "features" },
  { label: "Benefits", id: "benefits" },
  { label: "Documents", id: "documents" },
  { label: "Process", id: "process" },
  { label: "FAQ's", id: "faq" },
];

const PvtTabs = () => {
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

export default PvtTabs;
