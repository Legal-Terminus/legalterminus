import React, { useState } from "react";
import "./EpfRetFAQ.css";

// Each answer may have intro text, an optional bullet list (points),
// and an optional closing note.
const faqs = [
  {
    question: "Who needs to file EPF Returns in India?",
    answer:
      "Every establishment covered under the Employees' Provident Funds and Miscellaneous Provisions Act, 1952 is required to file monthly EPF returns. Generally, EPF registration becomes mandatory once an establishment employs 20 or more employees. After registration, the employer must file the monthly ECR (Electronic Challan-cum-Return) by the 15th of the following month through the official EPFO portal, even if the employee count later falls below 20. Establishments with fewer than 20 employees can also opt for voluntary EPF registration.",
  },
  {
    question: "What if my establishment has more than 50 employees?",
    answer:
      "We offer custom enterprise plans for larger establishments based on employee strength, branches, and compliance requirements. The plan can also include:",
    points: [
      "Multi-branch coordination",
      "Contractor employee compliance",
      "Inspection support",
      "Employee withdrawal assistance",
      "Dedicated account handling",
    ],
  },
  {
    question: "What happens if EPF returns are filed late?",
    answer: "Late filing can result in:",
    points: [
      "Interest under Section 7Q",
      "Penalty / damages under Section 14B",
      "EPFO notices and inspections",
      "Employee grievances due to delayed PF updates",
      "Legal action in serious default cases",
    ],
    note: "Timely filing helps avoid unnecessary penalties and compliance risks.",
  },
  {
    question: "What is Form 5A?",
    answer:
      "Form 5A contains details of the establishment's owners, directors, partners, and authorised signatories. It must be updated whenever there is a change in management or ownership structure. Non-updated Form 5A can create issues during EPFO verification or inspection.",
  },
  {
    question: "Is EPF mandatory for all employees?",
    answer:
      "EPF is generally mandatory for employees earning up to ₹15,000 per month in covered establishments. Employees earning above ₹15,000 can also become PF members with employer consent and EPFO approval. Once an employee becomes an EPF member, PF deduction usually continues even if salary later increases beyond ₹15,000.",
  },
  {
    question: "Can an employee opt out of EPF?",
    answer: "An employee can opt out only if:",
    points: [
      "Their salary exceeds ₹15,000 at the time of joining, AND",
      "They have never been an EPF member earlier.",
    ],
    note: "If the employee already has a UAN or previous PF membership, opting out is generally not allowed.",
  },
  {
    question: "What is the current EPF contribution percentage?",
    answer: "The standard EPF contribution is:",
    points: [
      "Employee Contribution: 12% of Basic Salary + Dearness Allowance",
      "Employer Contribution: 12%",
    ],
    note: "The employer's share is split between EPF contribution and EPS (Pension Scheme) contribution.",
  },
  {
    question: "What is EPS in EPF?",
    answer: "EPS stands for Employees' Pension Scheme. Out of the employer's 12% contribution:",
    points: [
      "8.33% goes to EPS (subject to wage ceiling)",
      "The balance goes to EPF",
    ],
    note: "EPS helps employees receive pension benefits after retirement, subject to eligibility conditions.",
  },
  {
    question: "What is EDLI in EPF?",
    answer:
      "EDLI (Employees' Deposit Linked Insurance Scheme) is an insurance benefit linked with EPF membership. In case of the employee's death during service, the nominee or legal heir can receive insurance benefits under the scheme, subject to EPFO rules.",
  },
  {
    question: "Can employees check their PF balance online?",
    answer: "Yes. Employees can check their PF balance through:",
    points: [
      "EPFO Member Portal",
      "UMANG App",
      "SMS service",
      "Missed call service linked with registered mobile number",
    ],
    note: "KYC-linked UAN is required for most online services.",
  },
  {
    question: "Can an employee have multiple UAN numbers?",
    answer:
      "Ideally, an employee should have only ONE UAN throughout their career. However, duplicate UANs are sometimes generated due to onboarding errors. We also assist employers and employees in resolving duplicate UAN issues and merging PF accounts.",
  },
  {
    question: "What happens if employee KYC is not updated?",
    answer: "Without proper Aadhaar, PAN, and Bank KYC:",
    points: [
      "PF withdrawals may fail",
      "Claims may get rejected",
      "Passbook may not update properly",
      "Online transfer facility may not work",
    ],
    note: "Proper KYC seeding is essential for smooth EPF operations.",
  },
  {
    question: "Can EPF be withdrawn while working?",
    answer:
      "Normally, full PF withdrawal is not allowed while actively employed. However, partial withdrawal may be permitted for specific purposes such as:",
    points: [
      "Medical emergency",
      "House purchase",
      "Home loan repayment",
      "Marriage",
      "Education",
      "Retirement-related needs",
    ],
    note: "Withdrawal eligibility depends on EPFO rules and years of service.",
  },
  {
    question: "How long does PF transfer take when changing jobs?",
    answer:
      "If the employee's UAN and KYC are properly updated, online PF transfer generally takes 7–30 working days. Incorrect KYC or mismatch in employer records can delay the transfer process.",
  },
  {
    question: "Is EPF applicable to contract employees?",
    answer:
      "Yes. EPF compliance also applies to eligible contract employees working through contractors. The principal employer may also become responsible if the contractor fails to deposit PF dues properly.",
  },
  {
    question: "What records should employers maintain for EPF compliance?",
    answer: "Employers should maintain:",
    points: [
      "Salary registers",
      "Attendance records",
      "Employee KYC records",
      "UAN details",
      "Appointment letters",
      "Wage sheets",
      "PF challans / ECR acknowledgements",
    ],
    note: "Proper documentation helps during EPFO inspections and audits.",
  },
  {
    question: "What happens during an EPFO inspection?",
    answer: "During inspection, EPFO officers may verify:",
    points: [
      "Employee count",
      "Salary records",
      "PF deductions",
      "ECR filings",
      "Contractor records",
      "Attendance registers",
      "KYC documentation",
    ],
    note: "Non-compliance may lead to notices, penalties, or assessment proceedings under Section 7A.",
  },
  {
    question: "Can directors or partners become EPF members?",
    answer:
      "Yes, in certain situations directors or partners receiving salary can be covered under EPF, depending on employment structure and remuneration arrangement. Professional evaluation is recommended before inclusion.",
  },
  {
    question: "What is Form 11 in EPF?",
    answer:
      "Form 11 is the employee declaration form collected at the time of joining. It contains:",
    points: [
      "Previous PF membership details",
      "UAN information",
      "KYC-related declarations",
    ],
    note: "This form helps employers process correct PF onboarding.",
  },
  {
    question: "Do startups also need EPF registration?",
    answer:
      "Yes. Startups crossing the employee threshold under the EPF Act must obtain EPF registration and comply with monthly filing requirements. Many startups voluntarily register earlier to improve employee benefits and HR credibility.",
  },
  {
    question: "What if salary is paid late? Can EPF still be filed on time?",
    answer:
      "EPF liability is linked to salary due for the month, not the actual salary payment date. Even if salary is delayed, EPF dues generally remain payable within the statutory due date to avoid interest and damages.",
  },
  {
    question: "Can employees file complaints against employers for non-deposit of PF?",
    answer: "Yes. Employees can raise complaints through:",
    points: [
      "EPFiGMS grievance portal",
      "EPFO regional office",
      "Labour authorities",
    ],
    note: "Non-deposit of deducted PF is treated seriously under the law.",
  },
  {
    question: "Why do businesses outsource EPF Return Filing?",
    answer: "Businesses outsource EPF Return Filing because it:",
    points: [
      "Reduces compliance risk",
      "Avoids penalties",
      "Ensures timely filing",
      "Improves employee support",
      "Keeps records organised",
      "Saves internal HR and accounting time",
    ],
    note: "Professional handling also helps during inspections and audits.",
  },
  {
    question: "How can Legal Terminus help with EPF Return Filing?",
    answer:
      "Legal Terminus provides end-to-end EPF Return Filing support for businesses across India. Our dedicated EPF compliance team manages the complete monthly filing process, including employee onboarding, KYC seeding, Form 11 processing, Form 5A updates, ECR preparation, portal filing, eSign coordination, TRRN generation, and payment support. We validate employee and wage data carefully to ensure accurate and timely filing on the official EPFO Unified Portal before the due date. We also assist with pending KYC corrections, challan records, and compliance tracking to help businesses avoid penalties, delays, and employee grievances. For establishments with more than 50 employees, we provide customised enterprise support based on operational requirements.",
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
                  <div className="opcfaq-answer-content">
                    {item.answer && <p className="opcfaq-answer-text">{item.answer}</p>}
                    {item.points && (
                      <ul className="opcfaq-answer-list">
                        {item.points.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    )}
                    {item.note && <p className="opcfaq-answer-text">{item.note}</p>}
                  </div>
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
