import React from "react";
import "./EpfRetTermCondition.css";

const EpfRetTermCondition = () => {
  return (
    <section className="opctc-section">
      <div className="opctc-container">
        <div className="opctc-card">
          <h2 className="opctc-title">TERMS &amp; CONDITIONS</h2>

          <p className="opctc-subtitle">
            By subscribing to the above plans, you agree to abide by our following additional terms and conditions
          </p>

          <ol className="opctc-list">
            <li className="opctc-item">
              Professional Fee Only: All quoted prices cover professional services — ECR preparation, contribution computation, UAN/KYC handling, and EPFO portal filing. They are exclusive of statutory PF contributions, interest, and damages.
            </li>
            <li className="opctc-item">
              Statutory Contributions Payable Separately: Employee and employer PF, EPS, EDLI, and admin charges are statutory amounts deposited with EPFO. These are paid by the establishment at actuals and are not part of our fee.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Monthly Due Date: The ECR must be filed and the challan paid by the 15th of the following month. Timely filing depends on you sharing finalised wage, attendance, and joiner/exit data at least 3 working days before the due date.
            </li>
            <li className="opctc-item">
              Late Payment Consequences: Delayed deposit of contributions attracts interest at 12% p.a. under Section 7Q and damages of 5%–25% p.a. under Section 14B. Legal Terminus is not liable for these charges where the delay arises from late data or funds from the client's side.
            </li>
            <li className="opctc-item">
              Applicability: EPF registration and monthly returns are mandatory for establishments employing 20 or more persons (and voluntarily for smaller ones). Determining coverage and the applicable wage base is confirmed during onboarding.
            </li>
            <li className="opctc-item">
              Data Accuracy: ECR and contributions are computed on the wage and member data provided by you. You remain responsible for the correctness of wages, UAN/KYC details, and joiner/exit dates; we flag visible discrepancies before filing.
            </li>
            <li className="opctc-item">
              Employer Login Required: Filing is done through the establishment's EPFO employer portal credentials and DSC/e-sign. Maintaining active login and an approved DSC of the authorised signatory is the establishment's responsibility.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: EPF registration of a new establishment, PF withdrawal/transfer claims of individual members, 7A inquiry representation beyond standard replies, and past-period arrears clean-up are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default EpfRetTermCondition;
