import React from "react";
import "./DpvtTermCondition.css";

const DpvtTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — eligibility assessment, drafting of resolutions, indemnity bond, affidavit, and Form STK-2 filing. They are exclusive of MCA government fees, stamp duty, and out-of-pocket costs.
            </li>
            <li className="opctc-item">
              Government Fees Payable Separately: The MCA strike-off fee (₹10,000), any pending annual-filing fees and late fees, and stamping/notarisation charges are payable to the authorities and reimbursed at actuals.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Eligibility for Strike-Off: Section 248 voluntary strike-off is available only if the company has either not commenced business, or has not carried on business for the two preceding financial years and has not applied for dormant status. We confirm eligibility before filing.
            </li>
            <li className="opctc-item">
              Liabilities Must Be Extinguished: Before strike-off, the company must clear all its liabilities. The directors give an indemnity (STK-3) and affidavit (STK-4) to this effect, and remain personally liable for any liability that subsists after strike-off. Accuracy of these declarations is the directors' responsibility.
            </li>
            <li className="opctc-item">
              Up-to-Date Filings Required: All overdue annual returns and financial statements must generally be filed before or along with the strike-off application. Pending-filing fees and late fees are additional and billed at actuals.
            </li>
            <li className="opctc-item">
              Companies That Cannot Be Struck Off: Listed companies, companies with pending charges, prosecutions, inspections/investigations, or those that are otherwise ineligible under Section 249 cannot use this route. Such cases may require voluntary liquidation under the IBC, 2016 instead, which we advise on separately.
            </li>
            <li className="opctc-item">
              Outcome Subject to ROC: Strike-off is approved by the Registrar of Companies after a public notice (STK-5/STK-6) and objection period. Legal Terminus prepares and files a complete application but cannot guarantee approval or a specific timeline, which is at the ROC's discretion.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Voluntary liquidation under the IBC, NCLT winding-up, valuation, dispute or creditor settlement, tax assessments/litigation, asset disposal, and revival of a struck-off company are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default DpvtTermCondition;
