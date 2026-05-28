import React, { useState } from "react";
import "./OPCFAQ.css";

const faqs = [
  {
    question: "How many persons are required to form a One Person Company?",
    answer: "Only one person is required to form a One Person Company.",
  },
  {
    question: "How many Directors are required to form a One Person Company?",
    answer: "Minimum one director is required in a One Person Company, with an upper cap of 15 directors.",
  },
  {
    question: "Who are Directors of the company?",
    answer: "Directors are officers of the company who are responsible for managing the company and making decisions as to its operation on a day-to-day basis, for the benefit of the shareholder.",
  },
  {
    question: "What is a company shareholder?",
    answer: "Shareholders are the owners of companies limited by shares. In an OPC there is only one shareholder who represents the sole owner of the company. They hold shares to show ownership and are not involved in day-to-day management.",
  },
  {
    question: "How much capital is required to incorporate a One Person Company?",
    answer: "An OPC can be incorporated with any amount of capital — there is no lower or upper limit. Government fees are relaxed for incorporation up to an Authorised Capital of Rs. 15,00,000/-. Stamp duty varies from state to state.",
  },
  {
    question: "What is the time period within which a One Person Company can be incorporated?",
    answer: "The process of incorporating a One Person Company can take anywhere between 15 to 20 working days, subject to submission of correct information and complete documentation.",
  },
  {
    question: "Is it possible to convert an OPC into a Private Limited Company?",
    answer: "Yes, an OPC can be voluntarily converted into a Private Limited Company after two years from the date of incorporation, or mandatorily when its paid-up capital exceeds Rs. 50 lakhs or its average turnover exceeds Rs. 2 crore.",
  },
  {
    question: "Who can be a Nominee in an OPC?",
    answer: "Only a natural person who is an Indian citizen and resident in India can be a nominee in an OPC. A minor cannot be a nominee.",
  },
  {
    question: "How Legal Terminus can help you incorporate a One Person Company in India?",
    answer: "Legal Terminus can help you with incorporation of a One Person Company in a hassle-free manner within a reasonable time span and at competitive professional fees. Book a free telephonic appointment with one of our consultants to know more.",
  },
];

const OPCFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">One Person Company Registration — FAQs</h2>
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

export default OPCFAQ;
