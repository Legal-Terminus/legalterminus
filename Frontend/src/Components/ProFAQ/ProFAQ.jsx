import React, { useState } from "react";
import "./ProFAQ.css";

const faqs = [
  {
    question: "Is there a single 'Proprietorship Registration' in India in 2026?",
    answer:
      "No, there is no single registration for a proprietorship. A proprietorship does not have a separate legal identity. Instead, you create your business identity by taking a few registrations like MSME (Udyam), Shop & Establishment, GST (if needed), Trade Licence, and other licences depending on your business.",
  },
  {
    question: "How long does it take to set up a proprietorship?",
    answer:
      "It usually takes 3 to 7 working days, depending on the registrations required.",
  },
  {
    question: "Should I choose Proprietorship, OPC, or LLP?",
    answer:
      "It depends on your needs:\n• Want to protect personal assets? → Go for OPC or LLP\n• Low budget and small business (below ₹50 lakh)? → Proprietorship is best\n• Planning to raise funds or add partners? → OPC or LLP",
  },
  {
    question: "Do I need a separate PAN for my proprietorship?",
    answer:
      "No. The proprietor's individual PAN is also the firm's PAN. There is no separate firm PAN. All invoices, GST registration, bank accounts, and tax filings use the proprietor's PAN. This is one of the reasons proprietorship is cheap and fast to set up — but also why you can't legally separate proprietor finances from firm finances (no separate legal entity).",
  },
  {
    question: "Is GST registration mandatory for a proprietorship?",
    answer:
      "Not always. GST is required only if:\n• Turnover exceeds ₹40 lakh (goods) or ₹20 lakh (services), or\n• You fall under special cases (like inter-state sales or e-commerce)\nOtherwise, GST is optional but can be beneficial.",
  },
  {
    question: "What's the unlimited liability risk in a proprietorship?",
    answer:
      "In a proprietorship, you and your business are the same. If the business has losses or legal issues, your personal assets (house, savings, etc.) can be at risk.",
  },
  {
    question: "Can I convert my proprietorship to a Pvt Ltd / LLP later?",
    answer:
      "Yes, a proprietorship can convert to a Private Limited Company or LLP later. Most successful proprietorships convert in Year 2-3 when liability or capital-raising needs arise.",
  },
  {
    question: "How can Legal Terminus help me set up my proprietorship?",
    answer:
      "Legal Terminus takes care of your entire proprietorship registration process from start to finish. We identify the right set of registrations for your business (such as MSME, Shop & Establishment, GST, and other licenses if required), handle all documentation and filings, and guide you at every step. Our pricing is transparent with no hidden charges, and we ensure a smooth and hassle-free setup, usually completed within 5 to 15 working days.",
  },
];

const FaqPvt = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-left">
          <h2 className="faq-title">Proprietorship Firm Registration FAQ's</h2>
          <p className="faq-intro">
            Common questions about setting up a proprietorship firm in India — answered honestly.
          </p>
        </div>

        <div className="faq-right">
          <div className="faq-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`faq-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`faq-icon ${isActive ? "open" : ""}`}>▾</span>
                  </button>
                  {isActive && (
                    <div className={`faq-answer ${isActive ? "open" : ""}`}>
                      <p style={{ whiteSpace: "pre-line" }}>{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqPvt;
