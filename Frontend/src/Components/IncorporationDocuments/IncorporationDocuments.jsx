import React from "react";
import "./IncorporationDocuments.css";
import {
  FaBuilding,
  FaStamp,
  FaFileAlt,
  FaPassport,
  FaUser,
  FaBolt,
  FaFileContract,
  FaMoneyBillWave,
} from "react-icons/fa";

const parentDocs = [
  {
    icon: <FaBuilding />,
    title: "Parent Identity & Existence",
    note: "Indian-parent: domestic KYC. Foreign-parent: apostilled / notarised",
    items: [
      "Indian-parent: PAN, Certificate of Incorporation, MOA/AOA, latest 1–2 years audited financials, latest Board Resolution",
      "Foreign-parent: same set apostilled / notarised, plus UBO declaration and parent's tax residency certificate (for DTAA benefits)",
    ],
  },
  {
    icon: <FaStamp />,
    title: "Parent Authorisations",
    note: "Foreign-parent docs require apostille",
    items: [
      "Indian-parent: Board Resolution authorising investment + appointing nominee director(s) + nominating authorised signatory",
      "Foreign-parent: same Board Resolution apostilled, plus Power of Attorney for incorporation filings and bank reference letter from parent's primary bank",
    ],
  },
  {
    icon: <FaMoneyBillWave />,
    title: "Capital Structure & Banking",
    note: "Foreign-parent: FEMA-compliant subscription mode required",
    items: [
      "Authorised + paid-up capital plan",
      "Indian-parent: parent's bank statement + NEFT remittance plan",
      "Foreign-parent: AD-Bank coordination details for FIRC + KYC retrieval",
      "FDI valuation certificate (DCF / NAV / fair value by CA / Merchant Banker for inward share issue)",
    ],
  },
];

const individualDocs = [
  {
    icon: <FaPassport />,
    title: "Director Identity (Resident + Non-Resident)",
    note: "Per person — all directors and nominee shareholder",
    items: [
      "Resident director: PAN + Aadhaar + utility bill (≤ 60 days)",
      "Non-resident / foreign director: apostilled passport + foreign address proof + visa copy (if visiting)",
      "Photograph, email id and mobile number",
      "DSC + DIN to follow",
    ],
  },
  {
    icon: <FaUser />,
    title: "Nominee Shareholder Documents",
    note: "Resident Indian individual holding 1 share on trust",
    items: [
      "PAN + Aadhaar + address proof + photograph + DSC",
      "Section 187 declaration of nominee shareholding (declaration of trust executed in favour of parent)",
      "Shareholder consent",
    ],
  },
  {
    icon: <FaBolt />,
    title: "Registered Office Proof",
    note: "Address must be in India",
    items: [
      "Latest electricity / gas / municipal tax bill (≤ 60 days old)",
      "NoC from the property owner",
      "If rented: notarised rent agreement",
      "If co-working / virtual: service agreement + operator NoC",
    ],
  },
];

const DocItem = ({ doc }) => (
  <div className="incd-doc-item">
    <div className="incd-doc-item-top">
      <div className="incd-doc-icon">{doc.icon}</div>
      <div className="incd-doc-meta">
        <h4 className="incd-doc-title">{doc.title}</h4>
        <span className="incd-doc-note">{doc.note}</span>
      </div>
    </div>
    <ul className="incd-doc-list">
      {doc.items.map((item, i) => (
        <li key={i} className="incd-doc-list-item">{item}</li>
      ))}
    </ul>
  </div>
);

const IncorporationDocuments = () => {
  return (
    <section className="incd-section">
      <div className="incd-container">

        {/* Header */}
        <div className="incd-header">
          <h2 className="incd-main-title">Documents Required for Incorporation of Wholly Owned Subsidiary in India</h2>
          <p className="incd-main-subtitle">
            Six categories. Indian-parent docs are domestic KYC. Foreign-parent docs need apostille / notarisation. Per-person documents apply to all directors and the nominee shareholder. We send a personalised checklist after the discovery call.
          </p>
        </div>

        {/* Two columns */}
        <div className="incd-columns">

          {/* Parent Company Documents */}
          <div className="incd-column">
            <div className="incd-col-header">
              <div className="incd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="incd-col-title">Parent Company Documents</h3>
                <p className="incd-col-subtitle">Identity, authorisations &amp; capital structure</p>
              </div>
            </div>
            <div className="incd-col-body">
              {parentDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          {/* Individual & Office Documents */}
          <div className="incd-column">
            <div className="incd-col-header incd-col-header--office">
              <div className="incd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="incd-col-title">Director, Nominee &amp; Office Documents</h3>
                <p className="incd-col-subtitle">Per-person KYC &amp; registered office proof</p>
              </div>
            </div>
            <div className="incd-col-body">
              {individualDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>


      </div>
    </section>
  );
};

export default IncorporationDocuments;
