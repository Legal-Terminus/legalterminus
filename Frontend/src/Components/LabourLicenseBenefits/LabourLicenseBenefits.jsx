import React from "react";
import "./LabourLicenseBenefits.css";

const LabourLicenseBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Labour Licence (CLRA) Registration in India
          </h2>
          <p className="opcben-subtitle">
            A valid CLRA registration is not just a legal requirement — it shields the principal employer from liability, unlocks large contracts, and proves you run a compliant, audit-ready workforce.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Legal Compliance &amp; Penalty-Free Operations</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A valid RC and contractor licence ensures contract labour is engaged lawfully under the CLRA Act 1970, eliminating exposure to prosecution under Sections 23 &amp; 24 — imprisonment up to 3 months, fines, and continuing daily penalties — and protecting you during labour-department inspections.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Eligibility for PSU &amp; Government Tenders</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Most PSU, government, railway, and large-corporate tenders mandate a valid CLRA registration or contractor licence as a pre-qualification condition. Without it, your bid is rejected at the compliance stage. CLRA proof is the gateway to high-value institutional contracts.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Protection from Contractor Liabilities</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              When the contractor is licensed, wage, PF, and ESI obligations rest with the contractor. Engaging labour through an unlicensed contractor shifts those liabilities onto the principal employer. Proper registration ring-fences your business from the contractor's statutory dues.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Worker Welfare &amp; Statutory Amenities</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              The licensing framework ensures contract workmen receive mandated welfare amenities — canteen, restrooms, drinking water, first-aid, and timely wages. Compliance demonstrates responsible employment, reduces disputes, and improves workforce stability on site.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Smooth EPF / ESI Integration</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              CLRA compliance dovetails with EPF and ESI obligations for contract workmen. A registered engagement makes it straightforward to map contributions, maintain muster rolls and wage registers, and pass joint inspections without back-liability surprises.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Credibility with Principal Employers</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              For contractors, a valid labour licence is the single most important document in any vendor-onboarding or manpower-supply agreement. Large principal employers screen for it before awarding work — a licence signals you are an organised, compliant, and bankable contractor.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default LabourLicenseBenefits;
