import React from "react";
import "../OPCFeatures/OPCFeatures.css";

const types = [
  {
    number: "01",
    title: "Factory Establishments in Odisha",
    text: "Manufacturing units, workshops, food processors, garment makers, mineral / steel-allied industrial units in Odisha covered under the Factories Act, 1948 plus OLWF Act. Coverage from 5 workers. Common across Odisha's industrial belts (Bhubaneswar, Cuttack, Rourkela, Angul, Jajpur).",
  },
  {
    number: "02",
    title: "Shop & Commercial Establishments in Odisha",
    text: "Retail outlets, offices, restaurants, hotels, cinemas, banks (branch-level), and other commercial establishments in Odisha covered under the Odisha Shops & Commercial Establishments Act + OLWF Act. Coverage from 5 workers. The most common category.",
  },
  {
    number: "03",
    title: "IT / BPO / KPO Establishments in Odisha",
    text: "IT services firms, BPO / KPO outfits, software companies operating from Odisha (especially Bhubaneswar's IT corridor). Covered as commercial establishments under OLWF. Worker count includes all on-roll employees + outsourced staff where applicable.",
  },
  {
    number: "04",
    title: "Hotels / Hospitality Establishments in Odisha",
    text: "Hotels, restaurants, banquet halls, resorts, tourism establishments in Odisha (Puri, Konark, Bhubaneswar, Cuttack, tourism circuits). Covered as commercial establishments under OLWF. Higher worker churn typical — keep worker list updated.",
  },
  {
    number: "05",
    title: "Construction / Real Estate Establishments",
    text: "Construction companies, real estate developers, infrastructure contractors operating in Odisha. Note: Construction workers are covered separately under the BOCW Welfare Cess (different framework); the establishment itself is covered under OLWF for non-construction-worker staff.",
  },
  {
    number: "06",
    title: "Mining / Mineral-Allied Establishments",
    text: "Mining companies, mineral processing units, mineral-allied service providers operating in Odisha's mining belt. Covered under OLWF for office / supervisory / non-mining-worker staff. Mining workers may have separate coverage under specific mining welfare frameworks.",
  },
];

const OLWFFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of OLWF Registration</h2>

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

export default OLWFFeatures;
