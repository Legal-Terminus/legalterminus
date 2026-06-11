import React, { useState } from "react";
import "./TmrnwFAQ.css";

const faqs = [
  {
    question: "How often does a trademark need to be renewed?",
    answer:
      "A registered trademark in India is valid for 10 years from the date of application. To keep it protected, it must be renewed every 10 years under Section 25 of the Trade Marks Act, 1999. There is no limit on the number of renewals — a trademark can be renewed indefinitely in successive 10-year terms.",
  },
  {
    question: "When can I file for trademark renewal?",
    answer:
      "A renewal application (Form TM-R) can be filed up to one year before the registration's expiry date. Filing early is strongly recommended — it ensures uninterrupted protection and avoids any surcharge. We track your deadline and file well ahead of time.",
  },
  {
    question: "What happens if I miss the renewal deadline?",
    answer:
      "If you miss the expiry date, the trademark enters a 6-month grace period during which it can still be renewed by paying a surcharge in addition to the renewal fee. If it is not renewed within that window, the mark can be removed from the register and you lose your exclusive rights.",
  },
  {
    question: "Can a removed (lapsed) trademark be restored?",
    answer:
      "Yes — within one year of the expiry date, a removed trademark can be restored by filing Form TM-R with a restoration fee plus the renewal fee. However, restoration is at the Registrar's discretion and may require justification, making it more expensive and less certain than renewing on time.",
  },
  {
    question: "What is the government fee for trademark renewal?",
    answer:
      "The IP India e-filing fee for renewal is ₹9,000 per class. If renewing within the grace period, a surcharge applies on top of this, and restoration involves an additional restoration fee. These government fees are separate from our professional fee and are billed at actuals.",
  },
  {
    question: "Which form is used for trademark renewal?",
    answer:
      "Trademark renewal, grace-period renewal, and restoration are all filed using Form TM-R on the IP India portal. We prepare and file Form TM-R with the correct class(es), applicant details, and any applicable surcharge or restoration fee on your behalf.",
  },
  {
    question: "Do I need to renew each class separately?",
    answer:
      "If your trademark is registered in more than one class, the renewal fee applies per class. We handle multi-class and full-portfolio renewals together so every class — and every mark in your brand family — is renewed at the same time, with nothing left to lapse.",
  },
  {
    question: "Will I get a reminder before my trademark expires?",
    answer:
      "The Registry may send a notice before expiry, but relying on it is risky. As part of our service, we set an automatic reminder well ahead of your renewal date and proactively reach out — so your renewal is handled in good time regardless of whether an official notice arrives.",
  },
  {
    question: "How does Legal Terminus handle my trademark renewal?",
    answer:
      "We verify your renewal deadline against the official register, collect the required details, prepare and file Form TM-R (with any surcharge or restoration fee), pay the government fee at actuals, track the Registry's processing, and confirm the renewed 10-year validity — then set a reminder for the next cycle. Book a free consultation to get started.",
  },
];

const TmrnwFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Trademark Renewal — FAQs</h2>
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

export default TmrnwFAQ;
