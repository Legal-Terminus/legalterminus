import React from "react";
import "./LabourLicenseFeatures.css";

const types = [
  {
    number: "01",
    title: "Principal Employer Registration (RC)",
    text: "Required for any establishment engaging 20 or more contract workmen through one or more contractors. The principal employer applies in Form I and receives a Certificate of Registration (RC). The RC lists each contractor and the maximum number of workmen, and is the legal foundation that allows contract labour to be engaged at the establishment.",
  },
  {
    number: "02",
    title: "Contractor Labour Licence",
    text: "Mandatory for every contractor who employs 20 or more workmen. The contractor applies in Form IV, supported by Form V (issued by the principal employer confirming the establishment is registered). On approval, the licensing officer grants a Licence in Form VI, valid for one year and tied to a maximum number of workmen.",
  },
  {
    number: "03",
    title: "Renewal & Amendment",
    text: "A labour licence is valid for 1 year and must be renewed before expiry — applications can be filed up to 30 days prior. Amendments are needed when the number of workmen increases beyond the licensed strength, when contractors change, or when establishment details are updated. Timely renewal avoids the late surcharge and keeps the engagement lawful.",
  },
];

const LabourLicenseFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Labour Licence / Registration in India</h2>

        <div className="opc-features-cards">
          {types.map((type) => (
            <div className="opc-features-card" key={type.number}>
              <div className="opc-features-number">{type.number}</div>
              <h3 className="opc-features-card-title">{type.title}</h3>
              <p className="opc-features-card-text">{type.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LabourLicenseFeatures;
