import React from "react";
import "./TmarkOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const niceClasses = [
  { range: "1–5", category: "Chemicals + Pharma", examples: "Class 5 - pharmaceuticals; Class 3 - cosmetics" },
  { range: "6–14", category: "Metals + Tools + Machinery + Vehicles + Jewellery", examples: "Class 11 - lighting; Class 12 - vehicles; Class 14 - jewellery" },
  { range: "15–21", category: "Music + Paper + Rubber + Leather + Construction + Household", examples: "Class 16 - paper / publications; Class 18 - leather" },
  { range: "22–28", category: "Ropes + Textiles + Clothing + Footwear + Carpet + Toys", examples: "Class 25 - apparel + footwear (very common)" },
  { range: "29–34", category: "Food + Beverage + Agriculture + Tobacco", examples: "Class 29 - food products; Class 30 - tea/coffee/snacks; Class 33 - alcoholic beverages" },
  { range: "35–45", category: "Trading", examples: "Class 35 - retail + advertising" },
  { range: "36–45", category: "SERVICES", examples: "Class 41 - education + entertainment; Class 42 - tech + IT services; Class 43 - food & lodging services; Class 45 - legal services" },
  { range: "Government Fee", category: "Per Class (E-Filing)", examples: "₹4,500 (Individual / Startup / MSME) | ₹9,000 (Others)" },
];

const TmarkOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Trademark Registration illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why You Need a Registered Trademark
            </h2>
            <p className="opc-intro-text">
              A registered trademark protects your brand name, logo, tagline, product name, or business identity under the Trade Marks Act, 1999. It grants exclusive legal rights over your brand, helps prevent unauthorized use, and allows you to use the ® symbol after registration.
              <br /><br />
              Trademark registration strengthens brand value, builds customer trust, and provides legal protection against infringement. Once registered, the trademark remains valid for 10 years and can be renewed indefinitely, making it a valuable long-term business asset.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Nice Classification + Government Fees</h2>
          <p className="opc-compare-subtitle">
            Trademarks in India follow the NICE CLASSIFICATION — an international classification system with 45 CLASSES (1–34 for Goods + 35–45 for Services). Each class covers a specific category of goods or services. You file separately for each class your business operates in. Here's a quick overview:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Class Range</th>
                  <th>Category</th>
                  <th>Examples</th>
                </tr>
              </thead>
              <tbody>
                {niceClasses.map((row, i) => (
                  <tr key={i}>
                    <td>{row.range}</td>
                    <td>{row.category}</td>
                    <td>{row.examples}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default TmarkOverview;
