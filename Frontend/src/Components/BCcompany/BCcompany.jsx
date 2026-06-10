import React from "react";
import "./BCcompany.css";
import illustration from "../../assets/whypvt-imp.svg";

const BCcompany = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="GS1 Barcode Registration illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why You Need a GS1 Barcode
            </h2>
            <p className="opc-intro-text">
              A GS1 barcode is a globally accepted product identification number used for selling products through retail stores, supermarkets, e-commerce platforms, and export markets. The barcode contains a unique GTIN (Global Trade Item Number) that helps identify your product and brand across supply chains and marketplaces worldwide. Today, most online marketplaces and retail chains such as Amazon, Flipkart, JioMart, BigBasket, DMart, Reliance Retail, and many export buyers require genuine GS1 barcodes for product listing, inventory management, and billing systems. Without a valid barcode, products may face difficulties in retail onboarding, warehouse scanning, or marketplace approvals.
              <br /><br />
              In India, genuine GS1 barcodes are issued only by GS1 India, the authorised organisation supported by the Ministry of Commerce &amp; Industry and leading trade bodies. Apart from barcodes (GTINs), GS1 India also provides systems like DataKart, GLN, and logistics identification support used by businesses for modern trade and supply-chain management. Bar Code Registration helps businesses build product credibility, simplify inventory tracking, and prepare products for retail, e-commerce, and export growth.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">GS1 Barcode Pack Sizes + Tenure: The Deep Dive</h2>
          <p className="opc-compare-subtitle">
            Per the GS1 India GCP Fee Structure effective 1 October 2025, fees scale with three variables: barcode pack size, tenure, and your annual sales turnover. Here's the structure:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Variable</th>
                  <th>Options</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Barcode Pack Size</td>
                  <td>100 / 1,000 / 10,000 / 1,00,000 GTINs</td>
                  <td>Pick based on current + 3-year SKU count</td>
                </tr>
                <tr>
                  <td>Tenure</td>
                  <td>1 / 2 / 3 / 5 / 10 years</td>
                  <td>Longer tenure = lower effective per-year cost</td>
                </tr>
                <tr>
                  <td>Turnover Slab</td>
                  <td>10 slabs from Up to Rs.5 Cr to Above Rs.1,000 Cr</td>
                  <td>Higher turnover = higher fee</td>
                </tr>
                <tr>
                  <td>Registration Fee</td>
                  <td>Rs.26,000 (Up to Rs.5 Cr, 100 GTINs) to Rs.69,500 (&gt;Rs.1000 Cr, 1L GTINs)</td>
                  <td>One-time, paid at first registration</td>
                </tr>
                <tr>
                  <td>Annual Subscription</td>
                  <td>Rs.12,250 (smallest) to Rs.22,800 (largest) per year</td>
                  <td>Recurring; reduces per-year for multi-year tenures</td>
                </tr>
                <tr>
                  <td>GST</td>
                  <td>18% on Registration + Subscription</td>
                  <td>Eligible for ITC if GSTIN active</td>
                </tr>
                <tr>
                  <td>Security Deposit</td>
                  <td>Rs.3,000 refundable (Nil for 10-year tenure)</td>
                  <td>Refundable on surrender of GCP</td>
                </tr>
                <tr>
                  <td>MSME Rebate</td>
                  <td>80% reimbursement of Reg + Annual fees for first 3 yrs, max Rs.50,650</td>
                  <td>Udyam-registered micro-manufacturers; 100/1000 packs only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default BCcompany;
