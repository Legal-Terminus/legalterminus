import React from "react";
import "./PtollpFeatures.css";

const types = [
  {
    number: "01",
    title: "Section 55 Statutory Conversion",
    text: "The conversion is carried out under Section 55 and the Second Schedule of the LLP Act, 2008. A registered or unregistered partnership firm can convert. On registration of the LLP, the firm is deemed dissolved and its name removed from the register of firms — the business simply continues as an LLP under the same partners.",
  },
  {
    number: "02",
    title: "Automatic Vesting of Assets & Liabilities",
    text: "The biggest advantage of this route is that all of the firm's property, assets, interests, rights, privileges, liabilities, and obligations vest in the LLP automatically by operation of law — without separate conveyance deeds or stamp duty on each asset. Pending contracts, agreements, and licences continue as if entered into by the LLP.",
  },
  {
    number: "03",
    title: "Same Partners, Two Designated Partners",
    text: "All partners of the firm — and no one else — must become partners of the LLP. At least two of them are appointed as designated partners (responsible for compliance), each holding a DPIN and a DSC. New partners can be brought in only after the LLP is formed, keeping the conversion itself clean and continuity intact.",
  },
];

const PtollpFeatures = () => {
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

export default PtollpFeatures;
