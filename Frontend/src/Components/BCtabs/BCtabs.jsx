import React, { useState } from "react";
import "./BCtabs.css";

const tabs = [
  { label: "What is Barcode (GS1)", id: "company" },
  { label: "Types of Barcodes", id: "types" },
  { label: "Benefits", id: "requirements" },
  { label: "Process & Steps", id: "process" },
  { label: "Documents", id: "documents" },
  { label: "FAQ's", id: "faq" },
];

const BCTabs = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index, id) => {
    setActiveIndex(index);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="opc-tabs-section">
      <div className="opc-tabs-container">
        <div className="opc-tabs-card">
          <div className="opc-tabs-list">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                className={`opc-tab ${index === activeIndex ? "active" : ""}`}
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

export default BCTabs;
