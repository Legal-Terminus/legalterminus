import React from "react";
import "./ItrIndPlanInfo.css";

const slabRows = [
  { slab: "Up to ₹2.5 lakh", neww: "NIL", old: "NIL" },
  { slab: "₹2.5 lakh – ₹4 lakh", neww: "NIL", old: "5%" },
  { slab: "₹4 lakh – ₹5 lakh", neww: "5%", old: "5%" },
  { slab: "₹5 lakh – ₹8 lakh", neww: "5%", old: "20%" },
  { slab: "₹8 lakh – ₹10 lakh", neww: "10%", old: "20%" },
  { slab: "₹10 lakh – ₹12 lakh", neww: "10%", old: "30%" },
  { slab: "₹12 lakh – ₹16 lakh", neww: "15%", old: "30%" },
  { slab: "₹16 lakh – ₹20 lakh", neww: "20%", old: "30%" },
  { slab: "₹20 lakh – ₹24 lakh", neww: "25%", old: "30%" },
  { slab: "Above ₹24 lakh", neww: "30%", old: "30%" },
  {
    slab: "Section 87A rebate (resident individual)",
    neww: "₹60,000 (income up to ₹12L = NIL tax)",
    old: "₹12,500 (income up to ₹5L = NIL tax)",
    highlight: true,
  },
  {
    slab: "Standard Deduction (salaried / pensioners)",
    neww: "₹75,000",
    old: "₹50,000",
    highlight: true,
  },
];

const penaltyRows = [
  { trigger: "ITR filing itself", amount: "NIL Govt fee", ref: "Section 139" },
  { trigger: "Belated ITR (total income > ₹5 lakh)", amount: "₹5,000 penalty", ref: "Section 234F" },
  { trigger: "Belated ITR (total income up to ₹5 lakh)", amount: "₹1,000 penalty", ref: "Section 234F" },
  { trigger: "Tax unpaid past deadline", amount: "1% per month / part-month", ref: "Section 234A" },
  { trigger: "Advance tax shortfall (< 90% test)", amount: "1% per month on shortfall", ref: "Section 234B" },
  { trigger: "Updated return (ITR-U)", amount: "25% / 50% / 60% / 70% additional tax", ref: "Section 139(8A)" },
  { trigger: "Schedule FA non-disclosure", amount: "₹10 lakh + prosecution", ref: "Black Money Act 2015" },
];

const ItrIndPlanInfo = () => {
  return (
    <>
      {/* Plan Customization note */}
      <section className="itrind-plancustom-section">
        <div className="itrind-plancustom-box">
          <strong>Plan Customization (per client T&amp;C):</strong> If the above plans do not
          qualify your requirements — for example, you have business / profession income
          (separate Business ITR Filing service), Stock / trading line items more than 25,
          Arrear Salary, Section 8 / Trust ITR-7, or unique multi-jurisdiction structures —{" "}
          kindly contact our executive, we shall be happy to customize a plan
          for you.
        </div>
      </section>

      {/* FY 2025–26 New Tax Regime Slabs + Section 87A Rebate */}
      <section className="opc-govtcosts-section">
        <div className="opc-govtcosts-container">
          <h2 className="opc-govtcosts-title">
            FY 2025–26 New Tax Regime Slabs + Section 87A Rebate (Budget 2025)
          </h2>
          <p className="opc-govtcosts-subtitle itrind-table-note">
            Budget 2025 reset the New Tax Regime — the headline change: NIL tax up to ₹12 lakh
            income (₹12.75 lakh for salaried with ₹75,000 standard deduction) via Section 87A
            rebate of ₹60,000.
          </p>

          <div className="opc-govtcosts-table-wrapper">
            <table className="opc-govtcosts-table">
              <thead>
                <tr>
                  <th>Income Slab (FY 2025–26)</th>
                  <th>New Regime Tax Rate (Default)</th>
                  <th>Old Regime Tax Rate (Optional)</th>
                </tr>
              </thead>
              <tbody>
                {slabRows.map((row, i) => (
                  <tr key={i} className={row.highlight ? "opc-govtcosts-total-row" : ""}>
                    <td>{row.slab}</td>
                    <td className="itrind-rate">{row.neww}</td>
                    <td>{row.old}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Indicative Penalty + Interest Structure */}
      <section className="opc-govtcosts-section">
        <div className="opc-govtcosts-container">
          <h2 className="opc-govtcosts-title">Indicative Penalty + Interest Structure</h2>

          <div className="opc-govtcosts-table-wrapper">
            <table className="opc-govtcosts-table">
              <thead>
                <tr>
                  <th>Trigger</th>
                  <th>Penalty / Interest</th>
                  <th>Statutory Reference</th>
                </tr>
              </thead>
              <tbody>
                {penaltyRows.map((row, i) => (
                  <tr key={i}>
                    <td>{row.trigger}</td>
                    <td className="itrind-rate">{row.amount}</td>
                    <td>{row.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default ItrIndPlanInfo;
