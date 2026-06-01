import React, { useState } from "react";
import "./PFRfaq.css";

const faqs = [
  {
    question: "Is registration of a Partnership Firm mandatory in 2026?",
    answer:
      "No, registration is not mandatory. You can start and run a Partnership Firm without registering it. However, an unregistered firm cannot file a legal case to recover money or enforce agreements. That's why registration is strongly recommended.",
  },
  {
    question: "How many partners can a Partnership Firm have?",
    answer:
      "Minimum 2 partners. Maximum 50 partners under Rule 10 of the Companies (Miscellaneous) Rules, 2014. Only natural persons (individuals) — not companies, LLPs, trusts, or HUFs as entities — can be partners. Indian residents and NRIs both qualify; foreign nationals can also be partners subject to FEMA conditions.",
  },
  {
    question: "How long does Partnership Firm registration take?",
    answer:
      "Unregistered firms (Elemental tier): 5–7 working days from start of Deed drafting to PAN allotment. Registered firms (Enriched / Supreme): 10–15 working days end-to-end, depending on the state's RoF processing speed. Maharashtra, Karnataka, Tamil Nadu, and Delhi are typically fastest; some northern and eastern states have longer queues.",
  },
  {
    question: "Should I choose Partnership Firm or LLP?",
    answer: (
      <div>
        <p><strong>Choose Partnership Firm if:</strong></p>
        <ul>
          <li>You want a simple and low-cost setup</li>
          <li>You are working with trusted partners</li>
        </ul>
        <p><strong>Choose LLP if:</strong></p>
        <ul>
          <li>You want limited liability protection</li>
          <li>You plan to grow or take higher risks</li>
        </ul>
      </div>
    ),
  },
  {
    question: "What is Section 69 and why does it matter so much?",
    answer:
      "Section 69 of the Indian Partnership Act, 1932 says: an UNREGISTERED firm cannot file a suit in court to enforce any right arising from a contract — against third parties OR against partners. So if your customer doesn't pay, or if your business partner cheats you, you have no legal remedy unless your firm is registered. There's a narrow exception: partners CAN sue for dissolution and settlement of accounts even if the firm is unregistered. But for everything else — registration is what gives the Deed teeth.",
  },
  {
    question: "How are Partnership Firms taxed in 2026?",
    answer:
      "Partnership Firms are taxed at a flat 30% on profits (plus 12% surcharge if income > ₹1 cr, plus 4% Health & Education Cess). After the firm pays tax, partners can withdraw their share of profit tax-free under Section 10(2A) — there's no double taxation. Partners' remuneration and interest on capital are deductible at the firm level (subject to Section 40(b) limits). Firms below ₹1cr / ₹2cr turnover can opt for Section 44AD presumptive tax — 6%/8% of turnover declared as income, no audit.",
  },
  {
    question: "Can I add or remove a partner after the firm is registered?",
    answer:
      "Yes. You execute a Supplementary Partnership Deed (or Deed of Reconstitution) reflecting the change — admission, retirement, expulsion, or death of a partner. Notarise it, and if your firm is registered, file Form 5 with the RoF within 90 days. Stamp duty applies on the supplementary Deed (similar to original). We handle reconstitution under our Annual Compliance retainer.",
  },
  {
    question: "Can a Partnership Firm be converted to an LLP or Pvt Ltd later?",
    answer: (
      <div>
        <p>Yes, you can convert Partnership Firm to:</p>
        <ul>
          <li>LLP (simpler process)</li>
          <li>Private Limited Company (slightly complex)</li>
          <li>Many businesses convert as they grow</li>
        </ul>
      </div>
    ),
  },
  {
    question: "How can Legal Terminus help me register my Partnership Firm?",
    answer:
      "Legal Terminus takes care of your entire Partnership registration process from start to finish. We draft a clear and legally sound Partnership Deed, handle all documentation and registration work, and guide you at every step. Our pricing is transparent with no hidden charges, and we ensure the process is smooth and hassle-free, usually completed within 15 working days.",
  },
];

const PFRFaq = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="pfr-faq-section">
      <div className="pfr-faq-container">

        <div className="pfr-faq-header">
          <h2 className="pfr-faq-title">Partnership Firm Registration — FAQs</h2>
          <p className="pfr-faq-intro">
            Got questions? We've got answers — clear, accurate, and straight to the point.
          </p>
        </div>

        <div className="pfr-faq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`pfr-faq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="pfr-faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`pfr-faq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`pfr-faq-answer ${isActive ? "open" : ""}`}>
                  <div className="pfr-faq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default PFRFaq;
