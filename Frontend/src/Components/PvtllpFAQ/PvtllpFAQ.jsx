import React, { useState } from "react";
import "./PvtllpFAQ.css";

const faqs = [
  {
    q: "Can a Private Limited Company be converted into an LLP?",
    a: "Yes. A Private Limited Company can be converted into an LLP under Section 56 and the Third Schedule of the LLP Act, 2008. The conversion is filed through Form 18 and Form FiLLiP on the MCA portal. After approval, the company is converted into an LLP with a new LLP Incorporation Certificate.",
  },
  {
    q: "What are the main conditions for Pvt Ltd to LLP Conversion?",
    a: "The important conditions are:\n• All shareholders of the company must become partners in the LLP.\n• There should be no active security interest or charge on company assets at the time of conversion.\n• The company should have proper MCA compliance filings updated.\n• The same business should continue after conversion.\n\nWe review all eligibility conditions before filing the application.",
  },
  {
    q: "Is newspaper publication or URC-2 required for Pvt Ltd to LLP Conversion?",
    a: "No. Pvt Ltd Company to LLP Conversion does not require newspaper publication (URC-2), or URC-1 filing. The process is completely different from company incorporation or Section 366 conversions.",
  },
  {
    q: "What is the meaning of 'no security interest'?",
    a: "It means the company should not have any active charge, mortgage, hypothecation, or secured loan registered on its assets at the time of conversion. If any charge exists, it must first be satisfied and closed with the ROC before LLP conversion can proceed.",
  },
  {
    q: "What is Section 47(xiiib) tax exemption?",
    a: "Section 47(xiiib) of the Income-tax Act provides tax exemption on conversion of a Private Limited Company into an LLP, subject to certain conditions such as turnover limit, asset limit, and continuity of ownership.\n\nIf these conditions are satisfied, capital gains tax may not apply on conversion. We help review eligibility before starting the process.",
  },
  {
    q: "Can a company with turnover above ₹60 lakh convert into LLP?",
    a: "Yes. There is no restriction under the LLP Act on turnover for conversion. However, if turnover or asset limits exceed the conditions prescribed under Section 47(xiiib), the tax exemption benefit may not be available.",
  },
  {
    q: "How long does Pvt Ltd Company to LLP Conversion take?",
    a: "In most cases, the conversion process takes around 20–35 working days, depending on document readiness, MCA processing time, and whether any clarification is raised by the ROC.",
  },
  {
    q: "What happens to the company's assets and liabilities after conversion?",
    a: "After conversion, all assets, liabilities, contracts, rights, and obligations of the company automatically transfer to the LLP as per the LLP Act. The business continues under the LLP structure.",
  },
  {
    q: "What happens to GST, bank accounts, and licenses after conversion?",
    a: "Post conversion, GST registration, bank accounts, and business licenses may require amendment or migration to reflect the LLP structure. We assist clients with post-conversion compliance support as part of selected plans.",
  },
  {
    q: "Is audit mandatory for an LLP after conversion?",
    a: "Audit in an LLP is required only if:\n• Annual turnover exceeds ₹40 lakh, or\n• Partner contribution exceeds ₹25 lakh.\n\nIf these limits are not crossed, statutory audit is generally not mandatory under the LLP Act.",
  },
  {
    q: "Is an LLP better than a Pvt Ltd Company?",
    a: "It depends on business goals.\n\nAn LLP is suitable for:\n• Closely held businesses\n• Professional firms\n• Businesses not planning investor funding\n• Businesses looking for lower compliance cost\n\nA Private Limited Company is generally better for:\n• Startups planning fundraising\n• ESOP structures\n• Venture capital or angel investment\n• Rapid business scaling\n\nWe help you evaluate which structure fits your long-term business plans.",
  },
  {
    q: "What are the major compliances after LLP conversion?",
    a: "After conversion, important compliances include:\n• Filing LLP Agreement in Form 3\n• Filing Form 14 with ROC\n• Annual Form 11 and Form 8 filings\n• Income Tax Return filing\n• GST and other business compliance filings (if applicable)",
  },
  {
    q: "Can the LLP continue using the same business name?",
    a: "Generally yes, subject to MCA name approval guidelines. The LLP name is usually approved in a similar format to maintain business continuity and brand identity.",
  },
  {
    q: "How can Legal Terminus help with Pvt Ltd Company to LLP Conversion?",
    a: "Legal Terminus provides complete end-to-end and hassle-free assistance for Pvt Ltd Company to LLP Conversion, including eligibility review, document preparation, shareholder and partner structuring, ROC compliance check, Form 18 and FiLLiP filing, LLP Agreement drafting, and post-conversion compliance support.\n\nOur team also helps review tax exemption eligibility under Section 47(xiiib), identify compliance risks before filing, and ensure the conversion process is completed smoothly and professionally through the official MCA portal.",
  },
];

const PvtllpFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggle = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section" id="faq">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Private Limited to LLP — FAQs</h2>
          <p className="opcfaq-intro">
            Everything you need to know about converting your Private Limited Company into an LLP
          </p>
        </div>

        <div className="opcfaq-list">
          {faqs.map((faq, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`opcfaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="opcfaq-question"
                  onClick={() => toggle(index)}
                  aria-expanded={isActive}
                >
                  <span>{faq.q}</span>
                  <span className={`opcfaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`opcfaq-answer ${isActive ? "open" : ""}`}>
                  <div className="opcfaq-answer-content" style={{ whiteSpace: "pre-line" }}>{faq.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PvtllpFAQ;
