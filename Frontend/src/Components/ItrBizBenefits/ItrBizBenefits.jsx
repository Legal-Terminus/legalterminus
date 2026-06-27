import React from "react";
import "./ItrBizBenefits.css";

const benefits = [
  {
    title: "Get Your TDS Refund Back",
    text: "TDS deducted from your business income (Section 194 series + new Section 194T for PFs) stays with the Government UNTIL you file ITR + claim the refund. For proprietors / PFs with significant TDS but lower actual tax liability, the ENTIRE TDS amount is refundable. Refunds typically credited within 30-45 days of e-Verification.",
  },
  {
    title: "Avoids Section 234F + Section 271A + Section 40(a)(ia) Penalty Stack",
    text: "Section 234F belated penalty = Rs.5,000 (income > Rs.5L) or Rs.1,000 (income up to Rs.5L). PLUS Sec 234A/B/C interest at 1% per month. PLUS Section 271A Rs.25,000 if books not maintained. PLUS (for PF) Section 40(a)(ia) disallowance for Section 194T TDS non-deduction. Stacked penalties easily exceed Rs.30,000+ - timely filing eliminates all.",
  },
  {
    title: "Continues Loss Carry-Forward Eligibility (Section 72)",
    text: "Business losses can be CARRIED FORWARD for 8 ASSESSMENT YEARS to set off against future profits - BUT only if ITR is filed BEFORE the original due date (31 July). Belated filing FORFEITS the carry-forward right (Section 80). For loss-making businesses in early years (very common for new partnerships), this is the single most valuable reason to file on time.",
  },
  {
    title: "Builds Banking + Credit + MSME Loan Track Record",
    text: "Banks + NBFCs require LATEST 2-3 YEARS of ITRs for: BUSINESS LOAN / MSME loan / working capital limits / overdraft / vehicle finance / equipment financing. Visa applications + insurance underwriting routinely ask for 3 years. Missing returns = loan rejection. Continuous timely filing builds your business's credit story.",
  },
  {
    title: "Section 40(b) Optimisation (Partnership Firm)",
    text: "For PFs - SECTION 40(b) Partner Remuneration deduction is one of the most powerful tax-saving tools. Budget 2024 DOUBLED the first slab to Rs.6 LAKH (effective FY 2025-26) - so a PF with Rs.20L book profit can deduct up to Rs.3L (on first Rs.6L) + 60% on Rs.14L balance = Rs.8.4L + Rs.3L = Rs.11.4L total - dramatically reducing firm-level tax. Our Enriched / Supreme tiers compute optimal remuneration structure.",
  },
  {
    title: "Pocket-Friendly + Customisation Available",
    text: "Three tiers from Rs.2,499 (filing only) to Rs.14,999 (full Tally) - same pricing for proprietor + PF. Right-sized to actual workload. Per T&C #1, larger / complex cases get CUSTOMISED quotes. No artificial bundling.",
  },
];

const ItrBizBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Business Income Tax Returns in India
          </h2>
          <p className="opcben-subtitle">
            Filing your business ITR on time + accurately + with the right form delivers concrete legal + commercial benefits. Here's what timely filing delivers for proprietors + partnership firms:
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

export default ItrBizBenefits;
