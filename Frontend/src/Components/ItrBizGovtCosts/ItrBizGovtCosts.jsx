import React from "react";
import "./ItrBizGovtCosts.css";

const TABLES = [
  {
    title: "FY 2025-26 Tax Rates - PROPRIETORSHIP FIRM (Slab Rates + Section 87A Rebate)",
    intro:
      "Proprietorship business income flows to the proprietor's PERSONAL income and is taxed at INDIVIDUAL SLAB RATES (same as salaried individuals). Section 87A rebate makes total income up to Rs.12 lakh effectively NIL TAX:",
    headers: ["Income Slab (FY 2025-26)", "New Regime (Default)", "Old Regime (Optional via Form 10-IEA)"],
    rows: [
      ["Up to Rs.2.5 lakh", "NIL", "NIL"],
      ["Rs.2.5-4 lakh", "NIL", "5%"],
      ["Rs.4-5 lakh", "5%", "5%"],
      ["Rs.5-8 lakh", "5%", "20%"],
      ["Rs.8-10 lakh", "10%", "20%"],
      ["Rs.10-12 lakh", "10%", "30%"],
      ["Rs.12-16 lakh", "15%", "30%"],
      ["Rs.16-20 lakh", "20%", "30%"],
      ["Above Rs.20 lakh", "25%-30% (progressive)", "30%"],
      ["Section 87A rebate", "Rs.60,000 (income up to Rs.12L = NIL tax)", "Rs.12,500 (income up to Rs.5L = NIL tax)"],
      ["Standard Deduction (if salary income also)", "Rs.75,000", "Rs.50,000"],
    ],
  },
  {
    title: "FY 2025-26 Tax Rates - PARTNERSHIP FIRM (Flat 30% + Surcharge + Cess)",
    intro:
      "Partnership Firm is a SEPARATE TAXABLE ENTITY under the Income Tax Act. It is taxed at a FLAT 30% rate (NOT slabs) regardless of income level. Section 87A rebate is NOT available for Partnership Firms. There is NO regime choice (always flat 30%):",
    headers: ["Tax Component", "Rate", "Applicability"],
    rows: [
      ["Base Income Tax", "FLAT 30%", "On taxable income (after Sec 40(b) deductions)"],
      ["Surcharge", "+ 12% of tax", "If TOTAL income EXCEEDS Rs.1 CRORE"],
      ["Health & Education Cess", "+ 4% of (tax + surcharge)", "Always applicable"],
      ["Effective Tax Rate (No surcharge)", "31.20%", "30% + 4% cess on 30%"],
      ["Effective Tax Rate (With surcharge)", "34.94%", "30% + 12% surcharge + 4% cess"],
      ["AMT (Section 115JC)", "18.50% of adjusted income", "If normal tax falls below 18.5%"],
      ["Section 87A Rebate", "NOT APPLICABLE", "Only for individuals - NOT firms"],
    ],
  },
  {
    title: "Partner Remuneration + Interest (Section 40(b) - Budget 2024 Amendment)",
    intro:
      "Working Partners' REMUNERATION is allowed as a deduction to the firm subject to limits (effective from FY 2025-26 / AY 2026-27 per Budget 2024):",
    headers: ["Book Profit Slab", "Maximum Allowable Remuneration", "Notes"],
    rows: [
      ["First Rs.6 LAKH of book profit", "Rs.3 LAKH OR 90% of book profit (whichever HIGHER)", "Budget 2024 DOUBLED first slab from Rs.3L to Rs.6L"],
      ["On balance book profit (above Rs.6L)", "60% of book profit", "Same as earlier"],
      ["Partner INTEREST on capital", "Up to 12% per annum (simple interest)", "Section 40(b)(iv) - allowed as deduction"],
      ["NEW Section 194T (FY 2025-26)", "10% TDS on partner payments > Rs.20,000/year", "Firm must deduct TDS on salary/interest/bonus to partners"],
    ],
  },
  {
    title: "Section 44AD Presumptive Scheme - Available for BOTH Proprietor + Partnership",
    headers: ["Section", "Applicable To", "Deemed Profit Rate"],
    rows: [
      ["Section 44AD", "PROPRIETOR (Indl / HUF) OR PARTNERSHIP FIRM (NOT LLP / Company); T/o up to Rs.2 Cr (Rs.3 Cr if digital > 95%)", "6% (digital) / 8% (cash)"],
      ["Section 44ADA", "Specified Profession (CA / doctor / lawyer); Gross receipts up to Rs.50 LAKH (proprietor only)", "50% of gross receipts"],
      ["Section 44AE", "Transport business (proprietor / firm) - up to 10 goods carriages", "Rs.7,500 per vehicle per month"],
      ["LOCK-IN", "Once opted, must continue for 5 YEARS minimum", "Opting out within 5 years triggers TAX AUDIT under Sec 44AB"],
    ],
  },
  {
    title: "Indicative Penalty + Interest Structure (Income Tax)",
    headers: ["Trigger", "Penalty / Interest", "Statutory Reference"],
    rows: [
      ["ITR filing itself", "NIL Govt fee", "Section 139"],
      ["Belated ITR (income > Rs.5L)", "Rs.5,000 penalty", "Section 234F"],
      ["Belated ITR (income up to Rs.5L)", "Rs.1,000 penalty", "Section 234F"],
      ["Tax unpaid past deadline", "1% per month / part-month", "Section 234A"],
      ["Advance tax shortfall (< 90%)", "1% per month on shortfall", "Section 234B"],
      ["Books not maintained (Section 44AA)", "Rs.25,000 penalty", "Section 271A"],
      ["Section 194T TDS default (Partnership)", "Disallowance under Section 40(a)(ia) + interest 234E", "FY 2025-26 onwards"],
    ],
  },
];

const ItrBizGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        {TABLES.map((table, idx) => (
          <div className="itrbiz-table-block" key={idx}>
            <h2 className="opc-govtcosts-title">{table.title}</h2>
            {table.intro && (
              <p className="opc-govtcosts-subtitle itrbiz-table-intro">{table.intro}</p>
            )}

            <div className="opc-govtcosts-table-wrapper">
              <table className="opc-govtcosts-table">
                <thead>
                  <tr>
                    {table.headers.map((head, i) => (
                      <th key={i}>{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, r) => (
                    <tr key={r}>
                      {row.map((cell, c) => (
                        <td key={c}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ItrBizGovtCosts;
