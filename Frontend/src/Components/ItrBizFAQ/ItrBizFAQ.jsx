import React, { useState } from "react";
import "./ItrBizFAQ.css";

const faqs = [
  {
    question: "Which ITR form should my business file?",
    answer:
      "It depends on your entity and income. A proprietor or professional maintaining books files ITR-3; one opting for the presumptive scheme files ITR-4; partnership firms and LLPs file ITR-5; and companies file ITR-6. Filing the wrong form can make the return defective under Section 139(9), so Legal Terminus confirms the correct form before preparing your return.",
  },
  {
    question: "What is the presumptive taxation scheme (44AD / 44ADA / 44AE)?",
    answer:
      "Presumptive taxation lets eligible small businesses and professionals declare income at a fixed percentage of turnover without maintaining detailed books or undergoing audit. Section 44AD applies to businesses (6% of digital / 8% of cash turnover, up to ₹3 crore), 44ADA to specified professionals (50% of receipts, up to ₹75 lakh), and 44AE to goods-carriage operators. We check your eligibility and compare it against regular filing.",
  },
  {
    question: "What are the due dates for filing a business ITR?",
    answer:
      "For businesses not requiring an audit, the due date is generally 31st July of the assessment year. For businesses requiring a tax audit, the return is due by 31st October, with the audit report filed by 30th September. A belated return can be filed later with a late fee and interest, but you lose certain benefits like carrying forward losses.",
  },
  {
    question: "When is a tax audit under Section 44AB required?",
    answer:
      "A tax audit is generally required if business turnover exceeds ₹1 crore (₹10 crore where cash receipts and payments are within 5%), or professional receipts exceed ₹50 lakh. It is also triggered if you declare profits lower than the presumptive rate and your income exceeds the basic exemption limit. We flag audit applicability early so it can be completed before the deadline.",
  },
  {
    question: "Do I have to file a return if my business made a loss?",
    answer:
      "Yes — and you should. Filing a return in a loss year is what lets you carry forward business losses and unabsorbed depreciation (up to 8 years) to set off against future profits. This benefit is only available if the return is filed by the original due date, so loss-year filing often saves significant tax later.",
  },
  {
    question: "What is Form 26AS and AIS, and why do they matter?",
    answer:
      "Form 26AS is your tax credit statement showing TDS deducted against your PAN. The Annual Information Statement (AIS) and Taxpayer Information Summary (TIS) show a wider set of reported transactions — interest, dividends, high-value purchases, GST turnover, and more. Returns that don't reconcile with these statements are the leading cause of notices, so we match every entry before filing.",
  },
  {
    question: "Can business losses or earlier-year losses be set off?",
    answer:
      "Yes. Current-year business losses can be set off against other eligible income (subject to rules), and unabsorbed losses/depreciation carried forward from earlier years can be set off against current profits — provided the earlier returns were filed on time. We track and apply your carry-forward balances correctly each year.",
  },
  {
    question: "What happens if I file my business return late?",
    answer:
      "A belated return attracts a late fee under Section 234F (up to ₹5,000), interest under Sections 234A/B/C on any unpaid tax, and the loss of the right to carry forward business losses. Continued non-filing can lead to notices, best-judgement assessment, and in serious cases prosecution under Section 276CC. Timely filing avoids all of this.",
  },
  {
    question: "How does Legal Terminus handle my business ITR filing?",
    answer:
      "We manage the full cycle: confirming the right ITR form, collecting your books and documents, reconciling 26AS/AIS, computing income with optimised deductions, flagging tax-audit applicability, getting your approval, and e-filing with verification — with a Chartered Accountant reviewing the return and the ITR-V and computation shared afterwards. Book a free consultation to get started.",
  },
];

const ItrBizFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Business ITR Filing — FAQs</h2>
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

export default ItrBizFAQ;
