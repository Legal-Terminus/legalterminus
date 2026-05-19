import React from "react";
import "./PvtltdDocument.css";
import {
  FaIdCard,
  FaFileContract,
  FaHome,
  FaUserCircle,
  FaBolt,
  FaFileAlt,
} from "react-icons/fa";

const steps = [
  { no: "01", color: "beige" },
  { no: "02", color: "teal" },
  { no: "03", color: "orange" },
  { no: "04", color: "red" },
  { no: "05", color: "yellow" },
  { no: "06", color: "violet" },
];

const PvtltdDocument = () => {
  return (
<>
     {/* ===== HEADLINE ===== */}
      <div className="pvtltd-doc-header">
        <h2 className="pvtltd-doc-title">
          Documents Required for Private Limited Company Registration in India
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
          <h4>INDIVIDUAL DOCUMENTS</h4> 
              <h4><span className="step-no">1.</span>Identity Proof</h4>
            <br></br>
            <ul>
            <li>PAN Card (Mandatory for Indian Nationals)</li>
            <li>Aadhaar Card (Indian Nationals)</li>
            <li>Passport (Mandatory for Foreign Nationals / NRIs)</li>
            </ul>
            </div>
          </div>

          <div className="card pink">
            <div className="icon"><FaFileContract /></div>
            <div>
              <h4><span className="step-no">2.</span>Address Proof (Individual – Not Older Than 2 Months)</h4>
            <br></br>
            <ul>
            <li>Bank Statement</li>
            <li>Mobile Bill</li>
            <li>Electricity Bill</li>
            <li>Water Bill</li>
            </ul>
            </div>
          </div>

          <div className="card pink">
            <div className="icon"><FaHome /></div>
            <div>
            <h4><span className="step-no">3.</span>Passport Size Photograph</h4>
            <br></br>
            <ul>
            <li>Latest Passport-size Photograph of all Proposed Directors / Shareholders</li>
            </ul>            
            </div>
          </div>
        </div>

        <div className="side right">
          <div className="card pink">
            <div className="icon"><FaIdCard /></div>
            <div>
          <h4>REGISTERED OFFICE DOCUMENTS</h4> 
              <h4><span className="step-no">1.</span>Utility Bill for Office Address (Not Older Than 2 Months)</h4>
            <br></br>
            <ul>
            <li>Electricity Bill</li>
            <li>Water Bill</li>
            <li>Gas Bill</li>
            <li>Property Tax Receipt</li>
            </ul>
            </div>
          </div>

          <div className="card pink">
            <div className="icon"><FaFileContract /></div>
            <div>
              <h4><span className="step-no">2.</span>Rent Agreement (If Premises is Rented)</h4>
            <br></br>
            <ul>
            <li>Duly Notarised Rent Agreement</li>
            </ul>
            </div>
          </div>

          <div className="card pink">
            <div className="icon"><FaHome /></div>
            <div>
            <h4><span className="step-no">3.</span>No Objection Certificate (NOC)</h4>
            <br></br>
            <ul>
            <li>NOC from Property Owner permitting use of premises as Registered Office
              <br></br>
          <strong>Note:</strong> Residential property is permissible as Registered Office under MCA guidelines
           </li>
            </ul>            
            </div>
          </div>
        </div>

      </div>
    </div>

    </>
  );
};

export default PvtltdDocument;
