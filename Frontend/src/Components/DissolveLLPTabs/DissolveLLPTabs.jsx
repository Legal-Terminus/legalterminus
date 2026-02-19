import React, { useState } from "react";
import "./DissolveLLPTabs.css";

const tabs = [
  { label: "Why Choose Pvt Ltd", id: "company" },
  // { label: "Types", id: "types" },
  { label: "Requirements", id: "requirements" },
  // { label: "Process & Steps", id: "process" },
  // { label: "Documents", id: "documents" },
  { label: "FAQ's", id: "faq" },
];

const DissolveLLPTabs = () => {
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
    <section className="Dissllp-tabs-section">
      <div className="Dissllp-tabs-container">
        <div className="Dissllp-tabs-card">

          <div className="Dissllp-tabs-list">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                className={`Dissllp-tab ${
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

export default DissolveLLPTabs;
