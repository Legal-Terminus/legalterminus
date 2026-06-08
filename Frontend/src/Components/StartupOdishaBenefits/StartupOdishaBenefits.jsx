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
            The Odisha Startup Policy 2022 provides one of India's most comprehensive state-level support packages for startups — combining direct financial assistance with infrastructure, mentorship, and market access.
          </p>
        </header>

        <div className="req-grid">
          <article className="req-card">
            <h3 className="req-card-title">Capital Subsidy up to ₹50 Lakhs</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Eligible startups registered under Startup Odisha can receive a direct capital subsidy of up to ₹50 lakhs on capital investment (plant, machinery, equipment). The subsidy quantum varies by sector, investment amount, and employment generation. Technology and agri-tech startups get higher subsidy rates. This is a direct grant — not a loan, not a tax benefit.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Subsidised Incubation Office Space</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Startup Odisha-recognised startups get priority access to subsidised office space at STPI Bhubaneswar, IIT Bhubaneswar's Technology Business Incubator (TBI), and KIIT-TBI. Rents are 50-80% below market rates. These centres also provide high-speed internet, meeting rooms, prototyping labs, and co-working infrastructure — critical for early-stage startups minimising fixed costs.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Mentorship &amp; Expert Network</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Startup Odisha maintains a network of 100+ mentors — experienced entrepreneurs, industry veterans, and domain experts. Recognised startups get structured access to 1:1 mentoring sessions, pitch preparation support, and introductions to the state's investor network. Monthly Startup Odisha events also provide peer networking and investor connect opportunities.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Priority Government Procurement</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Startup Odisha-recognised startups are exempt from prior experience and prior turnover criteria in Odisha government procurement. They can directly access tenders from state PSUs (NTPC, NALCO, SAIL, OPGC), Odisha government departments, and district-level procurement. The state reserves a minimum percentage of procurement for DPIIT/Startup Odisha-recognised entities.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Regulatory Fast-Track &amp; Single Window</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Startup Odisha-recognised startups go through Odisha's Industry 4.0 Single Window Clearance System for all business licenses and approvals. This reduces the time to obtain factory license, fire NOC, pollution clearance, and trade license from months to weeks. Dedicated Startup Odisha relationship managers assist with state-level regulatory navigation.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Patent &amp; IP Support</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Startups recognised under Startup Odisha who also have DPIIT recognition qualify for the 80% patent fee rebate at the national level. Additionally, Startup Odisha provides state-funded IP awareness workshops and connects startups with the National Law Institute (NLU Odisha) for pro-bono IP legal support. Odisha also reimburses a portion of patent filing costs under the state innovation fund.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default StartupOdishaBenefits;
