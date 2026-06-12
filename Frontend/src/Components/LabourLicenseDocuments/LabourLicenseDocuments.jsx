import React from "react";
import "./LabourLicenseDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaUsers, FaBolt, FaFileContract, FaFileSignature, FaFileAlt, FaList } from "react-icons/fa";

const ownerDocs = [
  {
    icon: <FaIdCard />,
    title: "Applicant / Entity Identity",
    note: "Identity of applicant / entity & authorised signatory",
    items: [
      "Applicant's PAN + Aadhaar (individuals / proprietors)",
      "Entities: entity PAN + Certificate of Incorporation / Partnership Deed / Trust Deed / Registration Certificate",
      "Authorised signatory's photograph + KYC + Board Resolution / Authorisation Letter",
      "Digital Signature Certificate (DSC) for portal filing",
    ],
  },
  {
    icon: <FaFileSignature />,
    title: "Form V Certificate (PE → Contractor)",
    note: "Mandatory pre-condition for Contractor License",
    items: [
      "Principal Employer issues Form V certifying the work covered, worker count, period and nature of work",
      "Confirms PE readiness to engage the contractor",
      "We co-draft Form V from both PE + Contractor sides for chain consistency",
    ],
  },
  {
    icon: <FaList />,
    title: "Linked Statutory / Tax Registrations",
    note: "Separate / add-on registrations as applicable",
    items: [
      "GSTIN (for invoicing)",
      "EPFO Code (Code on Social Security 2020 - separate filing)",
      "ESIC Code (Code on Social Security 2020 - separate filing)",
      "Professional Tax Registration (state-specific)",
      "Construction (add-on): BOCW Cess registration with State BOCW Welfare Board",
      "Inter-state ISMW (add-on): registration of recruitment activity in the home State",
    ],
  },
];

const premiseDocs = [
  {
    icon: <FaBolt />,
    title: "Premises / Establishment Proof",
    note: "Address of principal establishment / worksite",
    items: [
      "Address proof of the principal establishment - rent agreement OR ownership document",
      "Latest property tax receipt / electricity bill (within 90 days)",
      "Contractor: address proof of office + any workmen accommodation / camp",
      "PE: address of premises where contract labour will be deployed",
    ],
  },
  {
    icon: <FaUsers />,
    title: "Worker Schedule + Wage Details",
    note: "Required to fix the licensed worker count",
    items: [
      "List of contract workers - name, gender, age, address, designation, daily wages, working hours",
      "Categorisation: skilled / semi-skilled / unskilled",
      "Inter-state migrant workmen: home State + journey allowance details",
      "Muster roll / wage register format (statutory)",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Welfare Facility Plan",
    note: "Section 24 of OSH Code 2020 + State Rules",
    items: [
      "Plan / layout of welfare facilities: canteen (50+ workers), restrooms / latrines / urinals (separate men + women)",
      "Drinking water points, first-aid box, creche (50+ women workers), washing facilities, rest shelters",
      "Premises layout drawing helpful",
    ],
  },
];

const DocItem = ({ doc }) => (
  <div className="opcd-doc-item">
    <div className="opcd-doc-item-top">
      <div className="opcd-doc-icon">{doc.icon}</div>
      <div className="opcd-doc-meta">
        <h4 className="opcd-doc-title">{doc.title}</h4>
        <span className="opcd-doc-note">{doc.note}</span>
      </div>
    </div>
    <ul className="opcd-doc-list">
      {doc.items.map((item, i) => (
        <li key={i} className="opcd-doc-list-item">{item}</li>
      ))}
    </ul>
  </div>
);

const LabourLicenseDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for Labour Licence Registration in India</h2>
          <p className="opcd-main-subtitle">Six categories. Documentation is moderate - identity, premises, worker schedule, Form V, welfare plan, linked statutory registrations. We send a personalised checklist after the discovery call.</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Applicant, Form V &amp; Statutory</h3>
                <p className="opcd-col-subtitle">Identity, Form V chain &amp; linked registrations</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {ownerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Premises, Workforce &amp; Welfare</h3>
                <p className="opcd-col-subtitle">Address, worker schedule &amp; welfare plan</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {premiseDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default LabourLicenseDocuments;
