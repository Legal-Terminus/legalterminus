import React from "react";
import "./LabourLicenseOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const LabourLicenseOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Labour Licence (CLRA) Registration illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why You Need a Labour License
            </h2>
            <p className="opc-intro-text">
              Labour License Registration is mandatory for contractors employing 50 or more contract workers under the OSH Code, 2020. The simplified labour law framework enables online registration through the Shram Suvidha Portal and provides longer license validity, helping businesses meet legal and workforce compliance requirements.
              <br /><br />
              A valid Labour License is essential for contractors, construction companies, manpower suppliers, factories, and service providers to operate legally and secure government or corporate contracts. We provide end-to-end assistance with documentation, online filing, department coordination, and compliance support for hassle-free registration.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LabourLicenseOverview;
