import React, { useState } from "react";
import "./PtpubFAQ.css";

const FAQ_ITEMS = [
  {
    question: "Can a Private Limited Company be converted into a Public Limited Company?",
    answer:
      "Yes. Under Section 14 and Section 18 of the Companies Act, 2013, a Private Limited Company can be converted into a Public Limited Company by passing a special resolution, altering its MOA and AOA, and filing Form MGT-14 and Form INC-27 with the ROC. It is a conversion of the same entity — not a fresh incorporation.",
  },
  {
    question: "How many members and directors are required after conversion?",
    answer:
      "A Public Limited Company needs a minimum of 7 members (shareholders) and 3 directors, with no upper limit on members. If your Private Limited has fewer, you must induct additional members and appoint directors to meet this minimum before the conversion can be completed.",
  },
  {
    question: "Which forms are filed for the conversion?",
    answer: (
      <span>
        Two key forms:<br />
        (1) <strong>MGT-14</strong> — to record the special resolution, filed within 30 days of the EGM.<br />
        (2) <strong>INC-27</strong> — the application for conversion of a private company into a public company.<br />
        Both are filed with the ROC along with the altered MOA &amp; AOA and the meeting records.
      </span>
    ),
  },
  {
    question: "What changes in the MOA and AOA on conversion?",
    answer: (
      <span>
        The articles are rewritten to remove the three defining features of a private company under Section 2(68):
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>The cap of 200 members</li>
          <li>The restriction on transfer of shares</li>
          <li>The prohibition on inviting the public to subscribe</li>
        </ul>
        The MOA name clause is also altered to remove the word "Private".
      </span>
    ),
  },
  {
    question: "Does the company get a new name and CIN?",
    answer:
      "Yes. On conversion the word 'Private' is dropped, so the name ends with 'Limited' instead of 'Private Limited'. The ROC issues a fresh Certificate of Incorporation and the CIN is updated. PAN, GST, bank, and licence records must then be updated to the new name.",
  },
  {
    question: "How long does the Private to Public conversion take?",
    answer:
      "Typically 30 to 45 working days, depending on document readiness, how quickly the EGM is held, and ROC processing. Adding members or directors to meet the minimum, and any ROC clarifications, are the most common factors that affect the timeline.",
  },
  {
    question: "Is there a minimum capital requirement to convert?",
    answer:
      "No. The earlier ₹5 lakh minimum paid-up capital requirement for public companies was removed by the Companies (Amendment) Act, 2015. You can convert with any authorised capital, though stamp duty on the altered MOA/AOA may vary by state and capital.",
  },
  {
    question: "Does the business continue without interruption after conversion?",
    answer:
      "Yes. Conversion does not create a new company or transfer the business — the same legal entity continues with its history, PAN, contracts, assets, and liabilities intact. Only the structure, articles, and name change.",
  },
  {
    question: "What extra compliance applies after becoming a Public Limited Company?",
    answer:
      "A Public Limited has heavier compliance than a Private Limited — a minimum of four board meetings a year, audit-committee and other governance thresholds (e.g., based on paid-up capital), and additional event-based filings. If the company later lists, SEBI (LODR) obligations such as quarterly results apply on top.",
  },
  {
    question: "How can Legal Terminus help with the conversion?",
    answer: (
      <span>
        Legal Terminus handles the complete conversion, including:
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>Eligibility review, board &amp; EGM documentation, and the special resolution</li>
          <li>MOA &amp; AOA alteration and MGT-14 / INC-27 filing</li>
          <li>End-to-end coordination until the fresh Certificate of Incorporation</li>
        </ul>
        We also update PAN, GST, bank, and licence records and set up your post-conversion compliance calendar.
      </span>
    ),
  },
];

const PtpubFaqs = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="pubfaq-section">
      <div className="pubfaq-container">

        <div className="pubfaq-header">
          <h2 className="pubfaq-title">Private to Public Limited Conversion — FAQs</h2>
          <p className="pubfaq-intro">
            Find answers to common questions about converting a Private Limited Company into a Public Limited Company in India.
          </p>
        </div>

        <div className="pubfaq-list">
          {FAQ_ITEMS.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`pubfaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="pubfaq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`pubfaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`pubfaq-answer ${isActive ? "open" : ""}`}>
                  <div className="pubfaq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default PtpubFaqs;
