import React from "react";
import "./CompanyRegImportance.css";

const BENEFITS = [
  {
    title: "Separate Legal Identity",
    text: "Once registered, a company becomes its own legal entity. It can own property, sign contracts, and operate separately from its owners.",
  },
  {
    title: "Limited Liability Protection",
    text: "The personal assets of shareholders are safe from company debts and risks, ensuring financial protection.",
  },
  {
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
    title: "Increased Credibility",
    text: "A registered company is more trusted by investors, clients, and vendors, making it easier to get funding and partnerships.",
  },
];

const Check = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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
          {BENEFITS.map((b) => (
            <div className="crimp-card" key={b.title}>
              <span className="crimp-icon" aria-hidden="true">
                <Check />
              </span>
              <div className="crimp-card-body">
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyRegImportance;
