import React, { useState } from "react";
import "./ShopRegTabs.css";

const tabs = [
  { label: "Why Register", id: "shop-company" },
  { label: "Types", id: "shop-types" },
  { label: "Benefits", id: "shop-requirements" },
  { label: "Steps", id: "shop-process" },
  { label: "Documents", id: "shop-documents" },
  { label: "FAQ's", id: "shop-faq" },
];

const ShopRegTabs = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index, id) => {
    setActiveIndex(index);
    const section = document.getElementById(id);
    if (section) {
      const tabsEl = document.querySelector(".shop-tabs-section");
      const offset = tabsEl ? tabsEl.offsetHeight : 104;
      const top = section.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section className="shop-tabs-section">
      <div className="shop-tabs-container">
        <div className="shop-tabs-card">
          <div className="shop-tabs-list">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                className={`shop-tab ${index === activeIndex ? "active" : ""}`}
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

export default ShopRegTabs;
