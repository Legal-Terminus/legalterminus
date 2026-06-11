import React, { useState } from "react";
import "./AflFAQ.css";

const faqs = [
  {
    question: "What is LLP annual filing and who must do it?",
    answer:
      "LLP annual filing is the mandatory yearly submission of returns to the Ministry of Corporate Affairs (MCA) under the LLP Act, 2008. Every Limited Liability Partnership registered in India must file Form 11 (Annual Return) and Form 8 (Statement of Account & Solvency) each year — regardless of turnover or whether it carried on any business. Even a newly incorporated or dormant LLP must file.",
  },
  {
    question: "What are Form 11 and Form 8?",
    answer:
      "Form 11 is the LLP's Annual Return, listing partners, designated partners, and total contribution, along with any changes during the year. Form 8 is the Statement of Account & Solvency, declaring the LLP's financial position and that it can pay its debts. Form 11 is the governance return; Form 8 is the financial return — both are mandatory every year.",
  },
  {
    question: "What are the due dates for LLP annual filing?",
    answer:
      "Form 11 is due by 30 May (within 60 days of the close of the financial year). Form 8 is due by 30 October (within 30 days from the end of six months of the financial year). DIR-3 KYC for designated partners is due by 30 September. The LLP's income tax return (ITR-5) follows the income tax due dates — 31 July, or 31 October if audit applies.",
  },
  {
    question: "Is audit mandatory for an LLP?",
    answer:
      "No — an LLP requires a statutory tax audit only if its annual turnover exceeds ₹40 lakh or its total contribution exceeds ₹25 lakh. LLPs below both thresholds do not need a mandatory audit, which is one reason LLPs are popular with small businesses and professionals. We confirm your audit position before filing.",
  },
  {
    question: "What is the penalty for late LLP filing?",
    answer:
      "Late filing of Form 11 or Form 8 attracts an additional MCA fee of ₹100 per day, per form, with no upper limit. Because the penalty does not cap, even a few months' delay across both forms can run into tens of thousands or lakhs of rupees. Continued default can also lead to the LLP being struck off.",
  },
  {
    question: "Does an LLP with no business still need to file?",
    answer:
      "Yes. A dormant or zero-revenue LLP must still file Form 11 and Form 8 every year. Assuming that 'no business means no filing' is the most common and most expensive LLP compliance mistake — penalties and strike-off risk apply regardless of activity.",
  },
  {
    question: "What is DIR-3 KYC for designated partners?",
    answer:
      "Every designated partner holding a DIN/DPIN must complete DIR-3 KYC annually by 30 September. If missed, the DIN is deactivated and a ₹5,000 penalty applies to reactivate it. A deactivated DIN means that partner cannot sign or file any LLP forms until it is restored, which can stall your annual filings.",
  },
  {
    question: "What happens if an LLP stops filing for several years?",
    answer:
      "Continuous non-filing causes ₹100/day penalties to accumulate on each pending form (with no cap), the LLP to be marked a defaulter, designated partners to face disqualification, and ultimately the LLP to be struck off the register. Reviving a struck-off LLP requires an NCLT application and is far costlier than staying compliant.",
  },
  {
    question: "How does Legal Terminus handle my LLP's annual filing?",
    answer:
      "We manage the full cycle: building your compliance calendar, finalising accounts and the Statement of Account & Solvency, verifying partner and contribution details, obtaining professional certification, and e-filing Form 11, Form 8, DIR-3 KYC, and ITR-5 with the MCA — sharing all SRN/challan receipts with timely reminders. Book a free consultation to get started.",
  },
];

const AflFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">LLP Annual Filing — FAQs</h2>
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

export default AflFAQ;
