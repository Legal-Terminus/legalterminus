import React from "react";
import "./TMApplicaCompanyTab.css";

// Replace with your actual illustration
import pvtIllustration from "../../assets/whypvt-imp.svg";

const PvtLtdFull = () => {
  return (
    <div className="Tm-Application-full-wrapper">

      {/* ===========================
          SECTION 1 — OVERVIEW
      ============================ */}
      {/* <div className="overview-wrapper">
        <h2 className="overview-title">Understanding the Basics
</h2>
        <p className="overview-text">
A Private Limited Company is a legally registered business under the Companies Act, 2013, with its own separate identity from its owners. It protects the personal assets of its members, limits who can own shares, and must have a registered office address. </p>
      </div> */}

      {/* ===========================
          SECTION 2 — INTRO
      ============================ */}
      <section className="Tm-Application-intro-section">
        <div className="Tm-Application-intro-container">
          {/* Illustration */}
          <div className="Tm-Application-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="Tm-Application-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="Tm-Application-intro-content">
            <h2 className="Tm-Application-intro-title">
              Why Register Your Trademark in India?
            </h2>
            <p className="Tm-Application-intro-text">
             Your brand name, logo, or tagline is one of your most valuable assets. Under the Trade Marks Act, 1999, trademark registration grants you exclusive legal rights to use that mark in commerce — and the power to take legal action against anyone who misuses it. 
            </p>
          </div>
        </div>
      </section>

     {/* ===========================
          SECTION 3 — COMPANIES ACT
      ============================ */}
      <section className="companies-act-section">
        <div className="companies-act-container">
          <div className="companies-act-card">
            <h2 className="Tm-Application-intro-title">Trademark Classes in India (Nice Classification)</h2>

            <p className="companies-act-text">
             India follows the Nice Classification system, which divides all goods and services into 45 trademark classes — Classes 1 to 34 for goods, and Classes 35 to 45 for services. You must file your trademark under the correct class for protection to apply. Filing in the wrong class can lead to rejection.</p>
            
            <p className="companies-act-point">
              <h1 className="companies-act-title">Goods Classes (1–34) — Quick Reference:</h1>
              Class 25 → Clothing, footwear, headwear | Class 30 → Coffee, tea, rice, flour, bread, confectionery | Class 5 → Pharmaceuticals, medical preparations | Class 3 → Cosmetics, perfumery, cleaning preparations | Class 9 → Software, electronics, scientific instruments | Class 32 → Beverages (non-alcoholic), beer | Class 33 → Alcoholic beverages | Class 29 → Meat, fish, dairy, preserved foods
            </p>

            <p className="companies-act-point">
              <h1 className="companies-act-title">Service Classes (35–45) — Quick Reference:</h1>
              Class 35 → Advertising, business management, retail services | Class 36 → Financial and insurance services | Class 41 → Education, entertainment, training | Class 42 → IT, SaaS, software development, R&D | Class 43 → Restaurants, hotels, food & drink services | Class 45 → Legal services, security services
            </p>

            <p className="companies-act-text">
             <strong>Pro Tip:</strong> Not sure which class fits your business? Our experts will identify the right class(es) before filing — so you don't waste money on incorrect applications.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PvtLtdFull;
