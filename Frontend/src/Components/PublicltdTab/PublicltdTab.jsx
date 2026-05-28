import React, { useState } from "react";
import "./PublicltdTab.css";

const tabs = [
  { label: "Why Choose Public Ltd", id: "company" },
  { label: "Types", id: "features" },
  { label: "Benefits", id: "benefits" },
  { label: "Documents", id: "documents" },
  { label: "Process", id: "process" },
  { label: "FAQ's", id: "faq" },
];

const PublicltdTabs = () => {
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
    <section className="pub-tabs-section">
      <div className="pub-tabs-container">
        <div className="pub-tabs-card">
          <div className="pub-tabs-list">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                className={`pub-tab ${index === activeIndex ? "active" : ""}`}
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

export default PublicltdTabs;
