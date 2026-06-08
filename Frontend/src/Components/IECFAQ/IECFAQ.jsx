import React, { useState } from "react";
import "./IECFAQ.css";

const faqs = [
  {
    question: "Is Import Export Code mandatory for all business organizations?",
    answer:
      "The Import Export Code is mandatory for those organizations who are engaged in the business of Import Export of goods or services. Individuals and entities exempt from IEC include those importing/exporting for personal use not connected with trade, and entities covered under specific exemptions notified by DGFT.",
  },
  {
    question: "What is the validity of IE Code?",
    answer:
      "An Import Export Code once issued is valid for lifetime. However, it must be updated annually (between April and June) on the DGFT portal — failure to update results in deactivation of the IEC.",
  },
  {
    question: "What is the due date of renewal of IE Code?",
    answer:
      "Since IEC Certificate is granted for lifetime, no renewal is required. However, annual updation (even with no changes) is mandatory every April–June. DGFT deactivates IEC for entities that do not complete the annual update.",
  },
  {
    question: "What if one wishes to carry on import/export business without obtaining IEC Registration?",
    answer:
      "Import or Export of Goods and/or Services is not possible without having Import Export Code Certificate. Customs authorities and DGFT require a valid IEC for every import/export consignment. Violation can attract penalties under the Foreign Trade (Development & Regulation) Act, 1992.",
  },
  {
    question: "What are the documents required for obtaining Import Export Code?",
    answer: (
      <div>
        <ol>
          <li>Copy of PAN of the organization/applicant</li>
          <li>Address Proof of the business premises (Electricity Bill / Lease Agreement)</li>
          <li>Cancelled cheque or Bank Certificate in the name of the organization</li>
          <li>Certificate of Incorporation / Partnership Deed / MSME Certificate (as applicable)</li>
          <li>Copy of PAN of all Directors/Partners/Proprietor</li>
          <li>Copy of Address proof of all Directors/Partners/Proprietor</li>
          <li>Bank Statement of last 2 months of the operating account</li>
          <li>Email ID &amp; Mobile number of the organization</li>
        </ol>
      </div>
    ),
  },
  {
    question: "What is the time period within which the Import Export Code can be obtained?",
    answer:
      "The process of obtaining IEC Registration typically takes 5 to 7 working days from submission of complete and correct documents. DGFT processes the application online and issues the IEC code electronically.",
  },
  {
    question: "What is the government fee for IEC registration?",
    answer:
      "The government fee for IEC registration is ₹500, payable online on the DGFT portal at the time of application. This is separate from the professional fee charged by Legal Terminus.",
  },
  {
    question: "How can Legal Terminus help you obtain Import Export Code?",
    answer:
      "Legal Terminus handles the complete IEC registration process — from document verification and application preparation to DGFT filing and follow-up. We ensure zero rejection risk by pre-verifying all documents before submission. Contact us for a free consultation with one of our IEC experts.",
  },
];

const IECFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="iecfaq-section">
      <div className="iecfaq-container">

        {/* Centered heading & subheading */}
        <div className="iecfaq-header">
          <h2 className="iecfaq-title">IEC Registration — FAQs</h2>
          <p className="iecfaq-intro">
            Got questions? We've got answers — straight, no-BS, legally accurate.
          </p>
        </div>

        {/* Full-width FAQ accordion */}
        <div className="iecfaq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`iecfaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="iecfaq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`iecfaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`iecfaq-answer ${isActive ? "open" : ""}`}>
                  <div className="iecfaq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default IECFAQ;
