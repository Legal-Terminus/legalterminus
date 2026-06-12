import React from "react";
import "./TmhearBenefits.css";

const TmhearBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Professional Hearing Representation
          </h2>
          <p className="opcben-subtitle">
            The hearing is where your application is won or lost. Expert representation ensures your case is fully prepared, properly argued, and never decided against you simply because no one showed up.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Your Case is Actually Heard</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              An attorney appears and argues on your behalf, so your side of the objection or opposition is presented clearly to the Hearing Officer — instead of the matter being decided ex-parte because you were absent or unprepared.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Best Chance of Acceptance</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Well-drafted written submissions and confident oral advocacy give your mark the strongest possible shot at being accepted. Framing the case correctly in advance often shapes the outcome before the hearing even begins.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Avoid Ex-Parte Refusal</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Failing to attend a hearing usually means the application is refused or abandoned without your input. Representation guarantees someone is there to defend your mark, protecting the filing fee and priority you have already invested.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Evidence Presented Properly</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Cases turn on how well evidence of use, reputation, and distinctiveness is organised and presented. We know what the Officer is looking for and put your strongest material front and centre.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Confident Handling of Procedure</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Virtual hearings, scheduling, adjournments, and Registry procedure can be daunting. An experienced attorney manages all of it smoothly, so you can stay focused on your business instead of decoding the process.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Clear Next Steps After the Order</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Whatever the result, we analyse the Hearing Officer's order and advise you on the next move — proceeding to registration, seeking a review, or filing an appeal — so you are never left guessing after the decision.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default TmhearBenefits;
