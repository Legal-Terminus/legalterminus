import React from "react";
import "./OPCFeatures.css";

const types = [
  {
    number: "01",
    title: "OPC Limited by Shares",
    text: "The default and most common structure. Member's liability is capped at the unpaid amount on shares held. Used by 95%+ of solo founders. Authorised capital typically ₹1L – ₹15L to keep stamp duty low.",
  },
  {
    number: "02",
    title: "OPC Limited by Guarantee",
    text: "Member's liability is capped at a guarantee amount specified in the MOA, payable only on winding up. Rare in practice; relevant for member-driven not-for-profit-leaning ventures (though OPC cannot be Section 8).",
  },
  {
    number: "03",
    title: "OPC with Share Capital — Resident Indian",
    text: "The standard format. Sole member is an Indian citizen who has stayed 120+ days in India during the preceding FY. Eligible for all OPC benefits (no AGM, MGT-7A, AOC-4 within 180 days).",
  },
  {
    number: "04",
    title: "OPC with Share Capital — NRI",
    text: "Post-2021 amendment, NRIs holding an Indian passport can incorporate OPC. Same 120-day stay test in the preceding FY applies. FEMA / RBI reporting kicks in if foreign remittance is the source of capital.",
  },
];

const OPCFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of One Person Company Registration in India</h2>

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

export default OPCFeatures;
