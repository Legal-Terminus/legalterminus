import React from "react";
import "../CopyPvtTypes/CopyPvtTypes.css";

const types = [
  {
    number: "01",
    title: "Private Limited Company",
    text: "The most common entity for Startup India recognition. Eligible if incorporated less than 10 years ago with turnover under ₹100 crore. Pvt Ltd unlocks the full Startup India toolkit — 80-IAC tax holiday, angel tax exemption, ESOP-ready structure, and VC funding compatibility. Ideal for startups planning to raise institutional capital.",
  },
  {
    number: "02",
    title: "Limited Liability Partnership (LLP)",
    text: "LLPs incorporated in India are eligible for DPIIT recognition. However, LLPs cannot issue ESOPs or preference shares, which limits their investor appeal. If your startup is currently an LLP and you're approaching seed or pre-Series A, consider converting to Pvt Ltd before or alongside getting DPIIT recognition.",
  },
  {
    number: "03",
    title: "Registered Partnership Firm",
    text: "Registered Partnership Firms (under the Indian Partnership Act, 1932) are eligible for Startup India recognition provided they meet the age and turnover criteria. Note: simple proprietorship / solo traders are NOT eligible — the business must have 2+ partners formally registered with the Registrar of Firms.",
  },
  {
    number: "04",
    title: "One Person Company (OPC)",
    text: "OPCs registered under Companies Act, 2013 are technically a form of Private Limited Company and are eligible for DPIIT recognition. The single-member structure does not bar recognition. OPCs aiming for the 80-IAC tax holiday must ensure the business meets IMB's innovation threshold criteria.",
  },
  {
    number: "05",
    title: "Startup with Foreign Investment",
    text: "A Private Limited Company with foreign shareholders (FDI under auto route) can apply for DPIIT recognition. The entity must still meet the 10-year age and ₹100 crore turnover criteria. For angel tax exemption (Form 2), only shares issued to Indian residents trigger the exemption requirement — foreign investor rounds are not covered by angel tax.",
  },
  {
    number: "06",
    title: "Biotech / Deep-Tech Startup",
    text: "For startups in biotech, medtech, cleantech, or deep-tech, DPIIT recognition is a prerequisite for accessing the BIRAC BIG grant, NIDHI PRAYAS grant, and DST SEED grants. These startups also qualify for an extended 80-IAC window and additional IP support programmes. Category selection in the DPIIT application is critical for these verticals.",
  },
];

const StartupIndiaTypes = () => {
  return (
    <section className="cpvt-section">
      <div className="cpvt-container">

        <h2 className="cpvt-title">Entities Eligible for Startup India (DPIIT) Recognition</h2>

        <div className="cpvt-cards">
          {types.map((type) => (
            <div className="cpvt-card" key={type.number}>
              <div className="cpvt-number">{type.number}</div>
              <h3 className="cpvt-card-title">{type.title}</h3>
              <p className="cpvt-card-text">{type.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default StartupIndiaTypes;
