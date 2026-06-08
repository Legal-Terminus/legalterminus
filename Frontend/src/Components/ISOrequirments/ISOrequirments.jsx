import React from "react";
import "./ISOrequirments.css";

const benefits = [
  {
    title: "Tender & Empanelment Eligibility",
    text: "ISO 9001 is a hard requirement for most central government tenders, PSU contracts, and large enterprise vendor empanelments. Without it, you don't get past the technical-qualification stage. With it, you're on the shortlist. Direct revenue impact.",
  },
  {
    title: "Enterprise & Export Credibility",
    text: "Tata / Reliance / Infosys / TCS / global enterprise customers run vendor due-diligence checklists. ISO certifications appear on every one of them. Export markets (especially EU and Japan) treat ISO as the floor, not the ceiling, of supplier credibility.",
  },
  {
    title: "Operational Efficiency Gains",
    text: "Implementation forces process documentation, role clarity, KPI definition, nonconformity tracking. Companies typically report 15–30% reduction in process defects + customer complaints in Year 1. Improvement compounds via the Plan-Do-Check-Act cycle baked into every ISO standard.",
  },
  {
    title: "MSME Subsidy Reimbursement",
    text: "MSME-registered businesses can claim up to 75% reimbursement of certification costs (capped at Rs.75,000) via the MSME Office's Quality Upgradation / ZED / IPR schemes. For Elemental tier clients, this often makes the net cost effectively negligible after subsidy.",
  },
  {
    title: "Risk Reduction & Insurance Discounts",
    text: "ISO 45001 (OH&S) reduces workplace accident rates — many insurers offer lower workmen's compensation premiums for certified workplaces. ISO 27001 reduces cyber-incident likelihood + makes cyber-insurance underwriters comfortable. Concrete, measurable risk reduction.",
  },
  {
    title: "Global Recognition + 3-Year Validity",
    text: "ISO certificates issued by IAF-accredited CBs are recognised in 165+ countries. 3-year validity (with annual surveillance audits) keeps the cost predictable. Re-certification at Year 3 is typically smoother than initial certification.",
  },
];

const RequirementsPvt = () => {
  return (
    <section className="req-section">
      <div className="req-container">
        <header className="req-header">
          <h2 className="req-title">
            Benefits of ISO Certification in India
          </h2>
          <p className="req-subtitle">
            ISO Certification isn't a vanity wall plaque — it's a measurable lever for revenue, operational efficiency, and risk reduction. Here's what genuinely matters:
          </p>
        </header>

        <div className="req-grid">
          {benefits.map((benefit, i) => (
            <article key={i} className="req-card">
              <h3 className="req-card-title">{benefit.title}</h3>
              <div className="req-card-underline" />
              <p className="req-card-text">{benefit.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RequirementsPvt;
