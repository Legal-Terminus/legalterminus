import React from "react";
import "./ProFOPCDocument.css";

const documents = [
  {
    id: 1,
    title: "KYC Documents",
    text:
      "PAN and Aadhaar of all proposed directors and shareholders along with address proof.",
    color: "red",
  },
  {
    id: 2,
    title: "Passport Size Photograph",
    text:
      "Recent passport size photographs of all proposed directors and shareholders.",
    color: "orange",
  },
  {
    id: 3,
    title: "Electricity Bill",
    text:
      "Latest electricity bill of the registered office address of the company.",
    color: "teal",
  },
  {
    id: 4,
    title: "Rent Agreement",
    text:
      "Duly notarised rent agreement for registered office address (if rented).",
    color: "brown",
  },
  {
    id: 5,
    title: "No Objection Certificate",
    text:
      "NOC from the owner allowing use of premises as registered office.",
    color: "pink",
  },
  {
    id: 6,
    title: "Other Documents",
    text:
      "Any additional documents as required by authorities.",
    color: "yellow",
  },
];

const ProFopcDocument = () => {
  return (
    <section className="profopc-doc-section">
      <div className="profopc-doc-container">

        {/* Infographic */}
        <div className="profopc-doc-wheel">
          <div className="profopc-doc-center">
            <span>Documents<br />Required</span>
          </div>

          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`profopc-doc-node profopc-doc-${doc.color}`}
            >
              {doc.id}
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="profopc-doc-list">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`profopc-doc-card profopc-doc-${doc.color}`}
            >
              <span className="profopc-doc-badge">{doc.id}</span>
              <div>
                <h4>{doc.title}</h4>
                <p>{doc.text}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProFopcDocument;
