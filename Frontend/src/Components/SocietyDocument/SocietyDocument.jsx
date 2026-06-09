import React from "react";
import "./SocietyDocument.css";
import { FaUser, FaBuilding, FaIdCard, FaFileAlt, FaFileContract, FaShieldAlt } from "react-icons/fa";

const leftDocs = [
  {
    icon: <FaUser />,
    title: "Founder Members Identity (Minimum 7)",
    note: "For EACH of the 7 members — state-specific eligibility check applies",
    items: [
      "Self-attested PAN + Aadhaar (mobile-linked) + photograph + address proof (per member)",
      "Occupation + designation",
      "Member acceptance form",
      "State-specific eligibility check (e.g., different families in AP / Telangana)",
    ],
  },
  {
    icon: <FaIdCard />,
    title: "Designated Office Bearers",
    note: "President, Secretary, Treasurer — signing authority for society documents",
    items: [
      "President + Secretary + Treasurer identification with their KYC",
      "Designation letters",
      "Confirmation that the President / Secretary will sign all society documents",
      "Resident-in-India confirmation",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Society Object & Activity Plan",
    note: "Foundation of 12A approval if pursued later",
    items: [
      "Brief description of Society purpose (charitable / educational / cultural / sports / professional)",
      "Object clause draft (we help)",
      "Activity plan for first 3 years",
      "Geographic scope",
      "Target beneficiaries / membership",
    ],
  },
];

const rightDocs = [
  {
    icon: <FaBuilding />,
    title: "Registered Office Proof",
    note: "Must be in the registration state",
    items: [
      "Latest electricity / gas / municipal tax bill (<= 60 days old) for the registered office",
      "NoC from property owner",
      "If rented: notarised rent agreement",
      "Photograph of office front-board",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "MoA + Rules + Affidavits",
    note: "We draft MoA and Rules; you provide affidavits on stamp paper",
    items: [
      "Memorandum of Association (object clause) - we draft",
      "Rules and Regulations (governance constitution) - we draft",
      "Founder President's affidavit on stamp paper",
      "Affidavits from each member",
      "NoC + cover letter",
    ],
  },
  {
    icon: <FaShieldAlt />,
    title: "Optional / Sector-Specific",
    note: "Not mandatory for all — sector credentials strengthen the application",
    items: [
      "For Educational: prior teaching credentials / institutional partnerships",
      "For Scientific: research credentials / DSIR application plans",
      "For Sports: federation affiliations",
      "For Professional: prior association affiliations",
      "For Cultural: heritage / artistic credentials",
    ],
  },
];

const DocItem = ({ doc }) => (
  <div className="socd-doc-item">
    <div className="socd-doc-item-top">
      <div className="socd-doc-icon">{doc.icon}</div>
      <div className="socd-doc-meta">
        <h4 className="socd-doc-title">{doc.title}</h4>
        <span className="socd-doc-note">{doc.note}</span>
      </div>
    </div>
    <ul className="socd-doc-list">
      {doc.items.map((item, i) => (
        <li key={i} className="socd-doc-list-item">{item}</li>
      ))}
    </ul>
  </div>
);

const SocietyDocument = () => {
  return (
    <section className="socd-section" id="documents">
      <div className="socd-container">

        <div className="socd-header">
          <h2 className="socd-main-title">Documents Required for Society Registration in India</h2>
          <p className="socd-main-subtitle">Six categories. Per-person documents apply to all 7 founding members + designated Office Bearers. We send a state-specific personalised checklist after the discovery call.</p>
        </div>

        <div className="socd-columns">

          <div className="socd-column">
            <div className="socd-col-header">
              <div className="socd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="socd-col-title">Members, Office Bearers & Object Documents</h3>
                <p className="socd-col-subtitle">For each member and the society mission</p>
              </div>
            </div>
            <div className="socd-col-body">
              {leftDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="socd-column">
            <div className="socd-col-header socd-col-header--office">
              <div className="socd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="socd-col-title">Office, MoA & Sector-Specific Documents</h3>
                <p className="socd-col-subtitle">Registered address, MoA/Rules, and optional evidence</p>
              </div>
            </div>
            <div className="socd-col-body">
              {rightDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SocietyDocument;
