import React from "react";
import "./PublicltdTermsCondition.css";

const TermsConditions = () => {
  return (
    <section className="publicltd-tc-section">
      <div className="publicltd-tc-container">
        <div className="publicltd-tc-card">

          {/* Heading */}
          <h2 className="publicltd-tc-title">TERMS &amp; CONDITIONS</h2>

          {/* Sub heading */}
          <p className="publicltd-tc-subtitle">
            By subscribing to the above plans, you agree to abide by our following additional terms and conditions
          </p>

          {/* List */}
          <ol className="publicltd-tc-list">
            <li className="publicltd-tc-item">
              DSC shall be from Sign X Class III only.
            </li>

            <li className="publicltd-tc-item">
              The Stamp Duty varies from state to state and shall be charged additionally as per actuals.
            </li>

            <li className="publicltd-tc-item">
              The fees mentioned above are valid for Authorised Capital up to Rs. 15 Lakhs and in case Authorised Capital is above Rs. 15 Lakhs, the additional fee shall be charged as per actuals.
            </li>

            <li className="publicltd-tc-item">
              The above fee includes name application for up to 4 choice names and in case all the 4 names are rejected by the department, an additional fee shall be charged as per actuals.
            </li>

            <li className="publicltd-tc-item">
              The audit of accounts shall be applicable for the respective FY. Further, the audit fees, if any, shall not be a part of our professional fees and shall be payable directly to the auditor.
            </li>

            <li className="publicltd-tc-item">
              In case the above plan does not qualify your requirements, kindly contact our executive. We shall be happy to customise a plan for you.
            </li>
          </ol>

        </div>
      </div>
    </section>
  );
};

export default TermsConditions;
