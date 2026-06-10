import React, { useState } from "react";
import "./TradeLicenseFAQ.css";

const faqs = [
  {
    question: "What is a Trade License and who issues it?",
    answer:
      "A Trade License is an approval issued by the local Municipal Corporation or Urban Local Body that allows a business to operate from a specific commercial premises. It is regulated under the respective State Municipal Laws and is generally required for shops, offices, restaurants, warehouses, clinics, factories, salons, and most commercial establishments.",
  },
  {
    question: "Is Trade License the same as Shop & Establishment Registration?",
    answer:
      "No. Both are different registrations issued by different departments. A Trade License is issued by the Municipal Corporation for permission to carry on a business activity from a premises. Shop & Establishment Registration is issued by the State Labour Department and regulates employee working conditions, holidays, and labour compliance. Many businesses may require both registrations.",
  },
  {
    question: "Who needs a Trade License?",
    answer:
      "Any person or business carrying on commercial activity from a physical premises may require a Trade License. This includes retail shops, restaurants, cloud kitchens, offices, gyms, clinics, warehouses, hotels, workshops, salons, manufacturing units, and service businesses.",
  },
  {
    question: "Is Trade License mandatory for home-based or online businesses?",
    answer:
      "In many cities, yes. Even online businesses or home offices may require a Trade License if commercial activity is being conducted from the premises. Rules vary from city to city, so we verify the applicability based on your business activity and location.",
  },
  {
    question: "How much does Trade License Registration cost?",
    answer: (
      <div>
        <p>Trade License cost has two parts:</p>
        <ul>
          <li>Professional Fee – charged for documentation, filing, coordination, and support</li>
          <li>Municipal Fee – charged by the local authority based on city, business type, area, and category</li>
        </ul>
        <p>Municipal fees vary widely depending on the location and nature of business.</p>
      </div>
    ),
  },
  {
    question: "How long does Trade License Registration take?",
    answer:
      "In most cities, general trade licenses are issued within 10–15 working days. Businesses requiring physical inspection — such as restaurants, manufacturing units, clinics, hotels, or hazardous trades — may take 20–30 working days depending on municipal inspection schedules.",
  },
  {
    question: "Why is selecting the correct trade category important?",
    answer:
      "Every Municipal Corporation has separate categories for different businesses. Filing under the wrong category can lead to rejection, penalties, cancellation, or fresh application requirements. We help identify the correct category before filing.",
  },
  {
    question: "Does the Municipal Corporation inspect the premises?",
    answer:
      "For many general businesses, licenses may be issued online without inspection. However, food businesses, factories, clinics, warehouses, hotels, and hazardous trades usually require physical inspection by municipal or fire authorities before approval.",
  },
  {
    question: "How long is a Trade License valid?",
    answer:
      "In most cities, a Trade License is valid for one financial year and must be renewed annually. Some Municipal Corporations issue multi-year licenses depending on the category and local rules.",
  },
  {
    question: "What happens if I do not renew my Trade License?",
    answer:
      "Late renewal may attract penalties, additional fees, or cancellation of the license. In some cases, the Municipal Corporation may issue notices or seal the premises for non-compliance.",
  },
  {
    question: "Can I operate a business without a Trade License?",
    answer:
      "Operating without a valid Trade License may lead to penalties, sealing of premises, utility disconnection, or municipal action under the applicable State Municipal Act. It is always advisable to obtain the required approvals before starting operations.",
  },
  {
    question: "Can one Trade License cover multiple branches?",
    answer:
      "Generally, no. Separate branches or business premises usually require separate Trade Licenses from the respective Municipal Corporation or local authority.",
  },
  {
    question: "What documents are usually required for Trade License Registration?",
    answer: (
      <div>
        <p>Commonly required documents include:</p>
        <ul>
          <li>PAN Card of applicant/entity</li>
          <li>Aadhaar Card or ID proof</li>
          <li>Address proof of business premises</li>
          <li>Rent Agreement or Ownership Proof</li>
          <li>Electricity Bill or Property Tax Receipt</li>
          <li>Passport-size photograph</li>
          <li>NOC from owner (if rented premises)</li>
          <li>Business incorporation documents (if company/LLP)</li>
        </ul>
        <p>Additional documents may be required depending on the business category.</p>
      </div>
    ),
  },
  {
    question: "Is Trade License required for GST Registration or current account opening?",
    answer:
      "Many banks, marketplaces, municipal authorities, and government departments ask for a valid Trade License as address and business proof. It also supports smoother GST registration and vendor onboarding in many cases.",
  },
  {
    question: "How can Legal Terminus help with Trade License Registration in India?",
    answer:
      "Legal Terminus provides complete support for Trade License Registration in India — including business category identification, document preparation, municipal portal filing, inspection coordination, query handling, renewal tracking, and amendment support. We assist businesses across multiple cities and help ensure smooth and compliant registration from start to finish.",
  },
];

const TradeLicenseFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="tradefaq-section">
      <div className="tradefaq-container">

        <div className="tradefaq-header">
          <h2 className="tradefaq-title">Trade License Registration FAQ&apos;s</h2>
          <p className="tradefaq-intro">
            Here, we’ve answered some of the most common questions about Trade
            License registration, process, and documentation to guide you
            through every step confidently.
          </p>
        </div>

        <div className="tradefaq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`tradefaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="tradefaq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`tradefaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`tradefaq-answer ${isActive ? "open" : ""}`}>
                  <div className="tradefaq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default TradeLicenseFAQ;
