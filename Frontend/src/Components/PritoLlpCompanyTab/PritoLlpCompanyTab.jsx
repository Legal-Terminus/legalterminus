import React from "react";
import "./PritoLlpCompanyTab.css";

// Replace with your actual illustration
import pvtIllustration from "../../assets/whypvt-imp.svg";

const PvtLtdFull = () => {
  return (
    <div className="PLC-to-LLP-pvtfull-wrapper">

      {/* ===========================
          SECTION 1 — OVERVIEW
      ============================ */}
      {/* <div className="overview-wrapper">
        <h2 className="overview-title">Understanding the Basics
</h2>
        <p className="overview-text">
A Private Limited Company is a legally registered business under the Companies Act, 2013, with its own separate identity from its owners. It protects the personal assets of its members, limits who can own shares, and must have a registered office address. </p>
      </div> */}

      {/* ===========================
          SECTION 2 — INTRO
      ============================ */}
      <section className="PLC-to-LLP-pvtintro-section">
        <div className="PLC-to-LLP-pvtintro-container">
          {/* Illustration */}
          <div className="PLC-to-LLP-pvtintro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="PLC-to-LLP-pvtintro-illustration"
            />
          </div>

          {/* Text */}
          <div className="PLC-to-LLP-pvtintro-content">
            <h2 className="PLC-to-LLP-pvtintro-title">
              Why Choose Conversion of Private Limited Company into LLP
            </h2>
            <p className="PLC-to-LLP-pvtintro-text">
           Converting a Private Limited Company into a Limited Liability Partnership (LLP) is a strategic step for businesses looking for operational flexibility and reduced compliance burden. The conversion process is governed by the Companies Act, 2013 and the Limited Liability Partnership Act, 2008, and is regulated by the Ministry of Corporate Affairs (MCA). After conversion, the LLP continues the business with all assets, liabilities, rights, and obligations legally transferred from the company.
            </p>
          </div>
        </div>
      </section>

      {/* ===========================
          SECTION 3 — COMPANIES ACT
      ============================ */}
      <section className="companies-act-section">
        <div className="companies-act-container">
          <div className="companies-act-card">
            <h3 className="companies-act-title">Limited Liability Partnership Act, 2008</h3>

            <p className="companies-act-text">
              As per the Limited Liability Partnership Act, 2008 and the applicable rules, a Private Limited Company may convert into a Limited Liability Partnership (LLP), subject to prescribed conditions and approval from the Registrar.
            </p>

            <p className="companies-act-point">
              <span className="companies-act-point-label">(a)</span>
              There must be a minimum of two Partners and two Designated Partners;
            </p>

            <p className="companies-act-point">
              <span className="companies-act-point-label">(b)</span>
              All shareholders of the company must become partners in the LLP;
            </p>

            <p className="companies-act-point">
              <span className="companies-act-point-label">(c)</span>
              The LLP shall be governed by an LLP Agreement defining the mutual rights and duties of partners;
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PvtLtdFull;
