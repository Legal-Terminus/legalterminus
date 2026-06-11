import React from "react";
import "./EsiRetBenefits.css";

const EsiRetBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Timely ESI Return Filing
          </h2>
          <p className="opcben-subtitle">
            Filing ESI returns on time is more than statutory compliance — it shields the employer from interest and prosecution, transfers injury liability to ESIC, and unlocks real health and cash benefits for your workforce.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Avoid Interest, Damages &amp; Prosecution</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Late deposit of ESI dues attracts 12% per annum interest plus damages of 5%–25%, and persistent default can lead to prosecution under Section 85. Depositing by the 15th every month eliminates these escalating statutory costs and legal risk.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Transfer Injury Liability to ESIC</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              For ESI-covered employees, the employer's liability for employment injury and occupational disease shifts to ESIC. Without valid ESI cover, the same injury can leave the employer directly liable for compensation — making timely filing a real risk shield.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Full Medical Care for Workers &amp; Family</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Registered Insured Persons and their dependants get full medical care at ESI dispensaries and hospitals from day one of employment, with no cap on treatment expenditure. Timely filing keeps this valuable benefit live for your entire eligible workforce.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Sickness, Maternity &amp; Disablement Cash</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              ESI provides cash benefits — sickness benefit (~70% of wages), 26 weeks of paid maternity benefit, and disablement and dependant benefits. These are funded by your monthly contributions, so accurate filing directly secures your workers' income protection.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Audit &amp; Tender Readiness</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A clean ESI compliance record is checked in statutory audits, labour inspections, and government/PSU tenders that require proof of ESI compliance. Up-to-date returns keep your establishment qualified and audit-ready throughout the year.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Higher Retention &amp; Employee Trust</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Workers who can actually use their ESI card for family healthcare value the employer more. Reliable ESI compliance reduces grievances, builds trust, and improves retention among the blue-collar and entry-level workforce that ESI covers.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default EsiRetBenefits;
