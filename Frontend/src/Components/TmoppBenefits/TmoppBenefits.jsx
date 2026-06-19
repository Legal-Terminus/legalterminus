import React from "react";
import "./TmoppBenefits.css";

const TmoppBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Trademark Opposition in India
          </h2>
          <p className="opcben-subtitle">
            Filing or defending an opposition delivers concrete legal + commercial benefits FOR YOU. Here's what filing the opposition / counter statement actually delivers:
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Blocks Copycat Registration Before It Happens (Scenario A)</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A successful opposition prevents the copycat application from proceeding to registration. Without registration, the copycat cannot enforce Section 28 exclusive rights, cannot file infringement actions against legitimate brands, cannot enrol in Amazon Brand Registry / Customs Recordal, and cannot extract licensing fees. Opposition is the PRE-REGISTRATION KILL SWITCH — cheapest + fastest way to stop a copycat in its tracks.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Your Application Stays Alive (Scenario B)</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Under Rule 44, an applicant who fails to file the Counter Statement within 2 months has their application DEEMED ABANDONED — without a hearing, without recourse. A timely Counter Statement keeps your application LIVE on the Register's books + preserves all the work (mark search, classification, filing fee, examination wait) that has gone into the application. Without the counter, you lose everything.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Preserves Priority Date + Brand Seniority (Scenario B)</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Your application's PRIORITY DATE (the date you originally filed) defines who got there first in any future conflict. Abandonment means losing that priority forever — even if you refile, the new priority date is the new filing date (potentially years later, by which time the opposing party may already have registered). A successful Counter Statement preserves your original priority + the brand seniority that compounds over decades.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Creates Legal Precedent + Evidentiary Record</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              The pleadings + evidence filed in an opposition become part of the case file — usable in future infringement / rectification / opposition matters involving the same mark or related marks. Strong arguments + use evidence filed now create a precedent your future legal team can rely on. The Registrar's reasoning (when favourable) becomes citeable authority.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Statutory Trademark Protection — Registration Path</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              For the applicant (Scenario B) — a successful Counter Statement + favourable outcome moves your application toward REGISTRATION + the full Section 28 (exclusive rights) + Section 29 (infringement remedies: injunction + damages + delivery up) + Section 31 (presumption of validity) protection bundle. Opposition is the final hurdle between application + registration.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Saves Long-Term Litigation Costs</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              An opposition that successfully blocks a problematic registration costs ₹5,999 – ₹19,999. The same dispute fought POST-registration (via rectification under Section 57 + High Court appeals + infringement suits) can cost ₹5-50 LAKHS over multiple years. Opposition is the cheapest + earliest moment to address a TM conflict. Money spent at this stage avoids 100x more spend later.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default TmoppBenefits;
