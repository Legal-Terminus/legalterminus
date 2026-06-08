import React from "react";
import "../CopyPvtTypes/CopyPvtTypes.css";

const types = [
  {
    number: "01",
    title: "ISO 9001:2015 — Quality Management",
    text: "The big one. Required for 80%+ of government tenders, most PSU empanelments, GeM marketplace differentiation, and enterprise vendor onboarding. Covers customer focus, leadership, process approach, continual improvement. Applicable to ANY business — manufacturing, services, retail, IT. Our most-delivered standard.",
  },
  {
    number: "02",
    title: "ISO 14001:2015 — Environmental Management",
    text: "For manufacturing, chemicals, energy, real estate, and any business with material environmental impact. Demonstrates legal compliance + pollution prevention + sustainability commitment. Increasingly required by ESG-focused enterprise customers and export markets (EU CBAM compliance prep).",
  },
  {
    number: "03",
    title: "ISO 45001:2018 — Occupational Health & Safety",
    text: "For manufacturing, construction, mining, factories, and any workforce-intensive operation. Covers hazard identification, risk control, worker participation, incident reporting. Replaced the older OHSAS 18001. Critical for high-risk industries and labour-law compliance signalling.",
  },
  {
    number: "04",
    title: "ISO 22000:2018 — Food Safety",
    text: "For food manufacturing, processing, packaging, cold storage, restaurants (large-scale), and supply chain. Integrates HACCP + GMP + traceability. Often required alongside FSSAI for exports and large institutional buyers (hotels, airlines, hospitals).",
  },
  {
    number: "05",
    title: "ISO 27001:2022 — Information Security",
    text: "For IT services, SaaS, BPO, fintech, healthcare data, and any business handling customer / financial / health data. Heavy on risk assessment + controls (Annex A: 93 controls in 2022 version, down from 114 in 2013). Mandatory for enterprise SaaS deals + EU GDPR + India DPDPA signalling.",
  },
  {
    number: "06",
    title: "ISO 13485:2016 — Medical Devices",
    text: "For medical device manufacturers, distributors, and providers of related services. Required for CDSCO licence applications + EU MDR / US FDA market access. More prescriptive than ISO 9001 — tighter on design controls, traceability, post-market surveillance.",
  },
];

const ISOTypes = () => {
  return (
    <section className="cpvt-section">
      <div className="cpvt-container">
        <h2 className="cpvt-title">Types of ISO Certification in India</h2>
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

export default ISOTypes;
