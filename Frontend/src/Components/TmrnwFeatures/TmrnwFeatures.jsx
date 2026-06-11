import React from "react";
import "./TmrnwFeatures.css";

const types = [
  {
    number: "01",
    title: "Standard (On-Time) Renewal",
    text: "The ideal route — filing Form TM-R before the trademark's expiry date. An application can be made up to one year ahead of expiry, with no surcharge. The mark's protection simply continues seamlessly for another 10 years, with no break in your exclusive rights or your right to use the ® symbol.",
  },
  {
    number: "02",
    title: "Grace-Period Renewal (with Surcharge)",
    text: "If the deadline is missed, the mark enters a 6-month grace period after expiry during which it can still be renewed by paying a surcharge in addition to the renewal fee. The mark generally remains on the register during this window, but acting quickly is essential to avoid removal and to minimise the extra cost.",
  },
  {
    number: "03",
    title: "Restoration & Renewal",
    text: "If a mark is removed from the register for non-renewal, it can be restored within one year of the expiry date by filing Form TM-R with a restoration fee plus the renewal fee. Restoration is at the Registrar's discretion and may require justification — making it the most expensive and least certain route, and a last resort.",
  },
];

const TmrnwFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Trademark Renewal</h2>

        <div className="opc-features-cards">
          {types.map((type) => (
            <div className="opc-features-card" key={type.number}>
              <div className="opc-features-number">{type.number}</div>
              <h3 className="opc-features-card-title">{type.title}</h3>
              <p className="opc-features-card-text">{type.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TmrnwFeatures;
