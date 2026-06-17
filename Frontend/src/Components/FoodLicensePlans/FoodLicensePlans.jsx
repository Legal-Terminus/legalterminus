import { useState } from "react";
import "./FoodLicensePlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    badge: "TEA / SNACK STALL + HAWKER",
    oldPrice: 1499,
    price: 999,
    services: [
      "Eligibility check — Petty Retailer of snacks / tea shops",
      "OR Hawker (itinerant / mobile food vendor)",
      "FoSCoS account creation + KOB selection",
      "Form A drafting + filing on foscos.fssai.gov.in",
      "Lightest documentation set (ID + address proof + photo)",
      "Government fee payment coordination",
      "14-digit FSSAI Registration Certificate delivery",
      "Food Safety Display Board (FSDB) template (PDF)",
      "Validity 1–5 years (applicant's choice; renewable)",
      "Renewal-reminder calendar (90 / 30 / 7-day pre-expiry alerts)",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ OTHER BASIC FBOs",
    popular: true,
    oldPrice: 4999,
    price: 2999,
    services: [
      "Eligibility check — other Basic Registration cases",
      "(home bakers, small manufacturers, kirana food sellers, tiffin services, small food business, etc.)",
      "Annual turnover up to ₹1.5 crore (revised 2026 slab)",
      "FoSCoS account + KOB + product-category mapping",
      "Form A drafting with full annexures",
      "Premises proof + product list validation",
      "Water test report + NOC guidance",
      "Food Safety Management Plan (FSMP) template",
      "Government fee payment coordination",
      "14-digit FSSAI Registration Certificate delivery",
      "Validity 1–5 years (applicant's choice; renewable)",
      "Renewal-reminder calendar (90 / 30 / 7-day pre-expiry alerts)",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "STATE LICENCE",
    oldPrice: 5999,
    price: 3999,
    services: [
      "Eligibility check — turnover ₹1.5 Cr to ₹50 Cr (revised 2026 slab)",
      "Restaurants, mid / large manufacturers, Re-packers, Re-labelers, distributors, hotels (3-star and below)",
      "FoSCoS application + product category mapping",
      "Form B drafting with full annexures",
      "Premises blueprint + equipment list review",
      "Water test report + NOC guidance",
      "Food Safety Management Plan (FSMP) template",
      "FoSTaC Food Safety Supervisor referral",
      "Government fee payment coordination",
      "Validity 1–5 years (applicant's choice; renewable)",
      "Renewal-reminder calendar (90 / 30 / 7-day pre-expiry alerts)",
      "Form D1 annual return reminders + risk-based-inspection readiness",
    ],
  },
  {
    id: "supreme-plus",
    name: "Supreme Plus",
    badge: "CENTRAL LICENCE",
    oldPrice: 11999,
    price: 7999,
    services: [
      "Eligibility check — turnover > ₹50 crore (revised 2026 slab)",
      "OR compulsory Central License category (irrespective of turnover): Importers / exporters, E-commerce food businesses (Swiggy / Zomato / Amazon Food), Multi-state operators / head office of multi-state FBO, 5-star hotels / ports / airports / railways / Defence caterers",
      "Central License application on FoSCoS (Form B)",
      "Full FSMP + HACCP plan documentation",
      "IEC linkage (for importers / exporters)",
      "Recall plan + traceability framework",
      "Liaison with Central Licensing Authority (CLA)",
      "FoSTaC Food Safety Supervisor referral",
      "Validity 1–5 years (applicant's choice; renewable)",
      "Renewal-reminder calendar (90 / 30 / 7-day pre-expiry alerts)",
      "Form D1 annual return reminders + risk-based-inspection readiness",
    ],
  },
];

const FoodLicensePlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Register your food license at pocket-friendly prices
            </p>
          </header>

          <div className="opcpricing-cards foodlicense-cards-center">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`opcplan-card${plan.popular ? " opcplan-card--popular" : ""}`}
              >
                <div>
                  <div className="opcplan-header">
                    {plan.badge && (
                      <div className={`opcplan-badge${plan.popular ? " opcplan-badge--popular" : ""}`}>
                        {plan.badge}
                      </div>
                    )}
                    <div className="opcplan-name">{plan.name}</div>
                    <div className="opcplan-old-price">₹{plan.oldPrice.toLocaleString("en-IN")}</div>
                    <div className="opcplan-price">₹{plan.price.toLocaleString("en-IN")}</div>
                    <div className="opcplan-meta">+ Govt fee &amp; GST extra</div>
                  </div>

                  <div className="opcplan-body">
                    <ul className="opcplan-list">
                      {plan.services.map((s, i) => (
                        <li key={i} className="opcplan-list-item">{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="opcplan-footer">
                  <button
                    className={`opcplan-button${plan.popular ? " opcplan-button--popular" : ""}`}
                    onClick={() => setActivePlan(plan)}
                  >
                    Buy Now
                  </button>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {activePlan && (
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="food-license-fssai" />
      )}
    </>
  );
};

export default FoodLicensePlans;
