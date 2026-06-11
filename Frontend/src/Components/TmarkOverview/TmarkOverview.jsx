import React from "react";
import "./TmarkOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const TmarkOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Trademark Application illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why a Trademark Matters for Your Brand
            </h2>
            <p className="opc-intro-text">
              A trademark is any unique sign — a name, logo, word, slogan, or combination — that distinguishes your goods or services from everyone else's. Registered under the Trade Marks Act, 1999 and administered by the Trade Marks Registry (IP India), it gives you exclusive nationwide rights to use the mark in your class and to stop others from using a confusingly similar one. India follows the 45-class Nice Classification, and protection extends only to the classes you register in.
              <br /><br />
              Your brand is often your most valuable asset, yet without registration anyone can copy it — and you may even be forced to rebrand if someone else registers first. A registered trademark turns your brand into legally protected property you can license, franchise, or sell. You can use the ™ symbol the moment you file, and the ® symbol once the mark is registered. Filing early secures your priority date and locks in your rights before a competitor does.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Registered vs Unregistered Brand: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What changes when your brand name and logo are protected by a registered trademark:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Registered Trademark</th>
                  <th>Unregistered Brand</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Exclusive Rights</td><td>Nationwide, in your class</td><td>Limited, hard to enforce</td></tr>
                <tr><td>Symbol You Can Use</td><td>® after registration</td><td>Only ™ (no ® right)</td></tr>
                <tr><td>Legal Action</td><td>Infringement suit available</td><td>Only costly passing-off claim</td></tr>
                <tr><td>Brand as Asset</td><td>Can license, franchise &amp; sell</td><td>No clear, tradable IP</td></tr>
                <tr><td>Marketplace Listing</td><td>Amazon/Flipkart Brand Registry eligible</td><td>Vulnerable to hijacking</td></tr>
                <tr><td>Risk of Rebrand</td><td>Protected — priority secured</td><td>May be forced to rename</td></tr>
                <tr><td>Validity</td><td>10 years, renewable forever</td><td>No formal term or record</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default TmarkOverview;
