import React from "react";
import "./TrademarkHowItWorks.css";

const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <path d="M8.5 11l2 2 3.5-3.5" />
  </svg>
);

const IconFiling = () => (
  <svg viewBox="0 0 24 24" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M8 13h4" />
    <path d="M8 17h3" />
    <path d="M18.5 11.5l2 2-4 4H14.5v-2l4-4z" />
  </svg>
);

const IconCertificate = () => (
  <svg viewBox="0 0 24 24" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="13" rx="2" />
    <circle cx="12" cy="10" r="2.4" />
    <path d="M10.3 11.8 9.4 16l2.6-1.4L14.6 16l-.9-4.2" />
  </svg>
);

const STEPS = [
  {
    icon: <IconSearch />,
    title: "A comprehensive TM search conducted by our experts",
    caption: "Result within 2-4 working hours",
  },
  {
    icon: <IconFiling />,
    title: "Trademark application filing & start using TM",
    caption: "10-12 working hours process",
  },
  {
    icon: <IconCertificate />,
    title: "Trademark registration certificate (valid for 10 years)",
    caption: "Once approved.",
  },
];

const TrademarkHowItWorks = () => {
  return (
    <section className="tmhw-section">
      <div className="tmhw-container">
        <h2 className="tmhw-heading">How It Works</h2>

        <div className="tmhw-grid">
          {STEPS.map((s) => (
            <div className="tmhw-card" key={s.title}>
              <span className="tmhw-icon-wrap" aria-hidden="true">
                <span className="tmhw-icon">{s.icon}</span>
              </span>
              <h3 className="tmhw-title">{s.title}</h3>
              <p className="tmhw-caption">{s.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrademarkHowItWorks;
