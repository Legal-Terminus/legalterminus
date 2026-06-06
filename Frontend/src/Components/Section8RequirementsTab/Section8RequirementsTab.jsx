import React from "react";
import "./Section8RequirementsTab.css";

const benefits = [
  {
    title: "Tax Exemption (12A)",
    text: "Once registered under Section 12A of the Income Tax Act, the company's surplus / income is exempt from income tax (subject to applying 85%+ to charitable objects in the year). This is the foundational tax benefit — without it, your 'non-profit' pays 30% income tax on surplus.",
  },
  {
    title: "Donor Tax Deduction (80G)",
    text: "Donors to your Section 8 company can claim 50% (or 100% in select cases) deduction on their donations under Section 80G. This is the main reason individual and corporate donors choose registered non-profits. Without 80G, retail donor mobilisation is virtually impossible.",
  },
  {
    title: "Institutional Credibility & Governance",
    text: "Audited accounts. Statutory MCA filings. Independent directors. Board minutes. Structured AOA. All the governance plumbing that institutional donors, Tata / Reliance / Wipro CSR teams, and Bill & Melinda Gates Foundation due-diligence checklists actually require.",
  },
  {
    title: "CSR Funding Eligibility",
    text: "With CSR-1 registration (separate MCA filing), Section 8 companies become eligible recipients of corporate CSR spends. Indian companies with profit > Rs.5 crore are mandated to spend 2% of net profit on CSR — that's a Rs.25,000+ crore annual pool you can apply to.",
  },
  {
    title: "FCRA-Compatible Structure",
    text: "Foreign Contribution Regulation Act registration / prior-permission for foreign donations is structurally well-suited to Section 8 (cleaner balance-sheet history, MCA filings, audited accounts). Trust / Society routes are FCRA-eligible too but face longer scrutiny.",
  },
  {
    title: "Limited Liability + Separate Legal Entity",
    text: "Founders' personal assets are insulated. The company can sign contracts, hold assets, sue and be sued in its own name. Trustees / society members face higher personal-liability risk than Section 8 directors — especially for large grants and government contracts.",
  },
];

const Section8RequirementsTab = () => {
  return (
    <section className="s8-req-section">
      <div className="s8-req-container">

        <header className="s8-req-header">
          <h2 className="s8-req-title">
            Benefits of Section 8 Company Registration in India
          </h2>
          <p className="s8-req-subtitle">
            Section 8 isn't a 'lighter Pvt Ltd' — it's a different instrument with different unlocks. Here's what genuinely matters once you're past Day 1:
          </p>
        </header>

        <div className="s8-req-grid">
          {benefits.map((b, i) => (
            <article key={i} className="s8-req-card">
              <h3 className="s8-req-card-title">{b.title}</h3>
              <div className="s8-req-card-underline" />
              <p className="s8-req-card-text">{b.text}</p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Section8RequirementsTab;
