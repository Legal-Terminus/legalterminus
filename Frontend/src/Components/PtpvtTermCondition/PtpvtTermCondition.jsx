import React from "react";
import "./PtpvtTermCondition.css";

const PtpvtTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — eligibility review, URC-1/URC-2 documentation, MOA/AOA drafting, and SPICe+ incorporation. They are exclusive of MCA government fees, stamp duty, DSC charges, and newspaper advertisement costs.
            </li>
            <li className="opctc-item">
              Government Fees &amp; Charges Payable Separately: MCA fees for URC-1 and SPICe+, DSC charges, state stamp duty on the MOA/AOA, and the URC-2 advertisement charges are payable to the authorities/vendors and reimbursed at actuals.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Section 366 Conversion Route: A partnership firm is converted into a Private Limited Company under Section 366 of the Companies Act, 2013 (Companies Authorised to Register) by filing Form URC-1 along with SPICe+ incorporation. The new company is registered under Section 367, and the firm's business carries on under the company.
            </li>
            <li className="opctc-item">
              All Partners Become Shareholders: On conversion, all partners of the firm must become shareholders of the company. A Private Limited Company requires at least two directors and two shareholders, so a firm with at least two partners can convert directly; the partners' capital is mapped into share capital.
            </li>
            <li className="opctc-item">
              NOC &amp; URC-2 Advertisement: A No-Objection Certificate from the Registrar of Firms (where the firm is registered) and from secured creditors, plus a public notice in Form URC-2 (one English + one vernacular newspaper) inviting objections, are mandatory before registration. Objections from creditors or the public must be addressed, which can affect the timeline.
            </li>
            <li className="opctc-item">
              Statement of Accounts &amp; Consents: The application requires a statement of the firm's assets and liabilities certified by a Chartered Accountant within the prescribed period, a copy of the registered partnership deed, the latest income-tax return, a list of creditors with consent, and the written consent of all partners. The client is responsible for the accuracy of these details.
            </li>
            <li className="opctc-item">
              Post-Conversion Compliance: A Private Limited Company has stricter compliance than a partnership firm — annual ROC filings (AOC-4, MGT-7), board meetings, and a mandatory statutory audit every year regardless of turnover. First-year compliance is included only in the plan that specifies it.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Detailed valuation, resolution of pre-existing firm disputes or dues, tax assessments/litigation, FDI/FEMA filings, trademark assignment, and ongoing accounting/bookkeeping are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default PtpvtTermCondition;
