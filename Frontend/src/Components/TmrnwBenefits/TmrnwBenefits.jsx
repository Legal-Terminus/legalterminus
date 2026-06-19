import React from "react";
import "./TmrnwBenefits.css";

const benefits = [
  {
    title: "LIFELONG REMINDER POLICY (Our Binding Commitment)",
    text: "The single biggest reason clients lose trademarks: they FORGOT. We don't let that happen. 90 / 60 / 30 / 7-day reminders before every renewal expiry — for every 10-year cycle, indefinitely — until your business exits OR you explicitly ask us to stop. Binding commitment, included in every plan tier. No additional charge for the reminder service.",
  },
  {
    title: "Continuous Statutory Protection",
    text: "Timely renewal keeps the trademark continuously on the register — preserving Section 28 EXCLUSIVE RIGHTS + Section 29 INFRINGEMENT remedies (injunction + damages + delivery up) + Section 31 PRESUMPTION OF VALIDITY. Lapsed marks lose all this overnight + you become limited to common-law passing-off rights (much harder to enforce).",
  },
  {
    title: "E-Commerce Brand Registry + Marketplace Continuity",
    text: "Amazon Brand Registry + Flipkart Brand Centre + Meesho + Myntra + Nykaa + ONDC + Shopify — ALL require an active registered trademark for brand-protection programmes. Lapsed mark = lose access to takedowns + brand-protection tools = counterfeit / lookalike listings proliferate unchecked. Continuous renewal preserves marketplace standing.",
  },
  {
    title: "Brand Valuation + Investor / M&A Continuity",
    text: "Brand valuation reports for funding rounds / M&A always include the registered TM portfolio. A lapsed TM is written down to zero in DD — and brand-led valuations can take a 10–30% hit from gaps in IP coverage. Continuous renewal maintains the asset value year on year + the priority date that compounds over decades.",
  },
  {
    title: "10-Year Validity After Renewal",
    text: "Trademark registration is valid for 10 YEARS from the application date + renewable indefinitely for further 10-year terms (Section 25). Some Indian trademarks (Tata, Bajaj, etc.) have been continuously renewed for 80+ years. A long-term brand asset — it compounds in value with use + advertising + market share.",
  },
  {
    title: "Customs Recordal + Anti-Counterfeit",
    text: "Registered TM owners can record their marks with INDIAN CUSTOMS under the IPR (Imported Goods) Enforcement Rules 2007 — empowering Customs to seize infringing goods at the border. Critical for export-oriented brands + importable consumer goods. The foundation for international IP enforcement (Madrid Protocol filings).",
  },
];

const TmrnwBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Trademark Renewal in India
          </h2>
          <p className="opcben-subtitle">
            Renewal isn't a chore — it's the ONE LINE OF DEFENCE that keeps your trademark's statutory protection alive. Here's what timely renewal preserves + delivers:
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

export default TmrnwBenefits;
