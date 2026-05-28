import React from "react";
import "./LLPTermandCondn.css";

const TermsConditions = () => {
  return (
    <section className="llp-tc-section">
      <div className="llp-tc-container">
        <div className="llp-tc-card">
        {/* Heading */}
        <h2 className="llp-tc-title">TERMS &amp; CONDITIONS</h2>

        {/* Sub heading */}
        <p className="llp-tc-subtitle">
          By subscribing to the above plans, you agree to abide by our following additional terms and conditions
        </p>

        {/* List */}
        <ol className="llp-tc-list">
          <li className="llp-tc-item">
            DSC shall be from Sign X Class III only.
          </li>

          <li className="llp-tc-item">
            The fees mentioned above are valid for Contribution up to Rs. 1 Lakhs and in case Contribution is above Rs. 1 Lakhs the additional fee shall be charged as per actuals.
          </li>

          <li className="llp-tc-item">
            The above fee includes Name application for up to 4 choice names and in case all the 4 names are rejected by the department, an additional fee shall be charged as per actuals.
          </li>

          <li className="llp-tc-item">
            The Audit of accounts shall be applicable for the respective FY in which the contribution exceeds Rs. 25 Lakhs & Turnover exceeds Rs. 40 Lakhs. Further, the Audit Fees, if any, shall not be a part of our professional fees and shall be payable directly to the Auditor.
          </li>

          <li className="llp-tc-item">
            In case the above plan does not qualify your requirements, kindly contact our executive, we shall be happy to customise a plan for you.
          </li>
        </ol>
        </div>
      </div>
    </section>
  );
};

export default TermsConditions;
