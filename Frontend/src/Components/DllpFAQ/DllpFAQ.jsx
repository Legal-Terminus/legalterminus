import React, { useState } from "react";
import "./DllpFAQ.css";

const faqs = [
  {
    question: "What does it mean to dissolve an LLP?",
    answer:
      "Dissolving an LLP means legally ending its existence so that it is removed from the Register maintained by the MCA. The most common route for an inactive LLP is a strike-off by filing Form 24 under Rule 37 of the LLP Rules, 2009, after which the ROC strikes the LLP's name off the register and it ceases to exist.",
  },
  {
    question: "Which LLPs are eligible to file Form 24?",
    answer:
      "An LLP can apply for strike-off via Form 24 if it has either not commenced business since incorporation, or has ceased carrying on commercial operations for one year or more. It must have no pending liabilities, must have closed its bank account, and must have filed its overdue returns up to the cessation date.",
  },
  {
    question: "What documents are needed for an LLP strike-off?",
    answer:
      "Form 24 is filed with: the consent of all partners, an affidavit and indemnity bond from each designated partner, a statement of accounts (nil assets/liabilities) certified by a CA and not older than 30 days, the LLP agreement, a copy of the latest income tax return, and the bank account closure proof.",
  },
  {
    question: "Do I need to file pending Form 8 and Form 11 before strike-off?",
    answer:
      "Yes. Overdue annual returns (Form 11) and Statements of Account & Solvency (Form 8) generally need to be filed up to the end of the financial year in which the LLP ceased business before Form 24 can be accepted. For LLPs the late fee is ₹100 per day, per form, with no upper cap — so clearing these early matters.",
  },
  {
    question: "Is there a government fee for filing Form 24?",
    answer:
      "Form 24 itself carries only a nominal MCA fee. The bigger costs are usually the fees and uncapped late fees for any pending Form 8 / Form 11, plus stamping and notarisation for the affidavit and indemnity, and the CA's charge for certifying the statement of accounts. These are billed at actuals over and above our professional fee.",
  },
  {
    question: "Can an LLP with assets or liabilities use Form 24?",
    answer:
      "No. Form 24 strike-off is only for an LLP with nil assets and nil liabilities. If the LLP still has assets to distribute or creditors to pay, it must go through voluntary winding-up, where a liquidator realises the assets and settles dues before dissolution. We advise on which route applies to your situation.",
  },
  {
    question: "What happens to the designated partners after strike-off?",
    answer:
      "After a clean strike-off, the partners are free of the LLP's ongoing compliance obligations. However, they remain personally liable, through the indemnity, for any liability of the LLP that subsists or surfaces after dissolution — which is why it is essential that all liabilities are genuinely extinguished before filing.",
  },
  {
    question: "How long does it take to strike off an LLP?",
    answer:
      "After Form 24 is filed, the ROC examines it and publishes a public notice inviting objections, typically for around a month. If there are no sustained objections, the LLP is struck off and the dissolution is notified. The overall timeline commonly runs a few months, depending on ROC processing and how clean the filings are.",
  },
  {
    question: "How does Legal Terminus help dissolve my LLP?",
    answer:
      "We assess your eligibility, bring any pending Form 8/11 and ITR up to date, help clear liabilities and close the bank account, draft the partners' consent, affidavit, and indemnity, coordinate the CA-certified accounts, file Form 24 with the ROC, and handle queries through the public-notice stage until the LLP is struck off. Book a free consultation to get started.",
  },
];

const DllpFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Dissolve an LLP — FAQs</h2>
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

export default DllpFAQ;
