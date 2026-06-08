import React from "react";
import "./IECTermCondition.css";

const IECTermCondition = () => {
  return (
    <section className="iectc-section">
      <div className="iectc-container">
        <div className="iectc-card">
        {/* Heading */}
        <h2 className="iectc-title">TERMS &amp; CONDITIONS</h2>

        {/* Sub heading */}
        <p className="iectc-subtitle">
          By subscribing to any of the above plans, you agree to the following terms and conditions. Please read them carefully before proceeding.
        </p>

        {/* List */}
        <ol className="iectc-list">
          <li className="iectc-item">
            IEC application shall be filed through the DGFT online portal only. The government fee of ₹500 is payable at actuals and is not included in the professional fee.
          </li>

          <li className="iectc-item">
            The mentioned fees are valid for individuals, proprietorships, or small businesses. Additional charges may apply for companies or LLPs due to additional documentation requirements.
          </li>

          <li className="iectc-item">
            The above fee includes one-time IEC application; any modification, update, or re-issuance later will incur additional government or service fees as applicable under DGFT rules.
          </li>

          <li className="iectc-item">
            The applicant must ensure all provided documents (PAN, address proof, bank certificate, cancelled cheque, etc.) are valid and up-to-date. Incorrect or incomplete details may delay or reject the approval process.
          </li>

          <li className="iectc-item">
            18% GST is applicable on all professional/consultancy fees charged by Legal Terminus.
          </li>

          <li className="iectc-item">
            Legal Terminus Private Limited is a private consultancy firm and is not affiliated with any government authority or DGFT. All IEC certificates are issued directly by DGFT. Our fees are exclusively for consultancy, documentation assistance, and application support services.
          </li>

          <li className="iectc-item">
            In case your requirements differ from these plans, kindly contact our executive — we will be happy to customise a plan for you.
          </li>
        </ol>
        </div>
      </div>
    </section>
  );
};

export default IECTermCondition;
