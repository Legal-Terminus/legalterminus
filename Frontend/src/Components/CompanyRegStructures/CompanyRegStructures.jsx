import React from "react";
import "./CompanyRegStructures.css";

const TYPES = [
  {
    title: "Private Limited Company",
    text: "A private limited company is a popular choice for a corporate business structure in India. The company has a separate legal identity, and there is separation of ownership and management.",
  },
  {
    title: "Public Limited Company",
    text: "A public limited company is the most transparent form of corporate business structure. It’s a popular choice for businesses because it allows shares to be easily bought and sold, and it’s seen as trustworthy by investors.",
  },
  {
    title: "One Person Company",
    text: "A one person company (OPC) is a type of small business where there’s only one owner, and their liability is limited to their shares. It’s become a popular choice for solo business owners in India.",
  },
  {
    title: "Limited Liability Partnership",
    text: "An LLP is the simplest business structure to set up in India. It offers limited liability to owners and has fewer compliance requirements compared to other corporate structures.",
  },
];

const CompanyRegStructures = () => {
  return (
    <section className="crst-section">
      <div className="crst-container">
        <h2 className="crst-title">Types of Company Registration</h2>
        <p className="crst-subtitle">
          We help you choose the right business structure and assist in the documentation and filing process.
        </p>

        <div className="crst-grid">
          {TYPES.map((t) => (
            <div className="crst-card" key={t.title}>
              <h3 className="crst-card-title">{t.title}</h3>
              <p className="crst-card-text">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyRegStructures;
