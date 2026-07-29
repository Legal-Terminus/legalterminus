import React, { useState } from "react";
import "./AddPlanandPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";


const PLANS = [
  { id: "elemental", name: "Elemental", price: 1499, services: ["Filing of DIR 12 (Addition/ Cessation)", "Preparation of Board Resolution"] },
  { id: "enriched", name: "Enriched", price: 3499, services: ["Filing of DIR 12 (Addition/ Cessation)", "DSC of 1 Proposed Director", "DIN of 1 Proposed Director", "Preparation of Board Resolution"] },
  { id: "supreme", name: "Supreme", price: 4999, services: ["Filing of DIR 12 (Addition)", "DSC of 1 Proposed Director", "DIN of 1 Proposed Director", "Filing of DIR 12 (Cessation)", "Preparation of Board Resolution"] }
];

const AddPlanandPricing = () => {
  const [activePlan, setActivePlan] = useState(null);
  // #133: payment (Buy Now → CheckoutModal) is paused; the shared "Book Free
  // Consultation" button below opens the consultation popup instead.
  const [showConsult, setShowConsult] = useState(false);

  return (

    <>
    <section className="Add-pp-Add-pp-section">
      <div className="Add-pp-container">
        
        {/* Upper part */}
        <header className="Add-pp-header">
          <h2 className="Add-pp-Add-pp-title">CHOOSE YOUR PLAN</h2>
          <p className="Add-pp-subtitle">
            Add or remove a director (company) with pocket friendly-prices
          </p>
        </header>

        {/* Cards */}
        <div className="Add-pp-cards">

          {/* Elemental */}
          <article className="Add-pp-card">
            <div>
              <div className="Add-pp-header">
                <div className="Add-pp-name">Elemental</div>
                <div className="Add-pp-price">{PLANS[0].price.toLocaleString("en-IN")}</div>
                <div className="Add-pp-meta">Including gov fee</div>
              </div>

              <div className="Add-pp-body">
                <ul className="Add-pp-list">
                  <li className="Add-pp-list-item">Filing of DIR 12 (Addition/ Cessation)</li>
                  <li className="Add-pp-list-item">Preparation of Board Resolution</li>
                </ul>
              </div>
            </div>

            {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                place (not deleted) so it can be re-enabled later. */}
            {false && (
            <div className="Add-pp-footer">
              <button className="Add-pp-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
            </div>
            )}
          </article>

          {/* Enriched */}
          <article className="Add-pp-card">
            <div>
              <div className="Add-pp-header">
                <div className="Add-pp-name">Enriched</div>
                <div className="Add-pp-price">{PLANS[1].price.toLocaleString("en-IN")}</div>
                <div className="Add-pp-meta">
                  Including gov fee <span className="popular">(Popular)</span>
                </div>
              </div>

              <div className="Add-pp-body">
                <ul className="Add-pp-list">
                  <li className="Add-pp-list-item">Filing of DIR 12 (Addition/ Cessation)</li>
                  <li className="Add-pp-list-item">DSC of 1 Proposed Director</li>
                  <li className="Add-pp-list-item">DIN of 1 Proposed Director</li>
                  <li className="Add-pp-list-item">Preparation of Board Resolution</li>
                </ul>
              </div>
            </div>

            {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                place (not deleted) so it can be re-enabled later. */}
            {false && (
            <div className="Add-pp-footer">
              <button className="Add-pp-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
            </div>
            )}
          </article>

          {/* Supreme */}
          <article className="Add-pp-card">
            <div>
              <div className="Add-pp-header">
                <div className="Add-pp-name">Supreme</div>
                <div className="Add-pp-price">{PLANS[2].price.toLocaleString("en-IN")}</div>
                <div className="Add-pp-meta">Including gov fee</div>
              </div>

              <div className="Add-pp-body">
                <ul className="Add-pp-list">
                  <li className="Add-pp-list-item">Filing of DIR 12 (Addition)</li>
                  <li className="Add-pp-list-item">DSC of 1 Proposed Director</li>
                  <li className="Add-pp-list-item">DIN of 1 Proposed Director</li>
                  <li className="Add-pp-list-item">Filing of DIR 12 (Cessation)</li>
                  <li className="Add-pp-list-item">Preparation of Board Resolution</li>
                </ul>
              </div>
            </div>

            {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                place (not deleted) so it can be re-enabled later. */}
            {false && (
            <div className="Add-pp-footer">
              <button className="Add-pp-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
            </div>
            )}
          </article>

        </div>

        {/* #133: one shared CTA below the plans — opens the consultation popup. */}
        <div className="consult-cta-row">
          <button
            type="button"
            className="consult-cta-button"
            onClick={() => setShowConsult(true)}
          >
            📅 Book Free Consultation
          </button>
        </div>
      </div>
    </section>


      {activePlan && (

        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="add-director" />

      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="add-director"
      />

    </>

  );};

export default AddPlanandPricing;
