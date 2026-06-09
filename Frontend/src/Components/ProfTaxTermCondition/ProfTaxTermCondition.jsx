import React from "react";
import "./ProfTaxTermCondition.css";

const ProfTaxTermCondition = () => {
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
              Professional Fee Only: All quoted prices are exclusive of government fees, state levies, and out-of-pocket costs. Our fee covers advisory, document preparation, state portal filing, and compliance handover.
            </li>
            <li className="opctc-item">
              State-Specific Government Fees: PT registration fees, PTEC annual payment, and PTRC slab tax vary by state. These are payable to the respective state government and reimbursed at actuals over and above our professional fee.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Applicability Varies: Professional Tax is applicable only in states that have enacted PT legislation — currently Andhra Pradesh, Assam, Gujarat, Karnataka, Kerala, Madhya Pradesh, Maharashtra, Meghalaya, Odisha, Sikkim, Tamil Nadu, Telangana, and West Bengal. We confirm applicability before filing.
            </li>
            <li className="opctc-item">
              Employee Count: Plans that include Employee Certificate (RC) are priced based on declared employee headcount at the time of registration. Additional employees enrolled post-registration may attract add-on charges.
            </li>
            <li className="opctc-item">
              Return Filing Scope: Monthly challan preparation included in Standard and Comprehensive plans covers the period stated. Annual return filing is included only in the Comprehensive plan. Subsequent months / years are quoted separately unless a retainer is agreed.
            </li>
            <li className="opctc-item">
              Multi-State Registration: The Comprehensive plan covers registration in up to 3 states. Additional state registrations are quoted separately at ₹1,499 + GST per state.
            </li>
            <li className="opctc-item">
              Refund Policy: Full refund of professional fee (less ₹499 documentation handling) is available if the state portal application is not filed within 5 working days from receipt of complete documents and information. Government fees already paid are non-refundable.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: PT amendment / surrender, response to show-cause notices, penalty waiver applications, and payroll integration support are not included and are quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default ProfTaxTermCondition;
