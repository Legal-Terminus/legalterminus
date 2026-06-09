import React from "react";
import "../OPCBenefits/OPCBenefits.css";

const ProfTaxBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Professional Tax Compliance in India
          </h2>
          <p className="opcben-subtitle">
            Timely PT compliance is not just a legal obligation — it protects employers from liability and keeps the business credible with employees, banks, and regulators.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Avoid Compounding Penalties</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Late PT returns attract monthly penalties that compound fast — ₹1,000/month in Maharashtra, ₹50/day in Karnataka. A single year of non-compliance can result in penalties that dwarf the actual PT amount. Proactive filing eliminates this risk entirely.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Personal Liability Protection for Employers</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Employers who deduct PT from salaries but fail to remit it to the state become personally liable — not just the company. Directors of companies and partners of firms can be held personally accountable. Timely remittance is the only protection.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Tax Deduction for Employees</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              PT paid by employees is deductible under Section 16(iii) of the Income Tax Act. Compliant employers provide employees with a proper PT deduction certificate, which reduces their taxable income. This is a real benefit employees value.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Regulatory Credibility &amp; Audit Readiness</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A clean PT compliance record demonstrates to banks, investors, and regulators that your business runs properly. During due diligence for funding or acquisitions, PT non-compliance is a red flag that can derail deals or trigger escrow holdbacks.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Smooth Labour Inspections</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              State labour departments conduct surprise PT audits. If you're registered and filing returns, inspections are resolved quickly with a compliance certificate. Unregistered employers face immediate closure notices and recovery proceedings in most states.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Multi-State Expansion Without Compliance Gaps</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Each state where you have employees requires a separate PT registration. Growing businesses often miss this — especially remote-first companies. We map every state where employees work and ensure all registrations and returns are filed before any audit risk arises.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ProfTaxBenefits;
