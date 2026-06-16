import React from "react";
import "./PtopvtTermCondition.css";

const PtopvtTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — eligibility review, URC-1/URC-2 documentation, MOA/AOA drafting, SPICe+ incorporation, and the takeover agreement. They are exclusive of MCA government fees, stamp duty, DSC charges, and newspaper advertisement costs.
            </li>
            <li className="opctc-item">
              Government Fees &amp; Charges Payable Separately: MCA fees for URC-1 and SPICe+, DSC charges, state stamp duty on the MOA/AOA and transfer agreement, and the URC-2 newspaper advertisement charges are payable to the authorities/vendors and reimbursed at actuals.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Section 366 Conversion Route: A sole proprietorship is converted into a Private Limited Company under Section 366 of the Companies Act, 2013 (Companies Authorised to Register) by filing Form URC-1 along with SPICe+ incorporation. It involves additional steps — newspaper publication (URC-2), creditor consent, and an audited statement of accounts — that a fresh incorporation does not.
            </li>
            <li className="opctc-item">
              Minimum Two Members &amp; Directors: A Private Limited Company requires at least two shareholders and two directors. As the sole proprietor, you must bring in at least one more person (a co-founder, family member, or trusted associate) to meet this requirement before conversion.
            </li>
            <li className="opctc-item">
              URC-2 Advertisement &amp; Objections: A public notice in Form URC-2 must be published in an English and a vernacular newspaper inviting objections before registration. Any objections raised by creditors or the public must be addressed, which can affect the timeline.
            </li>
            <li className="opctc-item">
              Statement of Accounts &amp; Solvency: The application requires an audited statement of accounts of the proprietorship not older than 30 days from the date of URC-1 filing, a list of creditors with their consent/NOC, and a declaration of solvency. The client is responsible for the accuracy of these financial details.
            </li>
            <li className="opctc-item">
              Post-Conversion Compliance: A Private Limited Company has higher compliance than a proprietorship — annual ROC filings (AOC-4, MGT-7), board meetings, statutory audit, and director KYC. First-year compliance is included only in the plan that specifies it.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Detailed business valuation, resolution of pre-existing proprietorship disputes or dues, trademark registration/assignment, FDI/FEMA filings, and ongoing accounting/bookkeeping are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default PtopvtTermCondition;
