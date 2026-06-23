import React from "react";
import "../CompanyRegImportance/CompanyRegImportance.css";

const IconShield = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconRegistered = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M9 16V8h3.2a2.4 2.4 0 0 1 0 4.8H9m3.2 0L15 16" />
  </svg>
);

const IconClock = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const IconTrending = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const BENEFITS = [
  {
    icon: <IconShield />,
    title: "Exclusive Rights & Legal Protection",
    text: "A registered trademark grants exclusive rights to use the mark for your goods / services (Section 28). Anyone using a deceptively similar mark can be sued for infringement under Section 29 — with rights to injunction, damages, and delivery up of infringing material.",
  },
  {
    icon: <IconRegistered />,
    title: "® Symbol & Brand Credibility",
    text: "Only registered trademarks can use the ® symbol. It signals statutory protection to customers, competitors, partners, and investors, and acts as a strong deterrent against potential infringers.",
  },
  {
    icon: <IconClock />,
    title: "10-Year Validity & Indefinite Renewal",
    text: "A trademark is valid for 10 years from the application date and renewable indefinitely for further 10-year terms (Section 25) — a long-term brand asset that compounds in value with use and advertising.",
  },
  {
    icon: <IconTrending />,
    title: "Investor, Funding & Marketplace Ready",
    text: "Registered trademarks are foundational for IP due-diligence in funding and M&A, can be used as collateral, and are required for Amazon Brand Registry, Flipkart, ONDC, and other marketplace brand-protection programmes.",
  },
];

const TrademarkImportance = () => {
  return (
    <section className="crimp-section">
      <div className="crimp-container">
        <h2 className="crimp-title">Why is Trademark Registration Important?</h2>
        <p className="crimp-intro">
          A registered trademark is far more than the ® symbol — it is a statutory asset that protects
          your brand identity under the Trade Marks Act, 1999 and grows in value as your brand grows.
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrademarkImportance;
