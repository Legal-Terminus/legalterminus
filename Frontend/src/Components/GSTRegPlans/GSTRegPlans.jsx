import React, { useState } from "react";
import "./GSTRegPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const packages = [
  {
    title: "Elemental",
    price: "₹1",
    highlight: false,
    features: [
      "GST Registration",
    ],
  },
  {
    title: "Enriched",
    price: "₹2999",
    highlight: true,
    features: [
      "GST Registration",
      "Udyam Registration",
    ],
  },
  {
    title: "Supreme",
    price: "₹7999",
    highlight: false,
    features: [
      "GST Registration",
      "Udyam Registration",
      "6 Months GST Return Filing",
    ],
  },
];

const FEATURE_LIMIT = 6;

const GSTRegistrationPackages = () => {
  const [expanded, setExpanded] = useState({});
  const [activePlan, setActivePlan] = useState(null);

  const toggleReadMore = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <>
    <section className="gst-reg-section">
      <header className="gst-reg-header">
        <h2 className="gst-reg-title">
          Choose Your Plan
        </h2>
        <p className="gst-reg-subtitle">
          Register your GST with pocket friendly-prices
        </p>
      </header>

      <div className="gst-reg-grid">
        {packages.map((pkg, index) => {
          const showAll = expanded[index];
          const visibleFeatures = showAll
            ? pkg.features
            : pkg.features.slice(0, FEATURE_LIMIT);

          return (
            <article
              key={index}
              className={`gst-reg-card ${pkg.highlight ? "highlight" : ""}`}
            >
              <div className="gst-reg-card-header">
                <span
                  className={`gst-reg-badge ${
                    pkg.highlight ? "gold" : ""
                  }`}
                >
                  {pkg.badge}
                </span>
                <h3>{pkg.title}</h3>
                <p className="gst-reg-card-subtitle">{pkg.subtitle}</p>
              </div>

              <div className="gst-reg-price-box">
                <div className="gst-reg-old-price">{pkg.oldPrice}</div>
                <div className="gst-reg-price">
                  {pkg.price} <span>Excluding Govt Fees</span>
                </div>
              </div>

              {/* <div className="gst-reg-guarantee">
                <strong>100% Money-Back Guarantee</strong>
                <span>Until we file your application</span>
              </div> */}

              <ul className="gst-reg-features">
                {visibleFeatures.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              {pkg.features.length > FEATURE_LIMIT && (
                <button
                  className="gst-reg-readmore"
                  onClick={() => toggleReadMore(index)}
                >
                  {showAll ? "Read Less" : "Read More"}
                </button>
              )}

              <button className="gst-reg-btn" onClick={() => setActivePlan({ id: pkg.title.toLowerCase(), name: pkg.title, price: parseInt(pkg.price.replace('₹', '')), services: pkg.features })}>Buy Now</button>
            </article>
          );
        })}
      </div>
    </section>

      {activePlan && (
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="gst-registration" />
      )}
    </>
  );
};

export default GSTRegistrationPackages;
