import React, { useState } from "react";
import "./TmoppFAQ.css";

const faqs = [
  {
    question: "What is a trademark opposition?",
    answer:
      "After a trademark application clears examination, it is advertised in the Trademark Journal. A trademark opposition is a formal challenge filed by any third party who believes the published mark conflicts with their rights — it asks the Registry not to register the mark. It can be filed by anyone, and is the public's opportunity to stop a confusing or conflicting trademark from being registered.",
  },
  {
    question: "Within how long can an opposition be filed?",
    answer:
      "A Notice of Opposition (Form TM-O) must be filed within 4 months from the date the mark is published in the Trademark Journal. If no opposition is filed within this window, the mark proceeds toward registration. Monitoring the journal is therefore essential to catch a conflicting mark in time.",
  },
  {
    question: "My application has been opposed — what should I do?",
    answer:
      "You must file a Counter-Statement within 2 months of receiving the Notice of Opposition. This is a strict deadline: if you do not file the counter-statement in time, your application is treated as abandoned. The counter-statement denies the opposition's claims and asserts your right to the mark, after which the case proceeds to the evidence stage.",
  },
  {
    question: "What are the grounds for opposing a trademark?",
    answer:
      "Common grounds include that the mark is identical or deceptively similar to an earlier mark (Section 11), that it is descriptive, generic, or non-distinctive (Section 9), that the opponent has prior use and reputation in the mark, or that the application was made in bad faith. The opposition succeeds or fails on how well these grounds are argued and evidenced.",
  },
  {
    question: "What is the government fee to file an opposition?",
    answer:
      "The government fee to file a Notice of Opposition is ₹2,700 per class. Defending an opposition by filing a counter-statement carries no separate government fee. These fees are separate from our professional fee and are billed at actuals.",
  },
  {
    question: "What are the evidence stages in an opposition?",
    answer:
      "After the counter-statement, evidence is filed by affidavit in three stages: the opponent's evidence in support of the opposition (Rule 45), the applicant's evidence in support of the application (Rule 46), and the opponent's evidence strictly in reply (Rule 47). Each stage has a fixed timeline, and a party may sometimes waive its evidence and rely on its pleadings.",
  },
  {
    question: "Will there be a hearing in an opposition?",
    answer:
      "Yes. After the evidence stages are complete, the Registrar appoints a hearing where both sides present oral arguments, usually via video conference. The hearing is often decisive — being prepared with written submissions and proper representation strongly influences the outcome. After the hearing, the Registrar issues a reasoned decision.",
  },
  {
    question: "What happens after the Registrar's decision?",
    answer:
      "If the opposition is rejected, the mark proceeds to registration; if it is allowed, the application is refused. The party that is not satisfied with the decision may appeal to the High Court within the prescribed time. We advise you on the merits and next steps once the order is passed.",
  },
  {
    question: "How does Legal Terminus help with a trademark opposition?",
    answer:
      "We handle both sides end-to-end: monitoring the journal, drafting and filing the Notice of Opposition or the Counter-Statement within the deadline, compiling and filing evidence affidavits at each stage, and — where included — preparing for and representing you at the hearing before the Registrar, tracking the matter through to the final decision. Book a free consultation to get started.",
  },
];

const TmoppFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Trademark Opposition — FAQs</h2>
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

export default TmoppFAQ;
