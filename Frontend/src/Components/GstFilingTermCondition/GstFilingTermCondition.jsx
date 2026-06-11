import React from "react";
import "./GstFilingTermCondition.css";

const GstFilingTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — data compilation, ITC reconciliation, return preparation, and GST portal filing. They are exclusive of any government late fees, interest, and statutory levies.
            </li>
            <li className="opctc-item">
              No Government Filing Fee: GST returns carry no government fee when filed on time. Late fees (₹20–₹50 per day) and 18% interest on delayed tax are payable to the government and reimbursed at actuals only where a delay occurs due to late data or non-payment by the client.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Timely Data Submission: Accurate and timely filing depends on the client sharing complete sales, purchase, and bank data at least 3 working days before the due date. Legal Terminus is not liable for late fees arising from delayed or incomplete data.
            </li>
            <li className="opctc-item">
              Data Accuracy: Returns are prepared on the basis of invoices and records provided by the client. The client is responsible for the correctness of the underlying data. We flag visible mismatches but do not independently audit the books unless separately engaged.
            </li>
            <li className="opctc-item">
              Returns Are Not Revisable: Once filed, a GST return cannot be revised. Corrections (if any) are made through amendments in a subsequent period's return, subject to GST law timelines.
            </li>
            <li className="opctc-item">
              Input Tax Credit: ITC is claimed strictly as per GSTR-2B and eligibility rules under Section 16 of the CGST Act. Credit blocked, ineligible, or not reflected by vendors cannot be claimed, and Legal Terminus is not responsible for vendor non-compliance.
            </li>
            <li className="opctc-item">
              Plan Scope &amp; Invoice Limits: Each plan covers a defined number of invoices/periods. Additional volume, extra GSTINs, or amendment filings beyond the plan are quoted separately.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: GST registration, refund applications, departmental audit defence beyond standard notice replies, e-way bill management, and accounting/bookkeeping are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default GstFilingTermCondition;
