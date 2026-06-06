import React, { useState } from "react";
import "./EPFRegFAQ.css";

const epfFaqs = [
  {
    question: "When is EPF Registration in India mandatory for an establishment?",
    answer:
      "EPF Registration in India becomes mandatory once an establishment employs 20 or more employees under the Employees' Provident Funds and Miscellaneous Provisions Act, 1952. Certain notified establishments may require registration with 10 or more employees. Employers are required to complete registration within the prescribed timeline to avoid penalties and compliance issues.",
  },
  {
    question: "Can I apply for voluntary EPF Registration in India with fewer than 20 employees?",
    answer:
      "Yes. Businesses with fewer than 20 employees can also opt for voluntary EPF Registration in India with the consent of the employer and employees. Many businesses choose voluntary registration to provide better employee benefits, improve retention, and build professional credibility.",
  },
  {
    question: "What is included in your EPF Registration in India service fee?",
    answer:
      "Our professional fee for EPF Registration in India covers advisory, document review, Form 5A preparation, EPFO portal filing assistance, DSC coordination, employee UAN guidance, and post-registration support. The Government does not charge any registration fee for EPF Registration.",
  },
  {
    question: "How long does EPF Registration in India take?",
    answer:
      "EPF Registration in India generally takes around 5–7 working days, depending on document availability, DSC readiness, and verification processes. Timelines may vary based on the accuracy and completeness of the submitted documents.",
  },
  {
    question: "What is the difference between EPF and EPS under EPF Registration in India?",
    answer:
      "Under EPF Registration in India, EPF (Employees' Provident Fund) is the employee's retirement savings contribution, while EPS (Employees' Pension Scheme) provides pension benefits after retirement. Both are managed under the EPF framework and form part of the employee social security system.",
  },
  {
    question: "What is included in the 1-year free support for EPF Registration in India?",
    answer:
      "Our EPF Registration in India plans include 1 year of support for profile updates and basic changes such as authorised signatory updates, address changes, DSC updates, and establishment detail modifications.",
  },
  {
    question: "Are employees earning above ₹15,000 mandatorily covered under EPF Registration in India?",
    answer:
      "Employees earning above the prescribed wage threshold at the time of joining may opt out of EPF coverage subject to applicable EPFO rules. However, many employees voluntarily continue EPF membership due to its long-term retirement and tax benefits.",
  },
  {
    question: "What monthly compliance is required after EPF Registration in India?",
    answer:
      "After EPF Registration in India, employers are required to file monthly EPF returns, deposit employee and employer contributions within due dates, maintain employee records, and ensure proper UAN and KYC management for employees.",
  },
  {
    question: "Why should businesses choose professional assistance for EPF Registration in India?",
    answer:
      "Professional assistance for EPF Registration in India helps businesses avoid errors in registration, employee onboarding, UAN setup, and compliance management. Proper guidance ensures smooth registration, accurate documentation, and hassle-free post-registration support.",
  },
  {
    question: "How can Legal Terminus help with EPF Registration in India?",
    answer:
      "Legal Terminus provides end-to-end assistance for EPF Registration in India, including document review, Form 5A preparation, portal filing support, employee onboarding guidance, and post-registration assistance. Our team also supports profile updates, compliance guidance, and coordination for related labour law registrations through a single point of contact.",
  },
];

const EPFFaq = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="faq-section">
      <div className="faq-container">

        <div className="faq-header">
          <h2 className="faq-title">EPF Registration — FAQs</h2>
          <p className="faq-intro">
            Answers to the most asked questions about EPF Registration, compliance, eligibility, and benefits in India.
          </p>
        </div>

        <div className="faq-list">
          {epfFaqs.map((item, index) => {
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

export default EPFFaq;
