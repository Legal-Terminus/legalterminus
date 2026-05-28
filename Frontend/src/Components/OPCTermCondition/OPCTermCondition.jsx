import React from "react";
import "./OPCTermCondition.css";

const OPCTermCondition = () => {
  return (
    <section className="opctc-section">
      <div className="opctc-container">
        <div className="opctc-card">
          {/* Heading */}
          <h2 className="opctc-title">TERMS &amp; CONDITIONS</h2>

          {/* Sub heading */}
          <p className="opctc-subtitle">
            By subscribing to the above plans, you agree to abide by our following additional terms and conditions
          </p>

          {/* List */}
          <ol className="opctc-list">
            <li className="opctc-item">
              DSC shall be from Sign X Class III only.
            </li>

            <li className="opctc-item">
              The Stamp Duty varies from state to state and in states such as Andhra Pradesh, Bihar, Chandigarh, Chhattisgarh, Daman And Diu, Delhi, Goa, Gujarat, Karnataka, Kerala, Lakshadweep, Madhya Pradesh, Maharashtra, Punjab, Rajasthan, Telangana, Uttar Pradesh, Uttarakhand fees shall vary accordingly & shall be charged additionally as per actuals.
            </li>

            <li className="opctc-item">
              The fees mentioned above are valid for Authorised Capital up to Rs. 15 Lakhs and in case Authorised Capital is above Rs. 15 Lakhs the additional fee shall be charged as per actuals.
            </li>

            <li className="opctc-item">
              The above fee includes Name application for up to 4 choice names and in case all the 4 names are rejected by the department, an additional fee shall be charged as per actual.
            </li>

            <li className="opctc-item">
              The Audit Fees shall not be a part of our professional fees and shall be payable directly to the Auditor.
            </li>
            <li className="opctc-item">
              In case the above plan does not qualify your requirements, kindly contact our executive, we shall be happy to customise a plan for you.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default OPCTermCondition;
