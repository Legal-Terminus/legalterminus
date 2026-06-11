import React, { useState } from "react";
import "./TmarkFAQ.css";

const faqs = [
  {
    question: "What is a trademark and what can be registered?",
    answer:
      "A trademark is a sign that distinguishes your goods or services from others — it can be a brand name, word, logo, slogan, label, shape, sound, or a combination. Under the Trade Marks Act, 1999, any mark that is distinctive and capable of distinguishing your offering can be registered, across one or more of the 45 classes of goods and services.",
  },
  {
    question: "Why should I register my trademark?",
    answer:
      "Registration gives you exclusive nationwide rights to your brand in its class, the power to file infringement suits, and a valuable, tradable asset you can license, franchise, or sell. Without registration, anyone can use a similar name, and you could even be forced to rebrand if someone else registers it first.",
  },
  {
    question: "What is the difference between the ™ and ® symbols?",
    answer:
      "You can use the ™ symbol as soon as you file your application — it signals that you claim the mark. The ® symbol can be used only after the trademark is officially registered and a certificate is issued. Using ® before registration is not permitted and can create legal liability.",
  },
  {
    question: "How long does trademark registration take?",
    answer:
      "If the application goes through smoothly, registration typically takes several months to about a year or more, depending on examination and any objections. However, you get the benefits of priority and the right to use ™ from the date of filing itself — which is immediate.",
  },
  {
    question: "What are trademark classes and how many do I need?",
    answer:
      "India follows the Nice Classification of 45 classes — classes 1–34 cover goods and 35–45 cover services. Your trademark is protected only in the class(es) you register. You should file in every class your business genuinely operates in; each additional class carries its own government fee. We advise on the right classes during the search.",
  },
  {
    question: "What is the government fee for a trademark application?",
    answer:
      "The IP India e-filing fee is ₹4,500 per class for individuals, startups, and MSMEs, and ₹9,000 per class for companies and other entities. This is per class and is separate from our professional fee. Claiming the concessional fee requires valid MSME (Udyam) or DPIIT startup recognition where applicable.",
  },
  {
    question: "What happens if my trademark gets an objection?",
    answer:
      "The Registry may raise an objection in its examination report — usually under Section 9 (the mark is non-distinctive or descriptive) or Section 11 (it conflicts with an existing mark). This is common and not the end of the road: we file a detailed, citation-backed reply, and if a hearing is scheduled, we prepare and represent your case.",
  },
  {
    question: "What is the trademark opposition period?",
    answer:
      "After your mark is accepted, it is published in the Trademark Journal and opens a 4-month window during which any third party who believes it conflicts with their rights can file an opposition. If no opposition is filed (or it is decided in your favour), the mark proceeds to registration.",
  },
  {
    question: "How long is a registered trademark valid?",
    answer:
      "A registered trademark is valid for 10 years from the date of application and can be renewed indefinitely in successive 10-year periods. As long as you renew it on time, your trademark protection can last forever — making it one of the few business assets that never has to expire.",
  },
];

const TmarkFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Trademark Application — FAQs</h2>
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

export default TmarkFAQ;
