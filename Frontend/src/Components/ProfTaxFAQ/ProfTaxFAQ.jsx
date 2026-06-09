import React, { useState } from "react";
import "./ProfTaxFAQ.css";

const faqs = [
  {
    question: "Which states levy Professional Tax in India?",
    answer: "Professional Tax is currently levied in Andhra Pradesh, Assam, Gujarat, Karnataka, Kerala, Madhya Pradesh, Maharashtra, Meghalaya, Odisha, Sikkim, Tamil Nadu, Telangana, and West Bengal. Central government employees and armed forces are exempt. If your state is not in this list, PT does not apply to you.",
  },
  {
    question: "What is the difference between PTEC and PTRC in Maharashtra?",
    answer: (
      <span>
        Maharashtra has two distinct PT certificates:
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li><strong>PTRC (Professional Tax Registration Certificate)</strong> — Employer-level certificate authorising deduction of PT from employees' salaries. Monthly filing of Form III-B required.</li>
          <li><strong>PTEC (Professional Tax Enrollment Certificate)</strong> — The employer / entity pays ₹2,500/year on its own income. Separate from employee deductions. Due by 30 June each year.</li>
        </ul>
        Both are mandatory for companies operating in Maharashtra.
      </span>
    ),
  },
  {
    question: "What is the maximum Professional Tax an employee can be charged?",
    answer: "The constitutional cap under Article 276 is ₹2,500 per year per person. Most states impose ₹200/month (₹2,400/year) for the highest slab. The exact amount depends on the state PT slab schedule and the employee's monthly salary bracket.",
  },
  {
    question: "What happens if I don't register for PT?",
    answer: "Non-registration after becoming liable results in: (a) retrospective PT assessment on all employees for the unregistered period, (b) penalty of 1%–2% per month on unpaid PT, (c) interest charges, and in severe cases (d) prosecution under the state PT Act. The total liability can far exceed the original tax amount.",
  },
  {
    question: "Is PT applicable to work-from-home employees?",
    answer: "Generally, PT liability follows the state where the employee physically works. A remote employee working from Maharashtra is liable under Maharashtra PT even if the employer's HO is in a non-PT state. The employer must obtain a Maharashtra PTRC for such employees. State-specific rules vary — we confirm applicability during the discovery call.",
  },
  {
    question: "How often do PT returns need to be filed?",
    answer: (
      <span>
        Filing frequency varies by state and turnover:
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li><strong>Monthly</strong> — Maharashtra PTRC (if annual PT liability &gt; ₹50,000)</li>
          <li><strong>Quarterly</strong> — Maharashtra PTRC (if annual PT liability ≤ ₹50,000)</li>
          <li><strong>Annual</strong> — Karnataka, Tamil Nadu, Kerala (most states)</li>
          <li><strong>Half-yearly</strong> — Gujarat, West Bengal</li>
        </ul>
        Our compliance calendar specifies exact due dates for your state.
      </span>
    ),
  },
  {
    question: "Can a self-employed professional register for PT themselves?",
    answer: "Yes. Freelancers, consultants, doctors, chartered accountants, architects, and engineers earning above the state PT threshold must self-enroll. Self-employed PT is typically ₹2,500/year payable in a single annual instalment. No employer deduction is involved — you pay directly to the state government.",
  },
  {
    question: "How can Legal Terminus help with Professional Tax Registration?",
    answer: (
      <span>
        Legal Terminus handles:
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>Applicability check across all PT-applicable states</li>
          <li>EC and RC registration on the correct state portal</li>
          <li>Government fee payment and acknowledgement</li>
          <li>Monthly / annual PT return filing (Standard + Comprehensive plans)</li>
          <li>Compliance calendar so you never miss a due date</li>
        </ul>
      </span>
    ),
  },
];

const ProfTaxFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Professional Tax Registration — FAQs</h2>
          <p className="opcfaq-intro">
            Clear answers to the most common PT registration questions — no jargon, legally accurate.
          </p>
        </div>

        <div className="opcfaq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`opcfaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="opcfaq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`opcfaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`opcfaq-answer ${isActive ? "open" : ""}`}>
                  <div className="opcfaq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ProfTaxFAQ;
