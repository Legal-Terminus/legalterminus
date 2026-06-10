import React from "react";
import "./TradeLicenseMunicipalFees.css";

const rows = [
  { city: "Delhi (MCD / NDMC)", range: "Rs.500 – Rs.50,000", portal: "https://mcdonline.nic.in" },
  { city: "Mumbai (BMC / MCGM)", range: "Rs.250 – Rs.25,000", portal: "https://portal.mcgm.gov.in" },
  { city: "Bangalore (BBMP)", range: "Rs.500 – Rs.20,000", portal: "https://bbmp.gov.in" },
  { city: "Chennai (GCC)", range: "Rs.500 – Rs.15,000", portal: "https://chennaicorporation.gov.in" },
  { city: "Hyderabad (GHMC)", range: "Rs.500 – Rs.25,000", portal: "https://www.ghmc.gov.in" },
  { city: "Kolkata (KMC)", range: "Rs.500 – Rs.20,000", portal: "https://www.kmcgov.in" },
  { city: "Pune (PMC)", range: "Rs.500 – Rs.15,000", portal: "https://www.pmc.gov.in" },
  { city: "Ahmedabad (AMC)", range: "Rs.500 – Rs.15,000", portal: "https://ahmedabadcity.gov.in" },
  { city: "Bhubaneswar (BMC Odisha)", range: "Rs.500 – Rs.12,000", portal: "https://bmc.gov.in" },
  { city: "Other Municipal Councils / Nagar Palikas", range: "Rs.200 – Rs.10,000", portal: "State-specific ULB portals" },
];

const isLink = (value) => value.startsWith("http");

const TradeLicenseMunicipalFees = () => {
  return (
    <section className="trade-munifees-section">
      <div className="trade-munifees-container">
        <h2 className="trade-munifees-title">
          Indicative Municipal Fee Ranges
          <span className="trade-munifees-badge">Billed at Actuals</span>
        </h2>
        <p className="trade-munifees-subtitle">
          Trade License government fees are set by each Municipal Corporation / Urban Local Body and vary by business activity, premises size, and zone. Below are indicative ranges across major cities.
        </p>

        <div className="trade-munifees-table-wrapper">
          <table className="trade-munifees-table">
            <thead>
              <tr>
                <th>City / Corporation</th>
                <th>Annual Fee Range</th>
                <th>Official Portal</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>{row.city}</td>
                  <td className="trade-munifees-range">{row.range}</td>
                  <td>
                    {isLink(row.portal) ? (
                      <a
                        href={row.portal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="trade-munifees-portal"
                      >
                        {row.portal.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      row.portal
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default TradeLicenseMunicipalFees;
