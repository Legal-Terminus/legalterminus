import React from "react";
import "./UdyamRegWho.css";

const types = [
  {
    title: "Manufacturing Enterprise Udyam",
    desc: "For factories, workshops, fabricators, food processors, garment makers, electronics assemblers. NIC codes from Section C (10–33). Eligible for PMEGP capital subsidy (15–35% on project cost), ZED certification, technology upgradation schemes. The 'classic' MSME variant.",
  },
  {
    title: "Service Enterprise Udyam",
    desc: "For IT firms, consultants, marketing agencies, repair services, logistics, professional services. NIC codes from Section J / M / N. Eligible for CGTMSE collateral-free loans, ISO subsidy, IPR subsidies. The fastest-growing MSME segment in 2026.",
  },
  {
    title: "Trading Enterprise Udyam",
    desc: "For wholesale + retail traders. Added to MSME definition in 2 July 2021 notification. NIC Section G. Eligible for MSMED Section 43B(h) protection and priority sector lending — but NOT for manufacturing-specific subsidies (PMEGP, ZED tiers).",
  },
  {
    title: "Agro / Food Processing Udyam",
    desc: "For dairy, agro-processing, edible oil, packaged food, spice processing. NIC codes 10–12. Eligible for Mudra loans, NABARD-tied schemes, MoFPI cluster development, and (where relevant) PMFME (Pradhan Mantri Formalisation of Micro Food Enterprises) scheme.",
  },
  {
    title: "Women-Led Enterprise Udyam",
    desc: "Udyam filed under a woman-promoter (≥ 51% ownership). Same registration form, but unlocks additional benefits — Stand-Up India loan (Rs.10L – Rs.1 cr), Mahila Coir Yojana, lower interest rates from select banks, dedicated incubators, and reservation in some government tenders.",
  },
  {
    title: "SC/ST-Led Enterprise Udyam",
    desc: "Udyam filed by a SC/ST entrepreneur (≥ 51% ownership). Unlocks NSFDC / NSCFDC schemes, Stand-Up India loan, NSIC Single Point Registration with reservation in 4% of central PSU procurement, Credit Linked Capital Subsidy.",
  },
];

const UdyamRegWho = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">
        <h2 className="opc-features-title">Types of Udyam / MSME Registrations</h2>
        <div className="opc-features-cards opc-features-cards--3col">
          {types.map((item, index) => (
            <div className="opc-features-card" key={index}>
              <div className="opc-features-number">{String(index + 1).padStart(2, "0")}</div>
              <h3 className="opc-features-card-title">{item.title}</h3>
              <p className="opc-features-card-text">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UdyamRegWho;
