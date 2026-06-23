import React from "react";
import "../CompanyRegStructures/CompanyRegStructures.css";

const TYPES = [
  {
    title: "Word Mark",
    text: "A text-only mark — a brand name, word, letter, or numeral (e.g. “COCA-COLA”). It protects the name itself regardless of style, font, or colour, giving the broadest protection over your brand name.",
  },
  {
    title: "Logo / Device Mark",
    text: "An image, symbol, or device used to identify your brand (a logo or graphic). It protects the visual identity of your brand as filed, ideal when your logo is the key brand element.",
  },
  {
    title: "Combination Mark",
    text: "Text and image filed together — your brand name styled with your logo. It offers strong, specific protection for the complete look of your brand as a single mark.",
  },
  {
    title: "Sound & Colour Mark",
    text: "Non-conventional marks — a distinctive audio logo / jingle (sound mark) or a unique colour or colour combination tied to your brand (colour mark), filed via the TM-A application.",
  },
];

const TrademarkTypes = () => {
  return (
    <section className="crst-section">
      <div className="crst-container">
        <h2 className="crst-title">Types of Trademark Registration</h2>
        <p className="crst-subtitle">
          We help you choose the right type of mark and assist with the search, documentation, and TM-A filing process.
        </p>

        <div className="crst-grid">
          {TYPES.map((t) => (
            <div className="crst-card" key={t.title}>
              <h3 className="crst-card-title">{t.title}</h3>
              <p className="crst-card-text">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrademarkTypes;
