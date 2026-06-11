import React from "react";
import "./AfcTermCondition.css";

const AfcTermCondition = () => {
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
              Professional Fee Only: All quoted prices cover professional services — document drafting, form preparation, and MCA e-filing. They are exclusive of MCA government fees, statutory levies, and out-of-pocket costs.
            </li>
            <li className="opctc-item">
              Government Fees Payable Separately: MCA filing fees for AOC-4, MGT-7, ADT-1, DPT-3, and other forms are slab-based on authorised capital and are reimbursed at actuals per the official MCA fee schedule.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Statutory Audit Mandatory: Every company must have its accounts audited by a Chartered Accountant before filing AOC-4, regardless of turnover. Audit is included only in the plan that specifies it; otherwise it is coordinated separately.
            </li>
            <li className="opctc-item">
              Due-Date Dependence: AOC-4 is generally due within 30 days of the AGM and MGT-7 within 60 days of the AGM (AGM itself by 30 September). Timely filing depends on you sharing finalised accounts and signed documents at least 7 working days before the due date.
            </li>
            <li className="opctc-item">
              Late Filing Penalty: Delayed filing of AOC-4 / MGT-7 attracts an additional MCA fee of ₹100 per day, per form, with no maximum cap. Legal Terminus is not liable for penalties arising from delayed data, audit, or signatures from the client's side.
            </li>
            <li className="opctc-item">
              Valid DSC &amp; DIN Required: E-filing requires active Digital Signature Certificates (DSC) of directors and a director with valid DIN/KYC. Procuring or renewing DSC and completing DIR-3 KYC, where not in the chosen plan, is quoted separately.
            </li>
            <li className="opctc-item">
              Refund Policy: Full refund of professional fee (less ₹999 handling) is available if filing is not initiated within 7 working days of receiving all finalised documents. Government fees already paid to the MCA are non-refundable through us.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Event-based filings (change in directors, capital, charges), secretarial audit, condonation of delay applications, and representation before the ROC/NCLT beyond standard replies are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default AfcTermCondition;
