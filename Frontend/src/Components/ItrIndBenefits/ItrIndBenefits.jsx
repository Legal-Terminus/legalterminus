import React from "react";
import "./ItrIndBenefits.css";

const benefits = [
  {
    title: "Get Your TDS Refund Back",
    text: "TDS deducted from salary / bank interest / property sale / professional fees / dividend stays with the Government UNTIL you file ITR + claim the refund. For salaried with significant TDS but no actual tax liability (e.g., income up to Rs.12.75L under New Regime), the ENTIRE TDS amount is refundable - often Rs.20,000 to Rs.1 lakh+. Refunds typically credited within 30-45 days of e-Verification.",
  },
  {
    title: "Avoids Section 234F Penalty + Interest Stack",
    text: "Section 234F belated-return penalty = Rs.5,000 (income > Rs.5L) or Rs.1,000 (income up to Rs.5L). PLUS interest at 1% per month under Sections 234A + 234B + 234C. For someone with Rs.50,000 tax liability filed 6 months late = Rs.5,000 penalty + Rs.3,000 interest = Rs.8,000 wasted. Timely filing eliminates this stack.",
  },
  {
    title: "Loss Carry-Forward Preserved (Section 71B / 74)",
    text: "House Property Loss + Capital Losses can be CARRIED FORWARD for 8 ASSESSMENT YEARS to set off against future gains - BUT ONLY if the ITR is filed BEFORE the original due date (31 July). Belated filing FORFEITS the carry-forward right under Section 80. For equity investors with realised STCL / LTCL or property buyers, this is the single most valuable reason to file on time.",
  },
  {
    title: "Builds Loan + Credit + Visa Track Record",
    text: "Banks + NBFCs require LATEST 2-3 YEARS of ITRs for: HOME LOAN / personal loan / business loan / credit card / car loan approvals. Visa applications (US / UK / Schengen / Canada / Australia) routinely ask for 3 years of ITRs as proof of income. Insurance companies (high-value cover) ask for ITR-based income proof. Continuous timely filing maintains your institutional credibility.",
  },
  {
    title: "Old vs New Regime - Pay the Lower Tax",
    text: "Enriched onwards: we run BOTH old + new regime calculations + we file under whichever gives you LOWER TAX. For salaried up to Rs.12.75 lakh, New Regime usually wins (NIL tax). For high-income earners with significant 80C+80D+80CCD+Home Loan+HRA claims, Old Regime can save Rs.10,000-Rs.1 lakh+. Don't leave money on the table by defaulting to one regime.",
  },
  {
    title: "Pocket-Friendly Pricing + Customisation Available",
    text: "Six tiers from Rs.799 (basic salaried) to Rs.7,999 (full-stack NRI + capital gains + foreign income + DTAA). Right-sized to actual workload. If your situation doesn't fit any of the 6 plans - contact our executive for a CUSTOMISED quote. No artificial bundling or padding.",
  },
];

const ItrIndBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Individual Income Tax Returns in India
          </h2>
          <p className="opcben-subtitle">
            Filing your Individual ITR on time + accurately delivers concrete legal + commercial benefits. Here's what timely filing actually delivers for you:
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

export default ItrIndBenefits;
