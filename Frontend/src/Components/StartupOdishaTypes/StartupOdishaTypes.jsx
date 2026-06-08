import React from "react";
import "../CopyPvtTypes/CopyPvtTypes.css";

const types = [
  {
    number: "01",
    title: "Private Limited Company (Odisha-Registered)",
    text: "The most funding-ready structure for Startup Odisha. A Pvt Ltd with its registered office in Odisha is eligible for the full benefits under the Odisha Startup Policy 2022 — capital subsidy, incubation, and procurement preference. Also eligible for dual recognition: Startup Odisha + DPIIT. Preferred entity type for venture-backed startups.",
  },
  {
    number: "02",
    title: "Limited Liability Partnership (LLP)",
    text: "LLPs registered with the ROC having their registered office in Odisha are eligible for Startup Odisha recognition. Capital subsidy and incubation benefits are available. However, LLPs cannot issue ESOPs, which limits talent acquisition in later stages. If you're an LLP considering Startup Odisha, evaluate conversion to Pvt Ltd for scaling.",
  },
  {
    number: "03",
    title: "Registered Partnership Firm",
    text: "Firms registered under the Indian Partnership Act, 1932 with a registered office in Odisha are eligible. For the capital subsidy, the firm must have a minimum capital investment and meet employment generation criteria. Note: sole proprietorships are NOT eligible for Startup Odisha recognition.",
  },
  {
    number: "04",
    title: "Technology Startup",
    text: "Technology-sector startups (IT/ITES, SaaS, AI/ML, IoT, drone tech, fintech) are prioritised under Startup Odisha. STPI Bhubaneswar offers dedicated T-Hub incubation space for tech startups. Technology startups may also qualify for additional STPI scheme benefits and export incentives alongside Startup Odisha recognition.",
  },
  {
    number: "05",
    title: "Agri-Tech / Rural Startup",
    text: "Under the Odisha Startup Policy 2022, agri-tech and rural innovation startups serving the state's farming community get priority access to government agri-procurement schemes and NABARD-linked funding. Startups working on fisheries, aquaculture, organic farming, and post-harvest technology are particularly encouraged.",
  },
  {
    number: "06",
    title: "Social Enterprise / Impact Startup",
    text: "Startups focused on social impact — healthcare access, education, clean water, sanitation, or women empowerment — can register under Startup Odisha and access impact-linked grants from the state government. These startups may also qualify for CSR funding from Odisha-based PSUs like NALCO, NTPC, and SAIL under government mandate.",
  },
];

const StartupOdishaTypes = () => {
  return (
    <section className="cpvt-section">
      <div className="cpvt-container">

        <h2 className="cpvt-title">Entities &amp; Sectors Eligible for Startup Odisha</h2>

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

export default StartupOdishaTypes;
