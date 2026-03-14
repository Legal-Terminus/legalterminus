import React, { useState } from "react";
import "./TMApplicaFAQ.css";

const faqs = [
  {
    question: "Is trademark registration mandatory in India?",
    answer:
      "No, trademark registration is voluntary under the Trade Marks Act, 1999. However, registration gives you exclusive legal rights and the right to use ® — making it strongly advisable for any serious brand.",
  },
  {
    question: "Can I use ™ before my trademark is registered?",
    answer:
      "Yes! The ™ symbol can be used as soon as your application is filed, indicating that you're claiming rights over the mark. The ® symbol can only be used after the trademark is officially registered.",
  },
  {
    question: "How long does trademark registration take in India?",
    answer:
      "A smooth, uncontested trademark registration typically takes 2-3 years (this timelines varies and depends on the backlog with the department). If the application receives an examination report or faces opposition, it can take longer.",
  },
  {
    question:
      "What is a trademark class? Do I need to file in multiple classes?",
    answer:
      "A trademark class defines the category of goods or services your mark protects. India follows the Nice Classification with 45 classes. If your brand spans multiple product/service categories, you should consider multi-class filing to ensure complete protection.",
  },
  {
    question: "What happens if my trademark application gets objected?",
    answer:
      "The Trademark Examiner may raise objections (Absolute or Relative grounds) in an examination report. You have 30 days to file a reply. If not resolved, a Show Cause Hearing is scheduled. Our Enriched and Supreme plans cover this process.",
  },
  {
    question:
      "How long is a registered trademark valid?",
    answer:
    "A registered trademark in India is valid for 10 years from the date of filing. It can be renewed indefinitely every 10 years via Form TM-R, by paying the prescribed renewal fee.",
  },
  {
    question:
      "Can a foreign company or NRI register a trademark in India?",
    answer:
      "Yes. A foreign company or NRI can file a trademark application in India. For foreign applicants, an address for service in India is required. Our team handles the complete process. Fees for such cases are determined on mutual discussion.",
  },
  {
    question:
      "What is the government fee for trademark registration?",
    answer:
      "The government fee (Form TM-A) is ₹4,500 per class (online) for Individuals, Sole Proprietors, and MSME/Startup entities, and ₹9,000 per class (online) for Companies, LLPs, and other entities. These are in addition to Legal Terminus' professional fees.",
  },
  {
    question:
      "Can I register a trademark that is already in use by someone else?",
    answer:
      "No. If a similar or identical mark already exists in the same class, it will likely be refused by the Trademark Registry on relative grounds. This is exactly why we conduct a comprehensive trademark search before filing.",
  },
  {
    question:
      "What is Form TM-M?",
    answer:
      "Form TM-M serves as a Power of Attorney authorising Legal Terminus to file and prosecute your trademark application on your behalf. It is executed on ₹100 stamp paper (stamp duty may vary from state to state) and is mandatory for all trademark filings handled by us.",
  },
];

const FaqPvt = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="Tm-Applica-faq-section">
      <div className="Tm-Applica-faq-container">
        {/* Left side – static text */}
        <div className="Tm-Applica-faq-left">
          <h2 className="Tm-Applica-faq-title">Trademark Registration FAQ's</h2>

          <p className="Tm-Applica-faq-intro">
            Filing a trademark can feel like navigating a maze — but it doesn't have to. We've answered the most common questions about the process, timeline, documents, and costs.
          </p>

          <p className="Tm-Applica-faq-intro">
            
          </p>
        </div>

        {/* Right side – scrollable Q&A list */}
        <div className="Tm-Applica-faq-right">
          <div className="Tm-Applica-faq-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`Tm-Applica-faq-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="Tm-Applica-faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`Tm-Applica-faq-icon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>
                  {isActive && (
                   <div className={`Tm-Applica-faq-answer ${isActive ? "open" : ""}`}>
                    <p>{item.answer}</p>
                  </div>

                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqPvt;
