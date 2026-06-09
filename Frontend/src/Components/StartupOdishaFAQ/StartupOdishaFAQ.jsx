import React, { useState } from "react";
import "../PvtltdFAQ/PvtltdFAQ.css";

const faqs = [
  {
    question: "What is Startup Odisha Recognition?",
    answer:
      "Startup Odisha Recognition is an official recognition issued by the Government of Odisha under the Startup Odisha initiative for eligible startups operating in the state. It helps startups become part of Odisha's recognized startup ecosystem and may provide access to various state-level schemes, startup programs, mentoring opportunities, networking support, and other benefits offered under the Odisha Startup Policy.",
  },
  {
    question: "Is Startup Odisha the same as central DPIIT Startup India?",
    answer:
      "No. Startup Odisha Recognition and DPIIT Startup India Recognition are two separate recognitions issued by different authorities. Startup Odisha Recognition is issued by the Government of Odisha, while DPIIT Startup India Recognition is issued by the Department for Promotion of Industry and Internal Trade (DPIIT), Government of India. Under our plans, the Elemental plan includes Startup Odisha Recognition only, whereas the Enriched and Supreme plans include both Startup Odisha and DPIIT Startup India Recognition support.",
  },
  {
    question: "What scope does your service cover?",
    answer:
      "Our services mainly cover registration, filing, and recognition support. The Elemental Plan includes Startup Odisha Recognition filing. The Enriched Plan includes Startup Odisha Recognition, DPIIT Startup India Recognition, and Organizational DSC coordination support. The Supreme Plan includes all services of the Enriched Plan along with Trademark application filing for 1 class. Grant applications, subsidy claims, funding assistance, reimbursement claims, or government benefit applications are not included unless specifically mentioned.",
  },
  {
    question: "What is the total cost of Startup Odisha Registration?",
    answer:
      "There is no government fee for Startup Odisha Recognition or DPIIT Startup India Recognition. Our professional fee covers eligibility review, profile drafting, document support, application filing, and coordination services. Additional charges may apply for DSC or Trademark filing depending on the selected plan. Complete pricing details are shared transparently before starting the application process.",
  },
  {
    question: "How long does Startup Odisha recognition take?",
    answer:
      "Startup Odisha Recognition is generally processed within 7–15 working days, subject to document verification, application review, and Startup Cell approval timelines. Delays may occur if additional clarification or supporting documents are requested by the authorities.",
  },
  {
    question: "Who is eligible for Startup Odisha recognition?",
    answer:
      "Eligible startups generally include Private Limited Companies, OPCs, LLPs and Registered Partnership Firms operating in Odisha. The startup should normally be innovation-driven, growth-oriented, and should satisfy the eligibility conditions prescribed under the Startup Odisha Policy, including turnover and age limits.",
  },
  {
    question: "Are there any special benefits for women-led startups under Startup Odisha?",
    answer:
      "Yes. Startup Odisha provides additional benefits and financial support for eligible women-led startups and startups founded by transgender entrepreneurs or founders belonging to SC/ST/SEBC/PH categories. Recognised startups generally receive a monthly allowance of Rs.20,000 for up to one year (subject to fulfilling qualifying conditions). For startups where Founder(s)/Co-Founder(s) are Women, Transgender, or from SC/ST/SEBC/PH categories with at least 50% equity, the monthly allowance is enhanced to Rs.22,000. Additionally, such startups may receive financial assistance of up to Rs.16 Lakhs towards product development and marketing/publicity support, subject to approval and policy conditions. To avail these benefits, women, transgender, or SC/ST/SEBC/PH founders or co-founders must hold at least 50% equity ownership in the startup entity. The final approval and disbursement of benefits are subject to eligibility verification and the applicable Startup Odisha Policy guidelines.",
  },
  {
    question: "Do recognized startups automatically receive grants or subsidies?",
    answer:
      "No. Startup Odisha Recognition does not automatically guarantee grants, subsidies, funding, or financial assistance. Recognition only helps eligible startups apply for various government schemes and benefits separately, subject to approval and policy conditions.",
  },
  {
    question: "Can a sole proprietorship apply for Startup Odisha recognition?",
    answer:
      "No, a sole proprietorship is not eligible for Startup Odisha recognition. Eligible entity types are Private Limited Company, LLP, and Registered Partnership Firm only.",
  },
  {
    question: "How can Legal Terminus help me with Startup Odisha?",
    answer:
      "Legal Terminus provides complete assistance for Startup Odisha Recognition, including eligibility review, startup profile drafting, document support, application filing, and query handling support. Depending on the selected plan, we also assist with DPIIT Startup India Recognition, Organizational DSC coordination, and Trademark application filing through dedicated professional support and transparent pricing.",
  },
];

const StartupOdishaFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="faq-section">
      <div className="faq-container">

        <div className="faq-header">
          <h2 className="faq-title">Startup Odisha Registration — FAQs</h2>
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

export default StartupOdishaFAQ;
