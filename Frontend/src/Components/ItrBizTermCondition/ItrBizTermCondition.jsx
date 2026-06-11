import React from "react";
import "./ItrBizTermCondition.css";

const ItrBizTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — income computation, deduction optimisation, return preparation, and e-filing. They are exclusive of any statutory tax payable, government penalties, interest, and tax audit fees.
            </li>
            <li className="opctc-item">
              Self-Assessment Tax Payable Separately: Any income tax, advance tax, or self-assessment tax due on your business income is your liability and is paid directly to the Income Tax Department, over and above our fee.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Correct ITR Form: The applicable form (ITR-3, ITR-4, ITR-5, or ITR-6) is determined by your entity type, nature of income, and presumptive eligibility. Legal Terminus confirms the correct form during the discovery review before filing.
            </li>
            <li className="opctc-item">
              Data Accuracy &amp; Responsibility: Returns are prepared on the basis of books, invoices, bank statements, and details provided by you. You remain responsible for the completeness and correctness of the underlying data; we reconcile against 26AS / AIS and flag visible mismatches.
            </li>
            <li className="opctc-item">
              Tax Audit Scope: Where turnover/receipts exceed the Section 44AB threshold (or presumptive conditions are breached), a tax audit by a Chartered Accountant is mandatory. Audit is a separate engagement, quoted and timed independently of return filing.
            </li>
            <li className="opctc-item">
              Timely Submission: Accurate, penalty-free filing depends on you sharing complete data well before the due date (typically 31st July for non-audit and 31st October for audit cases). We are not liable for Section 234F fees or 234A/B/C interest arising from delayed or incomplete data.
            </li>
            <li className="opctc-item">
              Refund Policy: Full refund of professional fee (less ₹499 handling) is available if the return is not prepared within 7 working days of receiving all required documents. Taxes already paid to the department are not refundable through us.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Bookkeeping/accounting write-up, GST returns, TDS returns, statutory/tax audit, scrutiny representation beyond standard notice replies, and revised/updated return filing are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default ItrBizTermCondition;
