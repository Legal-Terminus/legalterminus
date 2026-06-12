import React from "react";
import "./DpvtFeatures.css";

const types = [
  {
    number: "01",
    title: "Voluntary Strike-Off (Section 248)",
    text: "The simplest and most common route for an inactive company. The company itself applies in Form STK-2 to have its name removed from the register — available where it has either never commenced business, or has not carried on business for the two preceding financial years. It needs no court process, only ROC approval, making it the fastest and most cost-effective way to close a dormant company.",
  },
  {
    number: "02",
    title: "Voluntary Liquidation (IBC, 2016)",
    text: "The route for a solvent company that has assets and liabilities to settle before closing. An Insolvency Professional is appointed as liquidator, the assets are realised, creditors are paid, and the surplus is distributed to shareholders before the company is dissolved by the NCLT. It is more involved than strike-off but is the correct path when there is value to wind down properly.",
  },
  {
    number: "03",
    title: "Striking Off by the ROC (Suo Motu)",
    text: "The Registrar can also strike off a company on its own motion — typically where the company has failed to commence business within a year of incorporation or has not filed returns for an extended period. While the end result is removal from the register, it is not a clean, controlled exit and usually comes with director disqualification, so a voluntary strike-off is always preferable.",
  },
];

const DpvtFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Ways to Close a Private Limited Company</h2>

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

export default DpvtFeatures;
