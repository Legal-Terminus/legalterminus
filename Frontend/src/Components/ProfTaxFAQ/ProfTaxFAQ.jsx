import React, { useState } from "react";
import "../OPCFAQ/OPCFAQ.css";

const faqs = [
  {
    question: "What is Professional Tax and who is liable to pay it?",
    answer:
      "Professional Tax (PT) is a state-level direct tax levied on persons earning income from employment, profession, trade, or calling. It applies to salaried employees (deducted by employer), self-employed professionals like doctors, lawyers, CAs, architects, and sole proprietors. Companies, LLPs, and partnership firms must also register as employers and deduct PT from employee salaries.",
  },
  {
    question: "Which states in India have Professional Tax?",
    answer: (
      <span>
        As of 2026, Professional Tax is levied in the following states:
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>Maharashtra, Karnataka, Andhra Pradesh, Telangana</li>
          <li>Tamil Nadu, West Bengal, Gujarat, Kerala</li>
          <li>Assam, Meghalaya, Odisha, Tripura, Jharkhand, Sikkim</li>
        </ul>
        States like Delhi, Rajasthan, UP, Haryana, Punjab, and MP do NOT have Professional Tax.
      </span>
    ),
  },
  {
    question: "What is the maximum Professional Tax that can be levied?",
    answer:
      "Article 276 of the Indian Constitution caps Professional Tax at ₹2,500 per person per year. No state can legally levy more than this. If you see a PT deduction that exceeds ₹208/month (which annualizes to ₹2,496 — close to the cap), flag it for review immediately.",
  },
  {
    question: "What is the difference between Registration Certificate (RC) and Enrolment Certificate (EC)?",
    answer: (
      <span>
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li><strong>Registration Certificate (RC):</strong> Required for employers who employ at least one person and must deduct PT from employee salaries.</li>
          <li><strong>Enrolment Certificate (EC):</strong> Required for self-employed individuals, professionals, traders, and proprietors who pay PT on their own income (not as employers).</li>
        </ul>
        A company with employees needs an RC. A sole proprietor with no employees needs an EC. An LLP with employees and partners may need both.
      </span>
    ),
  },
  {
    question: "When must an employer register for Professional Tax?",
    answer:
      "Registration is mandatory from the date you hire your first employee — not when your payroll crosses a threshold. Most states require registration within 30 days of employing the first person. Delayed registration triggers a penalty for the entire unregistered period, retroactively.",
  },
  {
    question: "Is Professional Tax deductible for income tax purposes?",
    answer: (
      <span>
        Yes — for employees:
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>PT deducted from salary is deductible under Section 16(iii) of the Income Tax Act</li>
          <li>This reduces the employee's gross salary before computing income tax</li>
          <li>Employer must provide Form 16 showing PT deducted</li>
        </ul>
        For self-employed individuals, PT paid as an EC holder is deductible as a business expense.
      </span>
    ),
  },
  {
    question: "What are the penalties for late filing or non-registration?",
    answer: (
      <span>
        Penalties vary by state but are significant:
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>Maharashtra: ₹1,000/month for late returns; 10% penalty on unpaid tax</li>
          <li>Karnataka: ₹50/day for late returns; 10% + 1.5%/month interest on dues</li>
          <li>West Bengal: ₹200/month penalty; 12% p.a. interest on arrears</li>
          <li>Non-registration: ₹2,000 – ₹5,000 flat penalty in most states</li>
        </ul>
        These compound fast. A missed return in Maharashtra costs ₹12,000/year in penalties alone, far exceeding the actual PT liability.
      </span>
    ),
  },
  {
    question: "If I have employees in multiple states, do I need separate PT registrations?",
    answer:
      "Yes — each state where you have employees or a place of business requires a separate PT registration with that state's tax authority. There is no central or unified PT registration. Our Supreme plan covers up to 3 states; additional states are quoted separately.",
  },
  {
    question: "How can Legal Terminus help with my Professional Tax compliance?",
    answer: (
      <span>
        Legal Terminus handles everything:
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>State applicability check and registration category assessment</li>
          <li>RC and/or EC application preparation and portal filing</li>
          <li>Slab mapping and monthly deduction template</li>
          <li>Monthly / quarterly return filing after you share challan acknowledgement</li>
          <li>Penalty notice responses and regularization of past non-compliance</li>
          <li>Annual compliance calendar with WhatsApp and email reminders</li>
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

export default ProfTaxFAQ;
