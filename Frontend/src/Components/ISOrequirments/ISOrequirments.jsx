import React from "react";
import "./ISOrequirments.css";

const RequirementsPvt = () => {
  return (
    <section className="req-section">
      <div className="req-container">
        <header className="req-header">
          <h2 className="req-title">
            Benefits of ISO Certification in India
          </h2>
          <p className="req-subtitle">
            ISO Certification is a competitive advantage, not just a compliance badge. It unlocks government tenders, international buyers, and builds a quality-driven culture that reduces operational errors and customer complaints.
          </p>
        </header>

        <div className="req-grid">
          <article className="req-card">
            <h3 className="req-card-title">Government Tender Eligibility</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Most central and state government tenders — especially in construction, IT, defence, healthcare, and manufacturing — mandate ISO certification as a baseline eligibility criterion. Without ISO, your bids are rejected at the technical qualification stage.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">International Recognition &amp; Export Readiness</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              ISO is accepted in 165+ countries. Overseas buyers, importers, and global procurement platforms require ISO-certified suppliers. Having ISO certification accelerates vendor empanelment with international enterprises and qualifies you for export incentive schemes.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Improved Quality &amp; Process Efficiency</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              ISO implementation forces a systematic review of all business processes — identifying bottlenecks, redundancies, and error-prone workflows. Post-certification businesses typically see 20–40% reduction in rework, returns, and customer complaints.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Enhanced Customer Trust &amp; Credibility</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              The ISO mark on your products, proposals, and website signals third-party verified quality. Enterprise procurement teams and individual customers prefer ISO-certified vendors — directly improving win rates on competitive bids and retail shelf placement.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Regulatory Compliance Foundation</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              ISO standards are aligned with BIS, FSSAI, MCA, and labour regulation frameworks. ISO-certified organisations find regulatory audits (factory inspections, FSSAI renewals, pollution control consents) significantly smoother — auditors recognise ISO as evidence of systematic compliance.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Better Loan &amp; Investment Access</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Banks and NBFCs (Lendingkart, FlexiLoans, SIDBI schemes) factor ISO certification into credit underwriting as a quality and governance signal. Investors and PE funds use ISO as a due diligence proxy for operational maturity in mid-market businesses.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default RequirementsPvt;
