import React from "react";
import "./PFRdocument.css";

import {
  FaIdCard,
  FaCamera,
  FaFileContract,
  FaCertificate,
} from "react-icons/fa";

const PFRdocument = () => {
  return (
    <section className="pdi-section">
      <h2 className="pdi-heading">
        Documents Required for Partnership Firm Registration in India
      </h2>

      <div className="pdi-wrapper">
        {/* LEFT COLUMN */}
        <div className="pdi-steps">
          <div className="pdi-step">
            <div className="pdi-number">01</div>
            <div className="pdi-card pdi-one">
              <div className="pdi-icon">
                <FaIdCard />
              </div>
              <p>
                Rs. 200/- stamp paper on name of any of the proposed Partner
              </p>
            </div>
          </div>

          <div className="pdi-step">
            <div className="pdi-number">02</div>
            <div className="pdi-card pdi-two">
              <div className="pdi-icon">
                <FaCamera />
              </div>
              <p>
                KYC documents – PAN, Aadhaar and other ID proofs of all proposed partners.
              </p>
            </div>
          </div>

          <div className="pdi-step">
            <div className="pdi-number">03</div>
            <div className="pdi-card pdi-three">
              <div className="pdi-icon">
                <FaFileContract />
              </div>
              <p>
                Latest electricity bill of the registered office address.
              </p>
            </div>
          </div>

          <div className="pdi-step">
            <div className="pdi-number">04</div>
            <div className="pdi-card pdi-four">
              <div className="pdi-icon">
                <FaCertificate />
              </div>
              <p>
                Rent agreement (if office is rented), duly notarised.
              </p>
            </div>
          </div>
        </div>

        {/* CENTER INFOGRAPHIC */}
        <div className="pdi-center">
          <div className="pdi-circle">
            <h3>Documents Required</h3>
            <p>Partnership Firm Registration</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PFRdocument;
