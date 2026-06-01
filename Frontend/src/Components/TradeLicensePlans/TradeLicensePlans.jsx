import React, { useState } from "react";
import "./TradeLicensePlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";


const PLANS = [
  { id: "elemental", name: "Elemental", price: 2999, services: [] },
  { id: "enriched", name: "Enriched", price: 5999, services: [] },
  { id: "supreme", name: "Supreme", price: 24999, services: [] }
];

const TradeLicensePlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (

    <>
    <section className="trade-pricing-section">
      <div className="tradepricing-container">
        {/* Header Section */}
        <header className="tradepricing-header">
          <h2 className="tradepricing-title">CHOOSE YOUR PLAN</h2>
          <p className="tradepricing-subtitle">
            Register your company with pocket-friendly prices
          </p>
        </header>

        {/* Pricing Cards */}
        <div className="tradepricing-cards">

          {/* ===== Elemental Plan ===== */}
          <article className="tradeplan-card">
            <div>
              <div className="tradeplan-header">
                <div className="tradeplan-name">Elemental</div>
                <div className="tradeplan-price">{PLANS[0].price.toLocaleString("en-IN")}</div>
                <div className="tradeplan-meta">Excluding gov fee</div>
              </div>

              <div className="tradeplan-body">
                <ul className="tradeplan-list">
                  <li className="tradeplan-list-item">Search Report of Name Availability</li>
                  <li className="tradeplan-list-item">1 RUN Name Approval Certificate</li>
                  <li className="tradeplan-list-item">Director Identification Number for 2 Individuals</li>
                  <li className="tradeplan-list-item">Certificate of Incorporation</li>
                  <li className="tradeplan-list-item">E-PAN</li>
                  <li className="tradeplan-list-item">E-TAN</li>
                  <li className="tradeplan-list-item">E-MOA</li>
                  <li className="tradeplan-list-item">E-AOA</li>
                  <li className="tradeplan-list-item">Documents for Bank Account Opening</li>
                  <li className="tradeplan-list-item">Documents for 1st Auditor Appointment</li>
                  <li className="tradeplan-list-item">EPF Registrations</li>
                  <li className="tradeplan-list-item">ESI Registrations</li>
                </ul>
              </div>
            </div>

            <div className="tradeplan-footer">
              <button className="tradeplan-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
            </div>
          </article>

          {/* ===== Enriched Plan ===== */}
          <article className="tradeplan-card">
            <div>
              <div className="tradeplan-header">
                <div className="tradeplan-name">Enriched</div>
                <div className="tradeplan-old-price">₹7,999</div>
                <div className="tradeplan-price">{PLANS[1].price.toLocaleString("en-IN")}</div>
                <div className="tradeplan-meta">
                  Excluding gov fee <span className="popular">(Popular)</span>
                </div>
              </div>

              <div className="tradeplan-body">
                <ul className="tradeplan-list">
                  <li className="tradeplan-list-item">Elemental Plan Plus</li>
                  <li className="tradeplan-list-item">Share Certificate</li>
                  <li className="tradeplan-list-item">Commencement of Business</li>
                  <li className="tradeplan-list-item">Udyam/MSME Registration</li>
                </ul>
              </div>
            </div>

            <div className="tradeplan-footer">
              <button className="tradeplan-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
            </div>
          </article>

          {/* ===== Supreme Plan ===== */}
          <article className="tradeplan-card">
            <div>
              <div className="tradeplan-header">
                <div className="tradeplan-name">Supreme</div>
                <div className="tradeplan-old-price">₹29,999</div>
                <div className="tradeplan-price">{PLANS[2].price.toLocaleString("en-IN")}</div>
                <div className="tradeplan-meta">Excluding gov fee</div>
              </div>

              <div className="tradeplan-body">
                <ul className="tradeplan-list">
                  <li className="tradeplan-list-item">Enriched Plan Plus</li>
                  <li className="tradeplan-list-item">Income tax filing of Company</li>
                  <li className="tradeplan-list-item">Preparation of Directors Report</li>
                  <li className="tradeplan-list-item">Preparation of Annual Return</li>
                  <li className="tradeplan-list-item">Preparation of Auditor Appointment Paperwork</li>
                  <li className="tradeplan-list-item">Preparation of List of Share Holders</li>
                  <li className="tradeplan-list-item">Preparation of Notice of AGM</li>
                  <li className="tradeplan-list-item">Preparation of Notice of BM</li>
                  <li className="tradeplan-list-item">Preparation of Extracts of AGM</li>
                  <li className="tradeplan-list-item">Filing of AOC - 4 (Financial Statements)</li>
                  <li className="tradeplan-list-item">Filing of MGT - 7 (Annual Return)</li>
                  <li className="tradeplan-list-item">Filing of ADT - 1 (Auditor Appointment)</li>
                  <li className="tradeplan-list-item">Minutes of Board Meeting for 1st FY</li>
                  <li className="tradeplan-list-item">Minutes of General Meeting for 1st FY</li>
                  <li className="tradeplan-list-item">Maintenance of Statutory E-Registers</li>
                  <li className="tradeplan-list-item">Filing of DPT - 3 Annual (If Applicable)</li>
                  <li className="tradeplan-list-item">Filing of MSME - 1 (If Applicable) for 1st FY</li>
                  <li className="tradeplan-list-item">DIR KYC (2 Directors)</li>
                  <li className="tradeplan-list-item">Income Tax Filing of 2 Directors</li>
                  <li className="tradeplan-list-item">Audit fees are excluded and to be paid directly to Auditor</li>
                </ul>
              </div>
            </div>

            <div className="tradeplan-footer">
              <button className="tradeplan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
            </div>
          </article>
        </div>
      </div>
    </section>


      {activePlan && (

        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="trade-license" />

      )}

    </>

  );};

export default TradeLicensePlans;
