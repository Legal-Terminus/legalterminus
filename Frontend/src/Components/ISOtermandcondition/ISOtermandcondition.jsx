import React from "react";
import "./ISOtermandcondition.css";

const items = [
  "Professional Fee Only: All quoted prices are exclusive of Certification Body (CB) fees, CB surveillance audit fees, CB auditor travel, and other out-of-pocket costs. Our fee covers consulting services — gap analysis, documentation development, implementation training, internal audit facilitation, and CB coordination.",
  "Not a Government Registration: ISO Certification is issued by accredited third-party Certification Bodies (NABCB / UKAS / ANAB / DAkkS) — NOT by any government. There is no government fee at any stage. The 'official' ISO certificate is whatever the chosen CB issues.",
  "GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout. ISO consulting GST is fully eligible for input tax credit for GST-registered clients.",
  "CB Fees Billed at Actuals: Certification Body fees vary widely — Rs.15,000 to Rs.90,000+ depending on standard, employee count, scope, sites covered, accreditation tier, and the CB's own pricing. We recommend 2–3 CBs and you choose. CB invoice is paid directly to the CB, not through us.",
  "Employee Count Cap (per tier): Elemental fits establishments up to 25 employees. Enriched fits up to 50 employees. Supreme fits up to 100 employees. Beyond 100 employees or multi-site operations, scope is quoted separately based on a custom assessment.",
  "Standards Covered: Elemental covers ANY ONE of ISO 9001 / 14001 / 45001. Enriched covers any TWO of these (typically 9001 + 14001 or 9001 + 45001). Supreme covers all THREE (full QHSE) OR sector-specific bundles (9001 + 22000 for food; 9001 + 27001 for IT). Additional standards beyond plan limits are billed at 60% of the per-standard professional fee.",
  "MSME Subsidy Reimbursement: MSME-registered businesses can claim up to 75% reimbursement of certification costs (capped at Rs.75,000) via the MSME Office's ZED / IPR / Quality Upgradation schemes — subject to scheme rules. We assist with the application but reimbursement timing is at the discretion of the MSME Office (typically 60–180 days post-certification).",
  "Refund Policy: Full refund of professional fee (less Rs.4,999 documentation handling) is available if gap analysis is not completed within 7 working days from receipt of complete documents. Beyond gap analysis, partial refund applies pro-rata based on completed milestones. CB fees already paid are non-refundable as they go to the CB directly.",
  "Certificate Validity & Surveillance: ISO Certificates are valid for 3 years. Annual Surveillance Audits (by the CB) are MANDATORY in Year 1 and Year 2 to maintain validity. Re-certification audit at end of Year 3. We provide surveillance prep within the plan-period (Year 1 only for Enriched, Year 1 + 2 for Supreme); thereafter quoted separately.",
  "Out-of-Scope Items: Onsite implementation beyond included sessions, additional sites / branches beyond 1, factory-floor process redesign, third-party software (QMS software / document control tools), pre-existing nonconformity remediation, CB audit hearings on adverse findings, and re-certification audit prep beyond Year 3 are not included and quoted separately.",
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
