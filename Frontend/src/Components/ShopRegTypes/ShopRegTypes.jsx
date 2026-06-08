import React from "react";
import "../CopyPvtTypes/CopyPvtTypes.css";

const types = [
  {
    number: "01",
    title: "Retail Shop Registration",
    text: "Standalone shops, retail outlets, kiranas, mobile shops, garment stores, electronics stores, pharmacies, etc. The most common SHOP & ESTABLISHMENT category. Triggered the day you open the shop / commercial premises. Registration may be linked to local municipal Trade Licence depending on the state.",
  },
  {
    number: "02",
    title: "Office / Commercial Establishment",
    text: "Offices of professionals (CAs, CSs, lawyers, doctors), consultancies, marketing agencies, IT firms, BPO / KPO, advertising agencies, design studios, etc. Even a single-person home office often qualifies for SHOP & ESTABLISHMENT in major states. Required for bank account, vendor KYC, and most enterprise contracts.",
  },
  {
    number: "03",
    title: "Restaurant / Eating House / Hotel",
    text: "Restaurants, cafes, bakeries, food courts, banquet halls, hotels, lodges, resorts. Covered under SHOP & ESTABLISHMENT PLUS additional licences (FSSAI, Trade Licence, Liquor Licence if applicable, Police Licence in some states). SHOP & ESTABLISHMENT is the labour-compliance gateway.",
  },
  {
    number: "04",
    title: "Cinema / Theatre / Place of Public Amusement",
    text: "Cinemas, theatres, amusement parks, event halls, gaming centres, gyms (in some states). Covered under SHOP & ESTABLISHMENT with additional state-specific entertainment / Public Amusement Licence overlays.",
  },
  {
    number: "05",
    title: "IT / Software / Tech Establishment",
    text: "IT services, SaaS firms, software development companies, fintech, deeptech. Most states classify these as Commercial Establishments. Required for bank account, vendor enterprise contracts, marketplace onboarding (Amazon / Flipkart / Meesho seller KYC).",
  },
  {
    number: "06",
    title: "Bank / Insurance / NBFC Branch",
    text: "Bank branches, insurance offices, NBFC branches, broker-dealer offices. Each branch requires its own SHOP & ESTABLISHMENT Registration in the respective state — even if the parent entity is registered. Compliance is generally stricter due to RBI / SEBI overlay.",
  },
];

const ShopRegTypes = () => {
  return (
    <section className="cpvt-section">
      <div className="cpvt-container">
        <h2 className="cpvt-title">Types of Shop &amp; Commercial Establishments Registration in India</h2>
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

export default ShopRegTypes;
