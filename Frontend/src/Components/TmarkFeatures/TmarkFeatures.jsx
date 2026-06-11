import React from "react";
import "./TmarkFeatures.css";

const types = [
  {
    number: "01",
    title: "Word & Logo Marks",
    text: "The two most common trademarks. A word mark protects a brand name, term, or slogan in plain text — covering it in any font or style. A device/logo mark protects a specific graphic, symbol, or stylised logo. Many businesses register both: the word mark for the name and the device mark for the visual identity, for the widest protection.",
  },
  {
    number: "02",
    title: "Service, Collective & Certification Marks",
    text: "A service mark identifies services rather than goods (classes 35–45). A collective mark is owned by an association and used by its members (e.g. a trade body). A certification mark — like ISI or AGMARK — certifies that goods/services meet a defined standard of quality, origin, or material, and is used by anyone who meets that standard.",
  },
  {
    number: "03",
    title: "Shape, Sound & Non-Conventional Marks",
    text: "Trademarks can extend beyond words and logos. The shape of goods or packaging, a distinctive colour combination, a sound (jingle), or even a pattern can be registered if it is distinctive and capable of distinguishing your offering. These non-conventional marks protect brand elements that customers recognise instantly.",
  },
];

const TmarkFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Trademarks You Can Register</h2>

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

export default TmarkFeatures;
