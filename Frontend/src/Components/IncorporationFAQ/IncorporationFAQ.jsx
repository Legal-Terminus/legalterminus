import React, { useState } from "react";
import "./IncorporationFAQ.css";

const faqs = [
  {
    question: "What is a Wholly Owned Subsidiary (WOS) in India?",
    answer:
      "A WOS is a private limited company in India where 100% of the shares are held by a foreign company. It operates as a separate legal entity.",
  },
  {
    question: "Can a foreign company directly set up a WOS in India?",
    answer:
      "Yes, a foreign company can directly incorporate a WOS in India under the Companies Act, 2013.",
  },
  {
    question: "How many directors are needed to incorporate a WOS in India?",
    answer:
      "You need at least two directors, and at least one must be an Indian resident (staying in India for at least 182 days in the previous year).",
  },
  {
    question: "Is it necessary to visit India to incorporate a WOS?",
    answer:
      "No physical visit is required. All documents can be signed and notarised and / or apostilled abroad and submitted electronically.",
  },
  {
    question: "What type of company structure is used for a WOS in India?",
    answer:
      "Most WOS entities are registered as Private Limited Companies due to limited liability and ease of operation.",
  },
  {
    question: "What are the common business areas allowed for a WOS?",
    answer:
      "Almost all sectors are allowed, except a few like real estate, defence, or agriculture which have restrictions under FDI policy.",
  },
  {
    question: "Is approval from the Indian government needed for setting up a WOS?",
    answer:
      "In most sectors under the automatic route, no prior approval is required. In others, prior approval via the Government route is necessary.",
  },
  {
    question: "What is the process of remitting capital into India?",
    answer:
      "The capital must be remitted through banking channels in foreign currency and reported to the RBI via Form FC-GPR within 30 days of share allotment.",
  },
  {
    question: "Is it mandatory to hold an Annual General Meeting (AGM) in India?",
    answer:
      "Yes, AGMs must be held, but can be conducted virtually (via VC) as per MCA Circulars—even if all shareholders are outside India.",
  },
];

const IncorporationFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="s8faq-section">
      <div className="s8faq-container">

        {/* LEFT */}
        <div className="incfaq-left">
          <h2 className="incfaq-title">
            Incorporation of Wholly Owned Subsidiary in India FAQ&apos;s
          </h2>

          <p className="s8faq-intro">
            Starting a Wholly Owned Subsidiary in India is an important step for
            any business owner. With the right support, the process can be simple
            and stress-free.
            <br /><br />
            Below are answers to the most common questions related to Wholly Owned Subsidiary
            in India.
          </p>
        </div>

        {/* RIGHT */}
        <div className="s8faq-right">
          <div className="s8faq-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`s8faq-item ${isActive ? "active" : ""}`}
                >
                  <button
                    className="s8faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`s8faq-icon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>

                  <div
                    className={`s8faq-answer ${
                      isActive ? "open" : ""
                    }`}
                  >
                    <p>{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default IncorporationFAQ;
