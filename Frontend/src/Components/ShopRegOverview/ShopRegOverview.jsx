import React from "react";
import "./ShopRegOverview.css";
import shopIllustration from "../../assets/whypvt-imp1.svg";

const ShopRegOverview = () => {
  return (
    <div className="shop-full-wrapper">

      <section className="shop-intro-section">
        <div className="shop-intro-container">
          <div className="shop-intro-illustration-wrap">
            <img
              src={shopIllustration}
              alt="Shop and Establishment Registration illustration"
              className="shop-intro-illustration"
            />
          </div>

          <div className="shop-intro-content">
            <h2 className="shop-intro-title">
              Why Register under Shop &amp; Establishment Act
            </h2>
            <p className="shop-intro-text">
              The Shop &amp; Commercial Establishments Act is a state-level labour law that governs working conditions, working hours, leave policies, holidays, and wages in all non-factory commercial premises — from a sole-proprietor kirana shop to a multi-floor corporate office. Registration under this Act is the first official identity your business gets from the state government.
            </p>
            <p className="shop-intro-text">
              Beyond compliance, the registration certificate is a prerequisite for opening a current bank account, applying for GST, obtaining trade licences, and qualifying for MSME/Udyam registration. It also signals legitimacy to vendors, landlords, and clients. Whether you operate a retail shop, restaurant, hotel, warehouse, or office — if it's in a municipal area, you need this registration.
            </p>
          </div>
        </div>
      </section>

      <section className="shop-compare-section">
        <div className="shop-compare-container">
          <h2 className="shop-compare-title">Registered vs. Unregistered Establishment — The Real Difference</h2>
          <p className="shop-compare-subtitle">
            Here's what's at stake if you skip the registration:
          </p>
          <div className="shop-compare-table-wrapper">
            <table className="shop-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Registered Establishment</th>
                  <th>Unregistered Establishment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Legal Standing</td>
                  <td>Recognised by state govt.</td>
                  <td>Operating illegally — liable to prosecution</td>
                </tr>
                <tr>
                  <td>Bank Account</td>
                  <td>Current account easily opened</td>
                  <td>Banks often reject current account applications</td>
                </tr>
                <tr>
                  <td>GST Registration</td>
                  <td>Registration Certificate accepted as address proof</td>
                  <td>Additional proof required; often delayed</td>
                </tr>
                <tr>
                  <td>MSME / Udyam</td>
                  <td>Eligible immediately</td>
                  <td>Cannot apply without valid establishment proof</td>
                </tr>
                <tr>
                  <td>Employee Compliance</td>
                  <td>Labour law compliance documented</td>
                  <td>Liable for penalties under labour laws</td>
                </tr>
                <tr>
                  <td>Penalty Risk</td>
                  <td>Nil (if renewed on time)</td>
                  <td>Fine + potential closure by local authority</td>
                </tr>
                <tr>
                  <td>Trade Licence</td>
                  <td>S&amp;E certificate accepted as base document</td>
                  <td>Trade licence application rejected or stalled</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ShopRegOverview;
