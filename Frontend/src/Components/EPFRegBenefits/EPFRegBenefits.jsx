import React from "react";
import "../PvtltdRequirementsTab/PvtltdRequirementsTab.css";

const benefits = [
  {
    title: "Statutory Compliance Avoidance",
    text: "Avoids damages under Section 14B (5–25% of arrears), prosecution under Section 14, and suo-motu coverage by EPFO. For employers registered on time, the act is friendly — delays trigger the heavy machinery.",
  },
  {
    title: "Talent Attraction & Retention",
    text: "Senior hires (especially from MNCs or large enterprises) expect EPF as standard. Sub-20 employers offering voluntary EPF signal professionalism, stability, and long-term commitment — measurable improvement in offer-acceptance rates.",
  },
  {
    title: "Tax Benefits (EEE Status)",
    text: "EPF is one of the few EEE (Exempt-Exempt-Exempt) instruments in India. Employee contribution: deductible under Section 80C. Annual interest: tax-free up to ₹2.5L contribution (₹5L if no employer contribution). Withdrawal after 5+ years: fully tax-free.",
  },
  {
    title: "Free EDLI Life Insurance",
    text: "Employees automatically get life insurance cover up to ₹7 lakh under the EDLI Scheme — paid by the employer at 0.50% of basic+DA. No medical tests, no separate premium. Adds genuine value at minimal cost.",
  },
  {
    title: "Employee Loan & Advance Facility",
    text: "Registered employees can take partial PF withdrawals for housing, medical emergencies, marriage, education, or unemployment — without losing the corpus. Auto-approved via UMANG app or EPFO portal. A genuine social-security net.",
  },
  {
    title: "Long-Term Wealth Accumulation",
    text: "EPF interest rate (currently 8.25% for FY 2024-25) consistently beats most guaranteed instruments and is compounded annually. An employee starting at age 25 with ₹30K basic + DA accumulates ₹1.5–2 crore in EPF by retirement at age 58. Real wealth creation — and it's the employer who makes it happen.",
  },
];

const EPFRegBenefits = () => {
  return (
    <section className="req-section">
      <div className="req-container">
        <header className="req-header">
          <h2 className="req-title">
            Benefits of EPF Registration in India
          </h2>
          <p className="req-subtitle">
            EPF isn't just a deduction — it's a structural benefit for the employer and the employee. Here's what actually matters once you're registered:
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

export default EPFRegBenefits;
