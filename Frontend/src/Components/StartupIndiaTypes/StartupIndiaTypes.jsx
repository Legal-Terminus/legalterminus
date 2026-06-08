import React from "react";
import "../CopyPvtTypes/CopyPvtTypes.css";

const types = [
  {
    number: "01",
    title: "Tech / SaaS / IT Startup",
    text: "Software platforms, SaaS products, IT services with proprietary tech, AI / ML platforms, fintech, deeptech. The largest sector in DPIIT registrations. Innovation framing typically around proprietary tech / IP / data moat / network effects. Angel tax exemption critical given VC-heavy funding pattern.",
  },
  {
    number: "02",
    title: "D2C / Consumer Brand Startup",
    text: "Direct-to-consumer brands - beauty, FMCG, fashion, food & beverages, home, baby. Innovation framing around brand IP, supply chain, customer experience, sustainability angle, or category creation. GeM marketplace access valuable. Trademark filing typically priority - 50% rebate helps.",
  },
  {
    number: "03",
    title: "AgriTech / Rural Innovation Startup",
    text: "Agri-input platforms, farm management SaaS, drone-as-a-service for agriculture, agri-finance, FPO-tech, post-harvest tech, agri-commerce. Strong DPIIT alignment - rural innovation is policy priority. Often eligible for NABARD-backed financing in addition to SIDBI FFS.",
  },
  {
    number: "04",
    title: "HealthTech / BioTech Startup",
    text: "Telemedicine platforms, health SaaS, medical devices, diagnostics, biotech research, healthcare AI. Innovation framing typically clear (medical IP / clinical evidence / patent-heavy). Patent rebate (80%) is genuinely material. Section 80-IAC tax holiday timing aligned with revenue ramp.",
  },
  {
    number: "05",
    title: "EdTech / Skilling Startup",
    text: "Online education platforms, K-12 / higher-ed tech, professional skilling, certification platforms, language learning, vernacular content. Innovation framing around personalisation / engagement / outcome measurement / scalable pedagogy. Public procurement (GeM) for government skilling contracts.",
  },
  {
    number: "06",
    title: "Climate / Social Impact / Renewables Startup",
    text: "Climate tech, renewable energy, EV / mobility, circular economy, sanitation, financial inclusion, women empowerment, education access. Strong DPIIT + IMB alignment. Often eligible for additional grants / impact-investor matchmaking. ESG-focused investors actively fund this sector.",
  },
];

const StartupIndiaTypes = () => {
  return (
    <section className="cpvt-section">
      <div className="cpvt-container">

        <h2 className="cpvt-title">Types of Startup India Registration</h2>

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
