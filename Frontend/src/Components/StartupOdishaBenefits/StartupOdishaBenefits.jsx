import React from "react";
import "../PvtltdRequirementsTab/PvtltdRequirementsTab.css";

const StartupOdishaBenefits = () => {
  return (
    <section className="req-section">
      <div className="req-container">
        <header className="req-header">
          <h2 className="req-title">
            Benefits of Startup Odisha Registration
          </h2>
          <p className="req-subtitle">
            The benefits below describe what the Startup Odisha RECOGNITION itself unlocks. The downstream benefits (grants, subsidies, reimbursements) are POLICY entitlements that recognised startups can apply for SEPARATELY - we do not handle those applications under this service.
          </p>
        </header>

        <div className="req-grid">
          <article className="req-card">
            <h3 className="req-card-title">Recognized Status in Odisha Ecosystem</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Your startup appears on the official startupodisha.gov.in directory, visible to state-level investors, ecosystem partners, accelerators, and the Startup Odisha Conclave organisers. State-level credibility that purely-private startups don't have.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Eligibility to Apply for State Benefits</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Recognition is the GATEWAY - it makes you eligible to APPLY for the Odisha Startup Policy benefits: need-based grants up to Rs.10L, marketing assistance up to Rs.5L, patent reimbursement, GST reimbursement, power tariff subsidy, stamp duty exemption. Note: we do NOT handle these benefit applications under this service.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">State Tender Preference Eligibility</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Recognised startups are eligible to claim relaxations on state government tenders - exemption from EMD, relaxed turnover / prior-experience requirements, and reservation in select procurement categories. Application to claim these preferences is done at the tender level by the startup.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Startup Odisha Conclave &amp; Events</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Recognition gives you access to participate in the annual Startup Odisha Conclave, sectoral demo days, mentor connect programmes, and state-sponsored cohorts. Networking + visibility within the Odisha ecosystem - free participation for recognised startups.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Incubation Centre Pathway</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Recognised startups can apply for residency at state-supported incubation centres (KIIT-TBI, IIT Bhubaneswar Incubator, OUTR, NIT-RKL etc.) - subject to centre-specific admission processes. Recognition is one of the credibility signals these centres look for.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Central DPIIT Compatibility</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Startup Odisha and central DPIIT Startup India recognitions are independent and complementary. Holding both increases your credibility footprint - state-level for Odisha-specific benefits + ecosystem, central-level for Section 80-IAC tax holiday, Section 56(2)(viib) angel tax exemption, and IP rebates.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default StartupOdishaBenefits;
