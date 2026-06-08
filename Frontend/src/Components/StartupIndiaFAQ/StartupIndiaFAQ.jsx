import React, { useState } from "react";
import "../PvtltdFAQ/PvtltdFAQ.css";

const faqs = [
  {
    question: "What is Startup India / DPIIT Recognition?",
    answer:
      "Startup India is an initiative launched by the Government of India to support innovation and entrepreneurship. DPIIT Recognition is an official recognition issued by the Department for Promotion of Industry and Internal Trade (DPIIT) to eligible startups. Recognized startups may become eligible for various benefits such as tax exemptions, startup funding support, trademark and patent fee rebates, easier government tender participation, and Startup India scheme benefits.",
  },
  {
    question: "Who is eligible for DPIIT recognition in 2026?",
    answer: (
      <span>
        To apply for DPIIT Startup Recognition, the entity must meet the following conditions:
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>Must be a Private Limited Company, LLP, or Registered Partnership Firm</li>
          <li>Should not be older than 10 years from incorporation</li>
          <li>Annual turnover should not exceed Rs.200 Crores in any financial year (Rs.300 Crores for Deep Tech startups)</li>
          <li>Must be working towards innovation, development, improvement, or a scalable business model</li>
        </ul>
        Sole Proprietorships are not eligible for DPIIT recognition.
      </span>
    ),
  },
  {
    question: "What is the total cost of Startup India Registration?",
    answer:
      "There is no government fee for DPIIT Startup Recognition. Our professional fee covers eligibility review, startup profile drafting, document support, and application filing. Additional charges may apply for DSC, trademark filing, or other services depending on the selected plan.",
  },
  {
    question: "How long does DPIIT recognition take?",
    answer:
      "DPIIT Startup Recognition is generally processed within 3–5 working days after successful submission of documents and application details. Approval timelines may vary depending on document verification and DPIIT review.",
  },
  {
    question: "What's Section 80-IAC and how do I claim the 3-year tax holiday?",
    answer:
      "Section 80-IAC provides eligible DPIIT-recognized startups with income tax benefits for a specified period, subject to approval from the Inter-Ministerial Board (IMB). This approval process is separate from DPIIT Recognition and depends on government eligibility criteria.",
  },
  {
    question: "What's the Section 56(2)(viib) angel tax exemption?",
    answer:
      "Section 56(2)(viib) of the Income Tax Act, 1961 - the 'angel tax' - has been ABOLISHED with effect from 1 April 2025 via the Finance Act, 2024. The provision that taxed share premium above fair market value at 30% in a startup's hands no longer exists for FY 2025-26 onwards. This applies to all investors - domestic and foreign. No Form 2 declaration, no DPIIT exemption certificate, and no merchant banker valuation is required for new fundraises. If your startup received angel tax demand notices for AY 2024-25 or earlier years, those assessments continue under the old law and need to be addressed separately with a tax advisor.",
  },
  {
    question: "Can a sole proprietorship apply for DPIIT recognition?",
    answer:
      "No. Sole Proprietorships are not eligible for DPIIT Recognition. Only Private Limited Companies, LLPs, and Registered Partnership Firms can apply under the Startup India scheme.",
  },
  {
    question: "Once recognised, are there ongoing compliance requirements?",
    answer:
      "Yes. Recognized startups may need to update their Startup India profile, submit declarations, and maintain regular compliance with applicable laws such as ROC filings, GST filings, Income Tax returns, and other statutory requirements. DPIIT recognition may lapse once the entity crosses the eligibility limits prescribed under the Startup India scheme.",
  },
  {
    question: "How can Legal Terminus help me with Startup India recognition?",
    answer:
      "Legal Terminus provides complete assistance for Startup India registration, including eligibility review, startup profile drafting, document support, DPIIT filing, and post-recognition guidance. We also assist startups with DSC coordination, trademark filing, and profile update support based on the selected plan.",
  },
];

const StartupIndiaFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="faq-section">
      <div className="faq-container">

        <div className="faq-header">
          <h2 className="faq-title">Startup India Registration — FAQs</h2>
          <p className="faq-intro">
            Got questions? We've got answers — straight, no-BS, legally accurate.
          </p>
        </div>

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

export default StartupIndiaFAQ;
