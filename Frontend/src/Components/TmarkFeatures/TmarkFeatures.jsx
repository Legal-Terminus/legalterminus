import React from "react";
import "./TmarkFeatures.css";

const types = [
  {
    number: "01",
    title: "Proposed-to-be-Used Mark",
    text: "You're launching a new brand + have decided on the mark, but haven't yet started commercial use. We file the TM-A claiming 'proposed to be used' — reserving your priority date now while you build the brand. Most common scenario for startups + new product launches.",
  },
  {
    number: "02",
    title: "Prior-Use Mark",
    text: "You've been using the brand in commerce for some time but haven't filed for registration yet. We file the TM-A with the DATE OF FIRST USE + user affidavit + evidence of prior use (invoices, advertisements, social media history, website screenshots). Stronger claim under Section 12 — protects against later similar-mark filings.",
  },
  {
    number: "03",
    title: "Wordmark / Device (Logo) / Combination Mark",
    text: "WORDMARK = text-only mark (e.g., 'COCA-COLA'). LOGO = device / image-only mark. COMBINATION = text + image together. We file accordingly via TM-A. Each plan covers any of these forms. Combination marks offer broader protection but are slightly more specific. Discussed in the discovery call.",
  },
  {
    number: "04",
    title: "Multi-Class Filings (Add-On)",
    text: "Each class is a separate filing. We can file across multiple classes simultaneously — e.g., a restaurant chain typically files Class 30 (food products) + Class 43 (restaurant services). Each additional class = Actual Plan + GST + class-fee at actuals.",
  },
  {
    number: "05",
    title: "Sound Mark",
    text: "Protects a distinctive sound sequence or audio logo (e.g., the Britannia four-bell chime or the Netflix 'Tudum').",
  },
  {
    number: "06",
    title: "Color Mark",
    text: "Protects a specific color or a unique combination of colors used in a specific commercial context (e.g., Cadbury purple).",
  },
];

const TmarkFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Trademark Registration in India</h2>
        <p className="tmark-features-subtitle">
          Trademark scenarios we handle across the 4 plan tiers. Pick by your trademark situation (proposed-to-be-used vs prior-use) + complexity (clean filing vs examination / hearing / opposition).
        </p>

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
