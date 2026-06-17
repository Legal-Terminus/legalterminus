import React from "react";
import "./PtpubZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ZolvitPremium = () => {
  return (
    <section className="zp-section">
      <div className="zp-container">
        <div className="zp-card">

          {/* Top two-column row: illustration + content */}
          <div className="zp-top-row">

            {/* Left illustration */}
            <div className="zp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Private Limited to Public Limited Conversion by Legal Terminus"
                className="zp-illustration"
              />
            </div>

            {/* Right content */}
            <div className="zp-content">

              <header className="zp-header">
                <h2 className="zp-title">
                  Legal Terminus{" "}
                  <span className="zp-title-highlight">Priority</span>{" "}
                  <span className="zp-title-icon">⚖</span>
                </h2>
                <p className="zp-subtitle">
                  Converting a Private Limited into a Public Limited is more than a name change — it's a special resolution, a full MOA/AOA rewrite to strip out the private restrictions, the 7-member / 3-director threshold, and MGT-14 + INC-27 filed in sequence. Priority is what happens when a senior expert owns the conversion file, front to back, with zero handoffs.
                </p>
              </header>

              <section className="zp-section-block">
                <h3 className="zp-label">What you get</h3>
                <ul className="zp-list zp-features-list">
                  <li className="zp-list-item">
                    <span className="zp-list-icon">⚡</span>
                    72-hour SLA on the first MOA/AOA alteration draft — with the special resolution and explanatory statement ready for your EGM.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">✅</span>
                    A senior expert reviews your cap table and confirms you meet the 7-member / 3-director minimum before filing.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">🔄</span>
                    Real-time ROC status updates on mail and WhatsApp — MGT-14 and INC-27 tracked to approval.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📑</span>
                    Post-conversion kit: fresh COI, altered MOA &amp; AOA, updated registers, and a compliance calendar.
                  </li>
                </ul>
              </section>

            </div>
          </div>

          {/* Full-width bottom: Important Notes + CTA */}
          <div className="zp-bottom-full">
            <h3 className="zp-label">Important Notes</h3>
            <div className="zp-note-box">
              <ul className="zp-note-list">
                <li className="zp-note-item">
                  You must reach the minimums first. A Public Limited Company needs at least 7 members and 3 directors. If your Private Limited has fewer, the conversion can only complete once new members / directors are inducted — we structure this cleanly.
                </li>
                <li className="zp-note-item">
                  The articles must be rewritten. The three defining private restrictions — capped membership, restricted share transfer, and the bar on inviting the public — are removed from the AOA by special resolution. The MOA name clause is altered to drop "Private".
                </li>
                <li className="zp-note-item">
                  Filing order and timing matter. MGT-14 (special resolution) must be filed within 30 days, followed by INC-27. A mismatch or delay between the two is the most common cause of ROC queries — we sequence them correctly.
                </li>
                <li className="zp-note-item">
                  Compliance steps up after conversion. A Public Limited has more board meetings, audit-committee thresholds, and event-based filings. We hand over a calendar so the heavier governance is planned, not a surprise.
                </li>
              </ul>
            </div>

            <div className="zp-cta-row">
              <a
                href="#ptpub-consult-form"
                className="zp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("ptpub-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Legal Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ZolvitPremium;
