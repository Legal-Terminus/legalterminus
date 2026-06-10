import React from "react";
import "./FoodLicenseFeatures.css";

const types = [
  {
    number: "01",
    title: "FSSAI Basic Registration",
    text: "Applicable for small food businesses and petty food manufacturers with an annual turnover below ₹12 lakhs. This covers home-based food makers, small vendors, temporary stalls, hawkers, and cottage food industries. Issues a 14-digit FSSAI Registration Number. Valid for 1–5 years with renewal before expiry.",
  },
  {
    number: "02",
    title: "State FSSAI License",
    text: "Required for medium-sized food businesses with annual turnover between ₹12 lakhs and ₹20 crores, operating within a single state. Covers restaurants, hotels, food manufacturers, distributors, transporters, retailers, caterers, and food processing units. Issued by the State Food Safety Authority. Subject to inspection.",
  },
  {
    number: "03",
    title: "Central FSSAI License",
    text: "Mandatory for large food businesses with turnover above ₹20 crores, or those operating across multiple states, or involved in import/export of food products. Also required for food manufacturers supplying to defence, railways, or government canteens. Issued by the Central Licensing Authority (FSSAI HQ). Requires full FSMS compliance documentation.",
  },
];

const FoodLicenseFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of FSSAI License / Registration in India</h2>

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

export default FoodLicenseFeatures;
