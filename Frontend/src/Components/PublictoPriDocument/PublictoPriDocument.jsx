import React from "react";
import "../ProFOPCDocument/ProFOPCDocument.css";

const documents = [
  {
    id: 1,
    title: "KYC Documents",
    text:
      "PAN and Aadhaar of all directors and shareholders along with address proof.",
    color: "red",
  },
  {
    id: 2,
    title: "Special Resolution & EGM Minutes",
    text:
      "Certified copy of the special resolution and minutes of the general meeting approving the conversion.",
    color: "orange",
  },
  {
    id: 3,
    title: "Altered MOA & AOA",
    text:
      "Updated Memorandum and Articles incorporating the private company restrictions.",
    color: "teal",
  },
  {
    id: 4,
    title: "List of Creditors",
    text:
      "List of creditors and debenture holders with their consent or no-objection.",
    color: "brown",
  },
  {
    id: 5,
    title: "Audited Financial Statements",
    text:
      "Latest audited financial statements and a declaration of solvency of the company.",
    color: "pink",
  },
  {
    id: 6,
    title: "Registered Office Proof",
    text:
      "Latest utility bill, rent agreement and NOC for the registered office address.",
    color: "yellow",
  },
];

const PublictoPriDocument = () => {
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

export default PublictoPriDocument;
