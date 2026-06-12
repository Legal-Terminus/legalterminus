import React, { useState } from "react";
import "./DpartFAQ.css";

const faqs = [
  {
    question: "What does dissolution of a partnership firm mean?",
    answer:
      "Dissolution of a firm means the complete winding-up of the partnership business — the relationship among all the partners ends, the firm's assets are realised, its liabilities are settled, and any surplus is distributed among the partners. It is governed by the Indian Partnership Act, 1932, and is different from a single partner merely retiring while the firm continues.",
  },
  {
    question: "What is the difference between dissolution of partnership and dissolution of firm?",
    answer:
      "Dissolution of partnership is a change in the relationship — such as a partner retiring, dying, or being admitted — while the firm continues with the remaining partners. Dissolution of the firm is the complete closure of the business, where the firm itself ceases to exist. This service deals with the dissolution and winding-up of the firm.",
  },
  {
    question: "How can a partnership firm be dissolved?",
    answer:
      "A firm can be dissolved by mutual agreement of all partners (Section 40), by notice in a partnership at will (Section 43), automatically on a contingency such as expiry of term or death/insolvency of a partner (Section 42), compulsorily on insolvency or illegality (Section 41), or by an order of the court (Section 44). The most common and cleanest route is dissolution by agreement through a dissolution deed.",
  },
  {
    question: "What is a dissolution deed and why is it important?",
    answer:
      "A dissolution deed is a written agreement signed by all partners that records the date of dissolution, the settlement of accounts, the allocation of assets and liabilities, and mutual releases and indemnities. It is the central document of the closure — a clear, well-drafted deed is the best protection against future disputes between former partners.",
  },
  {
    question: "How are accounts settled when a firm is dissolved?",
    answer:
      "Under Section 48 of the Indian Partnership Act, the firm's assets (including any amounts contributed by partners to make up losses) are applied in order: first to pay the firm's debts to third parties, then to repay each partner's advances/loans, then to repay each partner's capital, and any surplus is divided among the partners in their profit-sharing ratio.",
  },
  {
    question: "Do I need to give a public notice of dissolution?",
    answer:
      "Yes — it is strongly recommended. A public notice informs third parties that the firm has been dissolved and protects the partners from being held liable for acts done in the firm's name after the dissolution. For a registered firm, a notice of dissolution should also be filed with the Registrar of Firms.",
  },
  {
    question: "What registrations need to be closed after dissolution?",
    answer:
      "After dissolution, the firm's GST registration, PAN, Udyam (MSME) registration, Shops & Establishment licence, and any other trade or industry-specific licences should be surrendered or cancelled, and the firm's bank account closed. Leaving these open keeps generating compliance obligations and notices for a firm that no longer exists.",
  },
  {
    question: "Is it necessary for the firm to be registered to dissolve it?",
    answer:
      "No. Both registered and unregistered partnership firms can be dissolved. For a registered firm, the additional step of filing a notice of dissolution with the Registrar of Firms applies. An unregistered firm is dissolved through the deed, settlement, and public notice without that filing.",
  },
  {
    question: "How does Legal Terminus help dissolve my partnership firm?",
    answer:
      "We advise on the right mode of dissolution, prepare the settlement of accounts, draft a comprehensive dissolution deed with mutual releases and indemnities, arrange the public notice and Registrar of Firms intimation, coordinate the surrender of PAN/GST/licences and bank closure, and file the firm's final return — handing you a complete, dispute-proof closure file. Book a free consultation to get started.",
  },
];

const DpartFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Dissolve a Partnership Firm — FAQs</h2>
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

export default DpartFAQ;
