import React, { useState } from "react";
import "./ProFPLCPlanandPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";


const PLANS = [
  { id: "elemental", name: "Elemental", price: 3999, services: ["Search Report of Name Availability", "1 RUN Name Approval Certificate", "Director Identification Number for 2 Individuals", "Certificate of Incorporation", "E-PAN", "E-TAN", "E-MOA", "E-AOA", "Documents for Bank Account Opening", "Documents for 1st Auditor Appointment", "EPF Registrations", "ESI Registrations"] },
  { id: "enriched", name: "Enriched", price: 5999, services: ["Elemental Plan Plus", "Share Certificate", "Commencement of Business", "Udyam/MSME Registration"] },
  { id: "supreme", name: "Supreme", price: 24999, services: ["Enriched Plan Plus", "Income tax filing of Company", "Preparation of Directors Report", "Preparation of Annual Return", "Preparation of Auditor Appointment Paperwork", "Preparation of List of Share Holders", "Preparation of Notice of AGM", "Preparation of Notice of BM", "Preparation of Extracts of AGM", "Filing of AOC - 4", "Filing of MGT - 7", "Filing of ADT - 1", "Minutes of Board Meeting", "Minutes of General Meeting", "Maintenance of Statutory E- Registers", "DIR KYC (2 Directors)", "Income Tax Filing of 2 Directors"] }
];

const PricingSection = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (

    <>
    <section className="profplc-pricing-section">
      <div className="profplc-pricing-container">

        {/* Upper part */}
        <header className="profplc-pricing-header">
          <h2 className="profplc-pricing-title">CHOOSE YOUR PLAN</h2>
          <p className="profplc-pricing-subtitle">
            Register your company with pocket-friendly prices
          </p>
        </header>

        {/* Cards */}
        <div className="profplc-pricing-cards">

          {/* Elemental */}
          <article className="profplc-plan-card">
            <div>
              <div className="profplc-plan-header">
                <div className="profplc-plan-name">Elemental</div>
                <div className="profplc-plan-old-price">₹5,999</div>
                <div className="profplc-plan-price">{PLANS[0].price.toLocaleString("en-IN")}</div>
                <div className="profplc-plan-meta">Excluding gov fee</div>
              </div>

              <div className="profplc-plan-body">
                <ul className="profplc-plan-list">
                  <li className="profplc-plan-list-item">Search Report of Name Availability</li>
                  <li className="profplc-plan-list-item">1 RUN Name Approval Certificate</li>
                  <li className="profplc-plan-list-item">Director Identification Number for 2 Individuals</li>
                  <li className="profplc-plan-list-item">Certificate of Incorporation</li>
                  <li className="profplc-plan-list-item">E-PAN</li>
                  <li className="profplc-plan-list-item">E-TAN</li>
                  <li className="profplc-plan-list-item">E-MOA</li>
                  <li className="profplc-plan-list-item">E-AOA</li>
                  <li className="profplc-plan-list-item">Documents for Bank Account Opening</li>
                  <li className="profplc-plan-list-item">Documents for 1st Auditor Appointment</li>
                  <li className="profplc-plan-list-item">EPF Registrations</li>
                  <li className="profplc-plan-list-item">ESI Registrations</li>
                </ul>
              </div>
            </div>

            <div className="profplc-plan-footer">
              <button className="profplc-plan-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
            </div>
          </article>

          {/* Enriched */}
          <article className="profplc-plan-card">
            <div>
              <div className="profplc-plan-header">
                <div className="profplc-plan-name">Enriched</div>
                <div className="profplc-plan-old-price">₹7,999</div>
                <div className="profplc-plan-price">{PLANS[1].price.toLocaleString("en-IN")}</div>
                <div className="profplc-plan-meta">
                  Excluding gov fee <span className="profplc-popular">(Popular)</span>
                </div>
              </div>

              <div className="profplc-plan-body">
                <ul className="profplc-plan-list">
                  <li className="profplc-plan-list-item">Elemental Plan Plus</li>
                  <li className="profplc-plan-list-item">Share Certificate</li>
                  <li className="profplc-plan-list-item">Commencement of Business</li>
                  <li className="profplc-plan-list-item">Udyam/MSME Registration</li>
                </ul>
              </div>
            </div>

            <div className="profplc-plan-footer">
              <button className="profplc-plan-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="profplc-plan-card">
            <div>
              <div className="profplc-plan-header">
                <div className="profplc-plan-name">Supreme</div>
                <div className="profplc-plan-old-price">₹29,999</div>
                <div className="profplc-plan-price">{PLANS[2].price.toLocaleString("en-IN")}</div>
                <div className="profplc-plan-meta">Excluding gov fee</div>
              </div>

              <div className="profplc-plan-body">
                <ul className="profplc-plan-list">
                  <li className="profplc-plan-list-item">Enriched Plan Plus</li>
                  <li className="profplc-plan-list-item">Income tax filing of Company</li>
                  <li className="profplc-plan-list-item">Preparation of Directors Report</li>
                  <li className="profplc-plan-list-item">Preparation of Annual Return</li>
                  <li className="profplc-plan-list-item">Preparation of Auditor Appointment Paperwork</li>
                  <li className="profplc-plan-list-item">Preparation of List of Share Holders</li>
                  <li className="profplc-plan-list-item">Preparation of Notice of AGM</li>
                  <li className="profplc-plan-list-item">Preparation of Notice of BM</li>
                  <li className="profplc-plan-list-item">Preparation of Extracts of AGM</li>
                  <li className="profplc-plan-list-item">Filing of AOC - 4</li>
                  <li className="profplc-plan-list-item">Filing of MGT - 7</li>
                  <li className="profplc-plan-list-item">Filing of ADT - 1</li>
                  <li className="profplc-plan-list-item">Minutes of Board Meeting</li>
                  <li className="profplc-plan-list-item">Minutes of General Meeting</li>
                  <li className="profplc-plan-list-item">Maintenance of Statutory E- Registers</li>
                  <li className="profplc-plan-list-item">DIR KYC (2 Directors)</li>
                  <li className="profplc-plan-list-item">Income Tax Filing of 2 Directors</li>
                </ul>
              </div>
            </div>

            <div className="profplc-plan-footer">
              <button className="profplc-plan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
            </div>
          </article>

        </div>
      </div>
    </section>


      {activePlan && (

        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="proprietorship-to-plc" />

      )}

    </>

  );};

export default PricingSection;
