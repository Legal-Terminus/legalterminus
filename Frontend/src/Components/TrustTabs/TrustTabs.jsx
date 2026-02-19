import React, { useEffect, useState } from "react";
import "./TrustTabs.css";

const tabs = [
  { label: "Why Choose new-trusted", id: "company" },
  { label: "Types", id: "types" },
  { label: "Requirements", id: "requirements" },
  // { label: "Process & Steps", id: "process" },
  // { label: "Documents", id: "documents" },
  { label: "FAQ's", id: "faq" },
];

const TrustTabs = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index, id) => {
    setActiveIndex(index);
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
            if (index !== -1) setActiveIndex(index);
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
          <div className="new-trusted-tabs-list">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
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
