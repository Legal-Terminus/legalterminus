import React from "react";
import "./PvtllpTermCondition.css";

const PvtllpTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — eligibility review, Form 18 / FiLLiP documentation, LLP agreement drafting, and conversion filing. They are exclusive of MCA government fees, stamp duty on the LLP agreement, and DSC / DPIN charges.
            </li>
            <li className="opctc-item">
              Government Fees &amp; Charges Payable Separately: MCA fees for Form 18, FiLLiP and Form 3, DSC / DPIN charges, and state stamp duty on the LLP agreement are payable to the authorities/vendors and reimbursed at actuals.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Section 56 Conversion Route: A Private Limited Company is converted into an LLP under Section 56 and the Third Schedule of the LLP Act, 2008, by filing Form 18 along with FiLLiP. On approval, the LLP is incorporated, Form 14 intimation is filed with the Registrar of Companies, and the company is deemed dissolved.
            </li>
            <li className="opctc-item">
              All Shareholders Become Partners: On conversion, all shareholders of the company — and no one else — must become partners of the LLP. There must be at least two designated partners, and the partners' holding is mapped from the existing shareholding into capital contribution.
            </li>
            <li className="opctc-item">
              No Subsisting Security Interest: The company must have no security interest (charge) subsisting on its assets at the time of application. Any secured loans / charges must be satisfied or a No-Objection Certificate obtained from the charge-holders before conversion.
            </li>
            <li className="opctc-item">
              Up-to-Date Filings &amp; Consents: All annual returns and financial statements with the ROC, and all income-tax returns, must be up to date. The consent of all shareholders and of all secured creditors is required. The client is responsible for the accuracy of these details.
            </li>
            <li className="opctc-item">
              Tax on Conversion: The conversion is tax-neutral only if the conditions under Section 47(xiiib) of the Income-tax Act are met (turnover, shareholding-to-profit-share continuity, asset/accumulated-profit conditions). If they are not met, capital-gains tax may apply. We review eligibility, but tax assessment / litigation is out of scope.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Detailed valuation, resolution of pre-existing company disputes or dues, FDI/FEMA compliance, charge-satisfaction litigation, trademark assignment, and ongoing accounting/bookkeeping are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default PvtllpTermCondition;
