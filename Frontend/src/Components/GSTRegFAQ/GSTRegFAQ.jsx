import React, { useState } from "react";
import "./GSTRegFAQ.css";

const faqs = [
  {
    question: "When is GST registration mandatory?",
    answer: "GST registration is mandatory when annual turnover exceeds ₹40 lakh (goods) or ₹20 lakh (services). E-commerce sellers must register regardless of turnover. Inter-state suppliers are also mandatorily covered. Voluntary registration is available for businesses below the threshold who want to claim ITC.",
  },
  {
    question: "What documents are required for GST registration?",
    answer: (
      <span>
        Key documents:<br />
        • PAN + Aadhaar of proprietor / directors / partners<br />
        • Business registration certificate (CoI / Partnership Deed / Trade Licence)<br />
        • Registered office proof (rent agreement + electricity bill, or owned property proof)<br />
        • Cancelled cheque + bank statement<br />
        • Authorisation letter for the authorised signatory
      </span>
    ),
  },
  {
    question: "How long does GST registration take?",
    answer: "With Aadhaar authentication: 3–7 working days for clean applications. Without Aadhaar auth: up to 30 days as the application goes to a GST officer for physical verification. We always recommend Aadhaar-linked registration for fastest approval.",
  },
  {
    question: "Is the government fee for GST registration NIL?",
    answer: "Yes. The Central Government does not charge any fee for GST registration. Our professional fee covers advisory, document review, HSN/SAC mapping, application filing, ARN tracking, and GSTIN delivery. All costs are quoted upfront — no surprises.",
  },
  {
    question: "What is the difference between Regular and Composition scheme?",
    answer: (
      <span>
        Regular scheme: charge GST on sales, claim ITC on purchases, file GSTR-1 + GSTR-3B monthly/quarterly.<br /><br />
        Composition scheme: pay a flat low rate (1%–6%) on turnover, no ITC, file GSTR-4 annually. Eligible for businesses with turnover below ₹1.5 crore (goods) or ₹50L (services). Cannot supply inter-state.
      </span>
    ),
  },
  {
    question: "Can a proprietorship, freelancer, or home-based business register for GST?",
    answer: "Yes. Any business structure — proprietorship, partnership, company, LLP, freelancer, home-based business — can register for GST. The structure does not matter; what matters is turnover threshold or mandatory coverage (e-commerce, inter-state).",
  },
  {
    question: "How can Legal Terminus help with GST registration?",
    answer: "Legal Terminus handles the full process — document review, HSN/SAC code mapping, application filing, Aadhaar authentication coordination, ARN tracking, and GSTIN certificate delivery. You provide the documents; we do everything else. Setup typically completed within 7 working days.",
  },
];

const GSTRegFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="faq-section">
      <div className="faq-container">

        <div className="faq-header">
          <h2 className="faq-title">GST Registration — FAQs</h2>
          <p className="faq-intro">
            Common questions about GST registration eligibility, documents, timelines, and compliance — answered honestly.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div key={index} className={`faq-item ${isActive ? "active" : ""}`}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`faq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`faq-answer ${isActive ? "open" : ""}`}>
                  <div className="faq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default GSTRegFAQ;
