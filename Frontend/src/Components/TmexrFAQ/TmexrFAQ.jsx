import React, { useState } from "react";
import "./TmexrFAQ.css";

const faqs = [
  {
    question: "What is a trademark examination report?",
    answer:
      "After you file a trademark application, the Trade Marks Registry examines it and issues an examination report. If the Examiner has concerns, the report raises objections — usually under Section 9 (the mark is descriptive or non-distinctive) or Section 11 (it is similar to an existing mark). You then have to file a reply addressing those objections to move the application forward.",
  },
  {
    question: "How long do I have to reply to a trademark objection?",
    answer:
      "You must file the reply within 30 days of receiving the examination report. This is a strict deadline — if no reply is filed in time, the application is treated as abandoned. Because the window is short, it is important to act on an objection as soon as you receive the report.",
  },
  {
    question: "What happens if I don't reply to the examination report?",
    answer:
      "If you fail to file a reply within the deadline, your application is marked as abandoned. You lose the government filing fee, your priority date, and the application itself — and you would have to file a fresh application and pay the fee again to restart the process.",
  },
  {
    question: "What is the difference between a Section 9 and a Section 11 objection?",
    answer:
      "A Section 9 (absolute grounds) objection says the mark itself is not registrable because it is descriptive, generic, or non-distinctive. A Section 11 (relative grounds) objection says the mark conflicts with an earlier identical or similar mark. They require different strategies — Section 9 is usually met with evidence of use and distinctiveness, while Section 11 is met by distinguishing the marks or relying on consent/coexistence.",
  },
  {
    question: "Does filing a reply guarantee my trademark will be registered?",
    answer:
      "No. A reply gives your mark the best chance to proceed, but acceptance is at the discretion of the Examiner. After a strong reply the mark may be accepted and published; in some cases the Examiner schedules a show-cause hearing before deciding. The quality of the argument and evidence heavily influences the outcome.",
  },
  {
    question: "What is a show-cause hearing?",
    answer:
      "If the Examiner is not satisfied with the written reply, they may schedule a show-cause hearing where you (or your representative) argue the case orally, usually via video. Being prepared with written submissions and proper representation at this hearing is often the deciding factor between acceptance and refusal.",
  },
  {
    question: "What evidence helps overcome a descriptiveness (Section 9) objection?",
    answer:
      "Evidence that shows customers associate the mark with you — such as invoices, sales figures, advertising and marketing spend, packaging, website and social-media presence, and the date of first use — helps establish 'acquired distinctiveness'. This is typically presented through an affidavit of use, and can turn a Section 9 refusal into an acceptance.",
  },
  {
    question: "Can the reply be filed online?",
    answer:
      "Yes. The reply to the examination report, along with any affidavit and supporting evidence, is filed electronically on the IP India trademark portal. We handle the entire online filing on your behalf and share the filed reply and acknowledgement with you.",
  },
  {
    question: "How does Legal Terminus help with my examination reply?",
    answer:
      "We analyse your examination report, identify the grounds of objection, advise on the right evidence, draft a strong attorney-prepared reply with case-law citations (and an affidavit of use where needed), file it within the 30-day deadline, and — where included — prepare for and represent you at any show-cause hearing, tracking the matter through to acceptance. Book a free consultation to get started.",
  },
];

const TmexrFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Trademark Examination Reply — FAQs</h2>
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

export default TmexrFAQ;
