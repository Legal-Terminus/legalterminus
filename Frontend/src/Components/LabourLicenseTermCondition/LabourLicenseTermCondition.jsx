import React from "react";
import "./LabourLicenseTermCondition.css";

const LabourLicenseTermCondition = () => {
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
              Professional Fee Only: All quoted prices are exclusive of government registration/licence fees, security deposits, statutory levies, and out-of-pocket costs. Our fee covers professional services — application preparation, Form drafting, department filing, document coordination, and compliance support.
            </li>
            <li className="opctc-item">
              Government Fees Payable Separately: CLRA registration and licence fees, along with the refundable security deposit (per workman), are payable to the Labour Department / licensing authority and reimbursed at actuals based on the applicable state schedule.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Registration Type Eligibility: The correct registration (Principal Employer RC and/or Contractor Licence) is determined by your role in the engagement and the number of contract workmen. Legal Terminus confirms the applicable registration type during the discovery call before filing.
            </li>
            <li className="opctc-item">
              Applicability Threshold: CLRA registration/licence is mandatory where 20 or more contract workmen are engaged (or were engaged on any day of the preceding 12 months). Some states have lower thresholds — applicability is confirmed against the relevant state amendment.
            </li>
            <li className="opctc-item">
              Form V Dependency: A Contractor Licence application requires Form V (certificate that the principal employer has registered the establishment) from the principal employer. We coordinate this, but issuance timelines depend on the principal employer's cooperation.
            </li>
            <li className="opctc-item">
              Renewal Obligation: A labour licence is valid for 1 year and must be renewed before expiry (apply at least 30 days prior). Late renewal attracts a surcharge per CLRA rules. Legal Terminus includes renewal reminders in the relevant plans but is not liable for lapses due to client non-responsiveness.
            </li>
            <li className="opctc-item">
              Refund Policy: Full refund of professional fee (less ₹499 documentation handling) is available if the application is not filed within 7 working days from receipt of all required documents and Form V. Government fees and security deposits already paid are subject to the department's own refund policy and are not refundable through us.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Inspection defence beyond standard representation, half-yearly/annual return filing not in the chosen plan, labour-law litigation, wage/PF/ESI dispute handling, and amendments after licence issuance are not included and quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default LabourLicenseTermCondition;
