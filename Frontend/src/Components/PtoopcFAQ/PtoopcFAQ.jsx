import React, { useState } from "react";
import "./PtoopcFAQ.css";

const faqs = [
  {
    question: "Can a sole proprietorship be converted into an OPC?",
    answer:
      "Yes — though legally it is done by incorporating a new One Person Company and transferring the proprietorship's business into it, because a proprietorship is not a separate legal entity that can be 'converted' by statute. We incorporate the OPC through SPICe+ and execute a takeover agreement to move the assets, liabilities, and contracts into the company.",
  },
  {
    question: "Who is eligible to form an OPC?",
    answer:
      "Only a natural person who is an Indian citizen and resident in India can incorporate and be the member of an OPC. A nominee — also an Indian citizen and resident — must be appointed. A person can be a member of only one OPC at a time and cannot be a nominee in more than one OPC.",
  },
  {
    question: "What is a nominee and why is it required?",
    answer:
      "Because an OPC has only one member, the law requires a nominee to be named at incorporation through Form INC-3. The nominee steps into the member's place in the event of the member's death or incapacity, ensuring the company continues without disruption. The nominee's written consent is filed along with their KYC.",
  },
  {
    question: "Does converting to an OPC affect my control over the business?",
    answer:
      "No. You remain the single member and typically the sole director, so you retain 100% ownership and complete decision-making control — exactly as in a proprietorship. The difference is only that the business now sits inside a company that gives you limited liability and a separate legal identity.",
  },
  {
    question: "What happens to my existing GST, bank account, and licences?",
    answer:
      "Since the OPC is a new legal entity, fresh registrations are taken in the company's name — a new GST registration, a new bank account, and migration of Udyam, IEC, and other licences. The proprietorship's old registrations are then surrendered. We handle this migration so nothing is left under the old proprietorship.",
  },
  {
    question: "What are the compliance requirements of an OPC?",
    answer:
      "An OPC is a company, so it must file annual ROC returns (financial statements in AOC-4 and the abridged annual return MGT-7A), maintain statutory registers and minutes, hold the required board meeting(s), complete director KYC, and have its accounts audited each year. This is more than a proprietorship's near-nil compliance, but far lighter than a public company's.",
  },
  {
    question: "Is there a turnover or capital limit for an OPC?",
    answer:
      "Earlier an OPC was required to convert into a private company if its paid-up capital crossed ₹50 lakh or turnover crossed ₹2 crore, but that mandatory threshold was removed. An OPC can now grow without a forced conversion and may convert into a private or public company voluntarily whenever it chooses.",
  },
  {
    question: "Can an OPC be converted into a private limited company later?",
    answer:
      "Yes. When the business grows or you want to bring in investors or additional shareholders, an OPC can be converted into a private limited (or public) company through the prescribed MCA process. Starting as an OPC gives you a clean corporate foundation to scale from when the time is right.",
  },
  {
    question: "How does Legal Terminus help convert my proprietorship to an OPC?",
    answer:
      "We handle everything end-to-end: eligibility check, DSC/DIN, name reservation, drafting the MOA/AOA and the nominee's INC-3 consent, SPICe+ incorporation, and the takeover agreement that transfers your business into the OPC — then GST/bank/licence migration, surrender of the proprietorship registrations, and a first-year compliance calendar. Book a free consultation to get started.",
  },
];

const PtoopcFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Proprietorship to OPC — FAQs</h2>
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

export default PtoopcFAQ;
