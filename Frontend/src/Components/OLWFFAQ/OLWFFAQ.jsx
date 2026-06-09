import React, { useState } from "react";
import "../OPCFAQ/OPCFAQ.css";

const faqs = [
  {
    question: "What is ODISHA LABOUR WELFARE FUND (OLWF) REGISTRATION and who needs it?",
    answer: "ODISHA LABOUR WELFARE FUND (OLWF) REGISTRATION is a mandatory labour compliance under the Odisha Labour Welfare Fund Act, 1996 for establishments in Odisha employing 5 or more workers. The scheme is managed by the Odisha Labour Welfare Board under the State Labour Department. Employers and employees contribute a small amount towards the welfare fund, which is used for worker welfare schemes such as scholarships, medical assistance, housing support, and other employee welfare benefits.",
  },
  {
    question: "How is your pricing structured and what additional costs will I pay?",
    answer: "Our professional fee covers eligibility review, application preparation, document support, filing assistance, and registration coordination. Government charges, if applicable, are billed separately at actuals. In some cases, a DSC may also be required for online filing. Ongoing half-yearly welfare contributions payable to the Board are separate and depend on the applicable employee contribution rates.",
  },
  {
    question: "How long does OLWF Registration take?",
    answer: "ODISHA LABOUR WELFARE FUND (OLWF) REGISTRATION generally takes around 7–10 working days, subject to proper documentation and employee details. Delays usually happen due to incomplete worker information or mismatch in establishment records.",
  },
  {
    question: "What is the OLWF contribution system?",
    answer: "Both the employer and employee contribute a nominal amount towards the Labour Welfare Fund. The contribution is generally paid on a half-yearly basis. The exact contribution amount is notified by the Odisha Labour Welfare Board and may change from time to time.",
  },
  {
    question: "What benefits do employees receive under OLWF?",
    answer: "Employees and their dependants may become eligible for various welfare benefits provided by the Odisha Labour Welfare Board, such as educational scholarships, medical assistance, welfare support schemes, recreation facilities, and financial assistance in specific situations. The availability and eligibility of benefits are decided by the Welfare Board.",
  },
  {
    question: "Is OLWF different from EPF and ESIC?",
    answer: "Yes. OLWF, EPF, and ESIC are separate labour compliances with different objectives. OLWF is a state-level welfare contribution scheme, while EPF relates to employee retirement savings and ESIC provides medical and insurance benefits. Depending on employee strength and salary structure, an establishment may need to comply with all applicable labour laws separately.",
  },
  {
    question: "Do establishments outside Odisha need OLWF Registration?",
    answer: "No. ODISHA LABOUR WELFARE FUND (OLWF) REGISTRATION applies only to establishments operating in Odisha. Other states may have their own Labour Welfare Fund laws and separate registration requirements.",
  },
  {
    question: "What happens if an establishment does not register under OLWF?",
    answer: "Failure to register or deposit contributions may result in notices, penalties, recovery proceedings, or inspection by the Labour Department. Timely registration and contribution filing help establishments avoid future compliance issues.",
  },
  {
    question: "What is included in your free 1-year update support?",
    answer: "Every plan includes free support for profile updates and corrections for 1 year from the date of registration. This includes changes in authorised signatory, address updates, employee count revisions, branch updates, and other basic registration corrections.",
  },
  {
    question: "Can newly started businesses also apply for OLWF Registration?",
    answer: "Yes. Any eligible establishment operating in Odisha with the required employee strength can apply for OLWF Registration, including newly started businesses, shops, offices, factories, hotels, and service establishments.",
  },
  {
    question: "How can Legal Terminus help with OLWF Registration?",
    answer: "Legal Terminus provides complete support for ODISHA LABOUR WELFARE FUND (OLWF) REGISTRATION, including eligibility review, employee data verification, document preparation, application filing, and registration coordination. We also assist with profile updates and contribution guidance to help businesses remain compliant with Odisha labour laws.",
  },
];

const OLWFFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">OLWF Registration — FAQs</h2>
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

export default OLWFFAQ;
