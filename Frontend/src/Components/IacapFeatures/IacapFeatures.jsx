import React from "react";
import "./IacapFeatures.css";

const types = [
  {
    number: "01",
    title: "To Onboard New Investors",
    text: "The most common reason — a company wants to issue fresh shares to angel investors, VCs, or new partners, but the new issue would take paid-up capital beyond the authorised limit. Increasing authorised capital creates the headroom needed to allot those shares and bring the investment in cleanly.",
  },
  {
    number: "02",
    title: "To Convert Loans / Infuse Promoter Funds",
    text: "Promoters often fund their company through loans or director's advances. To convert those loans into equity, or to formally infuse more promoter capital as shares, the authorised capital must be high enough to accommodate the new shares. Raising it first makes the conversion or infusion possible.",
  },
  {
    number: "03",
    title: "For Expansion & Higher Net Worth",
    text: "A larger authorised and paid-up capital strengthens the company's balance sheet and net worth, which helps in qualifying for bank loans, large tenders, and credit facilities. Companies planning expansion or seeking higher creditworthiness raise authorised capital to support fresh equity that funds the growth.",
  },
];

const IacapFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Common Reasons to Increase Authorised Capital</h2>

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

export default IacapFeatures;
