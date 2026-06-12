import React from "react";
import "./TmhearTermCondition.css";

const TmhearTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — case review, drafting of written submissions, evidence organisation, and hearing representation. They are exclusive of any government fees and out-of-pocket costs.
            </li>
            <li className="opctc-item">
              Government Fees Payable Separately: Attending a hearing carries no government fee. Any incidental fees — such as an adjournment request or a later review petition (Form TM-M) — are payable to the Trade Marks Registry and reimbursed at actuals.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              No Guarantee of Outcome: Representation gives your case its best chance, but the decision to accept, refuse, or seek further material rests entirely with the Hearing Officer / Registrar on the merits. We do not guarantee a particular result.
            </li>
            <li className="opctc-item">
              Hearing Date is Set by the Registry: The hearing date and mode are fixed by the Trade Marks Registry. Timely action depends on you sharing the hearing notice and instructions immediately on receipt so we can prepare in time.
            </li>
            <li className="opctc-item">
              Evidence is Client-Provided: The strength of submissions depends on documentary evidence (use, reputation, distinctiveness) supplied by the client. The client is responsible for the authenticity and timely provision of this evidence.
            </li>
            <li className="opctc-item">
              Adjournments are Limited: The Registry allows only a limited number of adjournments, granted at its discretion. We will request an adjournment where genuinely required, but cannot guarantee it will be allowed.
            </li>
            <li className="opctc-item">
              Scope per Hearing: Each plan covers the defined scope and, where specified, one or more hearing appearances. Additional hearings, fresh evidence rounds, or interlocutory petitions are quoted separately.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Fresh trademark filing, the initial examination reply, rectification/cancellation, assignment, renewal, appeals to the High Court, and infringement litigation are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default TmhearTermCondition;
