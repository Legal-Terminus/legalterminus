import React, { useState } from "react";
import "./PublicltdFAQ.css";

const FAQ_ITEMS = [
  {
    question: "How many directors and shareholders do I need for a Public Limited Company?",
    answer:
      "Minimum 3 directors (max 15 without special resolution) and minimum 7 subscribers / shareholders (no upper limit). Section 3(1)(a) and Section 149 of the Companies Act, 2013 govern this. Compare this to Private Limited which needs only 2 directors and 2 shareholders.",
  },
  {
    question: "Is there a minimum capital requirement to register a PLC in 2026?",
    answer:
      "No. The Companies (Amendment) Act, 2015 abolished the earlier ₹5 lakh minimum paid-up capital requirement for Public Limited Companies. You can start with any amount, but most companies choose ₹1 lakh to ₹5 lakh authorized capital based on their business needs.",
  },
  {
    question: "How long does it take to register a Public Limited Company?",
    answer:
      "On average, it takes 10–15 working days, depending on approvals and document accuracy. Delays usually happen due to name rejection or incorrect documents.",
  },
  {
    question: "What's the difference between a Public Limited and a Private Limited Company?",
    answer: (
      <span>
        Three big differences:<br />
        (1) Min directors / subscribers — Public Limited needs 3 directors &amp; 7 shareholders; Private Limited needs 2 each.<br />
        (2) Share transfer — PLC is free, Pvt Ltd is restricted by AOA.<br />
        (3) Public fundraising — PLC can issue shares to the public and list on stock exchanges; Pvt Ltd cannot.
      </span>
    ),
  },
  {
    question: "Can I convert a Private Limited Company into a Public Limited Company later?",
    answer: (
      <span>
        Yes. A Private Limited Company can be converted into a Public Limited Company by:
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>Passing a special resolution</li>
          <li>Amending MOA &amp; AOA</li>
          <li>Filing required forms with MCA</li>
        </ul>
        The process usually takes 30–45 days.
      </span>
    ),
  },
  {
    question: "What is SPICe+ and AGILE-PRO-S?",
    answer:
      "SPICe+ (INC-32) is the master incorporation form on MCA21 V3 — a single window that handles name reservation (Part A) and incorporation (Part B). AGILE-PRO-S (INC-35) is the linked form that bundles PAN, TAN, EPFO, ESIC, GST, Professional Tax, Shops & Establishment, and bank account opening. One filing, one set of forms — that's the post-2020 reform.",
  },
  {
    question: "Are stamp duty charges included in the registration fees?",
    answer:
      "No. Stamp duty is charged separately and depends on your state and authorized capital. The exact amount is shown during filing and must be paid online.",
  },
  {
    question: "Do all 7 subscribers and 3 directors need a Digital Signature Certificate?",
    answer:
      "Yes. All subscribers to the MOA must sign electronically using a Class 3 DSC. All directors also need DSCs to sign SPICe+, the consent letter (DIR-2) and eform-INC 9.",
  },
  {
    question: "What annual compliance does a PLC have to do after incorporation?",
    answer:
      "Unlisted PLC: AGM within 6 months of FY-end, Form MGT-7 (annual return), AOC-4 (financial statements), DIR-3 KYC for every director, INC-22A (ACTIVE) if not already filed, statutory audit, board meetings (4 per year minimum), and event-based filings (PAS-3, MGT-14, etc.) when triggered. Listed PLC adds quarterly results, LODR disclosures, insider trading code, related party transaction reporting — substantially heavier.",
  },
  {
    question: "How can Legal Terminus help with Public Limited Company registration?",
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

const LlpFaqs = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="pubfaq-section">
      <div className="pubfaq-container">

        <div className="pubfaq-header">
          <h2 className="pubfaq-title">Public Limited Company Registration — FAQs</h2>
          <p className="pubfaq-intro">
            Find answers to common questions about Public Limited Company registration in India.
          </p>
        </div>

        <div className="pubfaq-list">
          {FAQ_ITEMS.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`pubfaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="pubfaq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`pubfaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`pubfaq-answer ${isActive ? "open" : ""}`}>
                  <div className="pubfaq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default LlpFaqs;
