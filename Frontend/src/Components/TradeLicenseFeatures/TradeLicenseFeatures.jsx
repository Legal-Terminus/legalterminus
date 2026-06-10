import React from "react";
import "./TradeLicenseFeatures.css";
import featuresIllustration from "../../assets/tradelicense.jpg";

const types = [
  {
    number: "01",
    title: "Industrial Trade License",
    text: (
      <>
        Required for businesses involved in manufacturing or production work.
        <br />
        Examples: factories, manufacturing units, processing plants.
      </>
    ),
  },
  {
    number: "02",
    title: "Shop and Establishment License",
    text: (
      <>
        Needed for businesses running a shop or service outlet.
        <br />
        Examples: clothing stores, general stores, salons, repair/service centers.
      </>
    ),
  },
  {
    number: "03",
    title: "Food and Health Trade License",
    text: (
      <>
        Required for businesses that sell or supply food and beverages in an area.
        <br />
        Examples: restaurants, cafes, catering services, food trucks. For larger
        operations, an FSSAI license may also be required.
      </>
    ),
  },
];

const TradeLicenseFeatures = () => {
  return (
    <section className="trade-features-section">
      <div className="trade-features-container">

        <h2 className="trade-features-title">
          Types of Trade License Registration in India
        </h2>

        <p className="trade-features-intro">
          Trade Licenses can be registered in different categories based on the
          nature of business, operations, and applicable municipal regulations.
          Choosing the right type ensures legal compliance, smooth operations,
          and long-term business credibility.
        </p>

        <div className="trade-features-illustration-wrap">
          <img
            src={featuresIllustration}
            alt="Types of Trade License"
            className="trade-features-illustration"
          />
        </div>

        <div className="trade-features-cards">
          {types.map((type) => (
            <div className="trade-features-card" key={type.number}>
              <div className="trade-features-number">{type.number}</div>
              <h3 className="trade-features-card-title">{type.title}</h3>
              <p className="trade-features-card-text">{type.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TradeLicenseFeatures;
