import React, { useState } from "react";
import "../PvtltdFAQ/PvtltdFAQ.css";

const faqs = [
  {
    question: "What is Startup India (DPIIT) recognition and who can apply?",
    answer:
      "Startup India recognition is issued by DPIIT (Department for Promotion of Industry and Internal Trade) to startups that meet specific criteria: incorporated as a Private Limited Company, LLP, or Registered Partnership Firm; not older than 10 years from date of incorporation; annual turnover under ₹100 crore in any preceding FY; working towards innovation, development, or improvement of products/processes/services; and not formed by splitting or reconstruction of an existing business.",
  },
  {
    question: "Is there a government fee for DPIIT recognition?",
    answer:
      "No. The DPIIT recognition application is entirely free of government fees. You only pay our professional consultancy fee for application preparation, innovation narrative drafting, portal filing, and follow-up. There is no stamp duty, registration fee, or government charge for Startup India recognition.",
  },
  {
    question: "How long does DPIIT recognition take?",
    answer:
      "Typically 2–4 weeks from the date of application submission. DPIIT reviews applications online and may request clarifications. Applications with clear innovation descriptions and complete documents are processed faster. Our team ensures your application is DPIIT-ready before submission to minimise back-and-forth.",
  },
  {
    question: "What is the Section 80-IAC tax holiday and how do I get it?",
    answer: (
      <span>
        Section 80-IAC provides a 100% income tax exemption for 3 consecutive years out of your first 10 years of incorporation. To claim it:
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>First get DPIIT recognition (mandatory prerequisite)</li>
          <li>Then apply to the Inter-Ministerial Board (IMB) — a committee that reviews your innovation claim</li>
          <li>IMB approval typically takes 30–90 days</li>
          <li>You must choose 3 consecutive years within the first 10 years (can't skip years)</li>
        </ul>
        The 80-IAC exemption is not automatic with DPIIT recognition — it requires a separate IMB application.
      </span>
    ),
  },
  {
    question: "What is angel tax and how does DPIIT recognition help?",
    answer:
      "Angel tax (Section 56(2)(viib)) is a 30% tax imposed on a startup when it receives equity funding from Indian investors at a valuation higher than Fair Market Value (FMV). DPIIT-recognised startups can file Form 2 with DPIIT to get an exemption from angel tax. This is critical for startups raising from Indian angel networks, HNIs, and family offices — without the exemption, a ₹1 crore round at 3x FMV premium could trigger ₹6 lakh in angel tax on the startup.",
  },
  {
    question: "Can a company that already has revenue apply for Startup India?",
    answer:
      "Yes, as long as your annual turnover has not exceeded ₹100 crore in ANY preceding financial year. There is no minimum revenue requirement — even zero-revenue startups can apply. The key eligibility filters are: age (< 10 years), turnover cap (< ₹100 crore peak year), entity type, and innovation criterion.",
  },
  {
    question: "What happens if my DPIIT application is rejected?",
    answer:
      "DPIIT typically provides a reason for rejection (usually: not sufficiently innovative, incorrect entity type, or age/turnover mismatch). Rejected startups can re-apply after addressing the issues. Our team reviews all rejection reasons and prepares a stronger resubmission. Most rejections are due to weak innovation narratives — something our Priority service specifically addresses.",
  },
  {
    question: "Can a startup with foreign investors or foreign directors apply?",
    answer:
      "Yes. A Private Limited Company with foreign shareholders (FDI under auto route) or foreign directors can apply for DPIIT recognition. The foreign investment does not affect eligibility. However, the angel tax exemption (Form 2) only covers shares issued to Indian resident investors — foreign investor rounds are governed by FEMA and are not subject to angel tax anyway.",
  },
  {
    question: "Does DPIIT recognition need to be renewed?",
    answer:
      "DPIIT recognition itself does not have a fixed renewal date — it remains valid as long as the startup continues to meet the eligibility criteria (age < 10 years and turnover < ₹100 crore). However, the 80-IAC tax holiday election must be renewed each year it's claimed, and the angel tax Form 2 exemption covers only shares issued after the filing date.",
  },
  {
    question: "How can Legal Terminus help with Startup India recognition?",
    answer: (
      <span>
        Legal Terminus handles the complete process, including:
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>Eligibility assessment and entity type review</li>
          <li>Innovation narrative drafting (the most critical element)</li>
          <li>DPIIT portal application filing and document upload</li>
          <li>Query response and DPIIT follow-up</li>
          <li>Post-recognition 80-IAC and Form 2 filings (Supreme plans)</li>
          <li>Annual compliance support (Supreme Plus plan)</li>
        </ul>
        Our team combines legal, tax, and company secretarial expertise to ensure your application is built for approval — not just submission.
      </span>
    ),
  },
];

const StartupIndiaFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="faq-section">
      <div className="faq-container">

        <div className="faq-header">
          <h2 className="faq-title">Startup India Registration — FAQs</h2>
          <p className="faq-intro">
            Got questions? We've got answers — straight, no-BS, legally accurate.
          </p>
        </div>

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
                  <span className={`faq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`faq-answer ${isActive ? "open" : ""}`}>
                  <div className="faq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default StartupIndiaFAQ;
