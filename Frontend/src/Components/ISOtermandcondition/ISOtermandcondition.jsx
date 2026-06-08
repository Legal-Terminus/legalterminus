import React from "react";
import "./ISOtermandcondition.css";

const items = [
  "All fees mentioned in these plans are professional/consultancy fees charged by Legal Terminus. Certification Body (CB) fees — including Stage 1 audit, Stage 2 audit, surveillance audit, and re-certification audit — are charged separately by the CB on actuals and are not included in the above plan prices.",
  "ISO certification fees vary by standard (ISO 9001, 14001, 27001, 45001, 22000, etc.), certification body, scope of certification, and number of employees/sites. The fee communicated at the time of engagement is specific to the standard and scope agreed upon.",
  "Annual surveillance audits are conducted by the CB in Year 1 and Year 2 of the 3-year certification cycle. Surveillance charges are approximately 50% of the initial Stage 1+2 fees and are payable directly to the CB.",
  "CB auditor travel, accommodation, and daily allowance (if applicable) are charged on actuals and are separate from both Legal Terminus professional fees and CB audit fees. Remote/desk audits may eliminate this cost for eligible businesses.",
  "The ISO certification scope must accurately describe your business activities. Any change in scope after certification will require a re-audit and may attract additional CB charges.",
  "ISO certificate validity is 3 years from the date of issue, subject to successful annual surveillance audits. Non-compliance with surveillance audit requirements may result in certificate suspension or withdrawal by the CB.",
  "MSME-registered entities may be eligible for subsidy under government MSME ISO scheme (up to ₹75,000) on CB fees. Legal Terminus will provide advisory and filing support for MSME subsidy; actual subsidy disbursement is subject to MSME Ministry approval and scheme availability at the time of application.",
  "18% GST is applicable on all professional/consultancy fees charged by Legal Terminus. CB fees are subject to GST as per the CB's invoicing terms.",
  "Legal Terminus Private Limited is a private consultancy firm and is not affiliated with any ISO accreditation body or certifying body. ISO certificates are issued directly by the relevant CB; accreditation is provided by bodies such as NABCB, UKAS, DAkkS, or other IAF-recognised accreditation bodies.",
  "In case the above plans do not qualify your requirements, kindly contact our executive — we will be happy to customise a plan for you.",
];

const TermsConditions = () => {
  return (
    <section className="isotc-section">
      <div className="isotc-container">
        <div className="isotc-card">
          <h2 className="isotc-title">TERMS &amp; CONDITIONS</h2>
          <p className="isotc-subtitle">
            By subscribing to any of the above plans, you agree to the following terms and conditions. Please read them carefully before proceeding.
          </p>
          <ol className="isotc-list">
            {items.map((item, i) => (
              <li key={i} className="isotc-item">{item}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default TermsConditions;
