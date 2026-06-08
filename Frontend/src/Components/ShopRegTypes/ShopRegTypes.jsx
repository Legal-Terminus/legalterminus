import React from "react";
import "./ShopRegTypes.css";

const types = [
  {
    number: "01",
    title: "Retail Shops",
    text: "Any establishment that sells goods directly to consumers — grocery stores, clothing outlets, pharmacies, electronics shops, and all other retail units — must register under the Shop & Establishment Act, regardless of their size or the number of employees.",
  },
  {
    number: "02",
    title: "Commercial Offices & Professional Establishments",
    text: "Offices of chartered accountants, lawyers, architects, consultancies, IT companies, NBFCs, and other professional service providers are covered under 'commercial establishments' and require mandatory registration under the Act.",
  },
  {
    number: "03",
    title: "Restaurants, Hotels & Cafes",
    text: "All food-service establishments — restaurants, dhabas, cafes, cloud kitchens, and hotels — must register under the Act. The certificate is also a prerequisite for obtaining FSSAI and Local Body trade licences.",
  },
  {
    number: "04",
    title: "Warehouses, Godowns & Storage Facilities",
    text: "Warehouses and godowns used for commercial storage are classified as establishments under the Act. This includes e-commerce fulfilment centres, logistics hubs, and cold-storage units in municipal areas.",
  },
  {
    number: "05",
    title: "Theatres, Cinema Halls & Entertainment Venues",
    text: "Cinemas, theatres, amusement parks, and other places of public entertainment are explicitly covered under the Shop & Establishment Act and require registration before commencing operations.",
  },
  {
    number: "06",
    title: "Residential Hotels, Guest Houses & Lodges",
    text: "Residential hotels, paying guest accommodations, guest houses, and boarding lodges are covered under the Act. The registration is mandatory and is typically required before applying for a trade licence from the municipality.",
  },
];

const ShopRegTypes = () => {
  return (
    <section className="shoptype-section">
      <div className="shoptype-container">
        <h2 className="shoptype-title">Types of Establishments Covered under the Shop &amp; Establishment Act</h2>
        <div className="shoptype-cards">
          {types.map((type) => (
            <div className="shoptype-card" key={type.number}>
              <div className="shoptype-number">{type.number}</div>
              <h3 className="shoptype-card-title">{type.title}</h3>
              <p className="shoptype-card-text">{type.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopRegTypes;
