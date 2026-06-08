import React from "react";
import "../PvtltdRequirementsTab/PvtltdRequirementsTab.css";

const benefits = [
  {
    title: "Bank Current Account Opening",
    text: "Most banks (ICICI / HDFC / Axis / SBI / Kotak / IDFC First etc.) demand SHOP & ESTABLISHMENT Registration as PROOF OF BUSINESS for opening a current account in the business name. Without it, you're stuck with savings account routing — which is operationally limiting + tax-suboptimal.",
  },
  {
    title: "Marketplace / Enterprise Vendor KYC",
    text: "Amazon, Flipkart, Meesho, Zomato, Swiggy seller onboarding all require SHOP & ESTABLISHMENT Registration in their KYC. Same for enterprise client procurement teams empanelling vendors — SHOP & ESTABLISHMENT is a standard checklist item alongside PAN / GST / MSME.",
  },
  {
    title: "Statutory Compliance with State Labour Law",
    text: "Avoids penalties under the respective State SHOP & ESTABLISHMENT Act — typically ₹100 to ₹500 per day of non-registration, plus Inspector visit, plus closure risk for repeat offenders. Cheap insurance against an avoidable hassle.",
  },
  {
    title: "Worker Welfare Compliance Foundation",
    text: "SHOP & ESTABLISHMENT sets the foundation for working hours regulation, weekly off, annual leave, holiday schedule, wage payment timing, and conditions of employment — all subsequently picked up by adjacent state labour laws (LWF, ESIC, Professional Tax).",
  },
  {
    title: "Government Scheme / Subsidy Eligibility",
    text: "Many state and central schemes (MSME schemes, sector subsidies, women-entrepreneur grants etc.) require SHOP & ESTABLISHMENT Registration as basic proof-of-business eligibility. Standard checklist item in subsidy / grant applications.",
  },
  {
    title: "Loan & Credit Eligibility",
    text: "Banks underwriting working capital loans, business loans, term loans — all routinely demand SHOP & ESTABLISHMENT Registration as part of the loan KYC pack. Fintech lenders (Lendingkart, FlexiLoans etc.) also include SHOP & ESTABLISHMENT in their underwriting workflow.",
  },
];

const ShopRegBenefits = () => {
  return (
    <section className="req-section">
      <div className="req-container">
        <header className="req-header">
          <h2 className="req-title">
            Benefits of Shop &amp; Establishment Registration in India
          </h2>
          <p className="req-subtitle">
            SHOP &amp; ESTABLISHMENT Registration is the most under-appreciated business document in India. Here's what it actually unlocks once you have it:
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

export default ShopRegBenefits;
