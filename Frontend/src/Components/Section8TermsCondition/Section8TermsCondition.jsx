import React from "react";
import "./Section8TermsCondition.css";

const Section8TermsCondition = () => {
  return (
    <section className="s8-tc-section">
      <div className="s8-tc-container">

        {/* ================= HEADING ================= */}
        <h2 className="s8-tc-title">TERMS &amp; CONDITIONS</h2>

        {/* ================= SUBTITLE ================= */}
        <p className="s8-tc-subtitle">
          By subscribing to the above plans, you agree to abide by our following
          additional terms and conditions
        </p>

        {/* ================= LIST ================= */}
        <ol className="s8-tc-list">
          <li className="s8-tc-item">
            DSC shall be from Sign X Class III only.
          </li>

          <li className="s8-tc-item">
            The Stamp Duty varies from state to state and in states such as Andhra Pradesh, Bihar, Chandigarh, Chhattisgarh, Daman And Diu, Delhi, Goa, Gujarat, Karnataka, Kerala, Lakshadweep, Madhya Pradesh, Maharashtra, Punjab, Rajasthan, Telangana, Uttar Pradesh, Uttarakhand fees shall vary accordingly & shall be charged additionally as per actual.
          </li>

          <li className="s8-tc-item">
            The fees mentioned above are valid for Authorised Capital up to Rs. 15 Lakhs and in case Authorised Capital is above Rs. 15 Lakhs the additional fee shall be charged as per actuals.
          </li>

          <li className="s8-tc-item">
            The above fee includes Name application for up to 4 choice names and in case all the 4 names are rejected by the department, an additional fee shall be charged as per actual.
          </li>

          <li className="s8-tc-item">
            The Audit Fees shall not be a part of our professional fees and shall be payable directly to the Auditor.
          </li>

          <li className="s8-tc-item">
            In case the above plan does not qualify your requirements, kindly contact our executive, we shall be happy to customise a plan for you.
          </li>
        </ol>

      </div>
    </section>
  );
};

export default Section8TermsCondition;
