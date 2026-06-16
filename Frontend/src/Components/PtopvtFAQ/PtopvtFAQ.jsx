import React, { useState } from "react";
import "./PtopvtFAQ.css";

const faqs = [
  {
    question: "What is Proprietorship to Private Limited conversion?",
    answer:
      "It is the process of converting an existing sole proprietorship business into a Private Limited Company under Section 366 of the Companies Act, 2013, using Form URC-1 along with SPICe+ incorporation. The business gets limited liability, a separate legal identity, the ability to raise equity funding, and far greater credibility — while continuing as the same operation under a corporate structure.",
  },
  {
    question: "How is conversion different from a fresh company registration?",
    answer:
      "A fresh registration is for starting a brand-new business. A conversion is for an already-running proprietorship moving into a company structure under Section 366. It involves extra legal steps — newspaper publication (URC-2), creditor consent, an audited statement of accounts, and URC-1 documentation — that a fresh incorporation does not require, which is why it takes longer and costs a little more.",
  },
  {
    question: "What is Form URC-1?",
    answer:
      "Form URC-1 is the main MCA application used to register an existing business as a company under Section 366. It includes the business details, audited financial statements, list of members and creditors, declarations, and supporting documents, and is filed alongside the SPICe+ incorporation forms.",
  },
  {
    question: "Why is a newspaper advertisement required?",
    answer:
      "Before the conversion is registered, a public notice in Form URC-2 must be published in one English and one vernacular newspaper inviting objections from creditors or the public. This is a mandatory transparency requirement under the conversion rules, ensuring that anyone with a claim against the proprietorship can be heard.",
  },
  {
    question: "How many people are needed to convert to a Private Limited Company?",
    answer:
      "A Private Limited Company requires a minimum of two shareholders and two directors. Since a proprietorship has a single owner, you must bring in at least one more member — typically a co-founder, family member, or trusted associate — to meet this requirement. The company can have up to 200 shareholders.",
  },
  {
    question: "How long does the conversion take?",
    answer:
      "Most conversions take around 35 to 50 working days, depending on how quickly documents are ready, the newspaper publication and objection period, the audit of accounts, and MCA processing. We work to keep the timeline tight by preparing the URC-1 pack and URC-2 notice in parallel with the incorporation steps.",
  },
  {
    question: "What happens to my GST, bank account, and licences?",
    answer:
      "Because the Private Limited Company is a new legal entity with a new PAN, fresh registrations are taken in the company's name — a new GST registration, a new bank account, and migration of Udyam, IEC, and other licences. The proprietorship's old registrations are then surrendered. We handle this migration so nothing is left under the old proprietorship.",
  },
  {
    question: "Can I keep my existing business name and brand?",
    answer:
      "In most cases yes, subject to the MCA's name-approval rules. The legal name of the company will end with 'Private Limited', while your existing brand or trade name can generally continue. If the name is already trademarked in your personal name, it can be assigned to the company.",
  },
  {
    question: "How does Legal Terminus help convert my proprietorship to a Pvt Ltd?",
    answer:
      "We handle the entire Section 366 conversion end-to-end: eligibility and member structuring, DSC/DIN, name reservation, the URC-1 statutory pack, the URC-2 newspaper notice, MOA/AOA and SPICe+ incorporation — then GST/bank/licence migration, surrender of the proprietorship registrations, and a first-year compliance calendar. Book a free consultation to get started.",
  },
];

const PtopvtFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Proprietorship to Private Limited — FAQs</h2>
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

export default PtopvtFAQ;
