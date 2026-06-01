import React from "react";
import "./GSTRegTypes.css";

const types = [
  {
    number: "01",
    title: "Central GST (CGST)",
    text: "Applied on intra-state transactions — when goods or services are sold within the same state. Collected by the Central Government. CGST and SGST are charged simultaneously on every intra-state supply, each at half the applicable GST rate.",
  },
  {
    number: "02",
    title: "State GST (SGST)",
    text: "Also charged on intra-state sales alongside CGST, but this portion goes to the State Government. For example, a 18% GST on an intra-state sale means 9% CGST + 9% SGST. The state retains its share to fund local services.",
  },
  {
    number: "03",
    title: "Integrated GST (IGST)",
    text: "Applied on inter-state transactions — when goods or services cross state boundaries. Collected by the Central Government, which then distributes the state's share to the destination state. Enables seamless nationwide trade with clean ITC flow.",
  },
  {
    number: "04",
    title: "Union Territory GST (UTGST)",
    text: "Levied in Union Territories (Delhi, Chandigarh, Puducherry, etc.) instead of SGST. Works identically to SGST — collected alongside CGST on intra-UT supplies, with revenue retained by the Union Territory administration.",
  },
];

const GSTRegTypes = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of GST in India</h2>

        <div className="opc-features-cards">
          {types.map((type) => (
            <div className="opc-features-card" key={type.number}>
              <div className="opc-features-number">{type.number}</div>
              <h3 className="opc-features-card-title">{type.title}</h3>
              <p className="opc-features-card-text">{type.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default GSTRegTypes;
