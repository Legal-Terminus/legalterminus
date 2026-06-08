import React from "react";
import "../PvtltdRequirementsTab/PvtltdRequirementsTab.css";

const StartupIndiaBenefits = () => {
  return (
    <section className="req-section">
      <div className="req-container">
        <header className="req-header">
          <h2 className="req-title">
            Benefits of Startup India Registration
          </h2>
          <p className="req-subtitle">
            DPIIT recognition is the single most impactful government registration an early-stage Indian startup can obtain — it unlocks tax savings, regulatory ease, and funding access in one shot.
          </p>
        </header>

        <div className="req-grid">
          <article className="req-card">
            <h3 className="req-card-title">Section 80-IAC - 3-Year Tax Holiday</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              100% deduction on profits for 3 consecutive years out of your first 10. For a startup that hits profitability in Year 4 and earns Rs.5 cr profit / year for the next 3 years - that's Rs.4 cr+ saved in income tax. The single largest benefit DPIIT unlocks. Requires separate IMB approval.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Section 56(2)(viib) - Angel Tax: ABOLISHED</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Angel Tax (Section 56(2)(viib)) has been ABOLISHED with effect from 1 April 2025 via the Finance Act, 2024. The provision that taxed share premium above fair market value at 30% in a startup's hands no longer exists for FY 2025-26 onwards - for all investors, domestic and foreign. No Form 2 declaration or DPIIT exemption certificate is required for new fundraises. Startups with open angel tax notices for AY 2024-25 or earlier must still address those under the old law. For all new fundraising rounds, this tax overhang is completely gone.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Patent + Trademark Fee Rebates</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Patent filing: 80% rebate on government fee (from Rs.8,000 to Rs.1,600 for individual filing). Trademark filing: 50% rebate (from Rs.9,000 to Rs.4,500 per class - same as MSME rate). Plus fast-track patent examination. For IP-heavy startups, this is real savings + faster grant.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">SIDBI Fund-of-Funds (FFS) Access</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              DPIIT-recognised startups have indirect access to the Rs.10,000 crore SIDBI Fund-of-Funds for Startups (FFS). FFS doesn't invest directly - it invests in SEBI-registered VC / AIF funds that then invest in DPIIT-recognised startups. Practical effect: investor matchmaking + signal-boosting.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Self-Certification Under Labour + Environment Laws</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              DPIIT-recognised startups can self-certify compliance under 9 labour laws + 3 environment laws for the first 5 years. No inspector visits (unless credible complaint). Reduces compliance friction massively for early-stage startups with limited HR / compliance bandwidth.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Faster Public Procurement (GeM) + Faster Exit</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              On the GeM marketplace, DPIIT startups are exempt from prior-experience and turnover requirements - so you can bid on government tenders from day one. Plus, winding-up time is reduced to 90 days for failed DPIIT startups via fast-track insolvency under Section 55 of IBC 2016.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default StartupIndiaBenefits;
