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
    title: "Identity Proof of Applicant",
    note: "Mandatory for the proprietor / authorised applicant",
    items: [
      "Self-attested PAN card (mandatory)",
      "Self-attested Aadhaar card",
      "Voter ID / Passport / Driving Licence (any one as additional ID)",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Address Proof of Applicant",
    note: "Not older than 2 months from the date of filing",
    items: [
      "Latest bank statement OR electricity / mobile bill in the applicant's name",
    ],
  },
  {
    icon: <FaCamera />,
    title: "Passport Size Photograph",
    note: "Recent photograph of the applicant",
    items: [
      "Latest passport-size photograph of the proprietor / authorised applicant",
    ],
  },
];

const businessDocs = [
  {
    icon: <FaBolt />,
    title: "Business Premises Proof",
    note: "Latest utility bill / receipt (not older than 2 months)",
    items: [
      "Electricity Bill",
      "Water Bill",
      "Latest Property Tax Receipt of the business premises",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Rent Agreement (If Premises is Rented)",
    note: "Between the property owner and the applicant",
    items: [
      "Registered / notarised rent or lease agreement for the business premises",
    ],
  },
  {
    icon: <FaShieldAlt />,
    title: "No Objection Certificate (NOC)",
    note: "From property owner / concerned department",
    items: [
      "NOC from the property owner permitting commercial use of the premises",
      "NOC from neighbours / fire & pollution department (as applicable to the trade)",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Business Registration Proof",
    note: "Entity constitution document, as applicable",
    items: [
      "Certificate of Incorporation / Partnership Deed / GST Registration (as applicable)",
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
            Keep these ready and we'll handle the entire filing for you
          </p>
        </div>

        {/* Two columns */}
        <div className="trade-doc-columns">

          {/* Applicant / Individual Documents */}
          <div className="trade-doc-column">
            <div className="trade-doc-col-header">
              <div className="trade-doc-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="trade-doc-col-title">Applicant / Promoter Documents</h3>
                <p className="trade-doc-col-subtitle">Required for the proprietor / applicant</p>
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
                <h3 className="trade-doc-col-title">Business & Premises Documents</h3>
                <p className="trade-doc-col-subtitle">Premises proof, NOC & business registration</p>
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
