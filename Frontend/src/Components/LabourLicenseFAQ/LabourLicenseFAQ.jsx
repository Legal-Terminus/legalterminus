import React, { useState } from "react";
import "./LabourLicenseFAQ.css";

const faqs = [
  {
    question: "What is Labour License Registration in India?",
    answer: (
      <div>
        <p>Labour License Registration in India is a mandatory compliance for contractors and principal employers engaging contract labour under the Occupational Safety, Health and Working Conditions (OSH) Code, 2020.</p>
        <p>Under the new labour law framework:</p>
        <ul>
          <li>Contractors engaging 50 or more contract workers must obtain a Labour License.</li>
          <li>Principal Employers engaging contract workers through contractors must obtain Registration.</li>
          <li>The registration helps ensure proper wage payment, worker welfare, safety, and legal compliance.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "What changed after the new Labour Codes came into force?",
    answer: (
      <div>
        <p>The new OSH Code, 2020 replaced the earlier Contract Labour (Regulation &amp; Abolition) Act, 1970 and introduced major reforms:</p>
        <ul>
          <li>Threshold increased from 20 workers to 50 workers</li>
          <li>License validity increased from 1 year to 5 years</li>
          <li>One license can cover multiple establishments</li>
          <li>Filing shifted to the unified Shram Suvidha Portal</li>
          <li>Simplified compliance structure for businesses</li>
        </ul>
        <p>These reforms made labour licensing more streamlined and business-friendly.</p>
      </div>
    ),
  },
  {
    question: "Who needs a Labour License?",
    answer: (
      <div>
        <p>You need a Labour License if:</p>
        <ul>
          <li>You are a contractor engaging 50 or more contract workers</li>
          <li>You supply manpower, labour, housekeeping, security, construction, facility management, or staffing services</li>
        </ul>
        <p>Principal Employers engaging contract workers may also require registration under the OSH Code.</p>
      </div>
    ),
  },
  {
    question: "Is Labour License required for every state?",
    answer:
      "Yes. Labour law implementation is state-specific. While the OSH Code is central legislation, each state may issue its own rules and procedures. Some states have fully adopted the new system, while others are still transitioning from the old CLRA framework. We help you identify the correct process applicable in your state.",
  },
  {
    question: "What is Form V and why is it important?",
    answer: (
      <div>
        <p>Form V is a certificate issued by the Principal Employer to the Contractor confirming:</p>
        <ul>
          <li>Nature of work</li>
          <li>Worker count</li>
          <li>Work location</li>
          <li>Contract duration</li>
        </ul>
        <p>It is one of the most important documents for Labour License approval. Incorrect or incomplete Form V is one of the biggest reasons for rejection.</p>
      </div>
    ),
  },
  {
    question: "How long does Labour License Registration take?",
    answer: (
      <div>
        <p>The registration process generally takes:</p>
        <ul>
          <li>15–20 working days in states with active online processing</li>
          <li>20–30 working days in states with inspection or manual verification</li>
        </ul>
        <p>The timeline depends on document readiness and labour department processing.</p>
      </div>
    ),
  },
  {
    question: "What documents are required for Labour License Registration?",
    answer: (
      <div>
        <p>Common documents include:</p>
        <ul>
          <li>PAN &amp; Aadhaar of applicant</li>
          <li>GST Registration</li>
          <li>Establishment proof</li>
          <li>Form V Certificate</li>
          <li>Agreement / Work Order</li>
          <li>Employee details</li>
          <li>Passport-size photographs</li>
          <li>Digital Signature (DSC)</li>
        </ul>
        <p>Additional documents may vary by state.</p>
      </div>
    ),
  },
  {
    question: "What is the validity of a Labour License?",
    answer:
      "Under the OSH Code framework, Labour License is generally valid for 5 years. However, validity may vary in states that are still operating under transitional rules.",
  },
  {
    question: "What happens if I operate without a Labour License?",
    answer: (
      <div>
        <p>Operating without a valid Labour License may result in:</p>
        <ul>
          <li>Heavy penalties</li>
          <li>Labour department notices</li>
          <li>Legal proceedings</li>
          <li>Tender disqualification</li>
          <li>Wage liability on the Principal Employer</li>
          <li>Business and compliance risks</li>
        </ul>
        <p>Timely registration helps avoid unnecessary legal complications.</p>
      </div>
    ),
  },
  {
    question: "Is Labour License different from EPF and ESIC?",
    answer: (
      <div>
        <p>Yes. Labour License, EPF, and ESIC are completely different compliances.</p>
        <ul>
          <li>Labour License → Contract labour regulation</li>
          <li>EPF → Provident Fund compliance</li>
          <li>ESIC → Employee insurance compliance</li>
        </ul>
        <p>A business may require all three depending on employee count and nature of work.</p>
      </div>
    ),
  },
  {
    question: "Does the Principal Employer also have responsibilities?",
    answer: (
      <div>
        <p>Yes. Under the OSH Code, the Principal Employer and Contractor share responsibility for:</p>
        <ul>
          <li>Wage payment</li>
          <li>Worker welfare</li>
          <li>Safety facilities</li>
          <li>Basic labour compliance</li>
        </ul>
        <p>This is why proper documentation and contractor verification are very important.</p>
      </div>
    ),
  },
  {
    question: "What welfare facilities are mandatory for contract workers?",
    answer: (
      <div>
        <p>Depending on worker count and state rules, businesses may need to provide:</p>
        <ul>
          <li>Drinking water</li>
          <li>Restrooms</li>
          <li>Washing facilities</li>
          <li>First-aid</li>
          <li>Rest shelters</li>
          <li>Canteen</li>
          <li>Creche facilities (in applicable cases)</li>
        </ul>
        <p>We help businesses understand these requirements before filing.</p>
      </div>
    ),
  },
  {
    question: "Can one Labour License cover multiple sites?",
    answer:
      "Under the new OSH Code framework, a single Labour License can cover multiple establishments of the contractor, subject to applicable rules and approvals. This reduces repeated licensing and simplifies compliance management.",
  },
  {
    question: "How can Legal Terminus help with Labour License Registration?",
    answer:
      "Legal Terminus provides end-to-end professional support for Labour License Registration in India for both Contractors and Principal Employers. Our team assists with eligibility assessment, worker-threshold evaluation, Form V drafting support, document preparation, Shram Suvidha Portal filing, and coordination with the Labour Department for smooth processing of the application. We also help businesses understand welfare and compliance requirements under the OSH Code, 2020, including basic worker facilities and statutory obligations. From application filing to license approval, query handling, amendment support, and compliance guidance, we ensure the entire process is handled accurately, professionally, and within the applicable timelines.",
  },
];

const LabourLicenseFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Labour Licence (CLRA) Registration — FAQs</h2>
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

export default LabourLicenseFAQ;
