import React, { useState } from "react";
import "./Section8FAQ.css";

const faqs = [
  {
    question: "What is a Section 8 Company?",
    answer: "A Section 8 Company is a non-profit organization registered under the Companies Act, 2013 for charitable, social, educational, environmental, cultural, religious, or similar objectives. Unlike regular companies, a Section 8 Company cannot distribute profits to its members or directors. Any income earned must be used only for promoting the organization's objectives and activities. It is one of the most credible and professionally recognized legal structures for NGOs and non-profit organizations in India.",
  },
  {
    question: "What will be the total cost of Section 8 Company registration?",
    answer: "The total cost depends on factors such as the number of directors, DSC requirements, authorized capital, and state-wise stamp duty. Our professional fee covers drafting, filing, advisory, and registration support. Government fees, DSC charges, DIN fees, and stamp duty are charged separately on actuals with complete transparency. The complete cost estimate is shared before starting the registration process.",
  },
  {
    question: "How long does Section 8 Company registration take?",
    answer: "Section 8 Company registration usually takes around 20–25 working days, subject to document readiness and government approval timelines.",
  },
  {
    question: "Should I register as a Section 8 Company, a Trust, or a Society?",
    answer: "Three quick filters. (1) Are you targeting institutional donors (CSR teams, foreign foundations, government grants)? Section 8 wins on credibility. (2) Is your operation small, family-driven, low-budget, no institutional donors? Trust or Society is cheaper to set up and run. (3) Will you scale to multiple states / hundreds of crores in budget? Section 8 — structured governance is essential. We run this analysis live on the discovery call.",
  },
  {
    question: "What is 12A and 80G and why is everyone talking about them?",
    answer: (
      <div>
        <p>12A and 80G are registrations under the Income Tax Act, 1961.</p>
        <ul>
          <li>12A registration helps eligible non-profit organizations claim income tax exemption.</li>
          <li>80G registration allows donors to claim tax deductions on eligible donations made to the organization.</li>
        </ul>
        <p>These registrations are separate from Section 8 incorporation and can be applied for after incorporation.</p>
      </div>
    ),
  },
  {
    question: "Can directors or founders receive salary in a Section 8 Company?",
    answer: "Yes. Directors or founders can receive reasonable remuneration for genuine services provided to the organization. However, profit distribution, dividends, or personal benefit from the organization's income is not permitted under Section 8 regulations.",
  },
  {
    question: "What's CSR-1 and how do I become eligible for CSR funding?",
    answer: "CSR-1 is a one-time registration with the MCA (Form CSR-1 under Rule 4 of the Companies (CSR Policy) Rules) that any non-profit must complete to become eligible to receive CSR funds from Indian companies. Without CSR-1, no Indian company can give you CSR money — regardless of how good your project is. Required documents: PAN, registration certificate (COI for Section 8), 12A, 80G, and last 3 years' annual reports / audited accounts (or shorter if newer). The Supreme tier includes CSR-1 filing.",
  },
  {
    question: "Can a Section 8 Company receive foreign donations?",
    answer: "Yes, but foreign donations can only be accepted after obtaining approval or registration under the Foreign Contribution Regulation Act (FCRA), subject to eligibility conditions. Newly incorporated organizations may apply for prior permission in specific cases.",
  },
  {
    question: "Can I convert my Section 8 Company into a regular Pvt Ltd later?",
    answer: "Technically yes, but it's heavily restricted. Conversion requires Central Government approval, surrender of accumulated charitable assets to another Section 8 company, settlement of any pending tax / FCRA dues, and a special resolution. The process takes 6–12 months and is only granted in genuine cases (e.g., the original charitable purpose has become impossible). In practice, most Section 8 companies dissolve rather than convert. Pick this structure only if you're committed to a non-profit operating model.",
  },
  {
    question: "How can Legal Terminus help me set up my Section 8 Company?",
    answer: "Legal Terminus provides complete support for Section 8 Company incorporation, including name approval, MOA & AOA drafting, Section 8 license filing, incorporation, and post-registration compliance guidance. We also assist with 12A, 80G, CSR-1, and other non-profit registrations through dedicated professional support and transparent pricing.",
  },
];

const Section8FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="s8faq-section">
      <div className="s8faq-container">

        {/* LEFT */}
        <div className="s8faq-left">
          <h2 className="s8faq-title">
            Section 8 Company Registration FAQ's
          </h2>

          <p className="s8faq-intro">
            Starting a Section 8 Company in India is an important step for any
            founder building a non-profit or social impact organization. With
            the right support, the process can be simple and stress-free.
            <br /><br />
            Below are answers to the most common questions about Section 8
            company registration, tax exemptions, donor deductions, and
            post-incorporation compliance.
          </p>
        </div>

        {/* RIGHT */}
        <div className="s8faq-right">
          <div className="s8faq-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`s8faq-item ${isActive ? "active" : ""}`}
                >
                  <button
                    className="s8faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`s8faq-icon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>

                  <div className={`s8faq-answer ${isActive ? "open" : ""}`}>
                    <div className="s8faq-answer-body">{item.answer}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Section8FAQ;
