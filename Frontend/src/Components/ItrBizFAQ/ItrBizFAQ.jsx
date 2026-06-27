import React, { useState } from "react";
import "./ItrBizFAQ.css";

const faqs = [
  {
    question: "Do your plans cover both Proprietorships and Partnership Firms?",
    answer:
      "Yes. All our Business ITR Filing plans are designed for both Sole Proprietorships and Partnership Firms with turnover up to Rs.50 lakh (non-audit cases). The filing process and pricing structure remain the same, but the applicable ITR form and tax calculation method differ based on the entity type. Proprietorships are generally filed through ITR-3 or ITR-4, while Partnership Firms are generally filed through ITR-5 or ITR-4.",
  },
  {
    question: "How is tax calculation different for Proprietors and Partnership Firms?",
    answer: (
      <>
        <p>For Proprietorships, business income is added to the owner's personal income and taxed as per individual slab rates. Eligible proprietors may also get benefits like the Section 87A rebate under the new tax regime.</p>
        <p>For Partnership Firms, the firm itself is taxed separately at a flat applicable tax rate along with surcharge and cess as per the Income Tax Act. Partner remuneration and interest can be claimed as deductions subject to prescribed limits.</p>
      </>
    ),
  },
  {
    question: "Which ITR forms are applicable for business filing?",
    answer: (
      <>
        <p>Depending on the nature of business and taxation method:</p>
        <ul>
          <li>Proprietorships generally file through ITR-3 or ITR-4</li>
          <li>Partnership Firms generally file through ITR-5 or ITR-4</li>
        </ul>
        <p>Our team selects the correct form after reviewing your business structure and income details.</p>
      </>
    ),
  },
  {
    question: "What is Section 44AD Presumptive Taxation?",
    answer:
      "Section 44AD allows eligible small businesses to declare income on a presumptive basis without maintaining detailed books of accounts. It is generally available for eligible businesses within prescribed turnover limits. Filing is usually done through ITR-4.",
  },
  {
    question: "Which of your plans is suitable for me?",
    answer: (
      <>
        <p>Choose your plan based on the level of support you need:</p>
        <ul>
          <li>ELEMENTAL – For businesses having ready Balance Sheet and financial statements</li>
          <li>ENRICHED – For businesses needing Balance Sheet, P&L, and tax computation preparation</li>
          <li>SUPREME – For businesses requiring complete year-round bookkeeping, Tally accounting, and compliance support</li>
        </ul>
      </>
    ),
  },
  {
    question: "Do you provide Tally accounting support?",
    answer:
      "Yes. Under our Supreme plan, we provide year-round Tally bookkeeping support, accounting assistance, financial statement preparation, and compliance coordination.",
  },
  {
    question: "What is Section 194T for Partnership Firms?",
    answer:
      "From FY 2025-26 onwards, Section 194T introduces TDS compliance on certain payments made by Partnership Firms and LLPs to partners above prescribed limits. We help eligible firms manage this compliance properly.",
  },
  {
    question: "Is GST reconciliation included?",
    answer:
      "Yes. GST reconciliation support is available under higher-tier plans wherever applicable.",
  },
  {
    question: "What happens if I file the wrong ITR form?",
    answer:
      "Filing the wrong ITR form may result in a defective return notice from the Income Tax Department and may require correction or re-filing. We help ensure the correct form is selected from the beginning.",
  },
  {
    question: "Is there any Government fee for Business ITR filing?",
    answer:
      "No. There is no Government filing fee for filing Business ITR on the Income Tax portal. You only pay professional fees for accounting, tax computation, and filing services.",
  },
  {
    question: "Who pays the income tax to the Government?",
    answer:
      "The applicable income tax amount is paid directly by the client through the official Income Tax payment system. Legal Terminus does not collect or hold government taxes on behalf of clients.",
  },
  {
    question: "What is the due date for Business ITR Filing?",
    answer:
      "For most non-audit business cases for FY 2025-26 (AY 2026-27), the due date is 31 July 2026. Audit cases may have separate due dates as prescribed under the Income Tax Act.",
  },
  {
    question: "What happens if Business ITR is filed late?",
    answer:
      "Late filing may attract penalty, interest, delayed refund processing, and other compliance issues under the Income Tax Act.",
  },
  {
    question: "Is maintaining books of accounts mandatory?",
    answer:
      "Certain businesses are required to maintain books of accounts under Section 44AA of the Income Tax Act based on turnover and income criteria.",
  },
  {
    question: "Can I revise my Business ITR after filing?",
    answer:
      "Yes. If you discover any mistake after filing the return, a revised return can generally be filed within the prescribed timeline under the Income Tax Act.",
  },
  {
    question: "Do you help with advance tax calculation?",
    answer:
      "Yes. We assist eligible businesses in calculating advance tax liability wherever applicable.",
  },
  {
    question: "Can you handle returns for freelancers and consultants?",
    answer:
      "Yes. Freelancers, consultants, and professionals can also avail our Business ITR Filing services depending on the nature of their income and turnover.",
  },
  {
    question: "Do you support notices from the Income Tax Department?",
    answer:
      "Yes. We provide basic support and guidance for routine notices related to return filing and processing.",
  },
  {
    question: "What documents are generally required for Business ITR Filing?",
    answer: (
      <>
        <p>Commonly required documents include:</p>
        <ul>
          <li>PAN and Aadhaar</li>
          <li>Bank statements</li>
          <li>GST details (if applicable)</li>
          <li>Balance Sheet and Profit &amp; Loss Account</li>
          <li>TDS certificates</li>
          <li>Investment and loan details</li>
          <li>Previous year ITR copy</li>
        </ul>
      </>
    ),
  },
  {
    question: "Can newly started businesses also file ITR?",
    answer:
      "Yes. Even newly started Proprietorships and Partnership Firms should file ITR if applicable under the Income Tax Act.",
  },
  {
    question: "Do you provide support for tax refunds?",
    answer:
      "Yes. We assist in proper filing, refund tracking, and status updates until the return is processed.",
  },
  {
    question: "Is online filing available?",
    answer:
      "Yes. The entire Business ITR Filing process can be completed online through document sharing and virtual coordination.",
  },
  {
    question: "Do you provide customised plans for larger businesses?",
    answer:
      "Yes. Businesses with higher turnover, tax audit applicability, or special requirements can contact our team for a customised quote.",
  },
  {
    question: "Why choose Legal Terminus for Business ITR Filing?",
    answer:
      "Legal Terminus provides professionally managed Business ITR Filing services for both Proprietorships and Partnership Firms with accurate tax computation, proper form selection, timely filing support, accounting assistance, and regular status updates. Our team focuses on practical compliance support, transparent pricing, and smooth year-round coordination for businesses.",
  },
];

const ItrBizFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Business ITR Filing — FAQs</h2>
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

export default ItrBizFAQ;
