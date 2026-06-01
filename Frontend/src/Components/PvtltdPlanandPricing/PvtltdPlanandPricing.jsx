import React, { useState } from "react";
import "./PvtltdPlanandPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";


const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    price: 1,
    services: [
      "Name Search & Availability Report",
      "RUN Name Approval (up to 4 name choices)",
      "DIN for 2 Directors",
      "DSC for 2 Directors",
      "SPICe+ Part B + AGILE-PRO-S filing",
      "PAN + TAN application coordination",
      "Certificate of Incorporation (COI) delivery",
      "e-MOA & e-AOA Drafting",
      "EPF & ESI Registration",
      "1st Auditor Appointment Documents",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    price: 8999,
    services: [
      "Everything in Elemental",
      "Bank Account Opening Documents",
      "Share Certificate",
      "Commencement of Business (INC-20A)",
      "Udyam / MSME Registration",
      "GST Registration Assistance",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    price: 13999,
    services: [
      "Everything in Enriched",
      "The 1st Board Resolution documentation",
      "Annual ITR Filing — Company",
      "Financial Statements Filing — AOC-4",
      "Annual Return Filing — MGT-7",
      "Auditor Appointment Filing — ADT-1",
    ],
  },
  {
    id: "supreme-plus",
    name: "Supreme Plus",
    price: 24999,
    services: [
      "Everything in Supreme",
      "Directors' Report Preparation",
      "Minutes of Board & General Meetings (1st FY)",
      "Statutory E-Register Maintenance",
      "DPT-3 & MSME-1 Filing (if applicable)",
      "ITR Filing for 2 Directors",
    ],
  },
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
                  <div className="plan-old-price">₹7,999</div>
                  <div className="plan-price">₹{PLANS[0].price.toLocaleString("en-IN")}</div>
                  <div className="plan-meta">+ Govt. fees &amp; GST extra</div>
                </div>

                <div className="plan-body">
                  <ul className="plan-list">
                    <li className="plan-list-item">Name Search &amp; Availability Report</li>
                    <li className="plan-list-item">RUN Name Approval (up to 4 name choices)</li>
                    <li className="plan-list-item">DIN for 2 Directors</li>
                    <li className="plan-list-item">DSC for 2 Directors</li>
                    <li className="plan-list-item">SPICe+ Part B + AGILE-PRO-S filing</li>
                    <li className="plan-list-item">PAN + TAN application coordination</li>
                    <li className="plan-list-item">Certificate of Incorporation (COI) delivery</li>
                    <li className="plan-list-item">e-MOA &amp; e-AOA Drafting</li>
                    <li className="plan-list-item">EPF &amp; ESI Registration</li>
                    <li className="plan-list-item">1st Auditor Appointment Documents</li>
                  </ul>
                </div>
              </div>

              <div className="plan-footer">
                <button className="plan-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
              </div>
            </article>

            {/* Enriched */}
            <article className="plan-card plan-card--popular">
              <div className="plan-popular-badge">★ MOST POPULAR</div>
              <div>
                <div className="plan-header">
                  <div className="plan-name">Enriched</div>
                  <div className="plan-old-price">₹13,999</div>
                  <div className="plan-price">₹{PLANS[1].price.toLocaleString("en-IN")}</div>
                  <div className="plan-meta">+ Govt. fees &amp; GST extra</div>
                </div>

                <div className="plan-body">
                  <ul className="plan-list">
                    <li className="plan-list-item">Everything in Elemental</li>
                    <li className="plan-list-item">Bank Account Opening Documents</li>
                    <li className="plan-list-item">Share Certificate</li>
                    <li className="plan-list-item">Commencement of Business (INC-20A)</li>
                    <li className="plan-list-item">Udyam / MSME Registration</li>
                    <li className="plan-list-item">GST Registration Assistance</li>
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
                  <div className="plan-old-price">₹20,999</div>
                  <div className="plan-price">₹{PLANS[2].price.toLocaleString("en-IN")}</div>
                  <div className="plan-meta">+ Govt. fees &amp; GST extra</div>
                </div>

                <div className="plan-body">
                  <ul className="plan-list">
                    <li className="plan-list-item">Everything in Enriched</li>
                    <li className="plan-list-item">The 1st Board Resolution documentation</li>
                    <li className="plan-list-item">Annual ITR Filing — Company</li>
                    <li className="plan-list-item">Financial Statements Filing — AOC-4</li>
                    <li className="plan-list-item">Annual Return Filing — MGT-7</li>
                    <li className="plan-list-item">Auditor Appointment Filing — ADT-1</li>
                  </ul>
                </div>
              </div>

              <div className="plan-footer">
                <button className="plan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
              </div>
            </article>

            {/* Supreme Plus */}
            <article className="plan-card">
              <div>
                <div className="plan-header">
                  <div className="plan-name">Supreme Plus</div>
                  <div className="plan-old-price">₹37,499</div>
                  <div className="plan-price">₹{PLANS[3].price.toLocaleString("en-IN")}</div>
                  <div className="plan-meta">+ Govt. fees &amp; GST extra</div>
                </div>

                <div className="plan-body">
                  <ul className="plan-list">
                    <li className="plan-list-item">Everything in Supreme</li>
                    <li className="plan-list-item">Directors' Report Preparation</li>
                    <li className="plan-list-item">Minutes of Board &amp; General Meetings (1st FY)</li>
                    <li className="plan-list-item">Statutory E-Register Maintenance</li>
                    <li className="plan-list-item">DPT-3 &amp; MSME-1 Filing (if applicable)</li>
                    <li className="plan-list-item">ITR Filing for 2 Directors</li>
                  </ul>
                </div>
              </div>

              <div className="plan-footer">
                <button className="plan-button" onClick={() => setActivePlan(PLANS[3])}>Buy Now</button>
              </div>
            </article>

          </div>
        </div>
      </section>

      {activePlan && (
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="private-limited" />
      )}
    </>
  );
};

export default PricingSection;
