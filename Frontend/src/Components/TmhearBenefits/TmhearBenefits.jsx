import React from "react";
import "./TmhearBenefits.css";

const TmhearBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Trademark Hearing in India
          </h2>
          <p className="opcben-subtitle">
            Attending the hearing PROPERLY delivers concrete legal + commercial benefits. Here's what showing up — PREPARED — actually delivers for you as the trademark applicant / proprietor:
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Your Matter Stays Alive — Avoids Abandonment</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Non-appearance at any scheduled hearing causes the matter to be marked abandoned — whether it's a Show Cause Hearing (application refused), Opposition Hearing (default order), or Rectification Hearing (petition dismissed). Attending the hearing keeps the matter active + ensures the Hearing Officer hears your case on its merits + issues a reasoned order rather than a default order against you.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Oral Advocacy Often Decides the Order</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              The Hearing Officer has the pleadings + evidence in front of them — what they don't have is your real-time answers to their specific concerns. Strong oral advocacy at the hearing addresses the Hearing Officer's mind, cites precedent decisions that bear on the issue, and often moves the order in your favour — even where the written record is mixed. Many cases are won at the hearing that looked uncertain on paper.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Path to Acceptance / Registration / Favourable Order</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A successful hearing on Show Cause leads to application acceptance + Journal publication + (if unopposed) registration certificate. A successful Opposition Hearing leads to either your opposition allowed (copycat refused) or your application allowed (opposition dismissed). The hearing is the bridge between contested status + the favourable Registrar's order.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Builds the Record for Any Future Appeal</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Even if the Registrar's order goes against you — a properly conducted hearing with arguments on record + written submissions + paper-book creates a strong appellate record for any Section 91 appeal to the High Court (post-IPAB-abolition under Tribunals Reforms Act 2021). Hearings poorly handled make appeals nearly impossible. Hearings well handled give your appellate counsel a complete record to work with.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Statutory Protection Path Continues</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              For applicants — a successful hearing moves your matter toward the full Section 28 (exclusive rights) + Section 29 (infringement remedies) + Section 31 (presumption of validity) protection bundle. For opposers — a successful hearing blocks the copycat from accessing those rights against your brand. Either way, the hearing is what keeps the protection path open.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Saves Long-Term Litigation Costs</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A hearing well handled at the Registry costs ₹3,499 – ₹12,999. The same dispute escalated to High Court appeals (Section 91) + civil suits + injunction proceedings can cost ₹10-50 LAKHS over multiple years. Hearing-stage advocacy is the cheapest + earliest moment to resolve a TM contest. Money spent here avoids 100x more spend later.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default TmhearBenefits;
