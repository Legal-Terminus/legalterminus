import React, { useState } from "react";
import "./UdyamRegFAQ.css";

const faqs = [
  {
    question: "What is Udyam Registration and is it the same as MSME?",
    answer:
      "Udyam Registration IS the MSME registration in 2026. Since 1 July 2020, it replaced the older 'Udyog Aadhaar Memorandum (UAM)' and 'EM-II' systems. Filed online at udyamregistration.gov.in, governed by the MSMED Act, 2006. The certificate confirms your status as Micro / Small / Medium enterprise. Government fee is genuinely zero. Udyam = MSME, just the new official name.",
  },
  {
    question: "What are the new MSME classification limits in 2026?",
    answer:
      "Per the Budget 2025 amendment effective 1 April 2025: Micro — Investment ≤ ₹2.5 crore AND Turnover ≤ ₹10 crore. Small — Investment ≤ ₹25 crore AND Turnover ≤ ₹100 crore. Medium — Investment ≤ ₹125 crore AND Turnover ≤ ₹500 crore. Both conditions must be met for a category. Trading enterprises were added to the MSME definition in July 2021.",
  },
  {
    question: "What is Section 43B(h) and how does Udyam help me collect on time?",
    answer:
      "Section 43B(h) of the Income Tax Act (effective FY 2023-24) says: if a buyer doesn't pay an MSME supplier (with valid Udyam) within the agreed credit period (max 45 days under Section 15 of the MSMED Act), the buyer CANNOT claim that expense as a tax deduction in the year. The tax deduction shifts to the year of actual payment — which means the buyer's income tax goes up the year they delay paying you. This has dramatically rewritten payment discipline in 2024-25 onwards. Only Udyam-registered MSMEs get this protection.",
  },
  {
    question: "How long does Udyam registration take?",
    answer:
      "Same day. The Udyam Registration Number (URN) is issued INSTANTLY on form submission — the certificate PDF is downloadable within seconds. There is no manual approval, no review queue, no in-person verification. The validation runs on auto-fetch from PAN + Aadhaar + GSTN databases. The only delay risk is Aadhaar OTP failure (mobile not linked) or PAN being inoperative — both fixable in 1-2 days.",
  },
  {
    question: "Do I need GST registration for Udyam?",
    answer:
      "Only if your business is otherwise required to register under GST (turnover > ₹20L services / ₹40L goods, or covered under Section 24 of CGST Act). If you're below the threshold and not in Section 24, GST is NOT required for Udyam. PAN is mandatory regardless. Aadhaar of authorised person is mandatory regardless. The Udyam form auto-validates GSTIN if you have one.",
  },
  {
    question: "Can I file multiple Udyam Registrations under one PAN?",
    answer:
      "No. Section 8(8) of the MSMED Act read with the 26 June 2020 notification restricts ONE Udyam per enterprise. Multiple manufacturing / service / trading activities under the same PAN should be declared in the SAME Udyam (with up to 5 NIC codes). If you have multiple legal entities (different PANs), each gets its own Udyam.",
  },
  {
    question: "Is Udyam valid for life or do I need to renew?",
    answer:
      "Lifetime validity. No renewal needed. No annual fee. Once issued, the Udyam Number remains valid as long as the enterprise exists. The classification (Micro / Small / Medium) UPDATES AUTOMATICALLY every year based on your ITR + GSTR data — so if you graduate from Micro to Small, your certificate reflects the new tier without you having to refile.",
  },
  {
    question: "How can Legal Terminus help me with Udyam Registration?",
    answer:
      "Legal Terminus assists businesses throughout the Udyam Registration process by reviewing your business details, identifying the appropriate business activity classification (NIC Codes), preparing the application, and ensuring accurate submission on the Government portal. We also provide dedicated support for registration updates, corrections, and modifications, helping you maintain compliance and avoid errors. In addition, our team can assist with related services such as GST Registration, Trademark Registration, Startup India Registration, and other business compliance requirements through a single point of contact.",
  },
];

const UdyamRegFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="faq-section">
      <div className="faq-container">

        <div className="faq-header">
          <h2 className="faq-title">Udyam / MSME Registration — FAQs</h2>
          <p className="faq-intro">
            Got questions? We've got answers — straight, no-BS, legally accurate.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`faq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`faq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`faq-answer ${isActive ? "open" : ""}`}>
                  <div className="faq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default UdyamRegFAQ;
