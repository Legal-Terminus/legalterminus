import React from "react";
import "./EsiRetBenefits.css";

const benefits = [
  {
    title: "Late-Fee Zero + Section 45A Risk Reduction",
    text: "Section 39(5)(a) interest at 12% p.a. + Section 85B damages at 5%–25% p.a. compound fast. For a ₹5 lakh monthly ESI dues 3 months late: ₹15,000 + ₹12,500 = ₹27,500 statutory hit. We file by the 15th provided client data is in by Day 7 — the cheapest insurance you can buy. ESIC Section 45A determinations re-assess up to 5 YEARS of liability with interest + damages.",
  },
  {
    title: "Banking + Tender + Investor Due Diligence + Employee Trust",
    text: "Banks, NBFCs, investors, and government tenders ALL check ESI compliance status during due diligence (ESIC publishes defaulter lists). Erratic contributions flag the company as risky — loan rejection, lower credit limits, tender disqualification. A clean ESI record = best terms, and visible compliance builds employee trust.",
  },
  {
    title: "Full Medical Care for IP + Family (FREE)",
    text: "Every INSURED PERSON (IP) + their FAMILY get FREE COMPREHENSIVE MEDICAL CARE through ESIC hospitals + dispensaries + empanelled tie-up hospitals. Includes OPD + IPD + diagnostics + medicines + super-speciality treatment + dental + ophthalmic + ambulance + family-planning + immunisation. One of the most valuable employee benefits in India — effectively free family-health insurance funded by employer + employee contributions.",
  },
  {
    title: "Sickness Benefit + Maternity Benefit",
    text: "SICKNESS BENEFIT: 70% of average daily wages for up to 91 DAYS per year for sickness leave (Section 49 ESI Act). EXTENDED SICKNESS BENEFIT for chronic diseases (up to 2 years). MATERNITY BENEFIT: 100% of average daily wages for 26 WEEKS (Section 50) — one of the most generous maternity benefits globally. Additional 1 month for complications. Adoption + commissioning-mother benefit also available.",
  },
  {
    title: "Disablement Benefit + Dependants' Benefit",
    text: "TEMPORARY DISABLEMENT: 90% of wages for the period of incapacity (Section 51). PERMANENT DISABLEMENT: 90% of wages as a lifelong monthly pension (Section 51 + First Schedule). DEPENDANTS' BENEFIT: 90% of wages as a monthly pension to surviving spouse + children + dependent parents in case of death due to employment injury (Section 52).",
  },
  {
    title: "Funeral Expenses + Atal Beemit Vyakti Kalyan Yojana",
    text: "FUNERAL EXPENSES: ₹15,000 paid to the eldest surviving family member (Section 50 ESI Act). ATAL BEEMIT VYAKTI KALYAN YOJANA (ABVKY) — Unemployment allowance up to 25% of average wages for 90 days for IPs rendered unemployed due to retrenchment / closure / permanent invalidity / VRS (subject to 2 years of insurance + recent COVID-era relaxations).",
  },
];

const EsiRetBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of ESI Return Filing in India
          </h2>
          <p className="opcben-subtitle">
            Timely + accurate ESI returns aren't just employer compliance — they unlock real medical + monetary benefits for your EMPLOYEES too. Here's what matters on both sides of the table:
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

export default EsiRetBenefits;
