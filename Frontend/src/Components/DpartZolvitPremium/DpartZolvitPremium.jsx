import React from "react";
import "./DpartZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const DpartZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Partnership Firm Dissolution by Legal Terminus"
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
                  Dissolving a partnership looks like signing one deed — but a vague settlement clause, a missing public notice, or registrations left open turns into partner disputes and continuing liability years later. Priority is what happens when a lawyer owns the dissolution from settlement of accounts to the last registration surrendered.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    A watertight dissolution deed that pins down the settlement of accounts, mutual releases, and indemnities — so no partner can reopen the matter later.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Settlement of accounts done correctly under Section 48 — third-party debts, partners' loans, capital, and surplus applied in the right order.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Public notice and Registrar of Firms intimation handled, so partners are protected from liability for acts done after dissolution.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    PAN, GST, Udyam, and licence surrender coordinated so the firm leaves no loose registrations generating future notices.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    A clean closure file — executed deed, public notice, Registrar acknowledgement, and final-return record — for every partner's peace of mind.
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
                  The settlement clause is everything. Most partnership disputes after closure come from a vague or missing settlement of accounts. A precise clause covering capital, loans, goodwill, and surplus — with mutual release — is what makes a dissolution truly final.
                </li>
                <li className="opczp-note-item">
                  Public notice protects you. Without a public notice of dissolution, a partner can remain liable to third parties who still believe the firm exists. Publishing notice and informing the Registrar of Firms draws a clear line on liability.
                </li>
                <li className="opczp-note-item">
                  Close every registration. A firm's PAN, GST, Udyam, and trade licences keep generating compliance obligations and notices until they are surrendered. We make sure none are left dangling after the firm is dissolved.
                </li>
                <li className="opczp-note-item">
                  Tax matters on distribution. Distribution of assets on dissolution can have capital-gains implications for the firm and the partners. We flag the tax angle early so the closure is planned, not a surprise at assessment.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#dpart-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("dpart-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Closure Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DpartZolvitPremium;
