import React from "react";
import "./PtpubFeatures.css";

const types = [
  {
    number: "01",
    title: "Unlisted Public Company",
    text: "The default destination of a Pvt-to-Public conversion. You gain the 7-member / 3-director public structure, unrestricted membership, and freely transferable shares — without the SEBI overlay. Most companies convert to this first and raise via private placement before any listing.",
  },
  {
    number: "02",
    title: "Listed Public Company",
    text: "The end-goal for IPO-bound businesses — shares trade on the NSE / BSE. Converting to a Public Limited is the mandatory first step; listing follows later once SEBI eligibility thresholds are met. You cannot list a Private Limited directly, which is why conversion comes first.",
  },
  {
    number: "03",
    title: "Holding Public Company",
    text: "Convert when your company sits at the top of a group and controls one or more subsidiaries. A public holding structure supports consolidated financials, cleaner related-party disclosure under Section 188, and the ability to raise capital at the parent level for the whole group.",
  },
  {
    number: "04",
    title: "Foreign-Owned Public Company",
    text: "Where a foreign body corporate holds a significant stake, conversion to a Public Limited eases larger FDI inflows and institutional participation. The entity stays 'Indian' for the Companies Act but attracts FEMA / RBI FC-GPR reporting — which we factor into the conversion plan.",
  },
  {
    number: "05",
    title: "Pre-IPO / Investor-Ready Company",
    text: "Converting ahead of a funding round signals scale to VCs, PE funds, and institutional lenders. Free share transferability and no member cap make priced rounds, ESOP pools, and preferential allotments far cleaner than they ever are inside a Private Limited.",
  },
  {
    number: "06",
    title: "Deemed / Subsidiary Public Company",
    text: "A private company that is a subsidiary of a public company is treated as a public company under Section 2(71). Formally converting aligns your legal status with how the law already views you and removes the ambiguity around the private restrictions in your articles.",
  },
];

const PtpubFeatures = () => {
  return (
    <section className="pub-types-section">
      <div className="pub-types-container">

        <h2 className="pub-types-title">Types of Public Limited Company You Can Convert Into</h2>

        <div className="pub-types-cards">
          {types.map((type) => (
            <div className="pub-types-card" key={type.number}>
              <div className="pub-types-number">{type.number}</div>
              <h3 className="pub-types-card-title">{type.title}</h3>
              <p className="pub-types-card-text">{type.text}</p>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default PtpubFeatures;
