import React from "react";
import {
  FaIdCard,
  FaMapMarkerAlt,
  FaBuilding,
  FaFileAlt,
  FaUniversity,
  FaCertificate,
} from "react-icons/fa";
import "./ProDocument.css";

const steps = [
  { no: "01", color: "beige" },
  { no: "02", color: "teal" },
  { no: "03", color: "orange" },
  { no: "04", color: "red" },
  { no: "05", color: "yellow" },
  { no: "06", color: "violet" },
];

const ProDocumentSection = () => {
  return (
    <>
      <div className="pvtltd-doc-header">
        <h2 className="pvtltd-doc-title">
          Documents Required for Proprietorship Firm Registration in India
        </h2>
        <p className="pv-gst-subheading">
          Get these ready and we'll take care of the rest:
        </p>
      </div>

      <div className="infographic-wrapper">
        <div className="infographic">

          <div className="ring-wrapper">
            <div className="center-box">
              <h3>Documents Required</h3>
            </div>

            <div className="ring">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className={`ring-segment ${s.color}`}
                  style={{ transform: `rotate(${i * 60}deg)` }}
                >
                  <span style={{ transform: `rotate(-${i * 60}deg)` }}>
                    {s.no}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="side left">
            <div className="card pink">
              <div className="icon"><FaIdCard /></div>
              <div>
                <h4><span className="step-no">1.</span>Proprietor Identity</h4>
                <br />
                <ul>
                  <li>PAN card (mandatory)</li>
                  <li>Aadhaar card (mobile-linked + linked with PAN)</li>
                  <li>Voter ID / Driving Licence / Passport as second ID</li>
                  <li>Passport-size photograph (jpeg, &lt; 100 KB)</li>
                </ul>
              </div>
            </div>

            <div className="card pink">
              <div className="icon"><FaMapMarkerAlt /></div>
              <div>
                <h4><span className="step-no">2.</span>Address Proof of Proprietor</h4>
                <br />
                <ul>
                  <li>Bank statement OR utility bill OR mobile postpaid bill — not older than 60 days</li>
                  <li>Self-attested. Address must match Aadhaar</li>
                </ul>
              </div>
            </div>

            <div className="card pink">
              <div className="icon"><FaBuilding /></div>
              <div>
                <h4><span className="step-no">3.</span>Business Premises Proof</h4>
                <br />
                <ul>
                  <li>Owned: Latest property tax receipt + electricity bill</li>
                  <li>Rented: Notarised rent agreement + landlord's NoC + electricity bill</li>
                  <li>Home office: Self-declaration + utility bill in proprietor's name</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="side right">
            <div className="card pink">
              <div className="icon"><FaFileAlt /></div>
              <div>
                <h4><span className="step-no">4.</span>Business Identity Proof</h4>
                <br />
                <ul>
                  <li>Trade name (proposed)</li>
                  <li>Business activity description + NIC code mapping</li>
                  <li>Existing licences if any (Shop &amp; Est, FSSAI, etc.)</li>
                </ul>
              </div>
            </div>

            <div className="card pink">
              <div className="icon"><FaUniversity /></div>
              <div>
                <h4><span className="step-no">5.</span>Bank Account Documents</h4>
                <br />
                <ul>
                  <li>Cancelled cheque OR bank passbook first page OR bank statement with IFSC</li>
                  <li>For personal account migration: NoC may be required</li>
                </ul>
              </div>
            </div>

            <div className="card pink">
              <div className="icon"><FaCertificate /></div>
              <div>
                <h4><span className="step-no">6.</span>Sector-Specific Documents</h4>
                <br />
                <ul>
                  <li>Food: kitchen layout / FSSAI form</li>
                  <li>E-commerce: business website / marketplace plan</li>
                  <li>Import-export: pro-forma invoices / IEC application</li>
                  <li>Professionals: degree / professional body certificate</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ProDocumentSection;
