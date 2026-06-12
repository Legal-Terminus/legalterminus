import React from "react";
import "./TmoppTermCondition.css";

const TmoppTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — case analysis, drafting of the notice/counter-statement, evidence, and filing. They are exclusive of government fees, notarisation charges, and out-of-pocket costs.
            </li>
            <li className="opctc-item">
              Government Fees Payable Separately: The IP India fee for a Notice of Opposition (₹2,700 per class) is payable to the Trade Marks Registry and reimbursed at actuals. Defending an opposition (counter-statement) carries no government fee.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              No Guarantee of Outcome: Opposition proceedings are adjudicated by the Trade Marks Registry on the merits and evidence. Filing or defending an opposition does not guarantee a particular result; the decision rests entirely with the Registrar.
            </li>
            <li className="opctc-item">
              Strict Statutory Deadlines: A counter-statement must be filed within 2 months of receiving the opposition, failing which the application is deemed abandoned. Evidence stages also run on fixed timelines. Timely action depends on the client providing instructions and evidence promptly.
            </li>
            <li className="opctc-item">
              Evidence is Client-Provided: The strength of an opposition or defence depends on documentary evidence (prior use, reputation, sales, advertising) supplied by the client. Evidence is filed by affidavit, and the client is responsible for its authenticity.
            </li>
            <li className="opctc-item">
              Hearing May Be Required: Most contested oppositions proceed to a hearing before the Registrar. Hearing preparation and representation are included only in the plan that specifies them; otherwise they are quoted separately.
            </li>
            <li className="opctc-item">
              Multi-Stage Proceeding: Opposition is a multi-stage process that can span many months. Each plan covers a defined scope; additional rounds of evidence, extensions, or interlocutory petitions are quoted separately.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Fresh trademark filing, examination reply, rectification/cancellation, assignment, renewal, appeals to the High Court, and infringement litigation are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default TmoppTermCondition;
