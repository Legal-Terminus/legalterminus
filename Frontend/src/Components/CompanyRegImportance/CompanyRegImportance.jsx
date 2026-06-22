import React from "react";
import "./CompanyRegImportance.css";

const IconAward = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" />
  </svg>
);

const IconShield = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconGift = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);

const IconStar = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const BENEFITS = [
  {
    icon: <IconAward />,
    title: "Separate Legal Identity",
    text: "Once registered, a company becomes its own legal entity. It can own property, sign contracts, and operate separately from its owners.",
  },
  {
    icon: <IconShield />,
    title: "Limited Liability Protection",
    text: "The personal assets of shareholders are safe from company debts and risks, ensuring financial protection.",
  },
  {
    icon: <IconGift />,
    title: "Access to Government Schemes",
    text: "Registered companies can benefit from government programs like:",
    subItems: [
      {
        name: "Startup India",
        desc: "Offers tax benefits, funding support, and simplified compliance for startups.",
      },
      {
        name: "Make in India",
        desc: "Provides incentives, subsidies, and promotional support for manufacturing businesses.",
      },
    ],
  },
  {
    icon: <IconStar />,
    title: "Increased Credibility",
    text: "A registered company is more trusted by investors, clients, and vendors, making it easier to get funding and partnerships.",
  },
];

const CompanyRegImportance = () => {
  return (
    <section className="crimp-section">
      <div className="crimp-container">
        <h2 className="crimp-title">Why is Company Registration Important?</h2>
        <p className="crimp-intro">
          The Ministry of Corporate Affairs (MCA) manages the company registration process in India.
          It includes registering the business with the Registrar of Companies (RoC) and obtaining a
          Digital Signature Certificate (DSC) and Director Identification Number (DIN).
        </p>

        <div className="crimp-grid">
          {BENEFITS.map((b, i) => (
            <article className="crimp-card" key={b.title}>
              <span className="crimp-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="crimp-icon" aria-hidden="true">
                {b.icon}
              </span>
              <h3 className="crimp-card-title">{b.title}</h3>
              <p className="crimp-card-text">{b.text}</p>
              {b.subItems && (
                <ul className="crimp-sublist">
                  {b.subItems.map((s) => (
                    <li key={s.name}>
                      <strong>{s.name}:</strong> {s.desc}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyRegImportance;
