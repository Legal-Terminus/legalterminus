import React, { useState } from "react";
import "../ProFOPCFAQ/ProFOPCFAQ.css";

const faqs = [
  {
    question: "Why would a Public Limited Company convert into a Private Limited Company?",
    answer: (
      <div>
        <ol>
          <li>A private company carries a much lighter compliance and disclosure load than a public company.</li>
          <li>Ownership can be kept closely held by restricting the transfer of shares.</li>
          <li>Only 2 members and 2 directors are required, instead of 7 members and 3 directors.</li>
          <li>The company is no longer required to invite or accommodate public shareholding.</li>
          <li>Private companies enjoy several relaxations and exemptions under the Companies Act, 2013.</li>
          <li>Decision-making becomes faster with leaner board and general meeting requirements.</li>
        </ol>
      </div>
    ),
  },
  {
    question: "Which law and forms govern the conversion of a public company into a private company?",
    answer: (
      <div>
        <ol>
          <li>Section 14 of the Companies Act, 2013 read with Rule 41 of the Companies (Incorporation) Rules, 2014.</li>
          <li>Special resolution altering the Articles of Association.</li>
          <li>Form MGT-14 for filing the special resolution with the RoC.</li>
          <li>Form INC-25A for the newspaper advertisement inviting objections.</li>
          <li>Form RD-1 for the application to the Regional Director.</li>
          <li>Form INC-28 for filing the Regional Director's approval order.</li>
        </ol>
      </div>
    ),
  },
  {
    question: "What are the key documents required for the conversion?",
    answer: (
      <div>
        <ol>
          <li>KYC documents (PAN, Aadhaar, address proof) of all directors and shareholders</li>
          <li>Certified copy of the special resolution and minutes of the general meeting</li>
          <li>Altered Memorandum and Articles of Association</li>
          <li>List of creditors and debenture holders with their consent / NOC</li>
          <li>Latest audited financial statements and declaration of solvency</li>
          <li>Proof of registered office (utility bill, rent agreement, NOC)</li>
          <li>Copy of the INC-25A newspaper advertisement and individual notices</li>
        </ol>
      </div>
    ),
  },
  {
    question: "How long does it take to convert a public company into a private company?",
    answer:
      "Subject to a clean compliance record and complete documentation, the process usually takes around 45 to 60 working days, including the mandatory 21-day objection window after the newspaper advertisement and the Regional Director's processing time.",
  },
  {
    question: "How can Legal Terminus help with the conversion?",
    answer:
      "Legal Terminus manages the entire Public to Private Limited conversion end-to-end — from the Section 14 eligibility review, drafting the resolutions and altered Articles, MGT-14, INC-25A and RD-1 filings, to liaising with the Regional Director and filing INC-28. To know more, book a free telephonic appointment with one of our consultants.",
  },
];

const FaqPvt = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="profopc-faq-section">
      <div className="profopc-faq-container">
        {/* Left side */}
        <div className="profopc-faq-left">
          <h2 className="profopc-faq-title">
            Public To Private Limited Conversion FAQ&apos;s
          </h2>

          <p className="profopc-faq-intro">
            Here, we’ve answered the most common questions about converting a Public Limited Company into a Private Limited Company, covering documents, steps, and what happens after the conversion.
          </p>
        </div>

        {/* Right side */}
        <div className="profopc-faq-right">
          <div className="profopc-faq-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`profopc-faq-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="profopc-faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span
                      className={`profopc-faq-icon ${
                        isActive ? "open" : ""
                      }`}
                    >
                      ▾
                    </span>
                  </button>

                  {isActive && (
                    <div
                      className={`profopc-faq-answer ${
                        isActive ? "open" : ""
                      }`}
                    >
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

export default FaqPvt;
