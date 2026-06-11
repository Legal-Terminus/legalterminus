import React from "react";
import "./TmrnwTermCondition.css";

const TmrnwTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — deadline verification, Form TM-R drafting, and filing. They are exclusive of government renewal fees, surcharges, and out-of-pocket costs.
            </li>
            <li className="opctc-item">
              Government Fees Payable Separately: The IP India renewal fee (₹9,000 per class), grace-period surcharge, and restoration fee are payable to the Trade Marks Registry and reimbursed at actuals per the official fee schedule.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Renewal Window: An application to renew can be filed up to one year before the expiry date. Filing on time avoids the surcharge and the risk of removal. The renewal date is verified against the official register before filing.
            </li>
            <li className="opctc-item">
              Grace Period &amp; Surcharge: If a mark is not renewed by its expiry, it can still be renewed within a 6-month grace period on payment of a surcharge in addition to the renewal fee. We file promptly to minimise any surcharge.
            </li>
            <li className="opctc-item">
              Restoration is Discretionary: If a mark is removed for non-renewal, restoration is possible within one year of expiry by filing Form TM-R with the restoration fee. Restoration is subject to the Registrar's discretion and cannot be guaranteed.
            </li>
            <li className="opctc-item">
              Client Responsibility: Providing the correct registration number, class, proprietor details, and the current expiry date is the client's responsibility. Legal Terminus is not liable for lapses caused by incorrect details or delayed instructions.
            </li>
            <li className="opctc-item">
              Continuity of Rights: A renewed trademark continues to enjoy full statutory protection and the right to use the ® symbol. A lapsed or removed mark loses these rights until it is validly renewed or restored.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Fresh trademark applications, opposition/rectification, assignment, infringement litigation, and international (Madrid) renewals are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default TmrnwTermCondition;
