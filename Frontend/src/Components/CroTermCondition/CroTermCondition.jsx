import React from "react";
import "../OPCTermCondition/OPCTermCondition.css";

const CroTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover our consultancy and professional services —
              name search, drafting, document preparation, and the SPICe+ / MOA / AOA filing. They are
              exclusive of MCA government fees, stamp duty, DSC charges, and any state-specific levies.
            </li>
            <li className="opctc-item">
              Government Fees &amp; DSC Payable Separately: Government fees, stamp duty, and Digital
              Signature Certificate (DSC) charges are payable to the authorities/vendors and reimbursed
              at actuals. Stamp duty varies by state and is charged as per actuals.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout on the
              professional fee.
            </li>
            <li className="opctc-item">
              Authorized Capital: The fees are valid for authorized capital up to ₹15,00,000. Government
              fees increase for a higher authorized capital amount.
            </li>
            <li className="opctc-item">
              Name Application: The name application includes up to 4 choice names. An additional fee
              applies for resubmission if the names are rejected beyond the included attempts.
            </li>
            <li className="opctc-item">
              Audit Fees: Statutory audit fees, where applicable, are payable directly to the auditor
              and are not included in the above plans.
            </li>
            <li className="opctc-item">
              Custom Plans: Custom or add-on plans are available upon request to suit specific business
              requirements.
            </li>
            <li className="opctc-item">
              Foreign National / NRI Incorporation: Incorporation involving a Foreign National or NRI
              director/shareholder requires separate discussion and is quoted separately (notarization
              and apostille of documents apply).
            </li>
            <li className="opctc-item">
              Disclaimer: Legal Terminus is a privately operated consultancy service provider and is not
              affiliated with any government authority. We provide assistance in documentation,
              preparation, and filing only — approvals and registrations are issued by the respective
              government departments.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default CroTermCondition;
