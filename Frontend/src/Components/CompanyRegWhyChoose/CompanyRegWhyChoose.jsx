import React from "react";
import "./CompanyRegWhyChoose.css";

const ITEMS = [
  {
    title: "Affordable & Transparent Pricing",
    text: "Consultancy services starting at ₹3,999.",
    icon: (
      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="6" />
        <path d="M9.5 6.5h5M9.5 9h5M12 6.5c1.6 0 2.4 1.2 1.4 2.4-.5.6-1.4.6-1.4.6l2 2.5" />
        <path d="M3 20.5c2.5-2 5-1.3 7 0l3 .4 5.5-3c1-.6 2.2.7 1.2 1.7l-4.5 3.7c-1 .8-2.2 1-3.4.7l-4-1.2-4.8 1" />
      </svg>
    ),
  },
  {
    title: "Hassle-Free Compliance Support",
    text: "We guide you through documentation and procedural steps.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
  },
  {
    title: "Timely Reminders & Support",
    text: "Stay updated on important compliance requirements.",
    icon: (
      <svg viewBox="0 0 24 24" width="29" height="29" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    title: "Local Support in Odisha",
    text: "Dedicated assistance for businesses operating in Odisha.",
    icon: (
      <svg viewBox="0 0 24 24" width="29" height="29" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

const CompanyRegWhyChoose = () => {
  return (
    <section className="crwc-section">
      <div className="crwc-container">
        <h2 className="crwc-heading">
          Why Choose <span>Legal Terminus</span> for Business Setup Assistance?
        </h2>

        <div className="crwc-grid">
          {ITEMS.map((item) => (
            <div className="crwc-card" key={item.title}>
              <span className="crwc-icon" aria-hidden="true">
                {item.icon}
              </span>
              <h3 className="crwc-card-title">{item.title}</h3>
              <p className="crwc-card-text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyRegWhyChoose;
