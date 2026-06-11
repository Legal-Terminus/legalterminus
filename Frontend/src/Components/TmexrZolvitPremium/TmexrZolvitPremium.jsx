import React from "react";
import "./TmexrZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const TmexrZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Trademark Examination Reply by Legal Terminus"
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
                  An objection is not a rejection — but a weak, templated reply often becomes one. The reply is your single best chance to save your mark, and it has a hard 30-day clock. Priority is what happens when a trademark attorney builds a citation-backed argument and files it well before the deadline.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Fast turnaround on a tight clock — the report is analysed and a reply drafted with room to spare before the 30-day deadline.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    A tailored legal argument — not a template — addressing the exact Section 9 or Section 11 grounds cited against your mark.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Case-law citations and, where useful, an affidavit of use to prove distinctiveness or coexistence with cited marks.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Hearing preparation and representation if the Examiner calls a show-cause hearing — you're not left to argue it alone.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Status tracking from reply to acceptance, with the filed reply and updates delivered to you at each stage.
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
                  The 30-day deadline is real. If no reply is filed within 30 days of the examination report, the application is treated as abandoned — and you lose the filing fee, the priority date, and the mark. Acting immediately is critical.
                </li>
                <li className="opczp-note-item">
                  Section 9 vs Section 11 need different arguments. Section 9 (descriptive/non-distinctive) is best met with evidence of use and acquired distinctiveness; Section 11 (similar prior mark) calls for distinguishing the marks, goods, or a consent/coexistence argument. A generic reply that ignores this usually fails.
                </li>
                <li className="opczp-note-item">
                  Evidence wins descriptiveness objections. For a Section 9 objection, real proof that customers associate the mark with you — invoices, ads, sales, social presence — can turn a refusal into an acceptance. Gather and preserve this evidence early.
                </li>
                <li className="opczp-note-item">
                  A reply may lead to a hearing. The Examiner can still call a show-cause hearing after your reply. Being prepared with submissions and representation at that hearing is often the deciding factor between acceptance and refusal.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#tmexr-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("tmexr-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Trademark Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TmexrZolvitPremium;
