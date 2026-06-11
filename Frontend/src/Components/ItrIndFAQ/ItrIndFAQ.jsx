import React, { useState } from "react";
import "./ItrIndFAQ.css";

const faqs = [
  {
    question: "Who is required to file an income tax return?",
    answer:
      "You must file an ITR if your gross total income exceeds the basic exemption limit (₹2.5 lakh under the old regime, ₹3 lakh under the new regime). You should also file — even below the limit — if you want a TDS refund, have foreign assets/income, deposited large amounts in bank accounts, spent above specified limits on travel or electricity, or want to carry forward losses or apply for a loan or visa.",
  },
  {
    question: "Which ITR form should I file as an individual?",
    answer:
      "ITR-1 (Sahaj) suits resident individuals with income up to ₹50 lakh from salary, one house property, and other sources. ITR-2 is for those with capital gains, multiple properties, or foreign assets. ITR-3 is for individuals with business or professional income, and ITR-4 (Sugam) is for presumptive income up to ₹50 lakh. Legal Terminus confirms the right form based on your income before filing.",
  },
  {
    question: "What is the due date for filing an individual ITR?",
    answer:
      "For most individuals not requiring an audit, the due date is generally 31st July of the assessment year. If you miss it, a belated return can usually be filed up to 31st December with a late fee under Section 234F, and an updated return (ITR-U) may be possible later with additional tax. Filing on time avoids fees and preserves benefits like loss carry-forward.",
  },
  {
    question: "Should I choose the old or the new tax regime?",
    answer:
      "It depends on your deductions. The new regime has lower slab rates but removes most deductions and exemptions; the old regime has higher rates but lets you claim 80C, 80D, HRA, home-loan interest, and more. The new regime is now the default, so if the old one benefits you, you must actively opt for it. We compare both on your actual numbers and file the one with lower tax.",
  },
  {
    question: "What is Form 26AS and AIS, and why do they matter?",
    answer:
      "Form 26AS is your tax-credit statement showing TDS deducted against your PAN. The Annual Information Statement (AIS) and Taxpayer Information Summary (TIS) show a broader set of reported transactions — interest, dividends, share sales, and high-value spends. Returns that don't match these are the leading cause of notices, so we reconcile every entry before filing.",
  },
  {
    question: "How do I claim a tax refund and how long does it take?",
    answer:
      "If more tax was deducted (TDS) or paid than your actual liability, the excess is refunded after you file and e-verify your return. Refunds are processed by the CPC and typically credited within a few weeks of e-verification to your pre-validated bank account. Filing early and e-verifying immediately is the fastest route to your refund.",
  },
  {
    question: "Do I need to file a return if my employer already deducted TDS?",
    answer:
      "Yes. TDS deduction is not the same as filing a return. Filing reconciles your total income and tax, lets you claim deductions your employer may not have considered, and is the only way to claim a refund if excess TDS was deducted. It also creates your official income record for loans and visas.",
  },
  {
    question: "What happens if I don't file my ITR or file it late?",
    answer:
      "Late filing attracts a fee under Section 234F (up to ₹5,000, or ₹1,000 if income is below ₹5 lakh) and interest under Section 234A on unpaid tax. You also lose the right to carry forward certain losses, and refunds get delayed. Persistent non-filing can lead to notices and, in serious cases, prosecution. Timely filing avoids all of this.",
  },
  {
    question: "How does Legal Terminus help with my personal ITR?",
    answer:
      "We handle the full process: confirming the right ITR form, collecting your documents, reconciling 26AS/AIS, comparing tax regimes, maximising deductions, getting your approval, and e-filing with verification — with an expert reviewing the return and the ITR-V and computation shared afterwards, plus refund tracking. Book a free consultation to get started.",
  },
];

const ItrIndFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Individual ITR Filing — FAQs</h2>
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

export default ItrIndFAQ;
