import React, { useState } from "react";
import "../PvtltdFAQ/PvtltdFAQ.css";

const faqs = [
  {
    question: "Is it compulsory for establishments to obtain ESIC Registration?",
    answer:
      "Yes. Every establishment covered under the Employees' State Insurance Act, 1948 must register with ESIC once it employs 10 or more employees (in most states and notified industries). Registration must be completed within 15 days of becoming eligible. Failure to register attracts penalties and recovery of unpaid contributions with interest.",
  },
  {
    question: "What is the ESIC Code and how is it used?",
    answer:
      "The ESIC Code is a unique 17-digit employer identification number allotted after successful registration on the ESIC portal. It is used for all compliance activities — monthly contribution filing, employee IP number generation, challan payments, and correspondence with ESIC regional offices.",
  },
  {
    question: "What are the current employer and employee ESIC contribution rates?",
    answer:
      "The employer contributes 3.25% of the employee's gross wages, and the employee contributes 0.75% of gross wages. Employees earning up to ₹137 per day (approximately ₹3,500 per month) are exempted from the employee contribution, though the employer's share remains payable.",
  },
  {
    question: "On what salary is ESIC applicable?",
    answer:
      "ESIC is applicable to employees drawing a monthly gross salary of up to ₹21,000 (₹25,000 for persons with disabilities). Employees earning above this threshold are not covered under ESIC.",
  },
  {
    question: "What benefits do employees get after ESIC Registration?",
    answer:
      "Covered employees and their families receive sickness benefit (70% of wages), maternity benefit, disablement benefit (90% of wages), medical care with no expenditure ceiling, funeral expenses (₹10,000), and unemployment allowance. These benefits apply from the date of coverage.",
  },
  {
    question: "Are there any provisions relating to compliance after ESIC registration?",
    answer:
      "Yes. After registration, employers must file monthly ESI returns, deposit contributions by the 15th of every month, maintain attendance and wage registers, an inspection book, and an accident register. Delayed contributions attract interest and damages as prescribed by ESIC.",
  },
  {
    question: "What are the penal provisions for delayed ESIC payments?",
    answer:
      "Delayed contributions attract simple interest at 12% per annum under Section 85B. Additionally, damages may be levied at 5–25% of arrears depending on the delay period. Failure to register can attract imprisonment of up to 3 years and/or fine under Section 85.",
  },
  {
    question: "Who regulates the ESI Scheme?",
    answer:
      "The Employees' State Insurance Scheme is regulated by the Employees' State Insurance Corporation (ESIC) under the Ministry of Labour and Employment, Government of India. ESIC operates through regional offices across India.",
  },
  {
    question: "Can an establishment with fewer than 10 employees register voluntarily?",
    answer:
      "Yes. Establishments with fewer than 10 employees can voluntarily register under ESIC with mutual consent of the employer and employees. Voluntary registration is often adopted to provide better benefits and attract talent. Once registered, compliance becomes mandatory.",
  },
  {
    question: "How can Legal Terminus help with ESIC Registration?",
    answer:
      "Legal Terminus provides complete assistance for ESIC Registration — Form-1 filing, DSC coordination, employer code allotment, employee IP number generation, first contribution walkthrough, and ongoing compliance guidance. We handle both ESIC and EPF registrations simultaneously to reduce your compliance setup time.",
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
