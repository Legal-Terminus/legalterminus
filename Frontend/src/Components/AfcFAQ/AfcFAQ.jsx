import React, { useState } from "react";
import "./AfcFAQ.css";

const faqs = [
  {
    question: "What is company annual filing and who must do it?",
    answer:
      "Company annual filing is the mandatory yearly submission of financial statements and returns to the Ministry of Corporate Affairs (MCA) under the Companies Act, 2013. Every company registered in India — Private Limited, Public Limited, and One Person Company — must file, regardless of turnover or whether it carried on any business during the year. Even a dormant or zero-revenue company must complete its annual filings.",
  },
  {
    question: "Which forms are part of a company's annual filing?",
    answer:
      "The core forms are AOC-4 (audited financial statements), MGT-7 / MGT-7A (annual return), and ADT-1 (auditor appointment). Alongside these, companies file DIR-3 KYC for each director, DPT-3 (return of deposits/loans), and MSME-1 (dues to MSME vendors). The company also files its income tax return (ITR-6) separately with the Income Tax Department.",
  },
  {
    question: "What are the due dates for AOC-4 and MGT-7?",
    answer:
      "The Annual General Meeting (AGM) must generally be held by 30 September. AOC-4 is then filed within 30 days of the AGM and MGT-7 / MGT-7A within 60 days of the AGM. ADT-1 is filed within 15 days of the AGM where the auditor is appointed or ratified, and DIR-3 KYC is due by 30 September each year.",
  },
  {
    question: "Is a statutory audit mandatory before filing?",
    answer:
      "Yes. Every company must have its accounts audited by a Chartered Accountant before filing AOC-4 — this applies irrespective of turnover, profit, or level of activity. The audited Balance Sheet, Profit & Loss account, and Auditor's Report form the basis of the AOC-4 filing.",
  },
  {
    question: "What is the penalty for late annual filing?",
    answer:
      "Late filing of AOC-4 and MGT-7 attracts an additional MCA fee of ₹100 per day, per form, with no upper limit — so the penalty keeps growing until you file. Continued default can also lead to disqualification of directors for up to five years and striking off of the company's name from the register.",
  },
  {
    question: "Does a company with no business or no transactions still need to file?",
    answer:
      "Yes. A dormant company or one with nil revenue must still hold its AGM, get its accounts audited, and file AOC-4 and MGT-7. Skipping filings because there was 'no business' is one of the most common — and most expensive — compliance mistakes, as penalties and strike-off risk apply regardless.",
  },
  {
    question: "What is DIR-3 KYC and why is it important?",
    answer:
      "DIR-3 KYC is an annual KYC verification that every director holding a DIN must complete by 30 September. If a director misses it, their DIN is deactivated and a penalty of ₹5,000 applies to reactivate it. A deactivated DIN means that director cannot sign or file any company forms until it is restored.",
  },
  {
    question: "What happens if a company stops filing for several years?",
    answer:
      "Continuous non-filing leads the ROC to classify the company as a defaulter, accumulate ₹100/day penalties on each pending form, disqualify its directors for five years, and ultimately strike the company off the register. Reviving a struck-off company requires an NCLT application and is far costlier and slower than staying compliant.",
  },
  {
    question: "How does Legal Terminus handle my company's annual filing?",
    answer:
      "We manage the full cycle: building your compliance calendar, finalising books and coordinating the statutory audit, drafting the Director's Report and AGM documentation, preparing and e-filing AOC-4, MGT-7, ADT-1, DIR-3 KYC, and DPT-3 with the MCA, and sharing all SRN/challan receipts and updated registers — with a compliance manager and timely reminders. Book a free consultation to get started.",
  },
];

const AfcFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Company Annual Filing — FAQs</h2>
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

export default AfcFAQ;
