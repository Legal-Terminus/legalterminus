import React, { useState } from "react";
import "./FoodLicenseFAQ.css";

const faqs = [
  {
    question: "What changed in FSSAI licensing from 1 April 2026?",
    answer:
      "The revised FSSAI rules effective from 1 April 2026 increased the turnover limits for different license categories. Small food businesses now qualify for Basic Registration up to a higher turnover limit, reducing compliance costs for many businesses. State and Central License thresholds were also revised. However, all food businesses still need some form of FSSAI registration or license depending on their activity and turnover.",
  },
  {
    question: "Which FSSAI plan is right for my business?",
    answer:
      "Elemental (₹999) – Suitable for tea stalls, hawkers, small snack vendors, and petty food sellers with simple documentation needs.\nEnriched (₹2,999) – Best for home bakers, tiffin services, small food manufacturers, food trucks, and kirana food sellers.\nSupreme (₹3,999) – Suitable for restaurants, hotels, distributors, and medium-sized food manufacturers operating within one state.\nSupreme Plus (₹7,999) – Recommended for importers, exporters, e-commerce food businesses, multi-state operations, and large food businesses requiring a Central License.",
  },
  {
    question: "Who needs an FSSAI License or Registration?",
    answer:
      "Every Food Business Operator (FBO) in India needs FSSAI registration or license. This includes restaurants, cloud kitchens, home bakers, food manufacturers, food delivery businesses, retailers, wholesalers, transporters, importers, exporters, and food sellers on online platforms.",
  },
  {
    question: "How is your pricing different from government fees?",
    answer:
      "Our fee covers consultation, documentation, application drafting, portal filing, follow-up, and support. Government fees are charged separately by FSSAI based on your license category and validity period.",
  },
  {
    question: "How long does it take to get an FSSAI License?",
    answer:
      "Basic Registration usually takes around 7–10 working days.\nState License may take around 15–20 working days.\nCentral License generally takes 20–30 working days depending on inspection and approval timelines.",
  },
  {
    question: "What is the validity period of an FSSAI License?",
    answer:
      "An FSSAI License or Registration can be obtained for 1 to 5 years, depending on the option selected during application. Renewal should be filed before expiry to avoid penalties or cancellation.",
  },
  {
    question: "Do cloud kitchens and online food businesses need an FSSAI License?",
    answer:
      "Yes. Cloud kitchens, Swiggy / Zomato sellers, food businesses on Amazon or Blinkit, and businesses selling food through websites or apps must obtain an FSSAI License.",
  },
  {
    question: "Is FSSAI mandatory for home bakers and small food businesses?",
    answer:
      "Yes. Even small or home-based food businesses require at least Basic FSSAI Registration if they are selling food commercially.",
  },
  {
    question: "What is the FoSCoS portal?",
    answer:
      "FoSCoS (Food Safety Compliance System) is FSSAI's official online portal used for registration, licensing, renewal, modification, and annual return filing.\nOfficial Portal: https://foscos.fssai.gov.in",
  },
  {
    question: "What happens if I operate without an FSSAI License?",
    answer:
      "Running a food business without an FSSAI License can attract penalties, business closure, and legal action under the Food Safety and Standards Act, 2006.",
  },
  {
    question: "Is inspection required for FSSAI License approval?",
    answer:
      "In many State and Central License cases, FSSAI authorities may conduct a physical inspection of the premises before approval. Proper hygiene, storage, and food safety practices are important for smooth approval.",
  },
  {
    question: "Do restaurants and cafes need a Central or State License?",
    answer:
      "It depends on turnover, business size, and operational model. Small restaurants generally require a State License, while large chains, multi-state operations, and certain specialised businesses may require a Central License.",
  },
  {
    question: "Can I modify my FSSAI License later?",
    answer:
      "Yes. Business name, address, product category, turnover, contact details, and other information can be updated later through modification applications on the FoSCoS portal.",
  },
  {
    question: "Does an FSSAI License help in getting business partnerships and online listings?",
    answer:
      "Yes. Most food delivery platforms, supermarkets, distributors, and institutional buyers ask for a valid FSSAI License before onboarding a food business.",
  },
  {
    question: "How can Legal Terminus help with FSSAI Food License Registration?",
    answer:
      "Legal Terminus helps businesses across India with complete FSSAI Registration and Licensing support — from selecting the correct license category to preparing documents, filing applications on the FoSCoS portal, handling queries, and tracking approval status. Our team assists restaurants, cloud kitchens, home bakers, manufacturers, distributors, importers, exporters, and online food businesses with smooth and hassle-free compliance support. We also provide renewal reminders, modification support, and guidance for inspection readiness to help businesses stay compliant without delays.",
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
                  <div className="opcfaq-answer-content" style={{ whiteSpace: "pre-line" }}>{item.answer}</div>
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
