import React, { useState } from "react";
import "./SocietyFAQ.css";

const faqs = [
  {
    question: "What is Society Registration and who should register a Society?",
    answer: "Society Registration in India is the legal process of registering a member-based non-profit organization under the Societies Registration Act, 1860. A Society is commonly formed for charitable, educational, cultural, scientific, religious, sports, social welfare, or professional purposes. It requires a minimum of 7 members and is managed through elected office bearers and governing body members. Society Registration is generally suitable for NGOs, associations, clubs, alumni groups, welfare organizations, and community-based initiatives that prefer a democratic and member-driven structure.",
  },
  {
    question: "How is your pricing model exclusive of government fees? What will I actually pay in total?",
    answer: "Our professional fee covers our work - MoA + Rules drafting, member onboarding, Registrar coordination, PAN + (Enriched / Supreme) Udyam + (Supreme) GST filing. State government costs (Registrar fee Rs.50 - Rs.500, stamp paper Rs.100 - Rs.500, notarisation Rs.300 - Rs.1,000) are billed separately at actuals. Udyam and GST government fees are NIL. Total out-of-pocket for a Delhi Society in Elemental: Rs.500 - Rs.1,500. For Enriched / Supreme: same total (Udyam + GST are free).",
  },
  {
    question: "How long does Society Registration take?",
    answer: "Society Registration generally takes around 15–22 working days, depending on the state and document readiness. The timeline includes drafting of documents, member verification, notarization, filing before the Registrar of Societies, and issuance of the Registration Certificate. Additional registrations such as PAN, UDYAM, or GST may require a few extra days.",
  },
  {
    question: "Why does Enriched bundle UDYAM Registration?",
    answer: "UDYAM Registration helps eligible Societies obtain MSME recognition. This can be beneficial for societies involved in training, consultancy, educational services, skill development, events, or other revenue-generating activities. UDYAM Registration may help in government tenders, vendor onboarding, MSME benefits, and better payment protection under MSME provisions.",
  },
  {
    question: "Why does Supreme bundle GST Registration?",
    answer: "GST Registration may become necessary if the Society provides taxable services, conducts commercial activities, or crosses the prescribed GST turnover limit. Many organizations also prefer GST Registration for vendor empanelment, invoicing, and smoother business operations. The Supreme Plan includes GST Registration support with basic guidance on applicable service classifications and registration formalities.",
  },
  {
    question: "Should I register a Society, Trust, or Section 8 Company?",
    answer: "The right structure depends on your objective and management style. A Society is generally suitable for democratic and member-driven organizations. A Trust is usually preferred for founder-controlled charitable activities. A Section 8 Company is often chosen where higher corporate governance and stronger institutional credibility are required. We help clients choose the most suitable structure based on their activities and future plans.",
  },
  {
    question: "How many members do I really need?",
    answer: "A minimum of 7 members is required for Society Registration in most states. Certain states may have additional conditions regarding member composition or family relations. Additional members can also be admitted later as per the Rules & Regulations of the Society.",
  },
  {
    question: "Does a Society need PAN and bank account opening support?",
    answer: "Yes. After registration, the Society generally requires a PAN card to open a bank account, receive donations, and manage financial transactions. We also assist clients with PAN application support and provide guidance for bank account opening formalities.",
  },
  {
    question: "Can my Society receive foreign donations or CSR funds?",
    answer: "With SEPARATE additional registrations - yes. FCRA registration (for foreign donations) requires the Society to exist for 3+ years and have spent Rs.15L+ on charitable objects. CSR-1 registration with MCA (for CSR funds) requires PAN + 12A + 80G + last 3 years' annual reports. These are NOT included under THIS Society Registration service - they're separate quoted engagements. Society Registration is the foundational prerequisite.",
  },
  {
    question: "Can a Society apply for 12A and 80G Registration?",
    answer: "Yes. Registered Societies involved in charitable activities can apply for 12A and 80G Registration under the Income Tax Act. These registrations help the Society claim tax exemptions and allow donors to claim tax benefits on eligible donations.",
  },
  {
    question: "How can Legal Terminus help me with Society Registration?",
    answer: "We provide complete assistance for Society Registration in India, including MoA drafting, Rules & Regulations preparation, member documentation, Registrar filing, PAN support, and post-registration guidance. Depending on the selected plan, we also assist with UDYAM and GST Registration. Every file is professionally reviewed to ensure smooth registration and proper documentation support.",
  },
];

const SocietyFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="socfaq-section">
      <div className="socfaq-container">

        <div className="socfaq-header">
          <h2 className="socfaq-title">Society Registration in India — FAQs</h2>
          <p className="socfaq-intro">
            Clear answers to the most common questions about society registration — from members and documents to timelines, tax benefits, and structure comparisons.
          </p>
        </div>

        <div className="socfaq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`socfaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="socfaq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`socfaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`socfaq-answer ${isActive ? "open" : ""}`}>
                  <div className="socfaq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default SocietyFAQ;
