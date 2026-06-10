import React, { useState } from "react";
import "./FoodLicenseFAQ.css";

const faqs = [
  {
    question: "Who needs an FSSAI license or registration in India?",
    answer:
      "Every Food Business Operator (FBO) — including manufacturers, processors, transporters, distributors, retailers, importers, exporters, and food service operators — must obtain FSSAI registration or license before starting operations. This includes home bakers, cloud kitchens, restaurants, packaged food brands, food startups, and e-commerce food sellers.",
  },
  {
    question: "What is the difference between Basic Registration, State License, and Central License?",
    answer:
      "Basic Registration is for petty food businesses with turnover below ₹12 lakh/year. State License is for medium-sized businesses with turnover between ₹12 lakh and ₹20 crore operating within one state. Central License is for large businesses with turnover above ₹20 crore, multi-state operations, or businesses involved in import/export. The license type is determined by turnover, scale, and geographic spread.",
  },
  {
    question: "How long does FSSAI registration take?",
    answer:
      "Basic Registration is typically approved in 7–10 working days. State License takes 15–30 working days (may require premise inspection). Central License takes 30–60 working days (includes FSMS documentation and possible inspection). Delays occur if documents are incomplete or the premise inspection raises queries — we respond within 24 hours on your behalf.",
  },
  {
    question: "What is the FSSAI registration fee?",
    answer:
      "Government fees are: Basic Registration ₹100/year, State License ₹2,000–₹5,000/year depending on business type, Central License ₹7,500/year. These are in addition to Legal Terminus professional fees. Our fees cover document preparation, FoSCoS filing, government fee payment, inspection support, and license delivery.",
  },
  {
    question: "Can I operate a cloud kitchen or home food delivery business without FSSAI?",
    answer:
      "No. Cloud kitchens, ghost kitchens, and home-based food businesses are classified as FBOs under the FSS Act. Swiggy, Zomato, and EatSure require a valid FSSAI number to onboard and maintain your listing. FSSAI registration is mandatory before you accept your first order — not after you scale.",
  },
  {
    question: "Does FSSAI registration need to be renewed?",
    answer:
      "Yes. FSSAI registration and licenses must be renewed before expiry. Validity ranges from 1 to 5 years depending on what you choose at application. Late renewal attracts a penalty of ₹100 per day. Legal Terminus sends renewal reminders 90 days before expiry and handles the renewal filing on your behalf.",
  },
  {
    question: "Is a physical premise inspection mandatory for all license types?",
    answer:
      "No. Basic Registration is typically approved without inspection. State and Central licenses may involve inspection — the Designated Officer (DO) or Food Safety Officer (FSO) may visit your premises within 30 days of filing. We prepare you for the inspection with a checklist and accompany you remotely if questions arise.",
  },
  {
    question: "Can I get FSSAI registration if I operate from a rented property?",
    answer:
      "Yes. Rented premises are fully acceptable for FSSAI. You need: a notarized Rent Agreement between you and the property owner, and an NOC from the property owner permitting use of the premises for food business. We include both documents in our checklist.",
  },
  {
    question: "What happens if I operate without FSSAI registration?",
    answer:
      "Operating without FSSAI registration is a criminal offence under the Food Safety and Standards Act, 2006. Penalties include: ₹5 lakh for carrying on business without license/registration, ₹2 lakh for manufacturing/processing substandard food, and up to ₹10 lakh for unsafe food causing injury. Your products can also be seized and your business premises sealed.",
  },
  {
    question: "Can Legal Terminus help if FSSAI has raised a deficiency notice or query on my application?",
    answer:
      "Yes. If FSSAI raises a deficiency notice (common for State/Central applications), we respond within 24 hours with corrected documents or clarifications. If an inspection is scheduled, we prepare an inspection readiness checklist and walk you through what the FSO will look for. We stay with you until the license is issued.",
  },
];

const FoodLicenseFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">FSSAI Food License Registration — FAQs</h2>
          <p className="opcfaq-intro">
            Got questions? We've got answers — straight, no-BS, legally accurate.
          </p>
        </div>

        <div className="opcfaq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`opcfaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="opcfaq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`opcfaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`opcfaq-answer ${isActive ? "open" : ""}`}>
                  <div className="opcfaq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FoodLicenseFAQ;
