import React, { useState } from "react";
import "./CocomFAQ.css";

const faqs = [
  {
    question: "What is the object clause of a company?",
    answer:
      "The object clause is the part of the Memorandum of Association (MOA) that sets out the business activities a company is authorised to carry on. It defines the legal scope of the company's operations — anything done outside it is considered 'ultra vires' (beyond the company's powers). To do a new business not covered by the existing objects, the object clause must be amended.",
  },
  {
    question: "Why would a company need to change its object clause?",
    answer:
      "Companies change their object clause to add a new line of business, pivot into a different sector, modernise outdated or restrictive objects, or qualify for tenders and licences that require specific activities in the MOA. It is essential whenever the company plans to do something its current objects don't legally permit.",
  },
  {
    question: "What is the procedure to change the object clause?",
    answer:
      "Under Section 13 of the Companies Act, 2013, the board approves the change and calls an EGM, the members pass a special resolution (at least 75% majority) to alter the object clause, and Form MGT-14 is filed with the ROC within 30 days along with the altered MOA. Once the ROC registers it, the new objects take effect.",
  },
  {
    question: "What is Form MGT-14 and when is it filed?",
    answer:
      "Form MGT-14 is the form used to file a special resolution (and the altered MOA) with the Registrar of Companies. It must be filed within 30 days of passing the special resolution. Filing it on time is essential — late filing attracts additional government fees and the alteration is not effective until it is registered.",
  },
  {
    question: "Is a special resolution mandatory for changing objects?",
    answer:
      "Yes. Altering the object clause is an alteration of the MOA, which under Section 13 requires a special resolution — meaning at least three-fourths (75%) of the members voting at a general meeting must approve it. An ordinary resolution is not sufficient; without the special resolution, the change cannot be filed or registered.",
  },
  {
    question: "Are there extra requirements if the company raised public money?",
    answer:
      "Yes. Under Section 13(8), if a company has raised money from the public through a prospectus and still has unutilised amounts, changing the objects requires a special resolution plus publication of the details (including in newspapers) and an exit opportunity to dissenting shareholders. These additional steps are assessed and handled where applicable.",
  },
  {
    question: "Can I start the new business before the object clause is changed?",
    answer:
      "It is not advisable. A company can only lawfully carry on activities authorised by its object clause. Starting a new line of business before amending the MOA is ultra vires and can render contracts open to challenge and invite compliance scrutiny. The correct sequence is to amend the objects first, then begin the new activity.",
  },
  {
    question: "Does changing the objects affect the company's existing business?",
    answer:
      "No. Adding new objects or modifying the clause does not disturb the company's existing operations, identity, or history. The CIN, PAN, contracts, and liabilities all continue unchanged — you are simply expanding or updating what the company is legally allowed to do.",
  },
  {
    question: "How does Legal Terminus help change the object clause?",
    answer:
      "We draft the new object clause precisely around your intended business, prepare the board resolution, EGM notice, and special resolution, file Form MGT-14 with the altered MOA within the deadline, and track ROC approval — then advise on consequential GST, licence, and name changes so the new activity is fully compliant. Book a free consultation to get started.",
  },
];

const CocomFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Change Object Clause — FAQs</h2>
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

export default CocomFAQ;
