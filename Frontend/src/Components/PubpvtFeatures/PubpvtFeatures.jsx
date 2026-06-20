import React from "react";
import "./PubpvtFeatures.css";

const types = [
  {
    number: "01",
    title: "Section 14 + Regional Director Route",
    text: "A Public Limited Company is converted into a Private Limited Company under Section 14 read with Section 18 of the Companies Act, 2013. A special resolution alters the MOA and AOA, MGT-14 is filed, and an application is made to the Regional Director in Form RD-1. On the RD's approval, the order is filed in INC-28 and a fresh Certificate of Incorporation is issued.",
  },
  {
    number: "02",
    title: "Articles Add the Private Restrictions",
    text: "The AOA is rewritten to add the three defining features of a private company under Section 2(68) — a cap of 200 members, a restriction on the transfer of shares, and a prohibition on inviting the public to subscribe. The MOA name clause is altered to add the word 'Private', and the company must satisfy the minimum of 2 directors and 2 members.",
  },
  {
    number: "03",
    title: "RD Approval & Newspaper Notice",
    text: "Conversion requires the Regional Director's approval, a public notice in Form INC-25A published in an English and a vernacular newspaper, and individual intimation to creditors, the ROC, and the RD inviting objections. These safeguards must be cleared before the conversion order is granted and INC-28 is filed.",
  },
];

const PubpvtFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Key Features of the Conversion Route</h2>

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

export default PubpvtFeatures;
