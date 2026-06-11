import React, { useState } from "react";
import "./EsiRetFAQ.css";

const faqs = [
  {
    question: "What is an ESI return and who has to file it?",
    answer:
      "An ESI return is the monthly contribution filing made with the ESIC, declaring each covered employee's wages and depositing the ESI contributions. Every establishment registered under the ESI Act, 1948 must file it — registration is mandatory for establishments with 10 or more employees (20 in some states) and applies to employees drawing wages up to ₹21,000 per month.",
  },
  {
    question: "What is the due date for ESI return filing?",
    answer:
      "ESI contributions must be deposited and the return filed by the 15th of the following month. For example, contributions for July are due by 15th August. ESI also has two fixed contribution periods — April to September and October to March — each linked to a benefit period during which employees can claim cash benefits.",
  },
  {
    question: "How much is the ESI contribution?",
    answer:
      "The total ESI contribution is 4% of wages — the employee contributes 0.75% and the employer contributes 3.25%. It is calculated on gross monthly wages for employees earning up to ₹21,000 (₹25,000 for employees with disability). Employees earning above the ceiling are generally not covered.",
  },
  {
    question: "What happens if ESI contributions are paid late?",
    answer:
      "Late payment attracts simple interest at 12% per annum on the delayed amount, plus damages under Regulation 31C graded by the length of delay — from 5% per annum for up to 2 months to 25% per annum for delays over 6 months. Persistent default can also lead to a 45A determination and prosecution under Section 85 of the ESI Act.",
  },
  {
    question: "Who is an Insured Person (IP) and what is an e-Pehchaan card?",
    answer:
      "An Insured Person is an employee registered under ESI and allotted a unique Insurance Number. The e-Pehchaan card carries the IP's and dependants' details and is used to avail benefits at ESI dispensaries and hospitals. Until a worker is registered as an IP, they cannot access ESI medical or cash benefits — so prompt registration of new joiners is essential.",
  },
  {
    question: "Is ESI mandatory if an employee's salary is above ₹21,000?",
    answer:
      "Employees earning gross wages above ₹21,000 per month are outside ESI coverage and no contribution is required for them. However, if an employee was covered at the start of a contribution period and their wages rise above the ceiling mid-period, they continue to be covered until the end of that contribution period — a rule we apply automatically.",
  },
  {
    question: "What benefits do employees get under ESI?",
    answer:
      "ESI provides full medical care for the insured person and dependants, sickness benefit (cash during certified illness), 26 weeks of maternity benefit, temporary and permanent disablement benefit, dependants' benefit in case of death due to employment injury, and funeral expenses. These are funded entirely by the monthly ESI contributions.",
  },
  {
    question: "Does ESI registration continue if employee count drops below the threshold?",
    answer:
      "Yes. Once an establishment is covered under ESI, it generally continues to be covered even if the number of employees later falls below the threshold. The obligation to file monthly returns continues as long as there are coverable employees. We confirm your specific coverage position during onboarding.",
  },
  {
    question: "How does Legal Terminus handle my ESI return filing?",
    answer:
      "We manage the full monthly cycle: maintaining your due-date calendar, collecting wage and employee data, registering Insured Persons and generating e-Pehchaan cards, updating joiners and exits, computing 0.75%/3.25% contributions with the ceiling and continuation rules, uploading the return, and getting the challan paid by the 15th — sharing the paid challan and a compliance log every month. Book a free consultation to get started.",
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

export default EsiRetFAQ;
