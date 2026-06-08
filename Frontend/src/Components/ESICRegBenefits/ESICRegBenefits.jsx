import React from "react";
import "../PvtltdRequirementsTab/PvtltdRequirementsTab.css";

const benefits = [
  {
    title: "Free Medical Care (OPD + IPD)",
    text: "Covered employees + their family members (spouse, dependent parents, dependent children up to age 25) get free outpatient care, hospitalisation, surgery, and specialist consultations at ESIC dispensaries and tie-up hospitals. No cost ceiling. Effectively a fully-loaded health insurance plan at 0.75% employee contribution.",
  },
  {
    title: "Sickness Benefit (70% Wages)",
    text: "Cash payment of 70% of average wages for up to 91 days in a year for non-employment-related sickness (with medical certificate). Extended Sickness Benefit available for chronic conditions (TB, cancer, leprosy etc.) — up to 80% wages for up to 2 years.",
  },
  {
    title: "Maternity Benefit (100% Wages)",
    text: "Female covered employees receive 100% of average wages for 26 weeks (12 weeks for confinement, balance for prenatal + postnatal). Additional 1 month extra in case of complication / miscarriage. Plus confinement expenses of ₹7,500 where ESIC facility not used.",
  },
  {
    title: "Temporary & Permanent Disablement Benefit",
    text: "90% of average wages paid for any temporary disablement from an employment injury (no minimum period). For permanent disablement, lifetime monthly pension based on loss of earning capacity. Far better than statutory minimums under workmen's compensation.",
  },
  {
    title: "Dependants' Benefit + Funeral Expenses",
    text: "If a covered employee dies due to employment injury, dependants receive 90% of average wages as monthly pension — widow lifelong, children till age 25, dependent parents on means basis. Plus ₹15,000 funeral expenses to whoever performed the funeral.",
  },
  {
    title: "Unemployment Allowance (ABVKY / RGSKY)",
    text: "Atal Bimit Vyakti Kalyan Yojana (ABVKY) — covered employees who lose their job due to retrenchment / closure receive unemployment allowance of 50% of average wages for up to 90 days. Rajiv Gandhi Shramik Kalyan Yojana provides up to 12 months unemployment allowance + medical care during the period.",
  },
];

const ESICRegBenefits = () => {
  return (
    <section className="req-section">
      <div className="req-container">
        <header className="req-header">
          <h2 className="req-title">
            Benefits of ESIC Registration in India
          </h2>
          <p className="req-subtitle">
            ESIC isn't just a deduction — it's a comprehensive social-security cover for your covered employees and their families. Here's what genuinely matters once you're registered:
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

export default ESICRegBenefits;
