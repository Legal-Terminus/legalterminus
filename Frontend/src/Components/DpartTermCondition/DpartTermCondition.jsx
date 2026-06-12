import React from "react";
import "./DpartTermCondition.css";

const DpartTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — advising on the mode of dissolution, drafting the dissolution deed, settlement clauses, public notice, and Registrar intimation. They are exclusive of stamp duty, notary charges, publication costs, and other out-of-pocket expenses.
            </li>
            <li className="opctc-item">
              Out-of-Pocket Costs Payable Separately: State stamp duty on the deed, notarisation, newspaper publication of the public notice, and any Registrar of Firms fees are reimbursed at actuals.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Consent of All Partners: A dissolution by agreement requires the consent of all partners (or as provided in the partnership deed). The dissolution deed must be signed by all partners; we draft it but cannot dissolve the firm without the partners' execution.
            </li>
            <li className="opctc-item">
              Settlement of Accounts: On dissolution, the firm's assets are applied first to pay third-party debts, then to repay partners' advances and capital, and any surplus is distributed in the profit-sharing ratio under Section 48 of the Indian Partnership Act, 1932. Correct figures for capital, loans, and assets are the partners' responsibility.
            </li>
            <li className="opctc-item">
              Public Notice is Important: A public notice of dissolution protects partners from liability for acts done after dissolution. For a registered firm, a notice of dissolution should also be filed with the Registrar of Firms. We prepare both, but liability for pre-dissolution acts is not extinguished by notice.
            </li>
            <li className="opctc-item">
              Surrender of Registrations: The firm's PAN, GST, Udyam, Shops &amp; Establishment, and other registrations should be surrendered/cancelled after dissolution. Where included in the plan, we coordinate these; pending dues must be cleared before cancellation.
            </li>
            <li className="opctc-item">
              No Pending Liabilities Assumed: Legal Terminus drafts and files documents based on the information provided by the partners. We do not assume or settle the firm's debts, tax dues, or inter-se disputes; these remain the partners' responsibility.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Litigation between partners, court-ordered dissolution proceedings, asset valuation, debt or creditor settlement, tax assessments/appeals, and conversion of the firm into another entity are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default DpartTermCondition;
