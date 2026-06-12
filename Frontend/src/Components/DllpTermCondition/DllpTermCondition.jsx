import React from "react";
import "./DllpTermCondition.css";

const DllpTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — eligibility assessment, drafting of the partners' consent, affidavit, indemnity, and Form 24 filing. They are exclusive of MCA government fees, stamp duty, and out-of-pocket costs.
            </li>
            <li className="opctc-item">
              Government Fees Payable Separately: The Form 24 filing fee, any pending Form 8 / Form 11 fees and late fees, and stamping/notarisation charges are payable to the authorities and reimbursed at actuals.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Eligibility for Strike-Off: Under Rule 37 of the LLP Rules, 2009, Form 24 strike-off is available only if the LLP has either never commenced business or has ceased commercial activity for one year or more, with no pending liabilities. We confirm eligibility before filing.
            </li>
            <li className="opctc-item">
              Liabilities Must Be Extinguished: Before strike-off, the LLP must clear all liabilities and close its bank account. The designated partners give an affidavit and indemnity to this effect, and remain personally liable for any liability that subsists after strike-off. Accuracy of these declarations is the partners' responsibility.
            </li>
            <li className="opctc-item">
              Up-to-Date Filings Required: Overdue Form 8 and Form 11 generally need to be filed up to the end of the financial year in which the LLP ceased business before the strike-off application. Pending-filing fees and the uncapped ₹100/day late fee are additional and billed at actuals.
            </li>
            <li className="opctc-item">
              Consent of All Partners: Form 24 requires the consent of all partners of the LLP. The application also requires a statement of accounts disclosing nil assets and liabilities, certified by a Chartered Accountant and not older than 30 days from the date of application.
            </li>
            <li className="opctc-item">
              Outcome Subject to ROC: Strike-off is approved by the Registrar after a public notice and objection period. Legal Terminus prepares and files a complete application but cannot guarantee approval or a specific timeline, which is at the ROC's discretion.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Voluntary winding-up under the LLP Act, NCLT proceedings, valuation, dispute or creditor settlement, tax assessments/litigation, asset disposal, and revival of a struck-off LLP are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default DllpTermCondition;
