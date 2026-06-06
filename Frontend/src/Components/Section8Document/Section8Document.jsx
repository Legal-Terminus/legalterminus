import React from "react";
import "./Section8Document.css";
import { FaIdCard, FaFileContract, FaUserCircle, FaBolt, FaHome, FaFileAlt } from "react-icons/fa";

const individualDocs = [
  {
    icon: <FaIdCard />,
    title: "Director & Subscriber Identity",
    note: "Mandatory for all directors & shareholders",
    items: [
      "Self-attested PAN card (mandatory)",
      "Self-attested Aadhaar",
      "Driving Licence / Passport as ID for foreign nationals/NRI: notarized + apostilled passport copy",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Address Proof (Per Person)",
    note: "Not older than 60 days from the date of filing",
    items: [
      "Self-attested Bank statement OR gas bill OR mobile bill — not older than 60 days from filing date",
    ],
  },
  {
    icon: <FaUserCircle />,
    title: "Passport Size Photograph (Per Person)",
    note: "All proposed directors / shareholders",
    items: [
      "Latest passport-size photograph of all proposed directors / shareholders",
    ],
  },
];

const officeDocs = [
  {
    icon: <FaBolt />,
    title: "Registered Office Proof",
    note: "Latest utility bill for office address (not older than 2 months)",
    items: [
      "Latest Utility Bill for Office Address (Not Older Than 2 Months)",
      "Electricity Bill",
      "Water Bill",
      "Gas Bill",
    ],
  },
  {
    icon: <FaHome />,
    title: "Rent Agreement (If Business Premises is Rented)",
    note: "Only if the registered office is on rented premises",
    items: [
      "Duly notarized Rent Agreement between the owner of the property and one of the directors of the proposed company",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "No Objection Certificate (NOC)",
    note: "NOC from property owner",
    items: [
      "NOC from Property Owner permitting use of premises as Registered Office",
      "Note: Residential property is permissible as Registered Office under MCA guidelines",
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
            Six categories. Per-person documents apply to all directors and subscribers. We send a personalised checklist after the discovery call.
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
              {individualDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="s8doc-column">
            <div className="s8doc-col-header s8doc-col-header--office">
              <div className="s8doc-col-header-icon"><FaHome /></div>
              <div>
                <h3 className="s8doc-col-title">Registered Office Documents</h3>
                <p className="s8doc-col-subtitle">Required for the company's registered address</p>
              </div>
            </div>
            <div className="s8doc-col-body">
              {officeDocs.map((doc, i) => (
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
