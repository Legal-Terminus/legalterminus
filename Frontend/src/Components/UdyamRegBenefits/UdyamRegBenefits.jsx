import React from "react";
import "./UdyamRegBenefits.css";

const benefits = [
  "Necessary for getting a Current Bank Account for your Business",
  "Necessary for GST Registration",
  "Helps in Government Tenders",
  "Udyam Certified MSMEs can avail 45 Days Delayed Payment Rule",
  "Avail Loans under Government Credit Schemes like PMEGP or Mudra Loan",
  "MSMEs can get 50% waiver on Trademark Registration Fees",
  "Reversal of Credit Rating Fees or Government Deposits",
  "Participation in Government Exhibitions and Trade Fairs",
  "Access to Government Grant Programs",
];

const UdyamRegBenefits = () => {
  return (
    <section className="req-section">
      <div className="req-container">
        <header className="req-header">
          <h2 className="req-title">Benefits of Udyam Registration Certificate for MSMEs</h2>
          <p className="req-subtitle">
            Below are the key advantages of having a Udyam Registration Certificate for your MSME business.
          </p>
        </header>

        <div className="req-grid">
          {benefits.map((item, index) => (
            <article className="req-card" key={index}>
              <div className="udyam-benefit-number">{String(index + 1).padStart(2, "0")}</div>
              <div className="req-card-underline" />
              <p className="req-card-text">{item}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UdyamRegBenefits;
