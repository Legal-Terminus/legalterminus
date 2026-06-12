import React from "react";
import "./CocomZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const CocomZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Change of Object Clause by Legal Terminus"
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
                  Changing your object clause looks like one resolution — but vague new objects, a missed MGT-14 deadline, or starting a new activity before the MOA is amended exposes the company to ultra-vires risk. Priority is what happens when a compliance expert drafts precise objects and owns the change from resolution to updated MOA.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Object clauses drafted precisely around your real new business — broad enough to grow into, specific enough to satisfy the ROC.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Correctly prepared board resolution, EGM notice, and special resolution so the alteration is legally valid and clean.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Form MGT-14 filed within the 30-day deadline, with the updated MOA tracked to ROC approval.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    A check on consequential impacts — name, GST, and sector licences — so the new activity is actually compliant, not just on paper.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    A clean change file — updated MOA, filed resolutions, and an activity-to-MOA map — confirming the company can lawfully do the new business.
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
                  Don't act before you amend. A company can only carry on activities authorised by its object clause. Starting a new line of business before the MOA is altered is "ultra vires" — beyond the company's powers — and can invalidate contracts and invite scrutiny.
                </li>
                <li className="opczp-note-item">
                  It needs a 75% special resolution. Altering the object clause requires a special resolution passed by at least three-fourths of the members at a general meeting and filed in Form MGT-14 within 30 days. We handle the notice, resolution, and filing correctly.
                </li>
                <li className="opczp-note-item">
                  Public-money companies have extra steps. If the company raised funds from the public and has unutilised amounts, Section 13(8) adds a publication requirement and an exit offer to dissenting shareholders. We flag and handle this where it applies.
                </li>
                <li className="opczp-note-item">
                  Watch the knock-on effects. New objects can require a name change (if the name reflects the old business), a GST amendment, and fresh sector licences. We map these so the diversification is fully compliant end-to-end.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#cocom-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("cocom-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Compliance Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CocomZolvitPremium;
