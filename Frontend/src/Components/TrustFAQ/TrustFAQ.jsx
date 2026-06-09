import React, { useState } from "react";
import "./TrustFAQ.css";

const faqs = [
  {
    question: "What is a Trust and who should register one?",
    answer: "A Trust is a legal structure created for charitable, religious, educational, medical, family, or social welfare purposes. In a Trust, the Settlor transfers property or assets to Trustees, who manage them for the benefit of the beneficiaries or the public. Trust Registration in India is ideal for founders, families, NGOs, temples, educational initiatives, and charitable organisations looking for a simple and cost-effective non-profit structure with long-term continuity.",
  },
  {
    question: "What is the minimum requirement to register a Trust in India?",
    answer: "Generally, a minimum of 2 trustees are required to register a Trust in India. One person acts as the Settlor (Author of the Trust), and the others act as Trustees. The exact requirements may vary slightly depending on the state.",
  },
  {
    question: "How long does Trust Registration take?",
    answer: "Trust Registration usually takes around 15–22 working days, depending on the state, document readiness, and appointment availability at the Sub-Registrar or Charity Commissioner office. If 12A and 80G registrations are included, the Income Tax approval process may take additional time.",
  },
  {
    question: "What is included in your Trust Registration service?",
    answer: "Our service includes Trust Deed drafting, document preparation, registration coordination, and support with the Sub-Registrar or Charity Commissioner office. The Enriched Plan includes 12A and 80G registration support. The Supreme Plan includes additional compliance and advisory support such as CSR-1 and FCRA readiness guidance.",
  },
  {
    question: "How is your pricing structured?",
    answer: "Our professional fee covers drafting, advisory, filing support, and registration coordination. Government expenses such as stamp duty, notarisation charges, and registration fees are charged separately at actuals, as these vary from state to state. We always provide a clear cost estimate before starting the process.",
  },
  {
    question: "What is 12A and 80G registration?",
    answer: "12A and 80G are registrations under the Income Tax Act that help charitable Trusts receive tax benefits. 12A Registration helps the Trust claim income tax exemption on its surplus income. 80G Registration allows donors to claim tax deduction on eligible donations made to the Trust. These registrations are highly recommended for NGOs and charitable Trusts planning to raise donations or CSR funding.",
  },
  {
    question: "Should I register a Trust, Society, or Section 8 Company?",
    answer: "It depends on your goals. Trust is best for founder-driven or family-managed charitable activities with simple compliance. Society is suitable for member-driven organisations, associations, clubs, and groups. Section 8 Company is preferred for larger NGOs requiring higher corporate credibility and structured governance.",
  },
  {
    question: "Can the Settlor also become a Trustee?",
    answer: "Yes. The Settlor can also act as one of the Trustees of the Trust. This is common in founder-led charitable or family Trusts. However, a Trust should have at least two trustees for smooth governance and administration.",
  },
  {
    question: "Can a Trust receive CSR funds?",
    answer: "Yes, but the Trust must first obtain registrations such as 12A, 80G, and CSR-1. CSR-1 registration is mandatory for receiving CSR contributions from companies under the Companies Act, 2013.",
  },
  {
    question: "Can a Trust receive foreign donations?",
    answer: "Yes, but only after obtaining registration or prior permission under the Foreign Contribution Regulation Act (FCRA), 2010. Generally, a Trust becomes eligible for full FCRA registration after completing 3 years of active charitable operations.",
  },
  {
    question: "What is the difference between a Public Trust and a Private Trust?",
    answer: "Public Trust is created for charitable or public welfare purposes such as education, healthcare, religion, or social work. Private Trust is created for specific individuals or family beneficiaries, mainly for wealth management or succession planning.",
  },
  {
    question: "What support do you provide after registration?",
    answer: "Every plan includes free Trust-update support for 1 year. We assist with basic updates such as trustee changes, address changes, contact corrections, and profile updates. Additional amendment or supplementary deed registrations are handled separately.",
  },
  {
    question: "Is PAN mandatory for a Trust?",
    answer: "Yes. After Trust Registration, applying for PAN is highly recommended as it is required for opening a bank account, applying for 12A/80G, receiving donations, and carrying out financial transactions.",
  },
  {
    question: "Can a Trust open a bank account?",
    answer: "Yes. Once the Trust is registered and PAN is obtained, the Trust can open a current bank account in its own name for receiving donations, grants, and operational funds.",
  },
  {
    question: "How can Legal Terminus help with Trust Registration in India?",
    answer: "Legal Terminus provides end-to-end assistance for Trust Registration in India, including custom Trust Deed drafting, registration coordination, 12A and 80G filing support, UDYAM, GST and post-registration guidance. Our team focuses on creating legally strong Trust structures with clear object clauses and smooth compliance support so your organisation is ready for long-term operations.",
  },
];

const FaqTrust = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="trufaq-section">
      <div className="trufaq-container">

        <div className="trufaq-header">
          <h2 className="trufaq-title">Trust Registration in India — FAQs</h2>
          <p className="trufaq-intro">
            Clear answers to the most common questions on trust registration — from documents and timelines to tax benefits and trustee eligibility.
          </p>
        </div>

        <div className="trufaq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`trufaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="trufaq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`trufaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`trufaq-answer ${isActive ? "open" : ""}`}>
                  <div className="trufaq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FaqTrust;
