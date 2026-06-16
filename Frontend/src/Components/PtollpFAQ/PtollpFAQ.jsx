import React, { useState } from "react";
import "./PtollpFAQ.css";

const faqs = [
  {
    question: "What is Partnership to LLP conversion?",
    answer:
      "It is the process of converting an existing partnership firm into a Limited Liability Partnership (LLP) under Section 55 and the Second Schedule of the LLP Act, 2008. The same partners carry over, the business continues as an LLP, and the partners gain limited liability and a separate legal identity while keeping the flexibility of a partnership.",
  },
  {
    question: "Can both registered and unregistered firms convert to an LLP?",
    answer:
      "Yes. Both a registered and an unregistered partnership firm can be converted into an LLP under Section 55, provided the eligibility conditions are met. The firm's income-tax returns should be up to date, the consent of all partners and creditors should be available, and there should be no subsisting security interest on the firm's assets (or the secured creditors must consent).",
  },
  {
    question: "Which forms are filed for the conversion?",
    answer:
      "The conversion is filed using Form 17 (the application and statement for conversion of a firm into an LLP) together with Form FiLLiP for incorporation of the LLP. After the LLP is registered, the LLP agreement is filed in Form 3 within 30 days. We prepare and file all of these on your behalf.",
  },
  {
    question: "What happens to the firm's assets and liabilities on conversion?",
    answer:
      "On conversion, all the property, assets, interests, rights, privileges, liabilities, and obligations of the firm vest in the LLP automatically by operation of law — no separate transfer deeds or stamp duty on each asset are needed. Existing contracts and licences continue as if entered into by the LLP, and the firm is deemed dissolved.",
  },
  {
    question: "Do all partners have to become partners of the LLP?",
    answer:
      "Yes. On conversion, all the partners of the firm — and no one other than them — must become partners of the LLP. At least two of them must be appointed as designated partners with a DPIN and DSC. New partners can be brought in only after the LLP is incorporated, through a supplementary LLP agreement.",
  },
  {
    question: "Is a statement of accounts and creditor consent required?",
    answer:
      "Yes. The conversion application requires a statement of the assets and liabilities of the firm certified as true and correct by a Chartered Accountant in practice, along with a list of all creditors and their consent to the conversion. These protect creditors and are essential for the ROC to approve the conversion.",
  },
  {
    question: "What are the compliance requirements of an LLP after conversion?",
    answer:
      "An LLP files two annual MCA forms — Form 11 (annual return) by 30 May and Form 8 (statement of account & solvency) by 30 October — and its income tax return (ITR-5). A statutory audit is required only if turnover exceeds ₹40 lakh or contribution exceeds ₹25 lakh, so the compliance burden is lighter than that of a private limited company.",
  },
  {
    question: "What happens to GST, PAN, and licences after conversion?",
    answer:
      "Since the LLP is a new legal entity, fresh registrations are taken in the LLP's name — a new PAN, GST migration, and updating of Udyam, IEC, and other licences. The Registrar of Firms is also intimated of the conversion. We handle this migration so the business runs seamlessly under the LLP.",
  },
  {
    question: "How does Legal Terminus help convert my firm to an LLP?",
    answer:
      "We manage the entire Section 55 conversion end-to-end: eligibility check, DSC/DPIN, name reservation, the CA-certified statement of assets and liabilities and creditor consents, filing Form 17 with FiLLiP, drafting and filing the LLP agreement (Form 3) — then Registrar of Firms intimation, PAN/GST/licence migration, and a first-year compliance calendar. Book a free consultation to get started.",
  },
];

const PtollpFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Partnership to LLP — FAQs</h2>
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

export default PtollpFAQ;
