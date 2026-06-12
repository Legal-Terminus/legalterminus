import React, { useState } from "react";
import "./DpvtFAQ.css";

const faqs = [
  {
    question: "What does it mean to dissolve a private limited company?",
    answer:
      "Dissolving a company means legally ending its existence so that it is removed from the Register of Companies maintained by the MCA. The most common route for an inactive company is a voluntary strike-off under Section 248(2) of the Companies Act, 2013, where the company applies in Form STK-2 and the ROC strikes its name off the register.",
  },
  {
    question: "Which companies are eligible for strike-off?",
    answer:
      "A company can apply for voluntary strike-off if it has either not commenced any business since incorporation, or has not been carrying on any business for the two immediately preceding financial years and has not applied for dormant status. It must also have no pending liabilities, charges, prosecutions, or investigations.",
  },
  {
    question: "Which companies cannot be struck off?",
    answer:
      "Listed companies, companies with pending charges or unpaid liabilities, companies under prosecution, inspection, or investigation, and certain other categories under Section 249 cannot use the strike-off route. Companies that still have assets and liabilities to settle generally need voluntary liquidation under the IBC, 2016 instead.",
  },
  {
    question: "What is Form STK-2 and what is filed with it?",
    answer:
      "Form STK-2 is the application for removal of a company's name from the register, filed with the ROC. It is accompanied by the indemnity bond (STK-3) and affidavit (STK-4) from each director, a CA-certified statement of accounts (STK-8) not older than 30 days, the special resolution or members' consent, and the bank account closure proof.",
  },
  {
    question: "What is the government fee for striking off a company?",
    answer:
      "The MCA fee for filing Form STK-2 is ₹10,000. In addition, any pending annual filings (AOC-4, MGT-7) must be completed first and carry their own fees and late fees, and there are minor stamping/notarisation costs for the indemnity and affidavit. These government and out-of-pocket costs are separate from our professional fee.",
  },
  {
    question: "Do I need to file pending annual returns before strike-off?",
    answer:
      "Yes. The ROC expects the company's filings to be up to date before it will strike it off. Overdue annual returns and financial statements generally need to be filed (with applicable late fees) so the company can demonstrate a clean compliance position before the strike-off application is accepted.",
  },
  {
    question: "What happens to the directors after strike-off?",
    answer:
      "After a clean strike-off, the directors are free of the company's ongoing compliance obligations. However, they remain personally liable, through the indemnity bond, for any liability of the company that subsists or surfaces after dissolution — which is why it is essential that all liabilities are genuinely extinguished before filing.",
  },
  {
    question: "How long does it take to strike off a company?",
    answer:
      "After Form STK-2 is filed, the ROC examines it and publishes a public notice (STK-5/STK-6) inviting objections, typically for around 30 days. If there are no sustained objections, the company is struck off and the dissolution is notified in Form STK-7. The overall timeline commonly runs a few months, depending on ROC processing and how clean the filings are.",
  },
  {
    question: "How does Legal Terminus help dissolve my company?",
    answer:
      "We assess your eligibility, bring any pending filings up to date, help clear liabilities and close the bank account, draft the resolutions, indemnity bond, affidavit, and coordinate the CA-certified accounts, file Form STK-2 with the ROC, and handle queries through the public-notice stage until the company is struck off and notified in STK-7. Book a free consultation to get started.",
  },
];

const DpvtFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Dissolve a Private Limited Company — FAQs</h2>
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

export default DpvtFAQ;
