import React, { useState } from "react";
import "./PvtltdPlanandPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";


const PLANS = [
  { id: "elemental", name: "Elemental", price: 3999, services: ["Name Availability Search Report", "1 RUN Name Approval Certificate", "DIN for 2 Directors", "Certificate of Incorporation", "DIN allotment certificate (if not having DIN previously)", "E-PAN & E-TAN", "E-MOA & E-AOA", "Bank Account Opening Docs", "1st Auditor Appointment Docs", "EPF & ESI Registration"] },
  { id: "enriched", name: "Enriched", price: 5999, services: ["Everything in Elemental +", "Share Certificate (Form SH-1)", "Commencement of Business (Form INC-20A)", "Udyam / MSME Registration"] },
  { id: "supreme", name: "Supreme", price: 24999, services: ["Everything in Enriched +", "Income tax filing of (Company)", "Directors' Report Preparation", "Annual Return (MGT-7)", "Financial Statements (AOC-4)", "Auditor Appointment in 1st AGM (ADT-1)", "Preparation of Documents regarding AGM/BM Notice, Minutes & Extracts", "Statutory E-Register Maintenance", "DPT-3 (if applicable) for 1st FY", "MSME-1 (if applicable) for 1st FY", "DIR KYC for 2 Directors", "Income Tax Filing for 2 Directors", "Audit fees excluded (paid to Auditor)"] }
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
            Register your company with pocket-friendly prices
          </p>
        </header>

        {/* Cards */}
        <div className="pricing-cards">

          {/* Elemental */}
          <article className="plan-card">
            <div>
              <div className="plan-header">
                <div className="plan-name">Elemental</div>
                <div className="plan-old-price">₹5,999</div>
                <div className="plan-price">{PLANS[0].price.toLocaleString("en-IN")}</div>
                <div className="plan-meta">Excluding gov fee</div>
              </div>

              <div className="plan-body">
                <ul className="plan-list">
                  <li className="plan-list-item">Name Availability Search Report</li>
                  <li className="plan-list-item">1 RUN Name Approval Certificate</li>
                  <li className="plan-list-item">DIN for 2 Directors</li>
                  <li className="plan-list-item">Certificate of Incorporation</li>
                  <li className="plan-list-item">DIN allotment certificate (if not having DIN previously)</li>
                  <li className="plan-list-item">E-PAN & E-TAN</li>
                  <li className="plan-list-item">E-MOA & E-AOA</li>
                  <li className="plan-list-item">Bank Account Opening Docs</li>
                  <li className="plan-list-item">1st Auditor Appointment Docs</li>
                  <li className="plan-list-item">EPF & ESI Registration</li>
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
                <div className="plan-name">Enriched</div>
                <div className="plan-old-price">₹7,999</div>
                <div className="plan-price">{PLANS[1].price.toLocaleString("en-IN")}</div>
                <div className="plan-meta">
                  Excluding gov fee <span className="popular">(Popular)</span>
                </div>
              </div>

              <div className="plan-body">
                <ul className="plan-list">
                  <li className="plan-list-item">Everything in Elemental +</li>
                  <li className="plan-list-item">Share Certificate (Form SH-1)</li>
                  <li className="plan-list-item">Commencement of Business (Form INC-20A)</li>
                  <li className="plan-list-item">Udyam / MSME Registration</li>
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
                <div className="plan-name">Supreme</div>
                <div className="plan-old-price">₹29,999</div>
                <div className="plan-price">{PLANS[2].price.toLocaleString("en-IN")}</div>
                <div className="plan-meta">Excluding gov fee</div>
              </div>

              <div className="plan-body">
                <ul className="plan-list">
                  <li className="plan-list-item">Everything in Enriched +</li>
                  <li className="plan-list-item">Income tax filing of (Company)</li>
                  <li className="plan-list-item">Directors' Report Preparation</li>
                  <li className="plan-list-item">Annual Return (MGT-7)</li>
                  <li className="plan-list-item">Financial Statements (AOC-4)</li>
                  <li className="plan-list-item">Auditor Appointment in 1st AGM (ADT-1)</li>
                  <li className="plan-list-item">Preparation of Documents regarding AGM/BM Notice, Minutes & Extracts</li>
                  <li className="plan-list-item">Statutory E-Register Maintenance</li>
                  <li className="plan-list-item">DPT-3 (if applicable) for 1st FY</li>
                  <li className="plan-list-item">MSME-1 (if applicable) for 1st FY</li>
                  <li className="plan-list-item">DIR KYC for 2 Directors</li>
                  <li className="plan-list-item">Income Tax Filing for 2 Directors</li>
                  <li className="plan-list-item">Audit fees excluded (paid to Auditor)</li>
                </ul>
              </div>
            </div>

            <div className="plan-footer">
              <button className="plan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
            </div>
          </article>

        </div>
      </div>
    </section>


      {activePlan && (

        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} />

      )}

    </>

  );};

export default PricingSection;
