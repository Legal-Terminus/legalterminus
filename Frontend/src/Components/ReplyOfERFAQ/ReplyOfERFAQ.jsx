import React, { useState } from "react";
import "./ReplyOfERFAQ.css";

const faqs = [
  {
    question: "What are the types of Examination Report?",
    answer:(
    <div>
      <p><strong>The Examination Report are of two types</strong></p>
      <ul>
        <li>1. With objections: The Examination Report contains the objections on which the mark can be refused.</li>
        <li>2. Without objections: The Examination Report does not contain any objections, and can be construed as an acceptance of the TM application by the TM department.</li>
      </ul>
    </div>
  ),
},
  {
    question: "What are the various grounds of objections?",
    answer:(
    <div>
      <p><strong>The grounds of objections can be broadly classified into three categories</strong></p>
      <ul>
        <li><strong>1. Absolute Grounds of Refusal:</strong> The TM Department may out rightly refuse the application where the applied Trademark is without of any distinctive character, or contains the characteristics of the goods/ services, or deceive the public or cause confusion, or hurt the sentiments of any religion, scandalous or obscene matter, or prohibited word.</li>
        <li><strong>2. Relative grounds of Refusal:</strong>The TM department issues such objections where the applied Trademark is identical or similar with an earlier applied Trademark or an existing registered Trademark, and the same may create confusion among the public in general.</li>
        <li><strong>3. Other Grounds of Refusal:</strong>In this category the department objects if the applied Trademark is not properly filed as per the prescribed procedure, such as, use of incorrect form, mentioning wrong specification of goods and or services, not following the Nice classification for specification of goods/ services, incorrect details in the application, wrong classification of Trademark Class.</li>
      </ul>
    </div>
  ),
},
  {
    question: "Within how many days one can receive the Examination Report?",
    answer:
      "There is no time specified for issuance of examination report. However, in general, the examination report is issued by TM department within 30 to 60 days from the application of Trademark.",
  },
  {
    question:
      "What can be done in case an examination report is received with objections?",
    answer:
      "In such case, the proprietor/ owner of the TM will need to file a reply to the objections raised by the department. While there is no specific format prescribed for reply of examination report, however, it requires specialized drafting skills and expert legal knowledge to respond to such objections.",
  },
  {
    question: "Is there any time specified for reply of examination report?",
    answer:
      "The reply to objections raised through examination report need to be responded within 30 days from the date of their receipt.",
  },
  {
    question:
      "What are the consequences for non-filing of reply to the examination report?",
    answer:
      "The applied trademark is liable to be refused and abandoned.",
  },
  {
    question:
      "How Legal Terminus can help you with filing of reply of examination report of your applied Trademark?",
    answer:
      "Legal Terminus can help you with filing reply of examination report for your organization, as and when required, in a hassle-free manner within a reasonable time span and for competitive professional fee. To know more, please book a telephonic appointment with one of our consultants free of charge.",
  },
];

const FaqPvt = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="Rf-ER-faq-section">
      <div className="Rf-ER-faq-container">
        {/* Left side – static text */}
        <div className="Rf-ER-faq-left">
          <h2 className="Rf-ER-faq-title">Reply to Examination Report Trademark FAQ's</h2>

          <p className="Rf-ER-faq-intro">
            Here are answers to some common questions about Reply of Examination Report in trademark registration. These FAQs will help you understand the process, timeline, and importance of filing a proper reply to overcome objections raised by the Trademark Registry.
          </p>

          <p className="Rf-ER-faq-intro">
            
          </p>
        </div>

        {/* Right side – scrollable Q&A list */}
        <div className="Rf-ER-faq-right">
          <div className="Rf-ER-faq-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`Rf-ER-faq-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="Rf-ER-faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`Rf-ER-faq-icon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>
                  {isActive && (
                   <div className={`Rf-ER-faq-answer ${isActive ? "open" : ""}`}>
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
