import React, { useState } from "react";
import "./ItrIndFAQ.css";

const faqs = [
  {
    question: "Who is required to file an Income Tax Return (ITR) in India?",
    answer:
      "Any individual whose income exceeds the applicable basic exemption limit is generally required to file an ITR under Section 139 of the Income Tax Act, 1961. In many cases, ITR filing may also be required even below the exemption limit — such as where TDS has been deducted, foreign assets are held, high-value transactions are made, or capital gains are earned.",
  },
  {
    question: "Which ITR form should I file as an individual?",
    answer: (
      <>
        <p>The correct ITR form depends on your income type and residential status.</p>
        <ul>
          <li>ITR-1 (Sahaj) – For resident individuals earning salary/pension income, one house property income, and interest income up to prescribed limits.</li>
          <li>ITR-2 – For individuals having capital gains, multiple house properties, foreign assets/income, NRI income, or income above the ITR-1 eligibility limits.</li>
        </ul>
        <p>At Legal Terminus, we help you select the correct ITR form before filing.</p>
      </>
    ),
  },
  {
    question: "Which Legal Terminus plan is suitable for me?",
    answer:
      "We offer different plans based on the complexity of your income profile — from basic salaried returns to capital gains, foreign income, NRI taxation, and DTAA-related filings. If your case does not fit a standard plan, our team can provide a customised quote.",
  },
  {
    question: "Should I choose the Old Tax Regime or the New Tax Regime?",
    answer:
      "It depends on your deductions, investments, home loan benefits, and overall income structure. The New Tax Regime may benefit taxpayers with fewer deductions, while the Old Regime may be useful where substantial deductions under Sections 80C, 80D, home loan interest, HRA, or NPS are available. We compare both regimes wherever applicable and help you choose the more beneficial option.",
  },
  {
    question: "What happens if I file the wrong ITR form?",
    answer:
      "Filing the wrong ITR form may result in a defective return notice under Section 139(9), requiring correction and re-filing within the prescribed time limit. Incorrect filing may also delay refunds and create unnecessary notices from the Income Tax Department.",
  },
  {
    question: "What is the due date for Individual ITR Filing?",
    answer:
      "For most non-audit individual taxpayers, the due date for FY 2025-26 (AY 2026-27) is 31 July 2026. Different due dates may apply in audit or special cases.",
  },
  {
    question: "What is the penalty for late ITR filing?",
    answer: (
      <>
        <p>Late filing may attract:</p>
        <ul>
          <li>Penalty under Section 234F</li>
          <li>Interest under Sections 234A, 234B, and 234C</li>
          <li>Delay in refund processing</li>
          <li>Loss of certain tax benefits and carry-forward of losses</li>
        </ul>
        <p>The actual penalty depends on your income level and delay period.</p>
      </>
    ),
  },
  {
    question: "Can I file ITR after the due date?",
    answer:
      "Yes. You may still file a Belated Return within the permitted timeline under the Income Tax Act, subject to applicable late fees and interest.",
  },
  {
    question: "Can I revise my ITR after filing?",
    answer:
      "Yes. If you discover any mistake after filing your original return, you may file a Revised Return within the permitted time limit under the Income Tax Act.",
  },
  {
    question: "What documents are generally required for ITR filing?",
    answer: (
      <>
        <p>Common documents include:</p>
        <ul>
          <li>PAN &amp; Aadhaar</li>
          <li>Form 16</li>
          <li>Salary slips</li>
          <li>Bank statements</li>
          <li>Capital gains statements</li>
          <li>Interest certificates</li>
          <li>Investment proofs</li>
          <li>Home loan statements</li>
          <li>Foreign income/asset details (if applicable)</li>
        </ul>
        <p>Required documents vary based on your income profile.</p>
      </>
    ),
  },
  {
    question: "Is ITR filing mandatory if TDS has already been deducted?",
    answer:
      "Not always, but filing ITR is generally advisable to claim refunds, maintain financial records, and avoid future compliance issues.",
  },
  {
    question: "Why is ITR important for loan and visa applications?",
    answer: (
      <>
        <p>ITR acts as official proof of income and financial history. Banks, financial institutions, and embassies often ask for ITR acknowledgements while processing:</p>
        <ul>
          <li>Home loans</li>
          <li>Personal loans</li>
          <li>Business loans</li>
          <li>Credit cards</li>
          <li>Visa applications</li>
        </ul>
      </>
    ),
  },
  {
    question: "What is AIS and why is it important?",
    answer: (
      <>
        <p>AIS (Annual Information Statement) contains financial information reported to the Income Tax Department, including:</p>
        <ul>
          <li>Salary</li>
          <li>Interest income</li>
          <li>TDS/TCS</li>
          <li>Share transactions</li>
          <li>Mutual funds</li>
          <li>Property transactions</li>
        </ul>
        <p>Mismatch between AIS and ITR may trigger notices. We reconcile AIS, TIS, and Form 26AS before filing.</p>
      </>
    ),
  },
  {
    question: "What is Form 26AS?",
    answer: (
      <>
        <p>Form 26AS is your consolidated tax statement showing:</p>
        <ul>
          <li>TDS deducted</li>
          <li>TCS collected</li>
          <li>Advance tax paid</li>
          <li>Self-assessment tax paid</li>
          <li>High-value financial transactions</li>
        </ul>
        <p>It helps ensure proper tax credit in your ITR.</p>
      </>
    ),
  },
  {
    question: "Do I need to report stock market or mutual fund investments in ITR?",
    answer:
      "Yes. Capital gains from shares, mutual funds, ETFs, and other securities must be properly disclosed in the correct ITR form.",
  },
  {
    question: "Is foreign income or foreign asset disclosure mandatory?",
    answer:
      "Yes. Resident individuals holding foreign assets or earning foreign income may be required to disclose them in Schedule FA and other applicable schedules. Non-disclosure can attract serious penalties under applicable laws.",
  },
  {
    question: "Can NRIs file ITR in India?",
    answer:
      "Yes. NRIs earning taxable income in India — such as rent, capital gains, interest, or business income — may be required to file an ITR in India.",
  },
  {
    question: "What is DTAA and how does it help NRIs?",
    answer:
      "DTAA (Double Taxation Avoidance Agreement) helps avoid double taxation on the same income in two countries. Proper DTAA application may reduce tax liability for eligible NRIs and foreign income earners.",
  },
  {
    question: "Is freelance or professional income covered under Individual ITR?",
    answer:
      "Yes. Freelancers, consultants, professionals, and gig workers can file ITR based on their income structure. Additional books of account or presumptive taxation provisions may apply in some cases.",
  },
  {
    question: "Can I claim home loan benefits in ITR?",
    answer: (
      <>
        <p>Yes. Eligible taxpayers may claim deductions for:</p>
        <ul>
          <li>Principal repayment under Section 80C</li>
          <li>Interest on home loan under applicable provisions</li>
        </ul>
        <p>Eligibility depends on the tax regime selected and property usage.</p>
      </>
    ),
  },
  {
    question: "What happens after ITR filing?",
    answer: (
      <>
        <p>After filing:</p>
        <ul>
          <li>The return must be e-verified.</li>
          <li>The Income Tax Department processes the return.</li>
          <li>Refund or tax demand (if any) is issued.</li>
          <li>Intimation under Section 143(1) may be received.</li>
        </ul>
        <p>We assist clients with post-filing status updates wherever applicable.</p>
      </>
    ),
  },
  {
    question: "Is e-verification mandatory after filing ITR?",
    answer:
      "Yes. An ITR is generally considered incomplete unless it is properly e-verified within the prescribed time.",
  },
  {
    question: "How long does it take to receive an income tax refund?",
    answer:
      "Refund timelines vary depending on processing by the Income Tax Department, accuracy of the filed return, and bank validation status.",
  },
  {
    question: "Can ITR help in maintaining financial records?",
    answer:
      "Yes. Regular ITR filing helps build a strong financial profile and acts as long-term proof of income, tax compliance, and financial stability.",
  },
  {
    question: "Do you provide support after ITR filing?",
    answer:
      "Yes. Legal Terminus provides filing updates, acknowledgment support, refund tracking assistance, and basic post-filing guidance depending on the service plan selected.",
  },
  {
    question: "How can Legal Terminus help me with Individual ITR Filing?",
    answer:
      "Legal Terminus provides professional support for salaried individuals, freelancers, pensioners, capital gains earners, NRIs, and foreign income cases. We help with correct ITR form selection, Old vs New Regime comparison, AIS/Form 26AS reconciliation, capital gains reporting, foreign asset disclosures, and accurate return filing through the official Income Tax portal. Our process is fully online, secure, and designed to make tax filing simple and hassle-free for individuals across different income categories.",
  },
];

const ItrIndFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">ITR Filing for Individual — FAQs</h2>
          <p className="opcfaq-intro">
            Got questions? We've got answers — straight, clear, and legally accurate.
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

export default ItrIndFAQ;
