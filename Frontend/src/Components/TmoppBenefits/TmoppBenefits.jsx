import React from "react";
import "./TmoppBenefits.css";

const TmoppBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Professional Opposition Handling
          </h2>
          <p className="opcben-subtitle">
            Whether you are blocking a copycat or defending your own mark, expert opposition handling protects your brand rights, meets every deadline, and builds the evidence record that decides the case.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Block Conflicting Marks</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Filing a timely, well-grounded opposition stops a confusingly similar mark from being registered against you — protecting your brand from dilution and from a competitor gaining rights over something close to your identity.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Save Your Own Application</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              If you are opposed, filing the counter-statement within 2 months keeps your application alive. Professional defence ensures the deadline is met and your right to the mark is properly asserted, not lost by default.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Every Deadline Met</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Opposition runs on strict, unforgiving timelines — counter-statement, three evidence stages, and the hearing. A managed process ensures no stage is missed, because a single lapsed deadline can decide the entire matter against you.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Strong, Structured Evidence</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Cases are won on evidence of prior use, reputation, and likelihood of confusion, filed by affidavit. Knowing what evidence matters and presenting it correctly is the difference between a persuasive case and a weak one.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Expert Hearing Representation</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Most contested oppositions are decided at a hearing before the Registrar. Having a trademark attorney prepare submissions and argue your case is often the deciding factor between winning and losing the dispute.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Cheaper Than the Alternative</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Resolving a conflict at the opposition stage is far cheaper than infringement litigation or a forced rebrand later. Acting now, within the journal window, is the most cost-effective way to protect your brand.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default TmoppBenefits;
