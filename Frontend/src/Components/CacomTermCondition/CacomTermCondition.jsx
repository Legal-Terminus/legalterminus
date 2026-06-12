import React from "react";
import "./CacomTermCondition.css";

const CacomTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — drafting of resolutions, preparation of forms, and ROC/RD filings. They are exclusive of MCA government fees, stamp duty, advertisement costs, and other out-of-pocket expenses.
            </li>
            <li className="opctc-item">
              Government Fees Payable Separately: MCA fees for INC-22, MGT-14, INC-23, INC-28, RD application fees, and newspaper advertisement charges are payable to the authorities and reimbursed at actuals.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Type of Change Determines Process: The procedure depends on the move — within the same city/local limits needs only a board resolution and INC-22; within the state across ROC jurisdiction needs a special resolution and may need RD approval; and a change from one state to another needs an MOA alteration, advertisement, and Regional Director approval. The applicable plan is confirmed before filing.
            </li>
            <li className="opctc-item">
              Valid Address Proof Required: The new registered office must be supported by recent utility-bill proof (not older than two months), a rent agreement or ownership document, and a No-Objection Certificate from the owner where the premises are rented.
            </li>
            <li className="opctc-item">
              Filing Timeline: Form INC-22 must generally be filed within 30 days of the change. Timely filing depends on the client providing signed resolutions, the new address proof, and the NOC promptly. Late filing attracts additional MCA fees.
            </li>
            <li className="opctc-item">
              RD Approval is Discretionary: For a state-to-state change, the Regional Director's approval is required and is at the RD's discretion. Objections from creditors, employees, or authorities can extend the timeline. Legal Terminus prepares a complete application but does not guarantee approval or a fixed timeline.
            </li>
            <li className="opctc-item">
              Post-Change Updates: After the registered office is changed on the MCA record, the new address must be updated on PAN, GST, bank, licences, letterheads, and statutory displays — included only in the plan that specifies it.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Change of company name, directors, or objects, GST registration in the new state, drafting of lease/rent agreements, and dispute resolution are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default CacomTermCondition;
