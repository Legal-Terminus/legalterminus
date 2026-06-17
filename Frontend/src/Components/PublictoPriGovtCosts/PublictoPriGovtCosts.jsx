import React from "react";
import "../ProFOPCGovtCosts/ProFOPCGovtCosts.css";

const rows = [
  {
    head: "MCA Filing Fee - MGT-14",
    range: "Rs.200 - Rs.600",
    note: "Based on authorised share capital of the company",
  },
  {
    head: "Form RD-1 Application Fee",
    range: "Rs.5,000",
    note: "Application to the Regional Director for conversion",
  },
  {
    head: "INC-25A Newspaper Advertisement",
    range: "Rs.4,500 - Rs.18,000",
    note: "English + vernacular newspaper; rates vary by State + circulation",
  },
  {
    head: "Stamp Duty - Altered MOA + AOA",
    range: "Rs.500 - Rs.5,000",
    note: "State-based; payable on re-stamping the altered documents",
  },
  {
    head: "Form INC-28 (RD Order Filing)",
    range: "Rs.200 - Rs.600",
    note: "Filed within 15 days of receipt of the RD order",
  },
  {
    head: "Class 3 DSC (2-year)",
    range: "Rs.1,999 / person",
    note: "Required for authorised signatory / directors",
  },
  {
    head: "Certified True Copies + Notarisation",
    range: "Rs.500 - Rs.2,000",
    note: "Affidavits, declarations and attested resolutions",
  },
  {
    head: "Updated PAN / Company Master Data",
    range: "Rs.0 - Rs.110",
    note: "Issued on conversion; nominal correction fee if any",
  },
  {
    head: "RD Hearing / Objection Handling",
    range: "Billed at Actuals",
    note: "Only if creditors / regulators raise objections",
  },
  {
    head: "CS / CA Certification",
    range: "Included",
    note: "Professional certification is part of our fee",
  },
];

const PublictoPriGovtCosts = () => {
  return (
    <section className="profopc-govtcosts-section">
      <div className="profopc-govtcosts-container">
        <h2 className="profopc-govtcosts-title">
          Indicative Government & Out-of-Pocket Costs
          <span className="profopc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="profopc-govtcosts-subtitle">
          Per current MCA tariff + Section 14 conversion rules + State Stamp Duty schedules:
        </p>

        <div className="profopc-govtcosts-table-wrapper">
          <table className="profopc-govtcosts-table">
            <thead>
              <tr>
                <th>Cost Head</th>
                <th>Typical Range</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>{row.head}</td>
                  <td className="profopc-govtcosts-range">{row.range}</td>
                  <td>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PublictoPriGovtCosts;
