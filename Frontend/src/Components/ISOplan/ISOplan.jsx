import React, { useState } from "react";
import "./ISOplan.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";


const PLANS = [
  { id: "elemental", name: "Elemental", price: 9999, services: ["ISO 9001 (UKAC)", "Free Consultation", "Application Preparation & Filing"] },
  { id: "popular", name: "Popular", price: 11999, services: ["ISO 9001 (IAF)", "Free Consultation", "Application Preparation & Filing"] },
  { id: "elemental", name: "Elemental", price: 11999, services: ["ISO 14001", "Free Consultation", "Application Preparation & Filing"] },
  { id: "elemental", name: "Elemental", price: 11999, services: ["ISO 18001/45001", "Free Consultation", "Application Preparation & Filing"] },
  { id: "elemental", name: "Elemental", price: 13999, services: ["ISO 27001", "Free Consultation", "Application Preparation & Filing"] },
  { id: "elemental", name: "Elemental", price: 13999, services: ["ISO 22000", "Free Consultation", "Application Preparation & Filing"] },
  { id: "elemental", name: "Elemental", price: 11999, services: ["ISO 45000", "Free Consultation", "Application Preparation & Filing"] },
  { id: "elemental", name: "Elemental", price: 13999, services: ["ISO HACCP", "Free Consultation", "Application Preparation & Filing"] },
  { id: "elemental", name: "Elemental", price: 13999, services: ["ISO 20000", "Free Consultation", "Application Preparation & Filing"] }
];

const PricingSection = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (

    <>
    <section className="pvtltd-pricing-section">
      <div className="pricing-container">
        
        {/* Upper part */}
        <header className="pricing-header">
          <h2 className="PvtLtd-pricing-title">CHOOSE YOUR PLAN</h2>
          <p className="pricing-subtitle">
            Register your ISO Certification with pocket friendly-prices
          </p>
        </header>

        {/* Cards */}
        <div className="pricing-cards">

          {/* Elemental */}
          <article className="plan-card">
            <div>
              <div className="plan-header">
                <div className="plan-name">Elemental</div>
                <div className="plan-price">{PLANS[0].price.toLocaleString("en-IN")}</div>
                <div className="plan-meta">Excluding gov fee</div>
              </div>

              <div className="plan-body">
                <ul className="plan-list">
                  <li className="plan-list-item">ISO 9001 (UKAC)</li>
                  <li className="plan-list-item">Free Consultation</li>
                  <li className="plan-list-item">Application Preparation & Filing</li>
                </ul>
              </div>
            </div>

            <div className="plan-footer">
              <button className="plan-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
            </div>
          </article>

          {/* Enriched */}
          <article className="plan-card">
            <div>
              <div className="plan-header">
                <div className="plan-name">Popular</div>
                <div className="plan-price">{PLANS[1].price.toLocaleString("en-IN")}</div>
                <div className="plan-meta">
                  Excluding gov fee <span className="popular"></span>
                </div>
              </div>

              <div className="plan-body">
                <ul className="plan-list">
                  <li className="plan-list-item">ISO 9001 (IAF)</li>
                  <li className="plan-list-item">Free Consultation</li>
                  <li className="plan-list-item">Application Preparation & Filing</li>
                </ul>
              </div>
            </div>

            <div className="plan-footer">
              <button className="plan-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="plan-card">
            <div>
              <div className="plan-header">
                <div className="plan-name">Elemental</div>
                <div className="plan-price">{PLANS[2].price.toLocaleString("en-IN")}</div>
                <div className="plan-meta">Excluding gov fee</div>
              </div>

              <div className="plan-body">
                <ul className="plan-list">
                  <li className="plan-list-item">ISO 14001</li>
                  <li className="plan-list-item">Free Consultation</li>
                  <li className="plan-list-item">Application Preparation & Filing</li>
                </ul>
              </div>
            </div>

            <div className="plan-footer">
              <button className="plan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="plan-card">
            <div>
              <div className="plan-header">
                <div className="plan-name">Elemental</div>
                <div className="plan-price">{PLANS[3].price.toLocaleString("en-IN")}</div>
                <div className="plan-meta">Excluding gov fee</div>
              </div>

              <div className="plan-body">
                <ul className="plan-list">
                  <li className="plan-list-item">ISO 18001/45001</li>
                  <li className="plan-list-item">Free Consultation</li>
                  <li className="plan-list-item">Application Preparation & Filing</li>
                </ul>
              </div>
            </div>

            <div className="plan-footer">
              <button className="plan-button" onClick={() => setActivePlan(PLANS[3])}>Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="plan-card">
            <div>
              <div className="plan-header">
                <div className="plan-name">Elemental</div>
                <div className="plan-price">{PLANS[4].price.toLocaleString("en-IN")}</div>
                <div className="plan-meta">Excluding gov fee</div>
              </div>

              <div className="plan-body">
                <ul className="plan-list">
                  <li className="plan-list-item">ISO 27001</li>
                  <li className="plan-list-item">Free Consultation</li>
                  <li className="plan-list-item">Application Preparation & Filing</li>
                </ul>
              </div>
            </div>

            <div className="plan-footer">
              <button className="plan-button" onClick={() => setActivePlan(PLANS[4])}>Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="plan-card">
            <div>
              <div className="plan-header">
                <div className="plan-name">Elemental</div>
                <div className="plan-price">{PLANS[5].price.toLocaleString("en-IN")}</div>
                <div className="plan-meta">Excluding gov fee</div>
              </div>

              <div className="plan-body">
                <ul className="plan-list">
                  <li className="plan-list-item">ISO 22000</li>
                  <li className="plan-list-item">Free Consultation</li>
                  <li className="plan-list-item">Application Preparation & Filing</li>
                </ul>
              </div>
            </div>

            <div className="plan-footer">
              <button className="plan-button" onClick={() => setActivePlan(PLANS[5])}>Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="plan-card">
            <div>
              <div className="plan-header">
                <div className="plan-name">Elemental</div>
                <div className="plan-price">{PLANS[6].price.toLocaleString("en-IN")}</div>
                <div className="plan-meta">Excluding gov fee</div>
              </div>

              <div className="plan-body">
                <ul className="plan-list">
                  <li className="plan-list-item">ISO 45000</li>
                  <li className="plan-list-item">Free Consultation</li>
                  <li className="plan-list-item">Application Preparation & Filing</li>
                </ul>
              </div>
            </div>

            <div className="plan-footer">
              <button className="plan-button" onClick={() => setActivePlan(PLANS[6])}>Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="plan-card">
            <div>
              <div className="plan-header">
                <div className="plan-name">Elemental</div>
                <div className="plan-price">{PLANS[7].price.toLocaleString("en-IN")}</div>
                <div className="plan-meta">Excluding gov fee</div>
              </div>

              <div className="plan-body">
                <ul className="plan-list">
                  <li className="plan-list-item">ISO HACCP</li>
                  <li className="plan-list-item">Free Consultation</li>
                  <li className="plan-list-item">Application Preparation & Filing</li>
                </ul>
              </div>
            </div>

            <div className="plan-footer">
              <button className="plan-button" onClick={() => setActivePlan(PLANS[7])}>Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="plan-card">
            <div>
              <div className="plan-header">
                <div className="plan-name">Elemental</div>
                <div className="plan-price">{PLANS[8].price.toLocaleString("en-IN")}</div>
                <div className="plan-meta">Excluding gov fee</div>
              </div>

              <div className="plan-body">
                <ul className="plan-list">
                  <li className="plan-list-item">ISO 20000</li>
                  <li className="plan-list-item">Free Consultation</li>
                  <li className="plan-list-item">Application Preparation & Filing</li>
                </ul>
              </div>
            </div>

            <div className="plan-footer">
              <button className="plan-button" onClick={() => setActivePlan(PLANS[8])}>Buy Now</button>
            </div>
          </article>

        </div>
      </div>
    </section>


      {activePlan && (

        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="iso-certification" />

      )}

    </>

  );};

export default PricingSection;
