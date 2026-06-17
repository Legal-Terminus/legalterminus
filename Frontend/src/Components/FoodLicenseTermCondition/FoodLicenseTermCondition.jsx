import React from "react";
import "./FoodLicenseTermCondition.css";

const FoodLicenseTermCondition = () => {
  return (
    <section className="opctc-section">
      <div className="opctc-container">
        <div className="opctc-card">
          <h2 className="opctc-title">TERMS &amp; CONDITIONS</h2>

          <p className="opctc-subtitle">
            By subscribing to the above plans, you agree to abide by our following additional terms and conditions
          </p>

          <ol className="opctc-list">
            <li className="opctc-item">
              Revised 2026 Turnover Thresholds: Effective 1 April 2026, per the FSS (Licensing and Registration of Food Businesses) Amendment Regulations 2026 and FSSAI Order dated 13.03.2026, the categorisation slabs are: Basic Registration — turnover up to ₹1.5 crore; State License — ₹1.5 crore to ₹50 crore; Central License — above ₹50 crore (or compulsory-Central category irrespective of turnover). These supersede the earlier slabs (₹12 lakh / ₹20 crore).
            </li>
            <li className="opctc-item">
              4-Tier Plan Eligibility (Critical): (a) ELEMENTAL (₹999) is ONLY for Petty Retailer of snacks / tea shops (temporary or fixed stall preparing / serving tea / coffee / snacks and similar variants) AND Hawker (itinerant / mobile food vendor selling packaged or freshly prepared food while travelling on foot or movable carts). (b) ENRICHED (₹2,999) is for all OTHER Basic Registration cases — home bakers, small manufacturers, kirana food sellers, tiffin services, small food business, small caterers etc. with annual turnover up to ₹1.5 crore. (c) SUPREME (₹3,999) is for State Licence filers with annual turnover ₹1.5 crore to ₹50 crore. (d) SUPREME PLUS (₹7,999) is for Central Licence filers with annual turnover above ₹50 crore OR compulsory-Central category irrespective of turnover.
            </li>
            <li className="opctc-item">
              Licence Validity + Renewal Framework: FSSAI licences / registrations are issued for a tenure of 1, 2, 3, 4, or 5 YEARS at the applicant's choice (paid upfront at filing). RENEWAL must be filed BEFORE EXPIRY — typically the renewal window opens 180 days pre-expiry and closes ON the expiry date. LATE RENEWAL is permitted but attracts a PENALTY of ₹100 PER DAY of delay (no cap). Filing renewal MORE THAN 180 DAYS POST-EXPIRY can lead to licence cancellation — a fresh application becomes necessary. Our plans include a renewal-reminder calendar with 90 / 30 / 7-day pre-expiry alerts so you don't slip.
            </li>
            <li className="opctc-item">
              Government Fee Structure: FSSAI government fees are governed by Annexure III, FSS (Licensing and Registration) Regulations 2011. Basic: ₹100/year (Elemental + Enriched). State: ₹2,000–₹5,000 + 18% GST/year by category (Supreme). Central: ₹7,500 + 18% GST/year (Supreme Plus). Multi-year upfront fee = annual fee × years chosen, paid on FoSCoS (https://foscos.fssai.gov.in). Fees confirmed at the time of filing.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              Category Determination — We Get It Right First Time: The correct FSSAI plan + category is determined by FBO TYPE + ANNUAL TURNOVER + GEOGRAPHIC SCOPE + BUSINESS MODEL. Misclassification (e.g., filing Elemental when you're actually a small manufacturer; filing State when Central is mandatory) leads to license cancellation and re-filing — we audit this in the discovery call before filing.
            </li>
            <li className="opctc-item">
              Mandatory Central License Categories (Supreme Plus) — Irrespective of Turnover: Per FSS Regulations, Central License (Supreme Plus tier) is mandatory IRRESPECTIVE OF TURNOVER for: importers, exporters, e-commerce food businesses (FBOs selling via online platforms), operators in seaports / airports / railway stations, 5-star hotels, food caterers serving Central Government / Railways / Defence, head offices of multi-state operators, and any FBO with operations in more than 1 state (head office takes Central License). The ₹50 crore slab applies only to the turnover-triggered Central License category.
            </li>
            <li className="opctc-item">
              Risk-Based Inspection Regime: Continued validity of FSSAI license / registration under the 2026 Amendment is conditional on risk-based inspection outcomes. FSSAI may suspend or cancel a license if inspections reveal non-compliance with hygiene standards (Schedule 4), labelling regulations, FSMP, or food safety norms. Annual Return (Form D1 / D2) filing remains mandatory for State + Central licensees and is a key risk-rating input.
            </li>
            <li className="opctc-item">
              Refund Policy: Full refund of professional fee (less ₹499 documentation handling) is available if the FoSCoS application is not submitted within 5 working days from receipt of all required information + government fee. Government fees already paid to FSSAI are non-refundable (FoSCoS portal policy).
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: Annual returns (Form D1 / D2 for State + Central licensees), Hygiene Rating Audits (HRA), FoSTaC training, laboratory testing of water sample or food samples, label compliance reviews (FSS Labelling &amp; Display Regulations 2020), product-specific approvals / NOC (e.g., nutraceuticals under FSS Health Supplements Regulations 2022), proprietary food approval, organic certification (NPOP / PGS-India), defending suspension / cancellation orders, and litigation / appeal handling are NOT included in the base plan.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default FoodLicenseTermCondition;
