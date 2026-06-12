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
            Labour licensing isn&apos;t just statutory tick-the-box - it&apos;s the foundation of a defensible contract labour engagement. Here&apos;s what matters in the 2026 Labour Code era:
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Lawful Contract Labour Engagement</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              The Labour License is the express statutory authorisation to engage contract workers - without it, the engagement is unlawful and exposes both Principal Employer and Contractor to Chapter XIII penalties under OSH Code 2020 (up to Rs.1 lakh fine + imprisonment up to 6 months). With it, you operate clean.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Threshold Relief Under OSH Code (50 vs 20)</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              The 2026 reform raised the threshold from 20 to 50 workers. Many small / medium businesses earlier requiring license now sit BELOW the threshold and are exempt - a material compliance + cost relief. We audit your worker count carefully (including peak / seasonal / split-shift) to confirm threshold applicability.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">5-Year Validity (vs 1-Year Renewal Treadmill)</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Under OSH Code 2020, Contractor License is valid for 5 YEARS - vs annual renewal under CLRA 1970. One-time filing, five years of operation. The compliance discipline shifts to welfare facilities + annual returns + amendment-only updates.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Single License - All Establishments</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Under OSH Code 2020 Section 47, a Contractor's License is valid for ALL establishments where the contractor places workers. Earlier (CLRA), separate licenses were required per establishment - a massive compliance burden for multi-location contractors. Now: one license, full coverage.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Institutional + Tender Eligibility</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              PSU contracts, government tenders, defence procurement, large corporate vendor onboarding, EPC contracts, FM (facilities management) contracts ALL demand evidence of valid Labour License at bid submission / onboarding. Without it, you cannot bid for or fulfil these contracts.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Defence Against Joint-Liability Exposure</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              The Principal Employer is jointly + severally liable for wage default + welfare gaps of the Contractor. Engaging an UNLICENSED contractor = direct exposure of the PE to penalty + back-wages + welfare claims. Holding both licenses (Contractor + PE) + verified Form V chain = strong defence in any compliance audit / inspection / dispute.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default LabourLicenseBenefits;
