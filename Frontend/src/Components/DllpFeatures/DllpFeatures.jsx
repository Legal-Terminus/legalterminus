import React from "react";
import "./DllpFeatures.css";

const types = [
  {
    number: "01",
    title: "Strike-Off via Form 24",
    text: "The simplest and most common route for an inactive LLP. The LLP applies in Form 24 under Rule 37 of the LLP Rules, 2009 to have its name struck off the register — available where it has either never commenced business or has ceased commercial activity for one year or more. It needs no court process, only ROC approval, making it the fastest and most cost-effective way to close a dormant LLP.",
  },
  {
    number: "02",
    title: "Voluntary Winding-Up",
    text: "The route for an LLP that still has assets and liabilities to settle before closing. With the consent of partners and creditors, a liquidator is appointed to realise the assets, pay off the creditors, and distribute any surplus before the LLP is dissolved. It is more involved than a Form 24 strike-off but is the correct path when there is value to wind down properly.",
  },
  {
    number: "03",
    title: "Striking Off by the ROC (Suo Motu)",
    text: "The Registrar can also strike off an LLP on its own motion where it has reason to believe the LLP is not carrying on business — typically after a long period of non-filing. While the end result is removal from the register, it is not a clean, controlled exit and usually comes with penalties and partner consequences, so a voluntary Form 24 strike-off is always preferable.",
  },
];

const DllpFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Ways to Close an LLP</h2>

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

export default DllpFeatures;
