import React from "react";
import "./TmexrTermCondition.css";

const TmexrTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — examination report analysis, reply drafting, evidence compilation, and filing. They are exclusive of any government fees, notarisation charges, and out-of-pocket costs.
            </li>
            <li className="opctc-item">
              No Guarantee of Acceptance: Filing a reply does not guarantee that the objection will be waived or the mark accepted. The outcome rests entirely with the Trade Marks Registry / Examiner, who decides on the merits of the case.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Strict 30-Day Deadline: The reply to an examination report must be filed within 30 days of its receipt. Timely action depends on you sharing the examination report and instructions immediately. We are not liable for abandonment caused by delayed instructions from the client.
            </li>
            <li className="opctc-item">
              Evidence is Client-Provided: For Section 9 objections, evidence of use and distinctiveness (invoices, advertisements, packaging, sales figures) must be provided by the client. The strength of the reply depends on the quality and authenticity of this evidence.
            </li>
            <li className="opctc-item">
              Hearing May Be Required: Even after a reply, the Registry may schedule a show-cause hearing. Hearing preparation and representation are included only in the plan that specifies them; otherwise they are quoted separately.
            </li>
            <li className="opctc-item">
              Accuracy of Application Details: The reply is filed against the application details already on record. The applicant is responsible for the correctness of the original application, the mark, and the class(es).
            </li>
            <li className="opctc-item">
              Scope of Reply: Each plan covers a defined scope. Additional grounds raised, supplementary submissions, evidence beyond the plan, or a later review petition are quoted separately.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Fresh trademark filing, opposition defence, rectification, assignment, renewal, and infringement litigation are not included in an examination-reply engagement and are quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default TmexrTermCondition;
