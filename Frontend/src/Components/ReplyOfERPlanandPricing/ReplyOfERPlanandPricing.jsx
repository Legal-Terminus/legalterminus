import React from "react";
import "./ReplyOfERPlanandPricing.css";

const PricingSection = () => {
  return (
    <section className="Replyof-ER-pvtltd-Replyof-ER-pricing-section">
      <div className="Replyof-ER-pricing-container">
        
        {/* Upper part */}
        <header className="Replyof-ER-pricing-header">
          <h2 className="Replyof-ER-pvtltd-Replyof-ER-pricing-title">Choose Your Plan</h2>
          <p className="Replyof-ER-pricing-subtitle">
            Reply of examination report with pocket-friendly prices
          </p>
        </header>

        {/* Cards */}
        <div className="Replyof-ER-pricing-cards">

          {/* Elemental */}
          <article className="Replyof-ER-plan--card">
            <div>
              <div className="Replyof-ER-plan--header">
                <div className="Replyof-ER-plan--name">Elemental</div>
                {/* <div className="Replyof-ER-plan--old-price">₹5,999</div> */}
                <div className="Replyof-ER-plan--price">₹2,999</div>
                <div className="Replyof-ER-plan--meta">Excluding gov fee</div>
              </div>

              <div className="Replyof-ER-plan--body">
                <ul className="Replyof-ER-plan--list">
                  <li className="Replyof-ER-plan--list-item">Drafting of Reply by Expert Professional for 1 Objection only</li>
                  <li className="Replyof-ER-plan--list-item">Filing of Reply</li>
                </ul>
              </div>
            </div>

            <div className="Replyof-ER-plan--footer">
              <button className="Replyof-ER-plan--button">Buy Now</button>
            </div>
          </article>

          {/* Enriched */}
          <article className="Replyof-ER-plan--card">
            <div>
              <div className="Replyof-ER-plan--header">
                <div className="Replyof-ER-plan--name">Enriched</div>
                {/* <div className="Replyof-ER-plan--old-price">₹7,999</div> */}
                <div className="Replyof-ER-plan--price">₹3,899</div>
                <div className="Replyof-ER-plan--meta">
                  Excluding gov fee <span className="popular">(Popular)</span>
                </div>
              </div>

              <div className="Replyof-ER-plan--body">
                <ul className="Replyof-ER-plan--list">
                  <li className="Replyof-ER-plan--list-item">Drafting of Reply by Expert Professional for 2 Objections only</li>
                  <li className="Replyof-ER-plan--list-item">Filing of Reply</li>
                </ul>
              </div>
            </div>

            <div className="Replyof-ER-plan--footer">
              <button className="Replyof-ER-plan--button">Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="Replyof-ER-plan--card">
            <div>
              <div className="Replyof-ER-plan--header">
                <div className="Replyof-ER-plan--name">Supreme</div>
                {/* <div className="Replyof-ER-plan--old-price">₹29,999</div> */}
                <div className="Replyof-ER-plan--price">₹4,999</div>
                <div className="Replyof-ER-plan--meta">Excluding gov fee</div>
              </div>

              <div className="Replyof-ER-plan--body">
                <ul className="Replyof-ER-plan--list">
                  <li className="Replyof-ER-plan--list-item">Drafting of Reply by Expert Professional for more than 2 Objections</li>
                  <li className="Replyof-ER-plan--list-item">Filing of Reply</li>
                </ul>
              </div>
            </div>

            <div className="Replyof-ER-plan--footer">
              <button className="Replyof-ER-plan--button">Buy Now</button>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
};

export default PricingSection;
