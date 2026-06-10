import React from "react";
import "./FoodLicenseOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const FoodLicenseOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="FSSAI Food License Registration illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why FSSAI Food License Registration Matters
            </h2>
            <p className="opc-intro-text">
              The Food Safety and Standards Authority of India (FSSAI) is an autonomous body established under the Ministry of Health &amp; Family Welfare, Government of India, under the Food Safety and Standards Act, 2006. Every Food Business Operator (FBO) — regardless of size or turnover — is legally required to obtain FSSAI registration or license before commencing any food-related activity in India.
              <br /><br />
              Operating without FSSAI registration is a criminal offence under the FSS Act. Penalties range from ₹5 lakh for operating without a license to up to ₹10 lakh for unsafe food products causing injury. Beyond legal risk, unlicensed food businesses are rejected by retail chains, e-commerce platforms (Swiggy, Zomato, BigBasket), and institutional buyers — making FSSAI compliance a commercial necessity, not just a legal one.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">FSSAI Licensed vs Unlicensed: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What happens when you operate a food business without a valid FSSAI license:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>FSSAI Licensed</th>
                  <th>No FSSAI License</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Legal Status</td><td>Fully compliant under FSS Act 2006</td><td>Criminal offence; liable to prosecution</td></tr>
                <tr><td>Penalty Exposure</td><td>None (if license is current)</td><td>₹5 lakh for operating without license</td></tr>
                <tr><td>E-Commerce Listing</td><td>Accepted on Swiggy, Zomato, BigBasket, Amazon</td><td>Rejected — FSSAI number mandatory</td></tr>
                <tr><td>Retail / Modern Trade</td><td>Accepted by supermarkets &amp; D-Mart</td><td>Product rejected at shelf entry point</td></tr>
                <tr><td>Export Eligibility</td><td>Valid for export to most markets</td><td>Blocked — FSSAI certificate required</td></tr>
                <tr><td>Consumer Trust</td><td>FSSAI logo &amp; number on label — visible trust signal</td><td>No trust signal; returns &amp; complaints higher</td></tr>
                <tr><td>Setup Cost (total)</td><td>₹100 – ₹7,500 / year (govt fee)</td><td>₹5 lakh+ penalty + shutdown + restart cost</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default FoodLicenseOverview;
