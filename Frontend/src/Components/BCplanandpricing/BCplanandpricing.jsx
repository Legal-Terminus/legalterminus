import { useState } from "react";
import "./BCplanandpricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    oldPrice: 14999,
    price: 9999,
    services: [
      "GS1 India Company Prefix allocation",
      "Up to 10 GTINs (product barcodes)",
      "EAN-13 barcode image generation",
      "GS1 portal registration & filing",
      "Annual GS1 subscription coordination",
      "Product data entry on GS1 India registry",
      "Barcode image files (PNG + SVG)",
      "Usage guide for packaging & e-commerce",
    ],
  },
  {
    id: "business",
    name: "Business",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 24999,
    price: 17999,
    services: [
      "Everything in Starter",
      "Up to 100 GTINs",
      "ITF-14 (case/outer carton) barcodes",
      "GS1-128 logistics barcode generation",
      "Amazon / Flipkart barcode compliance check",
      "1-year GS1 annual renewal reminder",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    badge: "✦ FULL-SERVICE",
    oldPrice: 49999,
    price: 39999,
    services: [
      "Everything in Business",
      "Unlimited GTINs for 1 year",
      "Databar / QR code generation (fresh food / pharma)",
      "2D barcode (GS1 DataMatrix) for regulated products",
      "GS1 product data syndication support",
      "Multi-category catalogue setup",
      "2-year GS1 renewal & compliance management",
      "Priority CA / legal support for product compliance",
    ],
  },
];

const BCPricingSection = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Get GS1 Barcode Registration at pocket-friendly prices
            </p>
          </header>

          <div className="opcpricing-cards">
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
                    <div className="opcplan-meta">+ GS1 subscription &amp; GST extra</div>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="bc-registration" />
      )}
    </>
  );
};

export default BCPricingSection;
