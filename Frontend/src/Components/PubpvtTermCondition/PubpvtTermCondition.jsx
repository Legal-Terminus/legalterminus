import React from "react";
import "./PubpvtTermCondition.css";

const PubpvtTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — eligibility review, board &amp; EGM documentation, special resolution and MOA/AOA alteration drafting, and the MGT-14 / RD-1 / INC-28 filings. They are exclusive of MCA government fees, the Regional Director application fee, newspaper advertisement charges, stamp duty, and DSC charges.
            </li>
            <li className="opctc-item">
              Government Fees &amp; Charges Payable Separately: ROC filing fees (MGT-14, INC-28, INC-27), the Regional Director (RD-1) fee, newspaper advertisement charges, state stamp duty on the altered MOA/AOA, and DSC charges are payable to the authorities/vendors and reimbursed at actuals.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Conversion Route — Section 14 &amp; 18: A Public Limited Company is converted into a Private Limited Company under Section 14 read with Section 18 of the Companies Act, 2013. It requires a special resolution and the approval of the Regional Director (Central Government), after which a fresh Certificate of Incorporation is issued with the new name.
            </li>
            <li className="opctc-item">
              Regional Director Approval is Mandatory: The conversion is not effective on the special resolution alone — it requires the Regional Director's approval on Form RD-1. The process timeline depends on the RD's review and any objections raised by creditors or regulators.
            </li>
            <li className="opctc-item">
              Newspaper Notice &amp; Creditor Intimation: A public notice (Form INC-25A) must be advertised in one English and one vernacular newspaper, and individual notice must be served on creditors, the ROC, and the Regional Director, inviting objections. Objections must be addressed, which can affect the timeline.
            </li>
            <li className="opctc-item">
              Private-Company Structure: On conversion the company must satisfy the private-company conditions — a minimum of 2 directors and 2 members, a maximum of 200 members, restriction on transfer of shares, and a prohibition on inviting the public to subscribe. The articles are altered accordingly and the name gains the word "Private".
            </li>
            <li className="opctc-item">
              Updated Records: The CIN changes on conversion. PAN, GST, bank accounts, and licences must be updated to the new name. These updates are included only in the plan that specifies them.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Detailed valuation, resolution of pre-existing disputes or dues, SEBI delisting (for a previously listed company), FDI/FEMA filings, tax assessments/litigation, and ongoing accounting/bookkeeping are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default PubpvtTermCondition;
