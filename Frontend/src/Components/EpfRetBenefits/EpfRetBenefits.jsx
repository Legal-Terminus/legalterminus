import React from "react";
import "./EpfRetBenefits.css";

const EpfRetBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of EPF Return Filing in India
          </h2>
          <p className="opcben-subtitle">
            Timely + accurate EPF returns aren't just employer compliance — they unlock real benefits for the EMPLOYEES too. Here's what matters on both sides of the table:
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Late-Fee Zero (Statutory 7Q + 14B Avoidance)</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Section 7Q interest at 12% p.a. + Section 14B damages at 5%–25% p.a. compound fast. For a ₹10 lakh monthly PF dues 3 months late: ₹30,000 + ₹25,000 = ₹55,000 statutory hit. We file by the 15th provided client data is in by Day 7 — the cheapest insurance you can buy against statutory cost.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Banking + Tender + Investor Eligibility</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Banks, NBFCs, investors, government tenders, and large customers ALL check EPF compliance status during due diligence (EPFO publishes defaulter lists). Erratic ECRs flag the company as risky — loan rejection, lower credit limits, tender disqualification. Clean ECR record = best terms.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Continuous PF Account Growth + Tax-Free Interest</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Every month's contribution gets credited to the member's UAN-linked PF account + earns interest (currently ~8.25% p.a. compounded annually — declared by the EPFO Central Board). Interest is TAX-FREE on accumulated balance (subject to Section 10(11) / 10(12) Income-tax Act). Long-term, this is one of the safest tax-free retirement savings instruments in India.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Withdrawal Benefits + Section 80C Tax Deduction</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Members can withdraw PF for MARRIAGE / EDUCATION / MEDICAL EMERGENCY / HOUSING needs (Form 31 — partial withdrawal). Full PF withdrawal on retirement / 2-month gap post-resignation (Form 19). Employee's 12% contribution is ELIGIBLE FOR SECTION 80C DEDUCTION (up to ₹1.5 lakh per FY — Old Tax Regime). PF transfer is seamless across employers via UAN.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">EPS Pension at 58 (After 10+ Years' Service)</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Employer's EPS contribution (8.33% capped at ₹1,250/month) builds a PENSION ENTITLEMENT under the Employees' Pension Scheme, 1995. Members with 10+ years' eligible service get a LIFELONG MONTHLY PENSION from age 58 — covering retirement years. Members who join with a prior UAN have years carried over. Critical employee welfare benefit.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">EDLI Insurance Cover Up to ₹7 Lakh (Free Life Cover)</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Under the Employees' Deposit Linked Insurance Scheme, 1976, ACTIVE PF members get LIFE INSURANCE COVER OF UP TO ₹7 LAKH (depending on average wages + last 12 months' service) — PAID BY EPFO directly to the nominee on the member's death during service. NO premium burden on the employee. This is free + automatic life cover — one of the strongest reasons employees value clean EPF compliance.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default EpfRetBenefits;
