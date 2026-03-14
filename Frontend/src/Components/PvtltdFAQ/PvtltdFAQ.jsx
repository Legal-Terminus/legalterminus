import React, { useState } from "react";
import "./PvtltdFAQ.css";

const faqs = [
  {
    question: "How many people do I need to start a Private Limited Company?",
    answer:
      "A minimum of 2 persons are required — 2 directors and 2 shareholders (can be the same people). Maximum membership is capped at 200.",
  },
  {
    question: "How many Directors are required?",
    answer:
      "Minimum 2 directors, maximum 15 directors (extendable by special resolution). At least 1 director must be an Indian resident (must have been in India for at least 120 days in the previous financial year as per the Companies Act, 2013). Note: Earlier this was 182 days — this was amended.",
  },
  {
    question: "Who is a Director vs. a Shareholder?",
    answer:
      "A Shareholder (also called a member/subscriber) is an owner of the company by virtue of holding shares. A Director manages the affairs of the company. The same person can be both — and often is, especially in startups.",
  },
  {
    question:
      "What is the minimum capital required?",
    answer:
      "Zero. There is no minimum paid-up capital requirement under the Companies Act, 2013 (amended in 2015). You can technically start with ₹1 as paid-up capital. However, for practical banking and operational purposes, most companies start with ₹1 lakh authorised capital.",
  },
  {
    question: "What are the key documents needed?",
    answer:
      "PAN + Aadhaar (or Passport for foreign nationals) for all directors and shareholders, office address proof (electricity/water bill not older than 2 months), and NOC from property owner if on rent.",
  },
  {
    question: "How long does registration take?",
    answer:
    "Typically 7–15 working days from the date of submission of complete documents, subject to MCA/RoC processing timelines and document readiness at the client's end.",
  },
  {
    question:
      "Is the entire process online?",
    answer:
      "Yes. 100% online via the MCA portal. No physical filing. No office visits. Just digital signatures and e-forms.",
  },
  {
    question:
      "Can an NRI or Foreign National be a director or shareholder?",
    answer:
      "Yes. NRIs and foreign nationals can be shareholders and directors in a Private Limited Company, subject to applicable Foreign Direct Investment (FDI) norms set by RBI and FEMA. However, at least 1 director must be a resident Indian (present in India for at least 120 days in the previous financial year).",
  },
  {
    question:
      "What happens after registration?",
    answer:
      "Within 180 days of incorporation, the company must file Form INC-20A (Commencement of Business) with the RoC. Other immediate compliances include appointment of a Statutory Auditor within 30 days, opening a bank account, and holding the first Board Meeting within 30 days of incorporation. Our Supreme Plan covers these and more.",
  },
  {
    question:
      "What is the difference between MOA and AOA?",
    answer:
      "The Memorandum of Association (MOA) defines the company's relationship with the outside world — its name, registered office state, objectives, and liability clause. The Articles of Association (AOA) govern the internal management rules — director powers, meeting procedures, dividend policies, and share transfer rules.",
  },
];

const FaqPvt = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        {/* Left side – static text */}
        <div className="faq-left">
          <h2 className="faq-title">Private Limited Company Registration — FAQs</h2>

          <p className="faq-intro">
            Got questions? We've got answers — straight, no-BS, legally accurate.
          </p>

          <p className="faq-intro">
            
          </p>
        </div>

        {/* Right side – scrollable Q&A list */}
        <div className="faq-right">
          <div className="faq-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`faq-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`faq-icon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>
                  {isActive && (
                   <div className={`faq-answer ${isActive ? "open" : ""}`}>
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
