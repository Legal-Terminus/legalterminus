import React, { useState } from "react";
import "./PFRfaq.css";

const faqs = [
  {
    question: "How many persons are required to form a Partnership Firm?",
    answer: "Minimum 2 persons are required to form a Partnership Firm and there is an upper cap of 20 persons.",
  },
  {
    question: "Why should I choose to register a Partnership Firm?",
    answer: "A Partnership Firm is very easy to form due to its minimal registration requirement and it requires only a Partnership Deed to incorporate.",
  },
  {
    question: "How can I create / form a Partnership Firm?",
    answer: "In India a Partnership Firm can be formed through a Partnership Deed duly notarised by a Notary Public.",
  },
  {
    question: "What is the Stamp duty amount for execution of a Partnership Deed?",
    answer: "The Partnership Deed needs to be executed with Rs. 200/- Stamp Paper in India. The denomination may vary from state to state.",
  },
  {
    question: "Can I choose any name for my Partnership Firm?",
    answer: "The partners can choose any business name as per their wish. However, the business name should not be the same as a registered trademark.",
  },
  {
    question: "Can I restrict others from using my Partnership Firm's name?",
    answer: "No, the Partnership Firm cannot restrict any other person from using its business name, unless it gets its name registered under the Trade Mark Act.",
  },
  {
    question: "What are the Income Tax implications on a Partnership Firm?",
    answer: "Income earned by the Partnership Firm is taxed in the hands of the firm itself at a flat rate of 30% (surcharge and cess extra). The partner's share of profit is exempt from tax and interest on capital is exempt up to a certain limit.",
  },
  {
    question: "To what extent is the liability of a Partnership Firm limited?",
    answer: "The liability of a Partnership Firm and its Partners is unlimited in the eyes of Law. Each partner is jointly and severally liable for the debts of the firm.",
  },
  {
    question: "What is the procedure to register a Partnership Firm?",
    answer: (
      <div>
        <p>The broad process of registering a Partnership Firm involves the following steps:</p>
        <ol>
          <li>Step 1 — Provision of requisite documents/information to us</li>
          <li>Step 2 — Preparation of draft Partnership Deed</li>
          <li>Step 3 — Execution &amp; Notarisation of Partnership Deed with requisite Stamp Duty</li>
          <li>Step 4 — Application for PAN &amp; TAN of the firm</li>
        </ol>
      </div>
    ),
  },
  {
    question: "How long does it take to form a Partnership Firm?",
    answer: "The process of formation of a Partnership Firm can take anywhere between 5 to 7 working days, subject to submission of correct information and complete documentation.",
  },
  {
    question: "How can Legal Terminus help you register a Partnership Firm?",
    answer: "Legal Terminus can help you with registration of a Partnership Firm in a hassle-free manner within a reasonable time span and for a competitive professional fee. Book a free telephonic consultation with one of our experts to get started.",
  },
];

const PFRFaq = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="pfr-faq-section">
      <div className="pfr-faq-container">

        {/* Centered heading & subheading */}
        <div className="pfr-faq-header">
          <h2 className="pfr-faq-title">Partnership Firm Registration — FAQs</h2>
          <p className="pfr-faq-intro">
            Got questions? We've got answers — clear, accurate, and straight to the point.
          </p>
        </div>

        {/* Full-width staggered FAQ accordion */}
        <div className="pfr-faq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`pfr-faq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="pfr-faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`pfr-faq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`pfr-faq-answer ${isActive ? "open" : ""}`}>
                  <div className="pfr-faq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default PFRFaq;
