import React, { useState } from "react";
import "../PvtltdFAQ/PvtltdFAQ.css";

const faqs = [
  {
    question: "What is Startup Odisha and who can apply?",
    answer:
      "Startup Odisha is the Government of Odisha's flagship startup programme under the Odisha Startup Policy 2022. It provides recognition, capital subsidies, incubation space, and mentorship to eligible startups operating in Odisha. To be eligible: the entity must be registered / incorporated in Odisha; it must be a Private Limited Company, LLP, or Registered Partnership Firm; and the business must demonstrate an element of innovation, scalability, or technology use. Sole proprietorships are not eligible.",
  },
  {
    question: "Is there a government fee for Startup Odisha registration?",
    answer:
      "No. The Startup Odisha registration and recognition application is free of charge — there is no government fee. Legal Terminus charges a professional consultancy fee for application preparation, business description drafting, portal filing, and follow-up support.",
  },
  {
    question: "How much capital subsidy can a Startup Odisha-recognised startup get?",
    answer: (
      <span>
        The capital subsidy under Startup Odisha is up to ₹50 lakhs, but the actual amount depends on:
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>Amount of capital investment (plant, machinery, equipment)</li>
          <li>Sector (technology startups get higher rates)</li>
          <li>Employment generation (more jobs = higher subsidy)</li>
          <li>Location (Tier 2/3 cities in Odisha may attract additional incentives)</li>
        </ul>
        The subsidy is a direct grant — not a loan — and requires a separate application post-recognition with investment proof and asset documentation.
      </span>
    ),
  },
  {
    question: "Can I get both Startup Odisha and DPIIT (Startup India) recognition?",
    answer:
      "Yes, and we strongly recommend it. Both recognitions are independent and complementary. Startup Odisha gives you state-level benefits (capital subsidy, incubation, Odisha procurement access); DPIIT gives you central government benefits (80-IAC income tax holiday, angel tax exemption, patent fee rebate). Our Supreme plan includes both registrations in one engagement. Getting both maximises the total benefit package available to your startup.",
  },
  {
    question: "Does my entity need to be registered in Odisha?",
    answer:
      "Yes. This is the most critical eligibility criterion for Startup Odisha — your entity's registered office must be in the state of Odisha. A startup promoted by an Odisha resident but incorporated in another state (e.g., Bangalore or Mumbai) is NOT eligible for Startup Odisha benefits. If you're planning to expand to Odisha, you can establish a subsidiary or transfer the registered office to Odisha before applying.",
  },
  {
    question: "How long does Startup Odisha recognition take?",
    answer:
      "The recognition process typically takes 3–6 weeks from application submission, including State Evaluation Committee review and potential query response. Applications with complete documents and a clear business description are processed faster. Capital subsidy disbursement, once applied post-recognition, typically takes 3–6 months depending on government processing.",
  },
  {
    question: "What incubation facilities are available under Startup Odisha?",
    answer: (
      <span>
        The primary incubation centres under the Startup Odisha ecosystem include:
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>STPI Bhubaneswar — technology startup hub with dedicated T-Hub incubation</li>
          <li>IIT Bhubaneswar Technology Business Incubator (TBI) — deep-tech and engineering focus</li>
          <li>KIIT-TBI — multidisciplinary incubation with strong entrepreneur network</li>
          <li>CII-SCALE (Scale-up Centre for Aspiring Learners &amp; Entrepreneurs)</li>
        </ul>
        Space is competitive — our Priority service includes incubation application support and pitch preparation.
      </span>
    ),
  },
  {
    question: "Can a technology startup outside Odisha relocate to claim Startup Odisha benefits?",
    answer:
      "Yes. If a startup currently registered in another state wants to access Startup Odisha benefits, they can: (1) convert the existing entity to have its registered office in Odisha (requires MCA/ROC amendment), or (2) incorporate a new entity in Odisha. In both cases, the entity must then genuinely operate from Odisha (real operations, employees, office) — the Government of Odisha does not give benefits to entities with only a paper address in the state.",
  },
  {
    question: "What happens after Startup Odisha recognition is granted?",
    answer: (
      <span>
        After recognition, the immediate next steps are:
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>Apply for capital subsidy (within 6 months for best results)</li>
          <li>Apply for incubation centre space (STPI / KIIT-TBI / IIT TBI)</li>
          <li>Register on GeM portal and Odisha government procurement platform</li>
          <li>Apply for DPIIT recognition (if not already done — for central benefits)</li>
          <li>Connect with the Startup Odisha mentor network</li>
        </ul>
        Our team provides a detailed post-recognition checklist and action plan.
      </span>
    ),
  },
  {
    question: "How can Legal Terminus help with Startup Odisha registration?",
    answer: (
      <span>
        Legal Terminus handles the complete process, including:
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>Eligibility assessment and entity type review</li>
          <li>Business description and innovation narrative drafting</li>
          <li>Startup Odisha portal application filing and document upload</li>
          <li>Query response and state government follow-up</li>
          <li>Capital subsidy application support (Enriched and above)</li>
          <li>Dual DPIIT recognition filing (Supreme plan)</li>
          <li>Annual compliance support (Supreme Plus plan)</li>
        </ul>
        Our team includes CS professionals with deep experience in Odisha state government processes.
      </span>
    ),
  },
];

const StartupOdishaFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="faq-section">
      <div className="faq-container">

        <div className="faq-header">
          <h2 className="faq-title">Startup Odisha Registration — FAQs</h2>
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

export default StartupOdishaFAQ;
