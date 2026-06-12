import React, { useState } from "react";
import "./GstFilingFAQ.css";

const faqs = [
  {
    question: "Who needs to file GST returns in India?",
    answer:
      "Every business or person registered under GST must file GST returns, even if there were no sales or purchases during the period/month. Nil returns are also mandatory. Different types of taxpayers file different returns — such as GSTR-1, GSTR-3B, CMP-08, GSTR-4, GSTR-9, and others — depending on their registration type and turnover.",
  },
  {
    question: "Which GST Return Filing plan is suitable for my business?",
    answer: (
      <div>
        <p>Our plans are designed based on business size and invoice volume:</p>
        <ul>
          <li>Elemental – Best for nil return filers</li>
          <li>Enriched – Suitable for businesses with limited monthly invoices</li>
          <li>Supreme – Ideal for growing SMEs with regular GST activity</li>
          <li>Supreme+ – Designed for high-volume or multi-service businesses requiring advanced reconciliation and annual return support</li>
        </ul>
        <p>We help you choose the right plan during onboarding.</p>
      </div>
    ),
  },
  {
    question: "What is GSTR-3B hard-locking?",
    answer:
      "Under the latest GST system updates, important tax details in GSTR-3B are automatically taken from GSTR-1 and cannot be edited manually later. This means errors in sales reporting can directly affect your tax liability. Proper reconciliation before filing has now become extremely important.",
  },
  {
    question: "What is IMS (Invoice Management System)?",
    answer:
      "IMS is a system where buyers can review and accept or reject supplier invoices uploaded under GST. Incorrect invoice details can impact your customer's input tax credit (ITC) and may create disputes or compliance issues. Regular invoice matching is now essential for smooth GST compliance.",
  },
  {
    question: "What is GSTR-1A?",
    answer:
      "GSTR-1A is a correction facility that allows businesses to amend mistakes in GSTR-1 before filing GSTR-3B for the same period. It helps businesses avoid tax mismatches and incorrect GST liability.",
  },
  {
    question: "What are the due dates for GST returns?",
    answer: (
      <div>
        <p>Common GST due dates are:</p>
        <ul>
          <li>GSTR-1 – 11th of next month</li>
          <li>GSTR-3B – 20th of next month</li>
          <li>CMP-08 – Quarterly</li>
          <li>GSTR-9 (Annual Return) – 31st December of next financial year</li>
        </ul>
        <p>Due dates may vary for QRMP taxpayers and special categories.</p>
      </div>
    ),
  },
  {
    question: "Are government late fees included in your plans?",
    answer:
      "No. Our plans cover professional services such as reconciliation, return preparation, and filing support. Government late fees, penalties, and interest (if any) are paid directly on the GST portal by the taxpayer.",
  },
  {
    question: "What is the 3-year GST return time limit?",
    answer:
      "Under recent GST updates, returns cannot be filed after 3 years from their original due date. Pending old GST returns should be filed as early as possible to avoid permanent loss of input tax credit and compliance complications.",
  },
  {
    question: "What if I have multiple GST registrations?",
    answer:
      "Each GSTIN is treated separately under GST law and requires separate return filing. We also provide support for businesses operating in multiple states with multiple GST registrations.",
  },
  {
    question: "What is QRMP Scheme?",
    answer:
      "QRMP (Quarterly Return Monthly Payment) allows eligible businesses with turnover up to ₹5 crore to file GST returns quarterly instead of monthly while paying tax monthly. It reduces filing frequency and is beneficial for many small businesses.",
  },
  {
    question: "Do I need to file GSTR-9 and GSTR-9C?",
    answer:
      "GSTR-9 (Annual Return) is generally applicable for businesses crossing the prescribed turnover limit. GSTR-9C is applicable for higher turnover businesses requiring reconciliation with financial statements. We guide you based on your turnover and GST category.",
  },
  {
    question: "Are E-Way Bill and E-Invoice included in GST compliance?",
    answer: (
      <div>
        <p>Yes, they are important parts of GST compliance for eligible businesses.</p>
        <ul>
          <li>E-Way Bill is required for movement of goods beyond prescribed limits.</li>
          <li>E-Invoicing is mandatory for businesses crossing notified turnover thresholds.</li>
        </ul>
        <p>We also assist businesses with these compliances.</p>
      </div>
    ),
  },
  {
    question: "What happens if GST returns are not filed?",
    answer: (
      <div>
        <p>Non-filing of GST returns may lead to:</p>
        <ul>
          <li>Late fees and interest</li>
          <li>Blocking of Input Tax Credit (ITC)</li>
          <li>GST notice and penalties</li>
          <li>Suspension or cancellation of GST registration</li>
          <li>Difficulty in business operations and vendor relationships</li>
        </ul>
        <p>Timely filing helps avoid unnecessary compliance risks.</p>
      </div>
    ),
  },
  {
    question: "Can I file NIL GST returns?",
    answer:
      "Yes. Even if there are no sales or purchases during the month or quarter, GST-registered businesses must still file NIL returns to keep the GST registration active and compliant.",
  },
  {
    question: "What documents are required for GST Return Filing?",
    answer: (
      <div>
        <p>Generally, businesses need:</p>
        <ul>
          <li>Sales invoices</li>
          <li>Purchase invoices</li>
          <li>Bank statements</li>
          <li>Expense details</li>
          <li>Previous GST returns</li>
          <li>E-way bill or e-invoice data (if applicable)</li>
        </ul>
        <p>The exact requirement depends on your business type and GST activity.</p>
      </div>
    ),
  },
  {
    question: "How can Legal Terminus help with GST Return Filing?",
    answer:
      "Legal Terminus provides end-to-end GST Return Filing support for businesses across India. Our team handles return preparation, invoice reconciliation, GST portal filing, GSTR-2B matching, annual return support, and regular compliance tracking. We help businesses file accurate GST returns on time while reducing errors, notices, ITC mismatches, and late filing risks. Whether you are a small business, growing startup, trader, contractor, or multi-state enterprise, we provide structured GST compliance support based on your business needs.",
  },
];

const GstFilingFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">GST Return Filing — FAQs</h2>
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

export default GstFilingFAQ;
