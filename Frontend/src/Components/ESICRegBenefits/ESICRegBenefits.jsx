import React from "react";
import "../PvtltdRequirementsTab/PvtltdRequirementsTab.css";

const benefits = [
  {
    title: "Comprehensive Medical Care",
    text: "Insured employees and their dependants receive unlimited medical care — outpatient, inpatient, specialist, surgery, and emergency — at ESIC hospitals and dispensaries. No ceiling on medical expenditure. Medical benefits extend to retired employees on a nominal annual payment.",
  },
  {
    title: "Sickness Benefit",
    text: "70% of average daily wages paid for up to 91 days per year during certified sickness. Extended sickness benefit available at 80% of wages for certain long-term illnesses (TB, malignancy, mental illness etc.) for up to 2 years with treatment at ESIC facilities.",
  },
  {
    title: "Maternity Benefit",
    text: "Paid maternity leave at full wages for 26 weeks (for the first two children). Extendable by one month on medical advice. Miscarriage and tubectomy benefits also available. One of the most employer-friendly and employee-valued benefits under ESIC.",
  },
  {
    title: "Disablement & Death Benefit",
    text: "Permanent disablement benefit at 90% of wages paid as a monthly pension for life. In case of death due to employment injury, 90% of wages paid to dependants. Funeral expenses of ₹10,000 paid to the person performing last rites.",
  },
  {
    title: "Unemployment Allowance",
    text: "Under the Rajiv Gandhi Shramik Kalyan Yojana, insured persons involuntarily unemployed after 3 years of continuous coverage receive 50% of wages for up to 1 year, plus medical care for self and family during the unemployment period.",
  },
  {
    title: "Statutory Compliance & Penalty Avoidance",
    text: "Being ESIC-registered avoids damages of 5–25% of arrears under Section 85B, prosecution under Section 85, and suo-motu coverage proceedings by ESIC. For compliant employers, ESIC inspections are routine. For non-compliant ones, they trigger recovery + interest + prosecution.",
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
            ESIC isn't just a deduction — it's a comprehensive social security net for employees and a compliance shield for employers. Here's what actually matters once you're registered:
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
