import React, { useState } from "react";
import "./ReplyOfERPlanandPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";


const PLANS = [
  { id: "elemental", name: "Elemental", price: 2999, services: ["Drafting of Reply by Expert Professional for 1 Objection only", "Filing of Reply"] },
  { id: "enriched", name: "Enriched", price: 3899, services: ["Drafting of Reply by Expert Professional for 2 Objections only", "Filing of Reply"] },
  { id: "supreme", name: "Supreme", price: 4999, services: ["Drafting of Reply by Expert Professional for more than 2 Objections", "Filing of Reply"] }
];

const PricingSection = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (

    <>
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
                <div className="Replyof-ER-plan--price">{PLANS[0].price.toLocaleString("en-IN")}</div>
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
              <button className="Replyof-ER-plan--button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
            </div>
          </article>

          {/* Enriched */}
          <article className="Replyof-ER-plan--card">
            <div>
              <div className="Replyof-ER-plan--header">
                <div className="Replyof-ER-plan--name">Enriched</div>
                {/* <div className="Replyof-ER-plan--old-price">₹7,999</div> */}
                <div className="Replyof-ER-plan--price">{PLANS[1].price.toLocaleString("en-IN")}</div>
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
              <button className="Replyof-ER-plan--button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="Replyof-ER-plan--card">
            <div>
              <div className="Replyof-ER-plan--header">
                <div className="Replyof-ER-plan--name">Supreme</div>
                {/* <div className="Replyof-ER-plan--old-price">₹29,999</div> */}
                <div className="Replyof-ER-plan--price">{PLANS[2].price.toLocaleString("en-IN")}</div>
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
              <button className="Replyof-ER-plan--button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
            </div>
          </article>

        </div>
      </div>
    </section>


      {activePlan && (

        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="trademark-examination-reply" />

      )}

    </>

  );};

export default PricingSection;
