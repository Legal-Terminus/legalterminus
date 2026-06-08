import React, { useState } from "react";
import "./ShopRegFAQ.css";

const faqs = [
  {
    question: "Is Shop & Establishment Registration mandatory for all businesses?",
    answer:
      "Yes. Shop & Establishment registration is mandatory for every organisation operating as a shop, commercial establishment, hotel, restaurant, theatre, or place of public entertainment in municipal areas — irrespective of size or number of employees. Exemptions (hospitals, educational institutions, government establishments) vary by state.",
  },
  {
    question: "Which law governs Shop & Establishment Registration in Odisha?",
    answer:
      "In Odisha, the Odisha Shops & Commercial Establishments Act, 1956 governs registrations. Each state has its own Act — for example, the Maharashtra Shops and Establishments (Regulation of Employment and Conditions of Service) Act, 2017 applies in Maharashtra.",
  },
  {
    question: "What is the government fee for Shop & Establishment Registration?",
    answer:
      "In Odisha, the government fee is capped at approximately ₹600 per branch per year and is based on the number of employees. Fees differ by state — some charge a flat fee, others charge based on employee count or type of establishment.",
  },
  {
    question: "How long does it take to get the registration certificate?",
    answer:
      "In most states with online portals, the registration certificate is issued within 7–8 working days after submission of a complete and accurate application. States without online portals may require a physical visit and can take up to 15 working days.",
  },
  {
    question: "Does a home-based business need Shop & Establishment Registration?",
    answer:
      "It depends on the state. In most states, businesses operating exclusively from a residence (home) with no commercial signage or employees may be exempt. However, if you have employees working from your home or display a signboard, registration is typically required. Consult our expert to confirm applicability for your state.",
  },
  {
    question: "Is Shop & Establishment Registration needed for each branch separately?",
    answer:
      "Yes. Each branch located at a separate premises — even in the same city — requires its own individual Shop & Establishment registration. The certificate is premises-specific, not entity-specific.",
  },
  {
    question: "What happens if I operate without registration?",
    answer:
      "Operating without a valid Shop & Establishment certificate is a punishable offence. Penalties include fines per day of default and, in cases of repeated non-compliance, directed closure by the local authority or labour department. Banks may also reject your current account application without the certificate.",
  },
  {
    question: "Does the registration need to be renewed annually?",
    answer:
      "Yes. Annual renewal is mandatory under most state Shop & Establishment Acts. Failure to renew on time attracts late fees. Our Supreme plan includes renewal reminders to ensure you never miss the deadline.",
  },
  {
    question: "Can Legal Terminus handle registrations across multiple states?",
    answer: (
      <span>
        Yes. Legal Terminus handles Shop &amp; Establishment registrations across multiple Indian states. Our team is familiar with state-specific procedures, portals, and document requirements. Contact us for a multi-state registration quote.
      </span>
    ),
  },
  {
    question: "How can Legal Terminus help with Shop & Establishment Registration?",
    answer: (
      <span>
        Legal Terminus handles the complete process, including:
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>Customised document checklist for your state</li>
          <li>Document verification and application preparation</li>
          <li>Online filing with the local authority</li>
          <li>Government fee coordination</li>
          <li>Certificate delivery + annual renewal reminders</li>
        </ul>
      </span>
    ),
  },
];

const ShopRegFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="shopfaq-section">
      <div className="shopfaq-container">

        <div className="shopfaq-header">
          <h2 className="shopfaq-title">Shop &amp; Establishment Registration — FAQs</h2>
          <p className="shopfaq-intro">
            Got questions? We've got answers — straight, no-BS, legally accurate.
          </p>
        </div>

        <div className="shopfaq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`shopfaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="shopfaq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`shopfaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`shopfaq-answer ${isActive ? "open" : ""}`}>
                  <div className="shopfaq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ShopRegFAQ;
