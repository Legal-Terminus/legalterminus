import React, { useState } from "react";
import "./TmoppFAQ.css";

const faqs = [
  {
    question: "Can anyone file a Trademark Opposition in India?",
    answer:
      "Yes. Any person, business, company, partnership, proprietor, or even a prior user of a similar brand can file a Trademark Opposition if they believe the published trademark may affect their rights or create confusion in the market.",
  },
  {
    question: "Where can I check if a trademark has been opposed?",
    answer:
      "You can check the trademark application status on the official IP India portal. If an opposition is filed, the application status usually changes to \"Opposed\" on the Trade Marks Registry records.",
  },
  {
    question: "Can a trademark be opposed even after examination approval?",
    answer:
      "Yes. Examination approval does not guarantee registration. Once the trademark is published in the Trade Marks Journal, it becomes open for public opposition during the statutory 4-month opposition period.",
  },
  {
    question: "Is Trademark Opposition the same as trademark infringement?",
    answer:
      "No. Trademark Opposition is an administrative proceeding before the Trade Marks Registry during the application stage. Trademark infringement usually happens after registration when someone illegally uses a registered trademark without permission.",
  },
  {
    question: "Can I continue using my trademark during an opposition case?",
    answer:
      "Yes. In many cases, applicants continue using their trademark while the opposition matter is pending. However, the final rights depend on the Registrar's decision and the facts of the case.",
  },
  {
    question: "What are the common reasons for Trademark Opposition?",
    answer:
      "Common reasons include:\n• Similar brand name or logo\n• Risk of customer confusion\n• Prior use by another business\n• Descriptive or generic trademark\n• Bad-faith filing\n• Copying of an established brand identity",
  },
  {
    question: "What documents are generally required in a Trademark Opposition matter?",
    answer:
      "The required documents may include:\n• Trademark application details\n• Trade Marks Journal copy\n• Business proof\n• Prior use proof (invoices, advertisements, website, social media, GST records, etc.)\n• Authorisation documents / POA\n• Evidence affidavits (if applicable)",
  },
  {
    question: "Can multiple oppositions be filed against one trademark?",
    answer:
      "Yes. More than one party can oppose the same trademark application if they believe the registration may affect their rights or business interests.",
  },
  {
    question: "Can opposition be filed against only a logo or only a brand name?",
    answer:
      "Yes. Trademark Opposition can be filed against:\n• Wordmarks\n• Logos / Device marks\n• Taglines\n• Labels\n• Packaging marks\n• Combination marks",
  },
  {
    question: "What happens if the opposite party does not respond?",
    answer:
      "If the applicant fails to file a Counter Statement within the prescribed time, the trademark application is treated as abandoned. Similarly, if the opposer fails to submit evidence within time, the opposition may be treated as abandoned.",
  },
  {
    question: "Can I oppose a trademark if my own trademark is not registered?",
    answer:
      "Yes. Even unregistered trademark owners may oppose a trademark application if they can prove prior use, reputation, goodwill, or market presence.",
  },
  {
    question: "Does filing an opposition automatically stop trademark registration?",
    answer:
      "Temporarily yes. Once opposition is filed, the trademark registration process is kept on hold until the opposition matter is decided or settled.",
  },
  {
    question: "Can Trademark Opposition matters be resolved online?",
    answer:
      "Yes. Most filings, evidence submissions, status tracking, and hearings are now handled digitally through the official IP India e-filing system and online hearing platform.",
  },
  {
    question: "Can a startup or small business file a Trademark Opposition?",
    answer:
      "Absolutely. Trademark Opposition rights are available to all businesses — including startups, MSMEs, proprietorships, and individuals — if their brand rights may be affected.",
  },
  {
    question: "Why is professional handling important in Trademark Opposition matters?",
    answer:
      "Trademark Opposition involves legal drafting, evidence preparation, deadline management, and hearing representation. A small mistake or missed deadline can seriously affect the matter. Professional handling helps ensure proper filings, timely responses, and stronger legal presentation before the Registry.",
  },
  {
    question: "How can Legal Terminus help me with Trademark Opposition?",
    answer:
      "Legal Terminus provides end-to-end support for Trademark Opposition matters — whether you want to oppose a similar trademark or defend your own trademark application. Our team handles drafting, filing, evidence preparation, hearing support, and regular follow-ups through the official IP India e-filing portal.",
  },
];

const TmoppFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Trademark Opposition — FAQs</h2>
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

export default TmoppFAQ;
