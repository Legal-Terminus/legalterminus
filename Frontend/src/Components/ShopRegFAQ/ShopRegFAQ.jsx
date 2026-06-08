import React, { useState } from "react";
import "../PvtltdFAQ/PvtltdFAQ.css";

const faqs = [
  {
    question: "What is Shop & Establishment Registration?",
    answer:
      "Shop & Establishment Registration is a state-level labour law registration required for businesses operating from commercial establishments such as shops, offices, restaurants, startups, hotels, IT companies, consultancies, and other business premises. The registration is governed by the respective State Shop & Establishment Act and helps regulate working conditions, employee records, holidays, working hours, and other labour-related requirements.",
  },
  {
    question: "Is Shop & Establishment Registration mandatory in every state?",
    answer:
      "Yes, but the rules, applicability, fees, and validity period differ from state to state. Every state in India has its own Shop & Establishment Act and registration process. Businesses operating in multiple states may require separate registrations for each state or branch location.",
  },
  {
    question: "Who should apply for Shop & Establishment Registration?",
    answer:
      "Most commercial establishments, including proprietorships, partnership firms, LLPs, private limited companies, freelancers, consultants, startups, retail shops, and online businesses operating from a commercial premises generally require Shop & Establishment Registration, subject to the applicable state laws.",
  },
  {
    question: "Is Shop & Establishment Registration required for online businesses or home offices?",
    answer:
      "In many states, yes. If you are operating a business from a fixed place, including a home office, coworking space, or commercial premises, Shop & Establishment Registration may be required depending on the applicable state rules and business activities.",
  },
  {
    question: "Is Shop & Establishment Registration the same as a Trade Licence?",
    answer:
      "No. Shop & Establishment Registration and Trade Licence are different registrations issued under different laws and authorities. Shop & Establishment Registration is generally issued under the State Labour Department, whereas a Trade Licence is usually issued by the local Municipal Authority or Corporation.",
  },
  {
    question: "How much does Shop & Establishment Registration cost?",
    answer:
      "Government fees vary from state to state and may depend on employee count, nature of business, and validity period. Our professional fee covers advisory, application preparation, filing assistance, and registration support. Any applicable government fee is charged separately on actuals.",
  },
  {
    question: "How long does Shop & Establishment Registration take?",
    answer:
      "The registration process generally takes around 5–10 working days, depending on the state, document verification process, and Labour Department portal timelines.",
  },
  {
    question: "Is renewal required for Shop & Establishment Registration?",
    answer:
      "The validity and renewal requirements depend on the respective state laws. Some states provide lifetime registration, while others require annual or periodic renewal. We provide renewal reminder support based on the applicable state requirements.",
  },
  {
    question: "Do I need separate registration for multiple branches?",
    answer:
      "In most cases, yes. Separate Shop & Establishment Registration may be required for each business location or branch, even within the same state, depending on the applicable state rules.",
  },
  {
    question: "What documents are generally required for Shop & Establishment Registration?",
    answer:
      "The required documents generally include business address proof, identity proof of the proprietor/directors/partners, PAN card, business incorporation documents (if applicable), employee details, and utility bills or rent agreement of the business premises.",
  },
  {
    question: "How can Legal Terminus help with Shop & Establishment Registration?",
    answer:
      "Legal Terminus provides complete assistance for Shop & Establishment Registration across different Indian states, including document preparation, Labour Department filing, registration certificate support, and post-registration guidance. We also assist with profile updates, amendment support, and renewal reminders through dedicated professional support and transparent pricing.",
  },
];

const ShopRegFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="faq-section">
      <div className="faq-container">

        <div className="faq-header">
          <h2 className="faq-title">Shop &amp; Establishment Registration — FAQs</h2>
          <p className="faq-intro">
            Answers to the most asked questions about Shop &amp; Establishment Registration, compliance, eligibility, and process in India.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`faq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`faq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`faq-answer ${isActive ? "open" : ""}`}>
                  <div className="faq-answer-content">{item.answer}</div>
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
