import React from "react";
import "../CopyPvtDocument/CopyPvtDocument.css";
import { FaUser, FaBuilding, FaIdCard, FaUserShield, FaFileContract, FaNewspaper, FaFileAlt } from "react-icons/fa";

const applicantDocs = [
  {
    icon: <FaIdCard />,
    title: "Founder / Sole Member Identity",
    note: "KYC for the single member / director",
    items: [
      "Founder's PAN + Aadhaar (mandatory linkage)",
      "Latest passport-size photograph",
      "Email ID + mobile number (for OTP)",
      "Bank statement / utility bill (within 60 days) as residence proof",
      "For NRI Indian citizens: passport + 120-day residency evidence + overseas address proof",
      "DSC (Class-3 Individual, 2-year) for digital signing",
      "DIR-3 KYC if existing director",
    ],
  },
  {
    icon: <FaUserShield />,
    title: "Nominee Documents (Form INC-3)",
    note: "Mandatory for every OPC",
    items: [
      "Nominee's PAN + Aadhaar + photograph + DSC",
      "Form INC-3 (Nominee Consent) signed by nominee on appropriate stamp paper",
      "Nominee must be: Indian citizen + Indian resident + adult (18+) + NOT already a nominee in another OPC",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "URC-1 Statutory Pack",
    note: "Core conversion documentation",
    items: [
      "AUDITED Statement of Accounts of the proprietorship (not older than 30 DAYS from URC-1 filing)",
      "List of MEMBERS / partners with addresses + occupations + capital contribution",
      "List of CREDITORS with claim amounts + consent letters / NOCs",
      "Declaration of SOLVENCY by the proprietor (on stamp paper – format will be given by us)",
      "Affidavits confirming compliance with Section 366",
      "Resolution of consent (where applicable)",
    ],
  },
];

const officeDocs = [
  {
    icon: <FaNewspaper />,
    title: "URC-2 Advertisement Inputs",
    note: "For the mandatory newspaper notice",
    items: [
      "Proposed company name (post-name-reservation)",
      "Names of subscribers / proposed director + nominee",
      "Principal place of business",
      "Brief description of the business activity to be carried on by the company",
      "State / UT where the proprietorship is situated (determines the vernacular newspaper)",
    ],
  },
  {
    icon: <FaBuilding />,
    title: "Registered Office + Proprietorship Records",
    note: "Office proof + existing registrations",
    items: [
      "Address proof of registered office (rent agreement OR ownership document)",
      "NOC from owner (if rented)",
      "Latest electricity bill / utility bill (within 60 days)",
      "Existing proprietorship's PAN + GSTIN + Udyam Certificate + Shop & Establishment Certificate + Trade License + FSSAI License (if applicable) + IEC + any other registrations",
      "Last 3 years' ITRs + bank statements",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "MOA + AOA + Statutory Declarations",
    note: "Incorporation documents & stamp duty",
    items: [
      "Proposed OPC name (up to 4 options for SPICe+ Part A)",
      "Main object clauses",
      "Authorised + subscribed share capital",
      "Number + value of subscribed shares",
      "Other object clauses (incidental + ancillary)",
      "Custom AOA inputs (Supreme Plus only)",
      "Form INC-9 (Declaration by Director + Member)",
      "Stamp duty on MOA + AOA per State rate",
      "Stamp duty on Asset Transfer Agreement (Supreme / Supreme Plus)",
    ],
  },
];

const DocItem = ({ doc }) => (
  <div className="cpvd-doc-item">
    <div className="cpvd-doc-item-top">
      <div className="cpvd-doc-icon">{doc.icon}</div>
      <div className="cpvd-doc-meta">
        <h4 className="cpvd-doc-title">{doc.title}</h4>
        <span className="cpvd-doc-note">{doc.note}</span>
      </div>
    </div>
    <ul className="cpvd-doc-list">
      {doc.items.map((item, i) => (
        <li key={i} className="cpvd-doc-list-item">{item}</li>
      ))}
    </ul>
  </div>
);

const PtoopcDocuments = () => {
  return (
    <section className="cpvd-section">
      <div className="cpvd-container">

        {/* Header */}
        <div className="cpvd-header">
          <h2 className="cpvd-main-title">Documents Required for Converting Proprietorship to an OPC</h2>
          <p className="cpvd-main-subtitle">Six categories — heavier than a fresh OPC incorporation due to URC-1 + URC-2 statutory requirements. We send a personalised checklist after the discovery call.</p>
        </div>

        {/* Two columns */}
        <div className="cpvd-columns">

          {/* Applicant / Statutory Documents */}
          <div className="cpvd-column">
            <div className="cpvd-col-header">
              <div className="cpvd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="cpvd-col-title">Applicant &amp; Statutory Documents</h3>
                <p className="cpvd-col-subtitle">Founder, nominee &amp; URC-1 pack</p>
              </div>
            </div>
            <div className="cpvd-col-body">
              {applicantDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          {/* Office / Notice / Incorporation Documents */}
          <div className="cpvd-column">
            <div className="cpvd-col-header cpvd-col-header--office">
              <div className="cpvd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="cpvd-col-title">Office, Notice &amp; Incorporation Docs</h3>
                <p className="cpvd-col-subtitle">URC-2 inputs, office proof &amp; MOA/AOA</p>
              </div>
            </div>
            <div className="cpvd-col-body">
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

export default PtoopcDocuments;
