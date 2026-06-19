import React, { useState } from "react";
import "./TmexrFAQ.css";

const faqs = [
  {
    question: "Can I continue using my trademark while the Examination Report is pending?",
    answer:
      "Yes. Filing of an Examination Report does not stop you from using your trademark. If your trademark application is already filed, you may continue using the ™ symbol while the matter is under examination, subject to applicable laws.",
  },
  {
    question: "What are the most common reasons for trademark objections in India?",
    answer:
      "The most common reasons are:\n• Similarity with existing trademarks\n• Generic or descriptive brand names\n• Lack of distinctiveness\n• Incorrect trademark class selection\n• Use of common industry words\n\nA proper filing strategy and professionally drafted reply help reduce these risks.",
  },
  {
    question: "Can a logo trademark also receive an Examination Report?",
    answer:
      "Yes. Both wordmarks and logo / device marks can receive objections from the Trade Marks Registry, especially if they are similar to existing trademarks or contain descriptive elements.",
  },
  {
    question: "Do I need to attend the hearing personally?",
    answer:
      "Usually no. In most cases, your authorised trademark attorney or representative can attend the Show Cause Hearing on your behalf. Personal appearance is generally not required unless specifically requested by the Registry.",
  },
  {
    question: "What documents may be required for replying to an Examination Report?",
    answer:
      "Depending on the objection, documents may include:\n• User affidavit\n• Invoices and business proof\n• Website or social media evidence\n• Advertisement materials\n• GST registration\n• Brand usage samples\n• Authorisation documents\n\nThe exact requirement depends on the type of objection raised.",
  },
  {
    question: "Does replying to the Examination Report increase the chances of trademark registration?",
    answer:
      "Yes. A professionally drafted reply helps clarify objections raised by the Examiner and significantly improves the chances of acceptance, especially when supported with proper legal arguments and brand-use evidence.",
  },
  {
    question: "Can I file a fresh trademark instead of replying to the objection?",
    answer:
      "Yes. In some situations, filing a fresh application with a modified brand name, logo, or class may be more practical than contesting the objection. The best option depends on the strength of the original application.",
  },
  {
    question: "Will my trademark be published immediately after filing the reply?",
    answer:
      "Not always. The Registry first reviews the reply. If the Examiner is satisfied, the trademark is accepted and published in the Trademark Journal. If not satisfied, a Show Cause Hearing may be scheduled.",
  },
  {
    question: "Can I check the status of my trademark application online?",
    answer:
      "Yes. Trademark application status can be checked anytime on the official IP India portal (ipindiaonline.gov.in) using the application number.",
  },
  {
    question: "Is there any difference between Section 9 and Section 11 objections?",
    answer:
      "Yes.\n• Section 9 objections relate to the nature of the trademark itself — such as descriptive or generic names.\n• Section 11 objections relate to similarity with existing registered or pending trademarks.\n\nBoth require different legal approaches while drafting the reply.",
  },
  {
    question: "Can startups and small businesses also receive trademark objections?",
    answer:
      "Yes. Trademark objections are common for businesses of all sizes — including startups, MSMEs, companies, and individual founders. Receiving an Examination Report does not mean the trademark will definitely be rejected.",
  },
  {
    question: "What happens if my trademark is accepted after the hearing?",
    answer:
      "If the Hearing Officer is satisfied with the arguments and documents, the trademark application is accepted and published in the Trademark Journal for public opposition.",
  },
  {
    question: "How can Legal Terminus help with Reply to Examination Report?",
    answer:
      "Legal Terminus provides end-to-end support for Reply to Examination Report, including objection analysis, legal drafting, filing of reply, hearing coordination, attorney change support, and continuous status tracking. Our team helps businesses respond professionally to trademark objections and move the application toward acceptance and registration through the official IP India portal (ipindiaonline.gov.in).",
  },
];

const TmexrFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Reply of Examination Report — FAQs</h2>
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
                  <div className="opcfaq-answer-content" style={{ whiteSpace: "pre-line" }}>{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default TmexrFAQ;
