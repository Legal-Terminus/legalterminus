import React from "react";
import "./PublicltdFeatures.css";

const types = [
  {
    number: "01",
    title: "Listed Public Company",
    subtitle: "Stock Exchange",
    text: "These companies are registered on a stock exchange like BSE or NSE. People can buy and sell their shares during market hours. They must follow strict rules set by SEBI and other market authorities.",
  },
  {
    number: "02",
    title: "Unlisted Public Company",
    subtitle: "Privately Held",
    text: "These companies are not registered on a stock exchange. Their shares are not available for public trading. They can still issue shares to investors, but only in a limited or private way.",
  },
  {
    number: "03",
    title: "Government Public Company",
    subtitle: "State / Central Owned",
    text: "In this type, the Central or State Government owns at least 51% of the company. Many government-owned enterprises and Public Sector Undertakings (PSUs) come under this category.",
  },
  {
    number: "04",
    title: "Section 8 Company",
    subtitle: "Non-Profit / Social Purpose",
    text: "A Section 8 company is a non-profit entity created for social or charitable purposes like education, healthcare, or welfare. It can be registered as a public company, but its primary goal is service, not profit.",
  },
];

const PublicltdFeatures = () => {
  return (
    <section className="pub-types-section">
      <div className="pub-types-container">

        <h2 className="pub-types-title">Types of Public Limited Company in India</h2>

        <div className="pub-types-cards">
          {types.map((type) => (
            <div className="pub-types-card" key={type.number}>
              <div className="pub-types-number">{type.number}</div>
              <h3 className="pub-types-card-title">
                {type.title}
                {type.subtitle && (
                  <span className="pub-types-card-subtitle"> ({type.subtitle})</span>
                )}
              </h3>
              <p className="pub-types-card-text">{type.text}</p>
            </div>
          ))}
        </div>

        <p className="pub-types-note">
          <strong>Note:</strong> For most businesses, a Listed Public Company is chosen when they plan to raise funds from the public through the stock exchange. If you need guidance on the right structure,{" "}
          <strong>Book a Free Consultation</strong> and our experts will help you decide.
        </p>

      </div>
    </section>
  );
};

export default PublicltdFeatures;
