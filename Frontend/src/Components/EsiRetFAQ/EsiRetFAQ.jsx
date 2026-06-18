import React, { useState } from "react";
import "./EsiRetFAQ.css";

const faqs = [
  {
    question: "Who needs to file ESI Returns in India?",
    answer:
      "Any establishment covered under the Employees' State Insurance (ESI) Act, 1948 must file monthly ESI contributions. Generally, establishments employing 10 or more employees (20 in some states) are required to register under ESI if employees earn wages up to ₹21,000 per month. Once registered, monthly ESI contribution filing becomes mandatory, even if employee strength later falls below the threshold.",
  },
  {
    question: "Which Legal Terminus plan is suitable for my business?",
    answer:
      "ELEMENTAL – ₹999/month or ₹10,500/year (12% off)\nSuitable for establishments with up to 10 employees.\n\nENRICHED – ₹1,999/month or ₹21,500/year (12% off)\nSuitable for businesses with 10 to 25 employees.\n\nSUPREME – ₹2,999/month or ₹31,500/year (12% off)\nSuitable for establishments with 25 to 50 employees.\n\nAll plans include the same monthly compliance support. The pricing changes only based on employee count.",
  },
  {
    question: "What if my establishment has more than 50 employees?",
    answer:
      "No problem. We provide custom enterprise plans for businesses with larger teams, multiple branches, contractor employees, or higher compliance requirements. Our team will create a customised ESI compliance solution based on your business needs.",
  },
  {
    question: "What are the current ESI contribution rates?",
    answer:
      "Currently:\n• Employee Contribution: 0.75% of gross wages\n• Employer Contribution: 3.25% of gross wages\n\nTotal ESI contribution is 4% of employee wages and must be deposited through the ESIC portal before the 15th of the following month.",
  },
  {
    question: "What is the ESI salary limit?",
    answer:
      "Employees earning gross wages up to ₹21,000 per month are covered under ESI. For differently-abled employees, the wage limit is ₹25,000 per month.",
  },
  {
    question: "What happens if an employee's salary crosses ₹21,000?",
    answer:
      "If an employee's salary exceeds ₹21,000 during an ongoing contribution period, ESI deduction continues until the end of that contribution period. Coverage generally stops from the next contribution period if wages remain above the limit.",
  },
  {
    question: "What is the due date for ESI Return Filing?",
    answer:
      "Monthly ESI contribution must be filed and paid before the 15th of the following month through the official ESIC portal.\n\nExample: ESI for June salary must be filed before 15th July.",
  },
  {
    question: "What happens if ESI filing is delayed?",
    answer:
      "Late filing may result in:\n• Interest on delayed payment\n• Penalty and damages\n• Compliance notices\n• Recovery proceedings\n• Employee claim and benefit issues\n\nRegular delays may also increase the chances of inspection or legal action.",
  },
  {
    question: "What is an IP Number?",
    answer:
      "IP Number means 'Insured Person Number.' It is the unique ESI identification number given to every covered employee. This number helps employees and their family members access ESI medical and cash benefits across India.",
  },
  {
    question: "What benefits do employees receive under ESI?",
    answer:
      "ESI provides several important benefits to employees and their families, including:\n• Medical treatment\n• Hospitalisation\n• Maternity benefits\n• Sickness benefits\n• Disability benefits\n• Dependants' benefits\n• Funeral expenses support\n\nIt acts as an affordable social security and health protection scheme for employees.",
  },
  {
    question: "Can employees use ESI benefits immediately after registration?",
    answer:
      "Medical benefits generally become available shortly after successful registration and contribution filing. However, some cash benefits such as sickness or maternity benefits depend on contribution history and eligibility conditions.",
  },
  {
    question: "Can an employee continue using the same ESI number after changing jobs?",
    answer:
      "Yes. The ESI IP Number remains the same throughout the employee's career. Employees can continue using their existing IP number with every new employer.",
  },
  {
    question: "Is ESI mandatory for contractual or temporary employees?",
    answer:
      "Yes. If contractual or temporary employees fall within the ESI wage limit, they are generally covered under ESI, and contributions must be deposited accordingly.",
  },
  {
    question: "What documents are required for employee registration under ESI?",
    answer:
      "Usually, the following documents / details are required:\n• Aadhaar Card\n• PAN Card\n• Bank Account Details\n• Employee Photograph\n• Mobile Number\n• Family Details",
  },
  {
    question: "Do employers need to provide ESI cards to employees?",
    answer:
      "After successful registration, employees can download their ESI e-Pehchan Card directly from the ESIC portal. This card is used for availing medical benefits.",
  },
  {
    question: "How is your pricing different from statutory ESI payment?",
    answer:
      "Our service fee is only for handling your monthly ESI compliance work. The actual ESI contribution amount payable to ESIC is separate and must be paid directly to the government.",
  },
  {
    question: "Can I start your service in the middle of a month?",
    answer:
      "Yes. We can onboard your establishment anytime during the month. We also assist with pending filings, employee verification, and portal setup wherever required.",
  },
  {
    question: "Do you help with ESIC notices or inspection support?",
    answer:
      "Yes. We assist clients in responding to basic ESIC notices, contribution mismatch queries, and compliance-related communication. Dedicated inspection support can also be provided separately if required.",
  },
  {
    question: "Do you support employee benefit claims?",
    answer:
      "Yes. We guide employers and employees on basic ESI claim-related processes such as sickness benefit, maternity benefit, and hospital benefit coordination.",
  },
  {
    question: "How can Legal Terminus help me with ESI Return Filing?",
    answer:
      "Legal Terminus manages monthly ESI Return Filing for businesses across India with a dedicated compliance team focused on timely and accurate filing. Our team handles employee registration, exit updates, contribution preparation, challan generation, payment coordination, and monthly filing through the official ESIC portal. We also provide regular updates, contribution reports, and compliance support to help businesses avoid delays, penalties, and employee benefit issues.",
  },
];

const EsiRetFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">ESI Return Filing — FAQs</h2>
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
                  <div className="opcfaq-answer-content" style={{ whiteSpace: "pre-line" }}>{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default EsiRetFAQ;
