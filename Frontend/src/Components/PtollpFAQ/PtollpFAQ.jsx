import React, { useState } from "react";
import "./PtollpFAQ.css";

const faqs = [
  {
    question: "Can a Partnership Firm be converted into an LLP?",
    answer:
      "Yes. A Partnership Firm can be converted into an LLP under Section 55 and the Second Schedule of the LLP Act, 2008. The conversion is done by filing Form 17 and Form FiLLiP on the MCA portal. After approval, the firm receives a new LLP Certificate of Incorporation.",
  },
  {
    question: "Is newspaper publication or URC-2 required for Partnership to LLP Conversion?",
    answer:
      "No. Partnership to LLP Conversion does not require newspaper publication, URC-1, or URC-2. There is also no 21-day objection window. The process is simpler and faster compared to conversion into a Private Limited Company.",
  },
  {
    question: "What is the difference between Partnership to LLP Conversion and Partnership to Private Limited Conversion?",
    answer:
      "Partnership to LLP Conversion is governed by the LLP Act, 2008 and involves Form 17 and FiLLiP filing only. Partnership to Private Limited Conversion is governed by the Companies Act, 2013 and requires URC-1 filing, newspaper publication, and additional compliance steps. LLP conversion is generally quicker and involves lighter compliance.",
  },
  {
    question: "Can new partners be added during the conversion process?",
    answer:
      "No. At the time of conversion, all existing partners of the Partnership Firm must become partners of the LLP, and no new person can be added during the conversion filing. Any retirement or admission of partners should be completed before or after conversion.",
  },
  {
    question: "Is registration of the Partnership Firm mandatory before LLP conversion?",
    answer:
      "Registration is strongly recommended. Although some unregistered firms may also apply, registered firms usually face fewer ROC queries and smoother processing during conversion.",
  },
  {
    question: "What documents are required for Partnership to LLP Conversion?",
    answer:
      "The common documents required are PAN, Aadhaar, photographs of partners, Partnership Deed, office address proof, bank statement or utility bill, consent of partners, and a CA-certified Statement of Accounts. Additional documents may be required depending on the business.",
  },
  {
    question: "How long does Partnership to LLP Conversion take?",
    answer:
      "Normally, the process takes around 15–20 working days, subject to proper documentation and MCA approval timelines.",
  },
  {
    question: "What happens to the firm's assets and liabilities after conversion?",
    answer:
      "After conversion, all assets, liabilities, contracts, rights, and business operations automatically transfer to the LLP by operation of law. The LLP becomes the legal successor of the Partnership Firm.",
  },
  {
    question: "Will PAN and GST change after LLP conversion?",
    answer:
      "Yes. Since the LLP becomes a separate legal entity, a new PAN is issued. GST registration, bank accounts, and other business registrations may also need to be updated or migrated to the LLP.",
  },
  {
    question: "Is audit mandatory for an LLP?",
    answer:
      "Audit is required only if the LLP's annual turnover exceeds ₹40 lakh or the capital contribution exceeds ₹25 lakh. Otherwise, audit is generally not mandatory.",
  },
  {
    question: "Can the business name remain the same after conversion?",
    answer:
      "Yes. In most cases, the existing business name can continue with the addition of 'LLP', subject to MCA approval.",
  },
  {
    question: "Why do businesses prefer LLP over a Private Limited Company?",
    answer:
      "LLP is preferred by many professional firms and family businesses because it offers limited liability protection with lower compliance requirements. There is no mandatory AGM, and annual compliance is simpler compared to a Private Limited Company.",
  },
  {
    question: "How can Legal Terminus help with Partnership to LLP Conversion?",
    answer:
      "Legal Terminus provides complete end-to-end hassle-free support for Partnership to LLP Conversion, including eligibility review, name reservation, drafting and filing of Form 17 and FiLLiP, LLP Agreement drafting, ROC query handling, PAN and incorporation support, and post-conversion compliance assistance. Our team ensures smooth and priority-based filing through the official MCA portal.",
  },
];

const PtollpFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Partnership to LLP — FAQs</h2>
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

export default PtollpFAQ;
