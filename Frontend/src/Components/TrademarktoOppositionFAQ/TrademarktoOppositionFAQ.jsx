import React, { useState } from "react";
import "./TrademarktoOppositionFAQ.css";

const faqs = [
  {
    question: "What is a Trademark Opposition?",
    answer:
      "After the acceptance and Advertisement of the Trademark by the Trademark department, a fair chance is given to the public at large to oppose such Trademark within 4 months from the date of such advertisement. In common parlance, the objection raised by a third party against the future registration of a Trademark by the department is called “Opposition”.",
  },
  {
    question: "Who can file a Notice of opposition?",
    answer:
      "Any person can file opposition against the advertised trademark before its registration. It is interesting to note that a person objecting need not necessarily be an owner of an applied or registered trademark. Such a person can be a commoner and can file an opposition for the interest of the public at large.",
  },
  {
    question: "What is the time span within which a Notice of opposition can be filed?",
    answer:
      "A notice of opposition can be filed within 4 months from the date of advertisement of Trademark. There is no provision for extension of such time period under the TM legislation.",
  },
  {
    question: "What is a Notice of Opposition?",
    answer:
      "The Notice of Opposition contains the grounds of opposition against which the opponent opposes a Trademark from getting it registered. The Notice of Opposition along with prescribed fees is sent to the TM Department in the first instance. The TM department verifies the same and forwards the Notice of Opposition to the applicant.",
  },
  {
    question: "What is the way forward for the owner of applied TM post receipt of Notice of Opposition?",
    answer:
      "Upon receipt of such a notice, the owner of applied TM needs to  file a Counter statement within two months of receipt of such Notice, along with a prescribed fee. Non-filing of Counter Statement may lead to deemed abandonment of the applied Trademark. The preparation of Counter statement requires specialized drafting skills and expert legal knowledge.",
  },
  {
    question: "What is a Counter Statement?",
    answer:
      "The Counter statement contains point wise reply of the Notice of opposition. It is required to be filed before the Registrar. Post reviewing the same, the Registrar forwards the Counter statement to the Opponent.",
  },
  {
    question: "What is the next step in Opposition after filing Counter Statement?",
    answer:
      "Once the counter statement is filed, the opponent provides the evidences in support of the Notice of Opposition through an Affidavit along with a prescribed fee. Non-filing of evidence may lead to abandonment of the opposition.",
  },
  {
    question: "What is the subsequent step in Opposition after filing evidence in support of Notice of Opposition?",
    answer:
      "The applicant has to file evidences in support of its Counter Statement along with the prescribed fee. Non-filing of evidence may lead to abandonment of the applied Trademark.",
  },
  {
    question: "What is the next step in Opposition after filing evidence in support of Counter Statement?",
    answer:
      "After submission of evidences by both the parties, Registrar calls both the parties for hearing the matter, and Registrar hears arguments from both the parties and adjudicates on the matter.",
  },
  {
    question: "How Legal Terminus can help you with the above process of opposition of Trademark?",
    answer:
      "Legal Terminus can help you with the process of opposition of TM for your organization, as and when required, in a hassle-free manner within a reasonable time span and for competitive professional fee. To know more, please book a telephonic appointment with one of our consultants free of charge.",
  },
];

const TradeLicenseFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="tlfaqx-section">
      <div className="tlfaqx-container">

        <div className="tlfaqx-left">
          <h2 className="tlfaqx-title">
            Trademark Opposition FAQ's
          </h2>

          <p className="tlfaqx-intro">
            Here, we’ve answered some of the most common questions about the Trademark Opposition process, and documentation to guide you through every step confidently.
          </p>
        </div>

        <div className="tlfaqx-right">
          <div className="tlfaqx-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`tlfaqx-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="tlfaqx-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span
                      className={`tlfaqx-icon ${isActive ? "open" : ""}`}
                    >
                      ▾
                    </span>
                  </button>

                  {isActive && (
                    <div
                      className={`tlfaqx-answer ${
                        isActive ? "open" : ""
                      }`}
                    >
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

export default TradeLicenseFAQ;
