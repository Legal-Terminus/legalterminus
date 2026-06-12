import React, { useState } from "react";
import "./TmhearFAQ.css";

const faqs = [
  {
    question: "What is a trademark hearing?",
    answer:
      "A trademark hearing is an oral proceeding before a Hearing Officer at the Trade Marks Registry where you argue your case in person (usually via video conference). It happens either as a show-cause hearing — when the Examiner is not satisfied with your reply to the examination report — or as an opposition hearing, when your application has been opposed and both sides argue after the evidence stages.",
  },
  {
    question: "Why has my trademark been listed for a hearing?",
    answer:
      "Your mark is listed for a hearing when the Registry wants to hear you before taking a decision — typically because the objection raised in the examination report was not fully resolved by your written reply, or because an opposition has been filed against your application. The hearing is your opportunity to convince the Officer that the mark should be registered.",
  },
  {
    question: "How will I know the date of my hearing?",
    answer:
      "The Trade Marks Registry issues a hearing notice on the IP India portal, fixing the date and the mode (most hearings are now held by video conference). The notice is generally given a few weeks in advance. It is important to share it with your representative immediately so there is enough time to prepare.",
  },
  {
    question: "Do I have to attend the hearing in person?",
    answer:
      "Most trademark hearings are conducted online by video conference, so physical attendance is usually not required. You can also be represented by a trademark attorney or agent who appears and argues on your behalf — in fact, professional representation is strongly recommended for the best outcome.",
  },
  {
    question: "What happens if I miss or don't attend the hearing?",
    answer:
      "If neither you nor your representative attends, the Hearing Officer can decide the matter ex-parte — which usually means the application is refused or treated as abandoned. Because the consequences are severe, ensuring that someone appears and presents your case is critical.",
  },
  {
    question: "Can a trademark hearing be adjourned?",
    answer:
      "Yes, but only to a limited extent. An adjournment can be requested (by filing Form TM-M with the prescribed fee) if more time is genuinely needed, and it is granted at the Registry's discretion. You cannot rely on repeated postponements, so it is safer to be fully prepared for the scheduled date.",
  },
  {
    question: "What should I prepare for the hearing?",
    answer:
      "You should have well-drafted written submissions addressing the objection or opposition, organised evidence of use and reputation (invoices, advertising, sales, packaging), an affidavit of use where relevant, and a clear line of argument. We prepare all of this and file the submissions in advance to frame your case before the hearing begins.",
  },
  {
    question: "What happens after the hearing?",
    answer:
      "After hearing the arguments, the Hearing Officer passes a reasoned order — accepting the mark (which then proceeds toward registration or journal publication), refusing it, or seeking further material. We analyse the order and advise you on the next step, whether that is publication, a review, or an appeal to the High Court.",
  },
  {
    question: "How does Legal Terminus help with a trademark hearing?",
    answer:
      "We review your case the moment the hearing notice arrives, build the strategy, draft and file written submissions with case-law citations, organise your evidence, brief you, and have a trademark attorney appear and argue at the virtual hearing — handling adjournments if needed and advising on next steps after the order. Book a free consultation to get started.",
  },
];

const TmhearFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Trademark Hearing — FAQs</h2>
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

export default TmhearFAQ;
