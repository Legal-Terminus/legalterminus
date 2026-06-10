import React from "react";
import "./TradeLicenseArchitecture.css";

const rows = [
  {
    element: "Issuing Authority",
    how: "Municipal Corporation / Council / Nagar Palika of the city",
    notes: "City-specific (MCD / BMC / BBMP / GCC / GHMC / KMC etc.)",
  },
  {
    element: "Statutory Basis",
    how: "State Municipal Act + Corporation bye-laws",
    notes: "Varies by State / City",
  },
  {
    element: "Categorisation",
    how: "General / Industrial / Food / Hazardous / Hospitality / Service",
    notes: "Each category has its own fee + inspection regime",
  },
  {
    element: "Application Mode",
    how: "Online via Corporation portal (most metros) / Offline counter for smaller ULBs",
    notes: "Metros are now fully online",
  },
  {
    element: "Fee Structure",
    how: "Annual fee by category + premises area + zone",
    notes: "Rs.500 to Rs.50,000+ per year",
  },
  {
    element: "Validity",
    how: "Typically 1 financial year (1 Apr – 31 Mar)",
    notes: "Some cities: anniversary-based",
  },
  {
    element: "Renewal Window",
    how: "Before 31 March (most cities) OR 30 days before expiry",
    notes: "Late = penalty + per-day surcharge",
  },
  {
    element: "Inspection",
    how: "Mandatory for food / industrial / hazardous / hospitality categories",
    notes: "Risk-based for general trade in many cities",
  },
];

const TradeLicenseArchitecture = () => {
  return (
    <section className="trade-arch-section">
      <div className="trade-arch-container">
        <h2 className="trade-arch-title">
          Municipal Trade License Architecture: The Deep Dive
        </h2>
        <p className="trade-arch-subtitle">
          Each State Municipal Act delegates licensing power to the Corporation, which then publishes its own trade-category taxonomy + fee schedule. Here&apos;s the architecture:
        </p>

        <div className="trade-arch-table-wrapper">
          <table className="trade-arch-table">
            <thead>
              <tr>
                <th>Element</th>
                <th>How It Works</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="trade-arch-element">{row.element}</td>
                  <td>{row.how}</td>
                  <td>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default TradeLicenseArchitecture;
