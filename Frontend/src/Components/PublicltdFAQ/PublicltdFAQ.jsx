import React, { useState } from "react";
import "./PublicltdFAQ.css";

const FAQ_ITEMS = [
  {
    question: "How many persons are required to form a Public Limited company?",
    answer:
      "Minimum Seven persons are required to form a Public Limited Company and there is no maximum limit to it.",
  },
  {
    question: "How many Directors are required to form a Public Limited company?",
    answer:
      "Minimum three directors are required in a Public Limited Company, with an upper cap of 15 directors.",
  },
  {
    question: "Who are Directors of the company?",
    answer:
      "Directors are officers of the company who are responsible for managing the company and making decisions as to its operation on a day-to-day basis, for the benefit of the shareholders.",
  },
  {
    question: "What is a company shareholder?",
    answer:
      "Shareholders are the owners of companies limited by shares. They are also called 'members' and they agree to become part of a company by taking a minimum of one share in it. The quantity of shares held by each person represents how much of the business they own.",
  },
  {
    question: "How much capital is required to incorporate a Public Limited Company?",
    answer:
      "A Public Limited Company can be incorporated with a minimum Authorised and paid-up capital of Rs. 5,00,000/-. There is no upper limit; however, ROC fees vary with an increase in Authorised Capital.",
  },
  {
    question: "What are the key documents required for Public Limited Company Registration?",
    answer:
      "Key documents include: PAN Card, ID Proof (Passport / Voter ID / Aadhaar / Driving Licence), Address Proof (Telephone/Mobile Bill / Bank Statement), Passport-size photographs of all proposed directors & shareholders, Rent Agreement and Electricity Bill for the registered office, and an NOC from the property owner. All utility bills/bank statements must be less than 2 months old.",
  },
  {
    question: "What is the procedure to register a Public Limited Company?",
    answer:
      "The broad process involves: (1) Submission of documents, (2) Validating and processing the documents, (3) Filing of application for name reservation, (4) Preparation of DSCs and incorporation documents, (5) Uploading final forms to MCA portal with applicable fees, and (6) Issuance of the Certificate of Incorporation.",
  },
  {
    question: "What is the time period for incorporating a Public Limited Company?",
    answer:
      "The process of incorporating a Public Limited Company can take anywhere between 15 to 20 working days, subject to submission of correct information and complete documentation.",
  },
  {
    question: "How can Legal Terminus help incorporate a Public Limited Company?",
    answer:
      "Legal Terminus can help you with the incorporation of a Public Limited Company in a hassle-free manner within a reasonable time span and for a competitive professional fee. To know more, book a free telephonic appointment with one of our consultants.",
  },
];

const LlpFaqs = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="pubfaq-section">
      <div className="pubfaq-container">

        <div className="pubfaq-header">
          <h2 className="pubfaq-title">Public Limited Company Registration — FAQs</h2>
          <p className="pubfaq-intro">
            Find answers to common questions about Public Limited Company registration in India.
          </p>
        </div>

        <div className="pubfaq-list">
          {FAQ_ITEMS.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`pubfaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="pubfaq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`pubfaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`pubfaq-answer ${isActive ? "open" : ""}`}>
                  <div className="pubfaq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default LlpFaqs;
