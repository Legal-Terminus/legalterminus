import React, { useState } from "react";
import "./WindupPLCFAQ.css";

const faqs = [
  {
    question: "How many persons are required to form a Private Limited Company?",
    answer:
      "Minimum two persons are required to form a Private Limited Company and a maximum up to 200 persons can be a member of a single Private Limited Company.",
  },
  {
    question: "How many Directors are required to form a Private Limited Company?",
    answer:
      "Minimum two directors are required in a Private Limited Company, with an upper cap up to 15 directors.",
  },
  {
    question: "Who are Directors of the company?",
    answer:
      "Directors are officers of the company who are responsible for managing the company and making the decisions as to its operation on a day to day basis, for the benefit of the shareholders.",
  },
  {
    question:
      "What is a company shareholder?",
    answer:
      "Shareholders are the owners of companies limited by shares. As the beneficial owners of a limited company, they are not involved in day-to-day management or financial affairs. They are also called 'members' and they agree to become part of a company by taking a minimum of one share in it. The quantity of shares held by each person represents how much of the business they own.",
  },
  {
    question: "How much capital is required to start a Private Limited Company?",
    answer:
      "The Private Limited Company can be incorporated with any amount of capital and there is no lower or upper limit. Further, the government has relaxed the government fees for Incorporation of a Private Limited Company up to an Authorized capital of Rs. 15,00,000/-, however, the stamp duty, which is still levied, varies from State to State.",
  },
  {
    question:
      "What are some basic/ key documents required to incorporate a Private Limited Company in India?",
    answer:
      "PAN Card (All the Proposed Directors and/or Shareholders)",
  },
  {
    question:
      "What is the procedure to register a Private Limited Company?",
    answer:
      "You need at least two directors, two shareholders, a unique company name, a registered office address in India, and the necessary KYC documents for all directors and shareholders.",
  },
  {
    question:
      "What is the time period within which a Private Limited Company can be incorporated?",
    answer:
      "The process of incorporating a Private Limited Company can take anywhere between 10 to 15 working days, subject to submission of correct information and complete documentation.",
  },
  {
    question:
      "How Legal Terminus can help you incorporate a Private Limited Company in India?",
    answer:
      "Legal Terminus can help you with incorporation of Private Limited Company for you, as and when required, in a hassle-free manner within a reasonable time span and for competitive professional fee. To know more, please book a telephonic appointment with one of our consultants free of charge.",
  },
];

const WindupPLCFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="Windup-PLC-faq-section">
      <div className="Windup-PLC-faq-container">
        {/* Left side – static text */}
        <div className="Windup-PLC-faq-left">
          <h2 className="Windup-PLC-faq-title">Private Limited Company Registration FAQ&apos;s</h2>

          <p className="Windup-PLC-faq-intro">
            Starting a Private Limited Company in India is an important step for any business owner. With the right support, the process can be simple and stress-free.

<br/><br/>
Here, we’ve answered the most common questions about company registration—covering documents, steps, and what happens after registration. These FAQs will help you understand everything clearly and move ahead with confidence.

          </p>

          <p className="Windup-PLC-faq-intro">
            
          </p>
        </div>

        {/* Right side – scrollable Q&A list */}
        <div className="Windup-PLC-faq-right">
          <div className="Windup-PLC-faq-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`Windup-PLC-faq-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="Windup-PLC-faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`Windup-PLC-faq-icon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>
                  {isActive && (
                   <div className={`Windup-PLC-faq-answer ${isActive ? "open" : ""}`}>
                    <p>{item.answer}</p>
                  </div>

                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WindupPLCFAQ;
