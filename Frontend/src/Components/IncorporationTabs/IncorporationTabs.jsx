import React, { useState } from "react";
import "./IncorporationTabs.css";

const tabs = [
  { label: "Why Choose WOS", id: "company" },
  { label: "Types", id: "types" },
  { label: "Requirements", id: "requirements" },
  { label: "Process & Steps", id: "process" },
  { label: "Documents", id: "documents" },
  { label: "FAQ's", id: "faq" },
];

const IncorporationTabs = () => {
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
    <section className="incorp-tabs-section">
      <div className="incorp-tabs-container">
        <div className="incorp-tabs-card">

          <div className="incorp-tabs-list">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                className={`incorp-tab ${
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

export default IncorporationTabs;
