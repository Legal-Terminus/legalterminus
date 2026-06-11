import React from "react";
import "./GstFilingZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const GstFilingZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="GST Return Filing by Legal Terminus"
                className="opczp-illustration"
              />
            </div>

            <div className="opczp-content">

              <header className="opczp-header">
                <h2 className="opczp-title">
                  Legal Terminus{" "}
                  <span className="opczp-title-highlight">Priority</span>{" "}
                  <span className="opczp-title-icon">⚖</span>
                </h2>
                <p className="opczp-subtitle">
                  GST filing sounds routine — but a missed due date, an ITC mismatch, or a wrong GSTR-3B figure triggers late fees, blocked credit, and notices. Priority is what happens when a dedicated GST accountant owns your returns calendar from invoice to filed ARN, every period.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    A locked filing calendar — GSTR-1, GSTR-3B, QRMP, and annual dates tracked for you, with reminders well before every deadline.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Full ITC reconciliation — GSTR-2B matched against your purchase register so you claim every eligible rupee and reverse what you can't.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Senior-reviewed GSTR-3B tax computation to prevent under/over-payment and the interest that follows.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Vendor-mismatch alerts and follow-up guidance so suppliers upload your invoices before you file.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Filed-return kit: ARN, tax summary, ITC ledger snapshot, and a running compliance log for the financial year.
                  </li>
                </ul>
              </section>

            </div>
          </div>

          <div className="opczp-bottom-full">
            <h3 className="opczp-label">Important Notes</h3>
            <div className="opczp-note-box">
              <ul className="opczp-note-list">
                <li className="opczp-note-item">
                  Due dates are non-negotiable. GSTR-1 (11th), GSTR-3B (20th, or 22nd/24th under QRMP), and the annual GSTR-9 (31st Dec) each carry a daily late fee plus 18% interest on unpaid tax. We file ahead of time so a public holiday or portal outage never costs you.
                </li>
                <li className="opczp-note-item">
                  ITC is only as good as your vendors. Credit not appearing in your GSTR-2B cannot be claimed. We reconcile every period and flag defaulting suppliers so you recover blocked credit before it lapses under the Section 16 time limit.
                </li>
                <li className="opczp-note-item">
                  A GST return cannot be revised once filed. Errors are corrected only in a later period's return. That makes first-time accuracy critical — our returns are reviewed before submission, not after a notice.
                </li>
                <li className="opczp-note-item">
                  Continuous non-filing has consequences. Missing returns can block your e-way bills, suspend your GSTIN, and stop your buyers from claiming credit on your invoices. Staying current protects your whole supply chain.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#gstf-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("gstf-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a GST Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GstFilingZolvitPremium;
