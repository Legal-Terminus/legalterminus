import React from "react";
import "./Section8Document.css";
import { FaIdCard, FaFileContract, FaBolt, FaBuilding, FaUserCircle, FaFileAlt } from "react-icons/fa";

const directorDocs = [
  {
    icon: <FaIdCard />,
    title: "Director & Subscriber Identity",
    note: "Mandatory for all directors & shareholders",
    items: [
      "Self-attested PAN card (mandatory)",
      "Self-attested Aadhaar card",
      "Passport-size photograph (latest)",
      "Foreign national / NRI: notarized + apostilled passport copy",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Address Proof (Per Person)",
    note: "Not older than 60 days from the date of filing",
    items: [
      "Self-attested bank statement OR gas bill OR mobile bill",
      "Documents must be in the name of the director / shareholder",
    ],
  },
  {
    icon: <FaUserCircle />,
    title: "Director Identification Number (DIN)",
    note: "Applied via SPICe+ — no separate action for new directors",
    items: [
      "DIN applied as part of the SPICe+ incorporation filing",
      "Existing DIN holders: provide DIN + KYC documents",
      "All directors must have a valid DIN before COI issuance",
    ],
  },
];

const companyDocs = [
  {
    icon: <FaBolt />,
    title: "Registered Office Proof",
    note: "Latest utility bill for office address (not older than 2 months)",
    items: [
      "Electricity bill / water bill / gas bill",
      "Rent agreement (if rented) — duly notarized",
      "NOC from property owner permitting use as registered office",
      "Residential property is permissible under MCA guidelines",
    ],
  },
  {
    icon: <FaBuilding />,
    title: "Incorporation Documents",
    note: "Drafted by our team — no action required from you",
    items: [
      "MOA (Memorandum of Association) with charitable object clause",
      "AOA (Articles of Association) for governance and board procedures",
      "INC-12: application for Section 8 licence",
      "SPICe+ Part B for full incorporation filing",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "INC-12 Supporting Declarations",
    note: "Affidavits and declarations required with licence application",
    items: [
      "Declaration by each proposed director confirming charitable intent",
      "Affidavit stating no profit distribution to members",
      "Estimated income & expenditure for first 3 years",
      "Brief note on nature of work and charitable activities",
    ],
  },
];

const DocItem = ({ doc }) => (
  <div className="s8doc-doc-item">
    <div className="s8doc-doc-item-top">
      <div className="s8doc-doc-icon">{doc.icon}</div>
      <div className="s8doc-doc-meta">
        <h4 className="s8doc-doc-title">{doc.title}</h4>
        <span className="s8doc-doc-note">{doc.note}</span>
      </div>
    </div>
    <ul className="s8doc-doc-list">
      {doc.items.map((item, i) => (
        <li key={i} className="s8doc-doc-list-item">{item}</li>
      ))}
    </ul>
  </div>
);

const Section8Document = () => {
  return (
    <section className="s8doc-section">
      <div className="s8doc-container">

        <div className="s8doc-header">
          <h2 className="s8doc-main-title">
            Documents Required for Section 8 Company Registration in India
          </h2>
          <p className="s8doc-main-subtitle">
            Six categories. Most documents are standard KYC — the MOA/AOA and INC-12 declarations are drafted entirely by our team. We send a personalised checklist after the discovery call.
          </p>
        </div>

        <div className="s8doc-columns">

          <div className="s8doc-column">
            <div className="s8doc-col-header">
              <div className="s8doc-col-header-icon"><FaUserCircle /></div>
              <div>
                <h3 className="s8doc-col-title">Individual Documents</h3>
                <p className="s8doc-col-subtitle">Required for each director &amp; shareholder</p>
              </div>
            </div>
            <div className="s8doc-col-body">
              {directorDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="s8doc-column">
            <div className="s8doc-col-header s8doc-col-header--office">
              <div className="s8doc-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="s8doc-col-title">Company &amp; Registered Office Documents</h3>
                <p className="s8doc-col-subtitle">Required for company formation &amp; licensing</p>
              </div>
            </div>
            <div className="s8doc-col-body">
              {companyDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Section8Document;
