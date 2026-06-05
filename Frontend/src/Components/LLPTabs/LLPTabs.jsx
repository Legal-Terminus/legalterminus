import React, { useState } from "react";
import "./LLPTabs.css";

const tabs = [
  { label: "Why Choose LLP", id: "company" },
  { label: "Types", id: "types" },
  { label: "Benefits", id: "requirements" },
  { label: "Process & Steps", id: "process" },
  { label: "Documents", id: "documents" },
  { label: "FAQ's", id: "faq" },
];

const LlpTabs = () => {
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
    <section className="Llp-tabs-section">
      <div className="Llp-tabs-container">
        <div className="Llp-tabs-card">
          <div className="Llp-tabs-list">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                className={`Llp-tab ${index === activeIndex ? "active" : ""}`}
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

export default LlpTabs;
