import React from "react";
import "./PvtltdTermsCondition.css";

const TermsConditions = () => {
  return (
    <section className="pvtltd-tc-section">
      <div className="pvtltd-tc-container">
        <div className="pvtltd-tc-card">

        {/* Heading */}
        <h2 className="pvtltd-tc-title">TERMS &amp; CONDITIONS</h2>

        {/* Sub heading */}
        <p className="pvtltd-tc-subtitle">
          By subscribing to any of the above plans, you agree to the following terms and conditions. Please read them carefully before proceeding.
        </p>

        {/* List */}
        <ol className="pvtltd-tc-list">
          <li className="pvtltd-tc-item">
            Stamp Duty varies from state to state and shall be charged at actuals, over and above the plan fee. It is applied on the MOA, AOA, and SPICe+ forms at state-prescribed rates.
          </li>

          <li className="pvtltd-tc-item">
            The fees above are valid for companies with Authorized Capital up to ₹15,00,000 (Fifteen Lakhs), where the MCA registration fee is nil. For Authorized Capital above ₹15 Lakhs, MCA fees increase as per the Companies (Registration Offices and Fees) Rules, 2014.
          </li>

          <li className="pvtltd-tc-item">
            The plan fee includes name application for up to 4 choice names via the RUN (Reserve Unique Name) form. If all 4 names are rejected by the MCA/ROC, an additional charge shall be levied for resubmission.
          </li>

          <li className="pvtltd-tc-item">
            Statutory Audit Fees are expressly excluded from all plans and shall be payable directly by the client to the appointed Statutory Auditor. Legal Terminus does not act in the capacity of a Statutory Auditor.
          </li>

          <li className="pvtltd-tc-item">
            18% GST is applicable on all professional/consultancy fees charged by Legal Terminus.
          </li>

          <li className="pvtltd-tc-item">
            Government fees and Digital Signature Certificate (DSC) procurement charges are payable at actuals and shall be communicated prior to payment.
          </li>

          <li className="pvtltd-tc-item">
            If any proposed Director, Shareholder, or Subscriber is a Foreign National or NRI, the incorporation fee shall be determined through mutual discussion due to additional documentation requirements (apostille, notarization).
          </li>

          <li className="pvtltd-tc-item">
            PAN, TAN, EPF registration number, and ESIC code are allotted automatically by the government via the SPICe+ process and delivered to the company's registered email. These are not issued by Legal Terminus.
          </li>

          <li className="pvtltd-tc-item">
            Post-incorporation, the company must file Form INC-20A (Commencement of Business) within 180 days of the Certificate of Incorporation date under Section 10A of the Companies Act, 2013. Non-compliance attracts a penalty of ₹50,000 on the company and ₹1,000 per day per defaulting officer. This filing is included in the Enriched and Supreme Plans.
          </li>

          <li className="pvtltd-tc-item">
            Legal Terminus Private Limited is a private consultancy firm and is not affiliated with any government authority, the Ministry of Corporate Affairs, or the Registrar of Companies. All government certificates are issued directly by the respective departments. Our fees are exclusively for consultancy, documentation assistance, and application support services.
          </li>
        </ol>
        </div>
      </div>
    </section>
  );
};

export default TermsConditions;
