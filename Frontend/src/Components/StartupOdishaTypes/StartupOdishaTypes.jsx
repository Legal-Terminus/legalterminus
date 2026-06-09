import React from "react";
import "../CopyPvtTypes/CopyPvtTypes.css";

const types = [
  {
    number: "01",
    title: "IT / SaaS / Software Startup",
    text: "Software platforms, SaaS products, IT services with proprietary tech, AI / ML applications, fintech, deeptech. Often headquartered in Bhubaneswar / Cuttack. Innovation framing around proprietary tech / IP / data moat. Strong fit with Odisha's IT Policy alignment.",
  },
  {
    number: "02",
    title: "Agri / Aqua / Fishery Startup",
    text: "Agri-input platforms, farm management SaaS, drone-as-a-service for agriculture, agri-finance, FPO-tech, aquaculture, marine fisheries, post-harvest tech. Strong sectoral priority for Odisha given coastal + agrarian economy. Often pairs well with state agri-schemes.",
  },
  {
    number: "03",
    title: "Handloom / Handicraft / Tribal Startup",
    text: "Sambalpuri textiles, Pattachitra art, silver filigree, tribal craft enterprises, brand-led handloom D2C. State priority sector. Innovation framing around supply chain digitisation, brand IP, market access, weaver empowerment.",
  },
  {
    number: "04",
    title: "Tourism / Hospitality Startup",
    text: "Tourism tech, homestay platforms, eco-tourism, religious tourism (Jagannath circuit, Konark), wildlife tourism (Similipal, Bhitarkanika), MICE platforms, hospitality SaaS. Aligned with Odisha Tourism Policy + state Vision 2036.",
  },
  {
    number: "05",
    title: "Manufacturing / Industrial Startup",
    text: "Steel-allied manufacturing, aluminium downstream, electronics manufacturing, automotive components, MSME-scale industrial innovation. State priority given Odisha's industrial base. Often pairs with industrial corridor schemes.",
  },
  {
    number: "06",
    title: "Climate / Renewables / Mining-Tech Startup",
    text: "Renewable energy startups, EV / mobility, climate tech, mining-tech (Odisha has significant mineral reserves), sustainability platforms. State priority alignment - Odisha is pursuing both industrial growth + climate goals.",
  },
];

const StartupOdishaTypes = () => {
  return (
    <section className="cpvt-section">
      <div className="cpvt-container">

        <h2 className="cpvt-title">Types of Startup Odisha Registration</h2>

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
