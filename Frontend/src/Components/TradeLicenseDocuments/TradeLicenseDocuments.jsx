import React from "react";
import "./TradeLicenseDocuments.css";
import {
  FaUser,
  FaBuilding,
  FaIdCard,
  FaCamera,
  FaFileAlt,
  FaBolt,
  FaFileContract,
  FaShieldAlt,
} from "react-icons/fa";

const applicantDocs = [
  {
    icon: <FaIdCard />,
    title: "Applicant / Entity Identity",
    note: "Identity of applicant / entity & authorised signatory",
    items: [
      "Applicant's PAN + Aadhaar (for individuals / proprietors)",
      "For entities: entity PAN + Certificate of Incorporation / Partnership Deed / Trust Deed / Registration Certificate",
      "Authorised signatory's photograph + KYC + designation letter",
      "Board Resolution / Authorisation Letter where applicable",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Activity / Trade Declaration",
    note: "Declared activity, category & premises details",
    items: [
      "List of trade activities to be conducted at the premises",
      "Trade-category code per the Corporation's published tariff",
      "Premises area (carpet / built-up in sq ft)",
      "Zone classification (commercial / residential / industrial / mixed)",
      "For food / hospitality: menu / service list. For industrial: machinery list + production capacity",
    ],
  },
  {
    icon: <FaShieldAlt />,
    title: "Authority / Other Documents",
    note: "Affidavits, declarations & prior licenses",
    items: [
      "Affidavit / self-declaration on stamp paper declaring no encroachment / no nuisance / compliance with bye-laws (most cities)",
      "Property tax up-to-date certificate",
      "Previous Trade License copy (for renewal / amendment / surrender)",
      "For multi-establishment portfolio (Supreme): list of all premises with addresses + corresponding existing licenses",
    ],
  },
];

const businessDocs = [
  {
    icon: <FaFileContract />,
    title: "Premises Proof",
    note: "Ownership / tenancy & latest utility records",
    items: [
      "Rent agreement (registered, if state requires) OR property ownership document / sale deed",
      "Latest property tax receipt issued by the Municipal Corporation",
      "Recent electricity bill (within 90 days)",
      "Premises layout / floor plan (some cities)",
      "For rented premises: owner's NOC on stamp paper + owner's KYC + owner's property tax receipt",
    ],
  },
  {
    icon: <FaCamera />,
    title: "Premises Photographs",
    note: "Recent colour photographs (within 30 days)",
    items: [
      "Premises exterior + interior + signage / hoarding + entry / exit",
      "For food / industrial / hazardous categories: work areas, kitchen / production zone, storage area, sanitation facilities",
      "Some Corporations require GPS-tagged photographs uploaded via mobile app",
    ],
  },
  {
    icon: <FaBolt />,
    title: "Linked Statutory Documents",
    note: "Category-specific NOCs & registrations",
    items: [
      "GSTIN (most Corporations now require)",
      "For food categories: FSSAI License (or application receipt)",
      "For hospitality / inflammable / industrial: Fire Safety NOC",
      "For industrial: Pollution Control Board NOC (CTE / CTO)",
      "For medical / clinical: Clinical Establishments Act registration + biomedical waste authorisation",
      "For petrol pump / explosives: Explosives Department NOC",
    ],
  },
];

const DocItem = ({ doc }) => (
  <div className="trade-doc-item">
    <div className="trade-doc-item-top">
      <div className="trade-doc-icon">{doc.icon}</div>
      <div className="trade-doc-meta">
        <h4 className="trade-doc-item-title">{doc.title}</h4>
        <span className="trade-doc-note">{doc.note}</span>
      </div>
    </div>
    <ul className="trade-doc-list">
      {doc.items.map((item, i) => (
        <li key={i} className="trade-doc-list-item">{item}</li>
      ))}
    </ul>
  </div>
);

const TradeLicenseDocuments = () => {
  return (
    <section className="trade-doc-section" id="documents">
      <div className="trade-doc-container">

        {/* Header */}
        <div className="trade-doc-header">
          <h2 className="trade-doc-title">
            Documents Required for Trade License Registration in India
          </h2>
          <p className="trade-doc-subtitle-main">
            Six categories. Documentation is moderate — identity + premises + activity. Each Corporation has minor variations; we send a personalised, city-specific checklist after the discovery call.
          </p>
        </div>

        {/* Two columns */}
        <div className="trade-doc-columns">

          {/* Applicant / Individual Documents */}
          <div className="trade-doc-column">
            <div className="trade-doc-col-header">
              <div className="trade-doc-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="trade-doc-col-title">Applicant & Activity Documents</h3>
                <p className="trade-doc-col-subtitle">Identity, declared activity & declarations</p>
              </div>
            </div>
            <div className="trade-doc-col-body">
              {applicantDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          {/* Business / Premises Documents */}
          <div className="trade-doc-column">
            <div className="trade-doc-col-header trade-doc-col-header--office">
              <div className="trade-doc-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="trade-doc-col-title">Premises & Statutory Documents</h3>
                <p className="trade-doc-col-subtitle">Premises proof, photos & linked NOCs</p>
              </div>
            </div>
            <div className="trade-doc-col-body">
              {businessDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TradeLicenseDocuments;
