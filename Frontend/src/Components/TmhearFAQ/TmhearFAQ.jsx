import React, { useState } from "react";
import "./TmhearFAQ.css";

const faqs = [
  {
    question: "Do I need to personally attend the Trademark Hearing?",
    answer:
      "No. In most cases, your authorised trademark attorney or agent can attend and represent you before the Trade Marks Registry. However, clients are welcome to join the online hearing as observers if they wish.",
  },
  {
    question: "Are Trademark Hearings conducted physically or online?",
    answer:
      "Most Trademark Hearings in India are now conducted online through video conference by the Trade Marks Registry. Physical appearance is generally not required.",
  },
  {
    question: "How long does a Trademark Hearing usually take?",
    answer:
      "Most hearings are completed within 15–30 minutes, depending on the complexity of the case and the number of objections involved.",
  },
  {
    question: "Can a trademark be accepted directly after the hearing?",
    answer:
      "Yes. In many cases, the Hearing Officer may accept the trademark after hearing the arguments and later issue an order for advertisement in the Trade Marks Journal.",
  },
  {
    question: "What documents are usually required before a Trademark Hearing?",
    answer:
      "Commonly required documents include:\n• Examination Report or Opposition documents\n• Authorisation / Power of Attorney (TM-48)\n• Proof of trademark usage (if applicable)\n• Sales invoices, advertisements, website screenshots, social media proof, etc.\n• Supporting legal submissions or case laws",
  },
  {
    question: "Can I change my trademark attorney before the hearing?",
    answer:
      "Yes. You can appoint a new trademark attorney or agent at any stage by filing the required authorisation documents with the Trade Marks Registry.",
  },
  {
    question: "What happens after the hearing is completed?",
    answer:
      "After the hearing, the Hearing Officer reviews the submissions and issues a written order. Depending on the outcome:\n• The trademark may be accepted\n• Further clarification may be requested\n• The application may be refused\n• The matter may proceed to the next legal stage",
  },
  {
    question: "Can additional documents be submitted after the hearing?",
    answer:
      "In certain cases, the Hearing Officer may allow written submissions or supporting documents after the hearing within a specified time period.",
  },
  {
    question: "What is a Show Cause Hearing in trademark matters?",
    answer:
      "A Show Cause Hearing is conducted when the Trade Marks Registry is not satisfied with the written reply filed against the Examination Report and wants further oral clarification before deciding the application.",
  },
  {
    question: "Is a Trademark Hearing compulsory in every trademark application?",
    answer:
      "No. Hearings are conducted only when required by the Registry — usually in objection, opposition, rectification, or disputed matters.",
  },
  {
    question: "Can my trademark still get registered if objections were raised?",
    answer:
      "Yes. Many trademarks receive objections during examination but still proceed to registration after a proper reply and successful hearing representation.",
  },
  {
    question: "What is the role of case laws in a Trademark Hearing?",
    answer:
      "Case laws help support legal arguments and show how similar trademark disputes were decided previously by courts or the Trade Marks Registry.",
  },
  {
    question: "Will I receive a copy of the hearing order?",
    answer:
      "Yes. Once the order is passed, it becomes available on the IP India portal and can also be shared by your trademark attorney or representative.",
  },
  {
    question: "Can a hearing be postponed if there is an emergency?",
    answer:
      "Yes, adjournment may be requested in genuine situations by filing Form TM-M along with the prescribed government fee, subject to Registry approval.",
  },
  {
    question: "Why is professional representation important in Trademark Hearings?",
    answer:
      "Trademark Hearings involve legal arguments, procedural rules, and Registry practice. Proper representation improves the chances of successfully defending or securing your trademark application.",
  },
  {
    question: "Can I attend the hearing as observer?",
    answer:
      "YES — clients are WELCOME to attend the online video conference hearing as observers. We share the Registry's joining link 24 hours before the hearing. Most Hearing Officers permit silent observation by parties. Recommended for high-stakes matters — gives you direct visibility into the proceedings + the Hearing Officer's questions / orientation. We brief you afterward on what happened + what comes next. Camera-on, mute, professional setup expected.",
  },
  {
    question: "How can Legal Terminus help me with Trademark Hearing?",
    answer:
      "Legal Terminus provides professional support for Trademark Hearings before the Trade Marks Registry, including Show Cause Hearings, Opposition Hearings, Rectification matters, and Renewal/Restoration hearings.\n\nOur team helps clients with case review, legal argument preparation, hearing brief drafting, evidence coordination, online hearing representation, and post-hearing follow-up. We also assist in handling procedural requirements, hearing notices, adjournments, and communication with the Registry.\n\nWe understand that Trademark Hearings are time-sensitive and legally important. That is why we provide regular status updates, proactive coordination, and dedicated support throughout the hearing process to help clients avoid missed deadlines and procedural issues.",
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
                  <div className="opcfaq-answer-content" style={{ whiteSpace: "pre-line" }}>{item.answer}</div>
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
