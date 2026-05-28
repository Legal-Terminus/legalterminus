import React, { useState } from "react";
import "./LLPFAQ.css";

const faqs = [
  {
    question: "How many persons are required to form an LLP?",
    answer:
      "Minimum two persons are required to form an LLP and there is no upper limit to it.",
  },
  {
    question: "How many Designated Partners are required to form an LLP?",
    answer:
      "Minimum two Designated Partners are required in an LLP.",
  },
  {
    question: "Who are Designated Partners of the LLP?",
    answer:
      "Designated Partners are officers of the LLP who are responsible for managing the LLP and making the decisions as to its operation on a day to day basis, for the benefit of the shareholders.",
  },
  {
    question: "How much contribution is required to start an LLP?",
    answer:
      "The LLP can be incorporated with any amount of capital and there is no lower or upper limit to it.",
  },
  {
    question: "What are some basic/ key documents required to incorporate an LLP in India?",
    answer: (
      <ol>
        <li>PAN Card (All the Proposed Designated Partners and/or Partners)</li>
        <li>ID Proof (All the Proposed Designated Partners and/or Partners) — Passport / Voter ID / Aadhaar Card / Driving License</li>
        <li>Address Proof (All the Proposed Designated Partners and/or Partners) — Telephone Bill / Mobile Bill / Savings Bank Statement</li>
        <li>Passport size Photograph (All the Proposed Designated Partners and/or Partners)</li>
        <li>Rent Agreement (For proposed LLP Address)</li>
        <li>Electricity bill</li>
        <li>A permission letter from the owner about use of his premises for registered office of the proposed LLP</li>
        <li>All utility bills or bank statements shall be less than 2 months old</li>
      </ol>
    ),
  },
  {
    question: "What is the procedure to register an LLP?",
    answer: (
      <ol>
        <li>STEP 1: Provision of requisite documents/information to us</li>
        <li>STEP 2: Validating the documents / information and processing the same</li>
        <li>STEP 3: Filing of application and submission of the same in online manner</li>
        <li>STEP 4: Payment of appropriate government fee as applicable</li>
        <li>STEP 5: Processing of the application and issuance of registration certificate</li>
      </ol>
    ),
  },
  {
    question: "What is the time period within which an LLP can be incorporated?",
    answer:
      "The process of incorporating an LLP can take anywhere between 15 to 20 working days, subject to submission of correct information and complete documentation.",
  },
  {
    question: "How Legal Terminus can help you incorporate an LLP in India?",
    answer:
      "Legal Terminus can help you with incorporation of an LLP for you, as and when required, in a hassle-free manner within a reasonable time span and for competitive professional fee. To know more, please book a telephonic appointment with one of our consultants free of charge.",
  },
];

const FaqLLP = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="llpfaq-section">
      <div className="llpfaq-container">

        <div className="llpfaq-header">
          <h2 className="llpfaq-title">Limited Liability Partnership Registration — FAQs</h2>
          <p className="llpfaq-intro">
            Explore answers to frequently asked questions on LLP registration in India — benefits, eligibility, compliance, and more.
          </p>
        </div>

        <div className="llpfaq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`llpfaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="llpfaq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`llpfaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`llpfaq-answer ${isActive ? "open" : ""}`}>
                  <div className="llpfaq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FaqLLP;
