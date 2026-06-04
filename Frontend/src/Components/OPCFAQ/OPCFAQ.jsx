import React, { useState } from "react";
import "./OPCFAQ.css";

const faqs = [
  {
    question: "Who is eligible to incorporate a One Person Company in 2026?",
    answer:
      "Only a natural person who is an Indian citizen — resident or NRI (post-2021 amendment) — and who has stayed in India for at least 120 days in the immediately preceding financial year. Bodies corporate, LLPs, trusts, partnership firms, and foreign nationals are NOT eligible. Also: one person can be a member of only one OPC and a nominee in only one OPC at the same time.",
  },
  {
    question: "Why does an OPC need a nominee, and what does the nominee do?",
    answer: (
      <span>
        Since there is only one owner, a nominee is required for safety.
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>If something happens to the owner, the nominee will take over the company.</li>
          <li>The nominee has no role in daily business — only acts as a backup.</li>
        </ul>
      </span>
    ),
  },
  {
    question: "Is there a minimum capital requirement for OPC?",
    answer: (
      <span>
        No, there is no minimum capital requirement.
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>You can start with any amount</li>
          <li>₹1 lakh is commonly used, but not compulsory</li>
          <li>You can increase capital later if needed</li>
        </ul>
      </span>
    ),
  },
  {
    question: "How long does OPC registration take in 2026?",
    answer:
      "7–10 working days end-to-end on average. Day 1–2 for DSC + nominee consent, Day 2–4 for name approval (SPICe+ Part A), Day 5–6 for MOA/AOA + SPICe+ Part B, Day 6–9 for CRC examination, Day 7–10 for COI handover. The biggest delay risks are nominee ineligibility (already a member / nominee of another OPC) and incorrect registered office proof.",
  },
  {
    question: "Can an OPC convert into a Private Limited Company later?",
    answer:
      "Yes — and post-2021, the conversion is voluntary (not forced by turnover or capital thresholds). You file Form INC-6, alter the MOA + AOA via special resolution, induct a second member + second director, and the OPC converts into a Pvt Ltd. Process takes 30–45 days.",
  },
  {
    question: "What annual compliance does an OPC need to do?",
    answer: (
      <span>
        OPC has less compliance than Pvt Ltd, but still some filings are required:
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>Annual Return (MGT-7A)</li>
          <li>Financial Statements (AOC-4)</li>
          <li>Director KYC (if applicable)</li>
          <li>Income Tax Return</li>
          <li>Audit is mandatory</li>
        </ul>
      </span>
    ),
  },
  {
    question: "What businesses can an OPC NOT do?",
    answer: (
      <span>
        Three big restrictions:
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>Non-Banking Financial Investment activities including investment in securities of any body corporate</li>
          <li>Banking, insurance, and NBFC activities</li>
          <li>An OPC cannot be incorporated as a Section 8 company (charitable / not-for-profit)</li>
        </ul>
        If your business model touches any of these, you'll need a Pvt Ltd, PLC, or Section 8 structure. We flag this on the discovery call.
      </span>
    ),
  },
  {
    question: "Can I have more than one director in an OPC?",
    answer:
      "Yes. While OPC has only one member (shareholder), it can have up to 15 directors. Adding a non-shareholder director can be useful for operational delegation, raising bank credit, or bringing in an industry expert without giving away equity. Each additional director needs a DIN + DSC.",
  },
  {
    question: "How can Legal Terminus help me register my One Person Company?",
    answer: (
      <span>
        Legal Terminus handles the complete process, including:
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>Name approval and document preparation</li>
          <li>Filing of all required forms</li>
          <li>End-to-end coordination until Certificate of Incorporation</li>
        </ul>
        You also receive guidance on post-registration compliance to keep your company legally safe.
      </span>
    ),
  },
];

const OPCFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">One Person Company Registration — FAQs</h2>
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

export default OPCFAQ;
