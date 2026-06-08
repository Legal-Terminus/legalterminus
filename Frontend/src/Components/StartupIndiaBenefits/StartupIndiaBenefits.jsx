import React from "react";
import "../PvtltdRequirementsTab/PvtltdRequirementsTab.css";

const StartupIndiaBenefits = () => {
  return (
    <section className="req-section">
      <div className="req-container">
        <header className="req-header">
          <h2 className="req-title">
            Benefits of Startup India (DPIIT) Recognition
          </h2>
          <p className="req-subtitle">
            DPIIT recognition is the single most impactful government registration an early-stage Indian startup can obtain — it unlocks tax savings, regulatory ease, and funding access in one shot.
          </p>
        </header>

        <div className="req-grid">
          <article className="req-card">
            <h3 className="req-card-title">3-Year Income Tax Holiday (Section 80-IAC)</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              DPIIT-recognised startups can apply to the Inter-Ministerial Board (IMB) for a 3-year income tax exemption under Section 80-IAC — out of your first 10 years of operation. For a startup generating ₹1 crore profit per year, that's ₹66 lakh in tax savings at 22% rate across 3 years. The application is separate from recognition and requires an innovation narrative.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Angel Tax Exemption (Section 56(2)(viib))</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              When Indian angel investors put money in at a valuation above FMV, the "excess" is normally taxed at 30% in the startup's hands — this is angel tax. DPIIT-recognised startups can exempt themselves by filing Form 2 with DPIIT. This is the single most critical benefit for pre-seed and seed stage startups raising from Indian HNI / angel networks.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Patent Filing at 80% Rebate</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              DPIIT-recognised startups pay only 20% of the government patent filing fee at the Indian Patent Office. For a complete patent (application + examination + grant), this can save ₹1–1.5 lakh per patent. Additionally, patents filed by recognised startups go through a fast-track examination queue — typical examination time drops from 36-48 months to 6-18 months.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Self-Certification Under Labour &amp; Environment Laws</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Recognised startups can self-certify compliance under 6 labour laws (including Payment of Bonus Act, Contract Labour Act, PF Act) and 3 environment laws for 3-5 years without inspection. No inspector visits, no show-cause notices, and no compliance filings under these laws for the covered period. Only a startup with DPIIT recognition qualifies for this regulatory holiday.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Government Procurement &amp; Tenders</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              DPIIT-recognised startups get exemption from the "prior experience" and "prior turnover" criteria in government procurement. This means a one-year-old startup can bid for government contracts that would otherwise require 3-5 years of turnover history. The Government e-Marketplace (GeM) also has a dedicated Startup corner for DPIIT-recognised companies.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">SIDBI Fund of Funds &amp; Startup India Seed Fund</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              DPIIT-recognised startups are eligible for investment via SEBI-registered AIFs funded through SIDBI's Fund of Funds Scheme (FFS). The Startup India Seed Fund Scheme (SISFS) provides up to ₹50 lakh in seed funding through incubators empanelled by DPIIT. Both programmes require DPIIT recognition as a prerequisite.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default StartupIndiaBenefits;
