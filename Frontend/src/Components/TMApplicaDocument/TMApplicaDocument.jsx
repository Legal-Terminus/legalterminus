import React from "react";
import "./TMApplicaDocument.css";

const DocumentsInfographic = () => {
  return (
    <section className="TM-Applica-doc-wrapper">
      <h2 className="TM-Applica-doc-heading">
        Documents Required for Trademark Registration in India <br />
        {/* <span>Documents Required for Trademark Registration in India</span> */}
      </h2>

      <div className="TM-Applica-doc-container">
        {/* LEFT CARDS */}
        <div className="TM-Applica-doc-col left">
          <div className="TM-Applica-doc-card pink">
            <h4>Applicant Identity & KYC Documents</h4>
            <p>
              (Applicable for Individuals / Proprietors / Authorised Signatories)
            </p>
            <br></br>
            <ul>
            <li>Aadhaar Card / Passport / Voter ID / Driving Licence (any one)</li>
            <li>PAN Card of authorised signatory (for Company/LLP applications)</li>
            <li>Aadhaar of authorised signatory (for Company/LLP applications)</li>
            </ul>
            </div>

          <div className="TM-Applica-doc-card pink">
            <h4>Business Entity Proof</h4>
            <p>
              (Required for Companies / LLPs / Registered Entities)
            </p>
            <br></br>
            <ul>
            <li>Certificate of Incorporation</li>
            <li>PAN Card of the Company / LLP</li>
            </ul>
          </div>

          <div className="TM-Applica-doc-card pink">
            <h4>Authorization Documents (Power of Attorney)</h4>
            <ul>
            <li>Signed Form TM-M (Power of Attorney) on ₹100 stamp paper(Stamp duty may vary from state to state — required for first-time clients)</li>
            </ul>
          </div>
        </div>

        {/* CENTER INFOGRAPHIC */}
        <div className="TM-Applica-doc-center">
          <div className="star">
            <span className="TMApplica-star-item pink"></span>
            <span className="TMApplica-star-item yellow"></span>
            <span className="TMApplica-star-item red"></span>
            <span className="TMApplica-star-item orange"></span>
            <span className="TMApplica-star-item teal"></span>
            <span className="TMApplica-star-item beige"></span>
          </div>
          <div className="TMApplica-center-circle">
            <h3>DOCUMENTS<br />REQUIRED</h3>
          </div>
        </div>

        {/* RIGHT CARDS */}
        <div className="TM-Applica-doc-col right">
          <div className="TM-Applica-doc-card pink">
            <h4>Trademark Representation (Brand Details)</h4>
            <ul>
            <li>Clear image of the trademark (Logo / Wordmark / Device mark) in JPEG/PNG format (if logo/device mark to be filed)</li>
            </ul>
          </div>

          <div className="TM-Applica-doc-card pink">
            <h4>MSME / Startup Benefit Documents</h4>
            <ul>
            <li>MSME Registration Certificate</li>
            <li>Startup India Recognition Certificate (Required only if claiming 50% government fee concession)</li>
            </ul>
          </div>

          <div className="TM-Applica-doc-card pink">
            <h4>Prior Use Supporting Documents</h4>
            <ul>
            <li>Evidence of prior use in India (Invoices, advertisements, packaging, website proof, etc.)</li>
            <li>Affidavit of use (when claiming use before filing date)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentsInfographic;
