import React, { useState } from "react";
import "./GstFilingFAQ.css";

const faqs = [
  {
    question: "Who is required to file GST returns?",
    answer:
      "Every person registered under GST must file returns — regular taxpayers, composition dealers, e-commerce operators, Input Service Distributors, TDS/TCS deductors, and non-resident taxpayers. Returns must be filed even for periods with no transactions (a Nil return). Filing frequency and the specific returns depend on your turnover, taxpayer category, and scheme.",
  },
  {
    question: "What are the main GST returns and their due dates?",
    answer:
      "For regular monthly taxpayers: GSTR-1 (outward supplies) is due by the 11th of the next month and GSTR-3B (summary & tax) by the 20th. Under the QRMP scheme, GSTR-1 and GSTR-3B are quarterly (13th / 22nd or 24th) with monthly tax via PMT-06. The annual return GSTR-9 (and GSTR-9C reconciliation, where applicable) is due by 31st December of the following financial year.",
  },
  {
    question: "What is the difference between GSTR-1, GSTR-2B, and GSTR-3B?",
    answer:
      "GSTR-1 is your outward (sales) return filed with invoice-level detail. GSTR-2B is an auto-drafted, static statement of the Input Tax Credit available to you, based on what your suppliers filed. GSTR-3B is the monthly summary return where you declare total outward supply, claim eligible ITC (matched to GSTR-2B), and pay the net tax.",
  },
  {
    question: "What is the QRMP scheme?",
    answer:
      "The Quarterly Return Monthly Payment (QRMP) scheme is available to taxpayers with aggregate turnover up to ₹5 crore. You file GSTR-1 and GSTR-3B quarterly but pay tax monthly through a simple challan (PMT-06) for the first two months of the quarter. It reduces filing frequency while keeping tax payments current.",
  },
  {
    question: "What are the late fees and interest for delayed GST returns?",
    answer:
      "Late filing attracts a late fee of ₹50 per day (₹20 per day for Nil returns), split equally between CGST and SGST, subject to a cap based on turnover. In addition, interest at 18% per annum is charged on the net tax paid late, calculated from the due date to the date of actual payment.",
  },
  {
    question: "Can a GST return be revised after filing?",
    answer:
      "No. Once filed, a GST return cannot be revised. Any error or omission is corrected by making an amendment in a subsequent period's return (for example, amending an invoice in the next GSTR-1), within the time limits allowed under GST law. This is why first-time accuracy and pre-filing review matter.",
  },
  {
    question: "How is Input Tax Credit (ITC) claimed correctly?",
    answer:
      "ITC is claimed in GSTR-3B strictly to the extent it appears in your GSTR-2B and is eligible under Section 16 of the CGST Act — you must have a valid tax invoice, have received the goods/services, and the supplier must have paid the tax. We reconcile GSTR-2B against your purchase register every period so you claim all eligible credit and avoid wrongful claims that get reversed with interest.",
  },
  {
    question: "What happens if I don't file GST returns for several periods?",
    answer:
      "Continuous non-filing escalates quickly: late fees and interest accumulate, you cannot file later returns until earlier ones are filed, your e-way bill generation can be blocked, your buyers lose ITC on your invoices, and ultimately your GSTIN can be suspended or cancelled. Restoring compliance later is costlier than staying current.",
  },
  {
    question: "How does Legal Terminus handle my GST return filing?",
    answer:
      "We manage the entire cycle end-to-end: maintaining your due-date calendar, collecting your sales and purchase data, reconciling ITC against GSTR-2B, computing tax, preparing GSTR-1 and GSTR-3B (and annual GSTR-9/9C), getting your approval, and filing on the portal before the deadline — with the ARN and a tax summary shared after every filing. Book a free consultation to get started.",
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
