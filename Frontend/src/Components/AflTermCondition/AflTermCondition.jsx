import React from "react";
import "./AflTermCondition.css";

const AflTermCondition = () => {
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
              Government Fees Payable Separately: MCA filing fees for Form 11, Form 8, DIR-3 KYC, and other forms are slab-based on the LLP's total contribution and are reimbursed at actuals per the official MCA fee schedule.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Mandatory for All LLPs: Every LLP must file Form 11 and Form 8 each year irrespective of turnover or whether any business was carried on. Even a newly incorporated or dormant LLP is required to file.
            </li>
            <li className="opctc-item">
              Due-Date Dependence: Form 11 is due by 30 May and Form 8 by 30 October each year. Timely filing depends on you sharing finalised accounts, contribution details, and signed documents at least 7 working days before the due date.
            </li>
            <li className="opctc-item">
              Late Filing Penalty: Delayed filing of Form 11 / Form 8 attracts an additional MCA fee of ₹100 per day, per form, with no maximum cap. Legal Terminus is not liable for penalties arising from delayed data or signatures from the client's side.
            </li>
            <li className="opctc-item">
              Audit Applicability: A tax audit is required only if the LLP's turnover exceeds ₹40 lakh or contribution exceeds ₹25 lakh. Where applicable, audit is coordinated with a Chartered Accountant and quoted separately unless included in the chosen plan.
            </li>
            <li className="opctc-item">
              Valid DSC &amp; DIN Required: E-filing requires active Digital Signature Certificates (DSC) of designated partners with valid DIN/DPIN and KYC. Procuring or renewing DSC and completing DIR-3 KYC, where not in the chosen plan, is quoted separately.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Event-based filings (change of partners, contribution, or LLP agreement), strike-off, condonation of delay, and representation before the ROC beyond standard replies are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default AflTermCondition;
