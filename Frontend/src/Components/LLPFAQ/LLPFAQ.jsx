import React, { useState } from "react";
import "./LLPFAQ.css";

const faqs = [
  {
    question: "How many partners do I need to register an LLP in 2026?",
    answer: (
      <div>
        <p>You need minimum 2 partners to register an LLP.</p>
        <ul>
          <li>At least 1 partner must be a resident in India</li>
          <li>There is no maximum limit on partners</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Is there a minimum capital requirement for LLP?",
    answer:
      "No. The LLP Act, 2008 imposes no minimum contribution. You can start with ₹1, ₹100, ₹1 lakh, or ₹1 crore — your call. Keep it modest at incorporation to keep stamp duty and FiLLiP fees low. Capital can be increased later via supplementary LLP Agreement + Form 3 amendment.",
  },
  {
    question: "How is the new pricing model exclusive of government fees? What will I actually pay in total?",
    answer:
      "Our pricing includes only our professional services such as drafting, filing, advisory, and complete support until your LLP is registered. Government fees like FiLLiP filing, name approval, stamp duty, Form 3, DPIN, and other charges are paid separately at actuals. Additionally, DSC costs ₹1,999 per partner. For a typical 2-partner LLP, these extra costs are usually around ₹4,500 to ₹7,000, depending on the state and contribution amount. We always inform you of the exact total cost in advance, so there are no hidden charges or surprises.",
  },
  {
    question: "How long does LLP registration take in 2026?",
    answer: (
      <div>
        <p>It usually takes 10–15 working days. Delays may happen if:</p>
        <ul>
          <li>Name is rejected</li>
          <li>Documents are incorrect</li>
        </ul>
      </div>
    ),
  },
  {
    question: "LLP vs Pvt Ltd — which one should I choose?",
    answer: (
      <div>
        <p>It depends on your business needs:</p>
        <p><strong>Choose LLP if:</strong></p>
        <ul>
          <li>You want less compliance</li>
          <li>You are running a small or professional business</li>
        </ul>
        <p><strong>Choose Private Limited if:</strong></p>
        <ul>
          <li>You want funding or investors</li>
          <li>You plan to scale fast</li>
        </ul>
      </div>
    ),
  },
  {
    question: "What is a 'Small LLP' and why does it matter?",
    answer:
      "Introduced via the LLP Amendment Act, 2021. A Small LLP has contribution ≤ ₹25 lakh AND turnover ≤ ₹40 lakh in the preceding FY (both conditions must be met). Benefits: 50% lower MCA filing fees, no mandatory statutory audit (saves ~₹20-25K annually), simplified Form 11 annual return, lower additional fees on delayed filings. Worth structuring for if you can keep within the thresholds.",
  },
  {
    question: "What annual compliance does an LLP need?",
    answer: (
      <div>
        <p>LLP has simple compliance requirements:</p>
        <ul>
          <li>Form 11 (Annual Return)</li>
          <li>Form 8 (Financial Statement)</li>
          <li>Income Tax Return</li>
          <li>Audit is required only if turnover or capital crosses limits</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Can I convert my existing Partnership Firm or Pvt Ltd into an LLP?",
    answer:
      "Yes, you can convert your existing Partnership Firm or Private Limited Company into an LLP.",
  },
  {
    question: "Can foreign nationals or NRIs be partners in an LLP?",
    answer:
      "Yes, but at least one designated partner must be resident in India. NRIs and foreign individuals / bodies can be partners. FDI is allowed under the automatic route in most sectors (LLPs in agriculture, real estate, print media are restricted). For foreign partner contribution, FEMA reporting via FC-GPR within 30 days and annual FLA Return filing applies.",
  },
  {
    question: "How can Legal Terminus help me register my LLP?",
    answer:
      "Legal Terminus handles your complete LLP registration process from start to finish. Our experienced professionals take care of name approval, documentation, and filing to ensure everything is done correctly. We offer transparent pricing with no hidden charges and guide you even after registration. The entire process is smooth, hassle-free, and usually completed within 15 working days.",
  },
];

const FaqLLP = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="llpfaq-section">
      <div className="llpfaq-container">

        <div className="llpfaq-header">
          <h2 className="llpfaq-title">Limited Liability Partnership Registration — FAQs</h2>
          <p className="llpfaq-intro">
            Explore answers to frequently asked questions on LLP registration in India — benefits, eligibility, compliance, and more.
          </p>
        </div>

        <div className="llpfaq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`llpfaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="llpfaq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`llpfaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`llpfaq-answer ${isActive ? "open" : ""}`}>
                  <div className="llpfaq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FaqLLP;
