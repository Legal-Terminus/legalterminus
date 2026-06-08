import React, { useState } from "react";
import "../PvtltdFAQ/PvtltdFAQ.css";

const faqs = [
  {
    question: "When is ESIC registration mandatory for a business?",
    answer:
      "ESIC registration becomes mandatory for eligible establishments once the employee strength reaches the prescribed limit under the ESI Act, 1948. In most states, registration is required when the establishment employs 10 or more employees. The registration should generally be obtained within the prescribed time after crossing the threshold limit.",
  },
  {
    question: "Which employees are covered under ESIC?",
    answer:
      "Employees earning gross monthly wages up to ₹21,000 are generally covered under the ESI scheme. For persons with disabilities, the wage limit is ₹25,000 per month. Employees earning above the prescribed wage limit are usually not eligible for ESIC coverage.",
  },
  {
    question: "What is included in the total cost of ESIC registration?",
    answer:
      "There is no government fee for ESIC registration. Our professional fee covers advisory, document support, portal filing, Employer Code registration, employee IP registration assistance, and compliance guidance. Additional charges may apply for DSC procurement, if required.",
  },
  {
    question: "How long does ESIC registration take?",
    answer:
      "ESIC registration is generally completed within 5–7 working days, subject to document availability and successful verification on the ESIC portal.",
  },
  {
    question: "Why is employee family information important in ESIC registration?",
    answer:
      "ESIC benefits are not limited to employees alone. Eligible family members may also receive medical and related benefits under the scheme. Therefore, proper family declaration and employee details are important for smooth benefit access and future claim support.",
  },
  {
    question: "What benefits are available under the ESIC scheme?",
    answer:
      "Eligible employees covered under ESIC may receive various benefits such as medical treatment, maternity benefits, sickness benefits, disablement benefits, dependent benefits, and other social security support as provided under the ESI Act. In many cases, medical benefits also extend to eligible family members of the insured employee.",
  },
  {
    question: "Is ESIC registration mandatory in all locations in India?",
    answer:
      "ESIC applicability may depend on the notified areas and categories prescribed by the government. In some locations or establishment categories, ESIC may not yet be applicable. Applicability should always be checked based on the establishment's location and nature of business.",
  },
  {
    question: "What are the ongoing compliances after ESIC registration?",
    answer:
      "After registration, employers are generally required to maintain employee records, file monthly contributions, update employee details, and comply with periodic ESIC return filing and other applicable compliance requirements under the ESI Act.",
  },
  {
    question: "How can Legal Terminus help with ESIC registration?",
    answer:
      "Legal Terminus provides complete assistance for ESIC registration, including Employer Code registration, employee IP registration support, document preparation, portal filing, and compliance guidance. We also provide support for profile updates, employee corrections, and initial ESIC compliance assistance through dedicated professional support and transparent pricing.",
  },
];

const ESICRegFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="faq-section">
      <div className="faq-container">

        <div className="faq-header">
          <h2 className="faq-title">ESIC Registration — FAQs</h2>
          <p className="faq-intro">
            Answers to the most asked questions about ESIC Registration, compliance, eligibility, and benefits in India.
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

export default ESICRegFAQ;
