import React, { useState } from "react";
import "./CacomFAQ.css";

const faqs = [
  {
    question: "What is the registered office of a company?",
    answer:
      "The registered office is the official address of a company, recorded with the Registrar of Companies. It is the address where all official communications — from the MCA, the Income Tax Department, courts, and other authorities — are sent. Under Section 12 of the Companies Act, 2013, every company must maintain a registered office and keep its address up to date with the ROC.",
  },
  {
    question: "When do I need to change the registered office address?",
    answer:
      "You should change it whenever the company physically relocates — to new premises in the same city, a different city within the state, or another state altogether. Even a small shift to a new building requires the registered office on record to be updated, so that legal notices and correspondence continue to reach you.",
  },
  {
    question: "How is the process different for each type of move?",
    answer:
      "A shift within the same city or local limits needs only a board resolution and Form INC-22. A move to a different city within the state requires a special resolution (Form MGT-14), and Regional Director approval if it changes the ROC. A change from one state to another also alters the MOA and needs a special resolution, newspaper advertisement, and Regional Director approval before INC-22 is filed.",
  },
  {
    question: "What is Form INC-22 and when must it be filed?",
    answer:
      "Form INC-22 is the notice of situation or change of registered office filed with the ROC. It must generally be filed within 30 days of the change, with the new address proof, NOC, and relevant resolutions attached. Late filing attracts additional government fees, so it should be filed promptly after the move.",
  },
  {
    question: "What address proof is required for the new office?",
    answer:
      "You need a recent utility bill of the new premises (electricity, water, gas, or telephone) not older than two months, a rent/lease agreement or ownership document, and a No-Objection Certificate (NOC) from the owner if the premises are rented. The proof must clearly show the address that is being registered.",
  },
  {
    question: "Is Regional Director approval always needed?",
    answer:
      "No. RD approval is needed only when the change moves the company outside the jurisdiction of its current ROC — typically a move to a different city falling under another ROC, or a change from one state to another. A simple shift within the same city or within the same ROC's jurisdiction does not require RD approval.",
  },
  {
    question: "Does changing the registered office affect the company's identity?",
    answer:
      "No. Changing the registered office — even across states — does not change the company's identity. The CIN, incorporation history, PAN, contracts, and liabilities all continue unchanged. Only the address on record is updated, so there is no disruption to the company's existence or operations.",
  },
  {
    question: "What should be updated after the registered office is changed?",
    answer:
      "After the MCA record is updated, the new address should be reflected on the company's PAN, GST registration, bank account, Udyam, and other licences, as well as on letterheads, invoices, the name board at the office, and other statutory displays. Keeping all of these consistent avoids mismatches and compliance issues.",
  },
  {
    question: "How does Legal Terminus help change my registered office?",
    answer:
      "We identify the correct procedure for your type of move, verify the new address proof and NOC, draft the board and special resolutions, file Form MGT-14, INC-22, and (for a state change) handle the advertisement and Regional Director application — then help update PAN, GST, bank, and licences. Book a free consultation to get started.",
  },
];

const CacomFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Change Registered Office — FAQs</h2>
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

export default CacomFAQ;
