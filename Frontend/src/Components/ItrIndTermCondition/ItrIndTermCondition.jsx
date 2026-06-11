import React from "react";
import "./ItrIndTermCondition.css";

const ItrIndTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — income computation, regime comparison, deduction optimisation, return preparation, and e-filing. They are exclusive of any tax payable, government penalties, and interest.
            </li>
            <li className="opctc-item">
              Self-Assessment Tax Payable Separately: Any income tax, advance tax, or self-assessment tax due on your income is your liability and is paid directly to the Income Tax Department, over and above our fee.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Correct ITR Form: The applicable form (ITR-1, ITR-2, ITR-3, or ITR-4) is determined by your sources of income, residential status, and income level. Legal Terminus confirms the correct form during the review before filing.
            </li>
            <li className="opctc-item">
              Data Accuracy &amp; Responsibility: Returns are prepared on the basis of documents and details provided by you (Form 16, statements, proofs). You remain responsible for the completeness and correctness of the data; we reconcile against 26AS / AIS and flag visible mismatches.
            </li>
            <li className="opctc-item">
              Tax Regime Choice: We provide an old-vs-new regime comparison, but the final choice of regime — and its consequences (such as the new regime being the default) — is confirmed by you before filing.
            </li>
            <li className="opctc-item">
              Timely Submission: Accurate, penalty-free filing depends on you sharing complete documents well before the due date (generally 31st July). We are not liable for Section 234F fees or 234A/B/C interest arising from delayed or incomplete information.
            </li>
            <li className="opctc-item">
              Refund Timelines: Income tax refunds are processed and credited solely by the Income Tax Department / CPC. Legal Terminus files and e-verifies your return accurately but does not control refund amount or timing.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Detailed tax planning, response to scrutiny/assessment beyond standard notice replies, revised or updated (ITR-U) return filing, and accounting for business books are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default ItrIndTermCondition;
