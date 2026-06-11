import React from "react";
import "./EsiRetTermCondition.css";

const EsiRetTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — contribution computation, IP registration, return preparation, and ESIC portal filing. They are exclusive of statutory ESI contributions, interest, and damages.
            </li>
            <li className="opctc-item">
              Statutory Contributions Payable Separately: Employee (0.75%) and employer (3.25%) ESI contributions are statutory amounts deposited with ESIC. These are paid by the establishment at actuals and are not part of our fee.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Monthly Due Date: The ESI contribution and challan must be paid by the 15th of the following month. Timely filing depends on you sharing finalised wage, attendance, and joiner/exit data at least 3 working days before the due date.
            </li>
            <li className="opctc-item">
              Late Payment Consequences: Delayed deposit of contributions attracts simple interest at 12% p.a. and damages of 5%–25% p.a. under the ESI regulations. Legal Terminus is not liable for these charges where the delay arises from late data or funds from the client's side.
            </li>
            <li className="opctc-item">
              Applicability &amp; Wage Ceiling: ESI applies to establishments with 10 or more employees (20 in some states), covering employees drawing wages up to ₹21,000 per month (₹25,000 for persons with disability). Coverage and the wage base are confirmed during onboarding.
            </li>
            <li className="opctc-item">
              Continuation Rule: An employee covered at the start of a contribution period remains covered until the end of that period even if wages later cross the ceiling. We apply the correct continuation logic so contributions are neither under- nor over-paid.
            </li>
            <li className="opctc-item">
              Employer Login Required: Filing is done through the establishment's ESIC employer portal credentials. Maintaining active login and accurate employer/employee master data is the establishment's responsibility.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: ESI registration of a new establishment, individual benefit/claim processing for insured persons, 45A determination or 85 prosecution representation beyond standard replies, and past-period arrears clean-up are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default EsiRetTermCondition;
