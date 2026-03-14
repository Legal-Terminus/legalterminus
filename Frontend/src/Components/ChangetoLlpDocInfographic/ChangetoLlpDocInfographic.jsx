import React from "react";
import "./ChangetoLlpDocInfographic.css";

const documentsData = [
  {
    id: 1,
    desc:
      "KYC documents - All the Proposed Designated Partners and Partners such as :- >as ID Proof - PAN and Aadhaar >as Address Proof - Telephone Bill/ Mobile Bill/ Savings Bank Statement",
    color: "change-doc-red",
    position: "left",
  },
  {
    id: 2,
    desc:
      "Passport size Photograph - All the Proposed Designated Partners and Partners",
    color: "change-doc-orange",
    position: "left",
  },
  {
    id: 3,
    desc:
      "Electricity bill corresponding to the registered office address of the proposed LLP",
    color: "change-doc-teal",
    position: "left",
  },
  {
    id: 4,
    desc:
      "Rent Agreement duly notarised with respect to the registered office address of the proposed LLP (if on rent)",
    color: "change-doc-brown",
    position: "right",
  },
  {
    id: 5,
    desc:
      "A No Objection Certificate (NOC) from the owner for use of his/her premise as registered office of the proposed LLP",
    color: "change-doc-purple",
    position: "right",
  },
  {
    id: 6,
    desc:
      "Other documents shall be prepared and provided by our team",
    color: "change-doc-yellow",
    position: "right",
  },
];

const ChangetoLlpDocInfographic = () => {
  return (
    <section className="change-doc-section">
      <h2 className="change-doc-heading">
        Documents Required for Limited Liability Partnership Registration
      </h2>

      <div className="change-doc-wrapper">

        {/* LEFT ITEMS */}
        <div className="change-doc-column">
          {documentsData
            .filter(item => item.position === "left")
            .map(item => (
              <div
                key={item.id}
                className={`change-doc-card ${item.color}`}
              >
                <span className="change-doc-number">{item.id}</span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
        </div>

        {/* CENTER INFOGRAPHIC */}
        <div className="change-doc-center">
          <div className="change-doc-circle">
            <span>Documents<br />Required</span>
          </div>
          <div className="change-doc-star"></div>
        </div>

        {/* RIGHT ITEMS */}
        <div className="change-doc-column">
          {documentsData
            .filter(item => item.position === "right")
            .map(item => (
              <div
                key={item.id}
                className={`change-doc-card ${item.color}`}
              >
                <span className="change-doc-number">{item.id}</span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
        </div>

      </div>
    </section>
  );
};

export default ChangetoLlpDocInfographic;
