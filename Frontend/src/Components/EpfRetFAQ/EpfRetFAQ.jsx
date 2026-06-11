import React, { useState } from "react";
import "./EpfRetFAQ.css";

const faqs = [
  {
    question: "What is an EPF return and who has to file it?",
    answer:
      "An EPF return is the monthly Electronic Challan-cum-Return (ECR) filed with the EPFO, declaring each employee's wages and provident-fund contributions. Every establishment registered under the EPF & MP Act, 1952 must file it — registration is mandatory for establishments employing 20 or more persons, and voluntary registration is available for smaller ones.",
  },
  {
    question: "What is the due date for EPF return filing?",
    answer:
      "The ECR must be filed and the contributions deposited by the 15th of the following month. For example, contributions for July are due by 15th August. There is no separate 'annual return' filing now — the monthly ECR captures all member-wise contribution data through the year.",
  },
  {
    question: "How much is the EPF contribution?",
    answer:
      "The employee contributes 12% of wages (basic + DA). The employer also contributes 12%, split as 8.33% to the Employees' Pension Scheme (EPS, on wages up to ₹15,000) and 3.67% to EPF. In addition, the employer pays 0.50% towards EDLI insurance and 0.50% as EPF administrative charges.",
  },
  {
    question: "What happens if EPF contributions are deposited late?",
    answer:
      "Late deposit attracts interest at 12% per annum under Section 7Q, plus damages under Section 14B graded by the length of delay — 5% p.a. for up to 2 months, rising to 25% p.a. for delays beyond 6 months. Late employer contributions may also be disallowed as a tax deduction under Section 43B.",
  },
  {
    question: "What is a UAN and why does KYC seeding matter?",
    answer:
      "The Universal Account Number (UAN) is a permanent number that links all of an employee's PF accounts across employers. Seeding it with verified KYC — Aadhaar, PAN, and bank details — is essential, because contributions reflect correctly and the member can withdraw, take advances, or transfer their PF only when KYC is approved.",
  },
  {
    question: "Is EPF registration mandatory for establishments with fewer than 20 employees?",
    answer:
      "It is mandatory once an establishment reaches 20 or more employees (counting contract and casual staff in many cases). Smaller establishments can register voluntarily, and once covered, an establishment generally remains covered even if the headcount later drops below 20. We confirm your coverage status during onboarding.",
  },
  {
    question: "What is the EDLI benefit included in EPF?",
    answer:
      "The Employees' Deposit Linked Insurance (EDLI) scheme provides life-insurance cover to EPF members at no cost to the employee, funded by the employer's 0.50% contribution. In the event of a member's death during service, the nominee receives a lump-sum assurance benefit of up to ₹7 lakh, based on the prescribed formula.",
  },
  {
    question: "What is a 7A inquiry?",
    answer:
      "A Section 7A inquiry is an assessment proceeding initiated by the EPFO when it suspects non-compliance — such as non-payment, short-payment, or misclassification of wages. The officer can determine the dues payable, along with interest and damages. Consistent, accurate monthly filing is the best way to avoid a 7A inquiry altogether.",
  },
  {
    question: "How does Legal Terminus handle my EPF return filing?",
    answer:
      "We manage the full monthly cycle: maintaining your due-date calendar, collecting wage and member data, generating UANs and seeding KYC, updating joiners and exits, computing PF/EPS/EDLI/admin charges, uploading the ECR, and getting the challan paid by the 15th — sharing the paid TRRN and a compliance log every month. Book a free consultation to get started.",
  },
];

const EpfRetFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">EPF Return Filing — FAQs</h2>
          <p className="opcfaq-intro">
            Got questions? We've got answers — straight, no-BS, legally accurate.
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

export default EpfRetFAQ;
