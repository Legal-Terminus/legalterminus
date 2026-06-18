import React from "react";
import "./TmarkBenefits.css";

const benefits = [
  {
    title: "Exclusive Rights + Statutory Protection",
    text: "A registered trademark grants EXCLUSIVE RIGHTS to use the mark for the registered goods / services (Section 28 Trade Marks Act 1999). Anyone using a deceptively similar mark in the same / related class can be sued for INFRINGEMENT under Section 29 — statutory presumption of validity + entitlement to INJUNCTION + DAMAGES + DELIVERY UP of infringing materials. Without registration, you're limited to common-law passing-off (where YOU bear the burden of proof).",
  },
  {
    title: "® Symbol + Brand Credibility",
    text: "Only REGISTERED trademarks can use the ® symbol. Until registration, you can use ™ (claiming common-law rights). The ® symbol signals statutory protection to consumers + competitors + business partners + investors — and acts as a deterrent against potential infringers. Brand valuation reports always include the registered TM portfolio.",
  },
  {
    title: "10-Year Validity + Indefinite Renewal",
    text: "Trademark registration is valid for 10 YEARS from the application date + renewable indefinitely for further 10-year terms (Section 25). Some Indian trademarks (Tata, Bajaj, etc.) have been continuously renewed for 80+ years. A long-term brand asset — it compounds in value with use + advertising + market share.",
  },
  {
    title: "Investor + M&A + Funding Readiness",
    text: "VCs + private equity + strategic acquirers conduct IP due-diligence at every investment / acquisition. Registered trademarks are foundational — a missing or weak TM portfolio is a deal-killer or valuation discount. Banks accept registered TMs as collateral for IP-backed financing. Brand valuation (typically 20–40% of company value for consumer brands) requires registered TMs.",
  },
  {
    title: "E-Commerce + Marketplace Eligibility",
    text: "Amazon Brand Registry, Flipkart Brand Centre, Meesho, Myntra, Nykaa, ONDC — all require a valid registered trademark for brand-protection programmes. Without a registered TM, you cannot enforce takedowns of counterfeit / lookalike listings + cannot access marketplace brand-protection tools. Critical for any D2C / online business.",
  },
  {
    title: "Customs Recordal + Anti-Counterfeit",
    text: "Registered TM owners can record their marks with INDIAN CUSTOMS under the IPR (Imported Goods) Enforcement Rules 2007 — empowering Customs to seize infringing goods at the border. Critical for export-oriented brands + importable consumer goods. The foundation for international IP enforcement (Madrid Protocol filings).",
  },
];

const TmarkBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Trademark Registration in India
          </h2>
          <p className="opcben-subtitle">
            A registered trademark is far more than the ® symbol — it's a statutory asset that grows in value with your brand. Here's what matters:
          </p>
        </header>

        <div className="opcben-grid">
          {benefits.map((benefit, i) => (
            <article className="opcben-card" key={i}>
              <h3 className="opcben-card-title">{benefit.title}</h3>
              <div className="opcben-card-underline" />
              <p className="opcben-card-text">{benefit.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TmarkBenefits;
