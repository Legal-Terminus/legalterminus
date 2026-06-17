import React from "react";
import "./FoodLicenseDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaBolt, FaFileContract, FaShieldAlt, FaFileAlt, FaList } from "react-icons/fa";

const ownerDocs = [
  {
    icon: <FaIdCard />,
    title: "Applicant / FBO Identity",
    note: "Individuals & entities",
    items: [
      "Applicant's PAN + Aadhaar (for individuals / proprietors)",
      "Entities (company / LLP / partnership / Trust / Society): entity PAN + Certificate of Incorporation / Partnership Deed / Trust Deed / Registration Certificate",
      "Authorised signatory's photograph + KYC",
      "List of directors / partners / trustees",
    ],
  },
  {
    icon: <FaBuilding />,
    title: "Business Premises Proof",
    note: "Address & layout of the food premises",
    items: [
      "Address proof — rent agreement OR ownership document",
      "Recent electricity / water bill (within 90 days) + municipal property tax receipt",
      "Municipal NOC (where required by local body)",
      "Hawker (Elemental): mobile-cart description / route + photograph",
      "Supreme / Supreme Plus: premises blueprint + room-wise layout drawing",
    ],
  },
  {
    icon: <FaList />,
    title: "Turnover Proof + KOB Details",
    note: "Slab mapping & product categories",
    items: [
      "Turnover declaration mapped to revised 2026 slabs + the right plan tier (audited financials, GST returns, or self-declaration for new businesses)",
      "List of food products + categories per FSSAI's standardised KOB taxonomy",
      "Production capacity (MT/day for manufacturers, LPD for dairy, KG/day for meat)",
      "Source of raw material + list of equipment / machinery (manufacturers)",
    ],
  },
];

const premiseDocs = [
  {
    icon: <FaShieldAlt />,
    title: "Hygiene / Safety Documentation",
    note: "Supreme / Supreme Plus",
    items: [
      "Water test report from a NABL-accredited lab (within 1 month) — mandatory for manufacturers",
      "Food Safety Management Plan (FSMP) — recommended for Supreme; mandatory for Supreme Plus",
      "HACCP plan — mandatory for Supreme Plus",
      "Recall plan + traceability framework (Supreme Plus)",
      "FoSTaC Food Safety Supervisor designation",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Statutory NOCs / Linked Registrations",
    note: "Where applicable to your FBO",
    items: [
      "Fire safety NOC (for large premises)",
      "Pollution clearance / Consent to Operate (manufacturing)",
      "Supreme Plus importers / exporters: IEC (Import Export Code)",
      "Supreme Plus e-commerce FBOs: platform partner letters",
      "Multi-state Supreme Plus: list of branches with addresses + branch-level State Licenses",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Authority / Operational Documents",
    note: "Declarations & authorisations",
    items: [
      "Board Resolution / Authorisation Letter (for entities) appointing the authorised signatory",
      "Form IX (Nomination of Person by a Company) — required for Companies / LLPs",
      "Self-declaration of food safety compliance",
      "Previous license copy (for modification / surrender)",
      "Annual Return (Form D1 / D2) for existing State / Central licensees",
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

const FoodLicenseDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for Food License Registration in India</h2>
          <p className="opcd-main-subtitle">Six categories. Documentation scales with the plan tier — Elemental is lightest; Enriched is moderate; Supreme is comprehensive; Supreme Plus is fullest. We send a personalised checklist after the discovery call.</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Applicant, Premises &amp; Turnover</h3>
                <p className="opcd-col-subtitle">Identity, premises proof &amp; KOB details</p>
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
              <div className="opcd-col-header-icon"><FaShieldAlt /></div>
              <div>
                <h3 className="opcd-col-title">Safety, NOCs &amp; Authority Docs</h3>
                <p className="opcd-col-subtitle">Hygiene docs, NOCs &amp; declarations</p>
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

export default FoodLicenseDocuments;
