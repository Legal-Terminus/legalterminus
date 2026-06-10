import React from "react";
import "./BCGovtCosts.css";

const rows = [
  { turnover: "Up to Rs.5 Cr",        c100: "Rs.48,135",   c1000: "Rs.52,560",  c10000: "Rs.59,050",  c100000: "Rs.69,375"  },
  { turnover: "Above Rs.5 – 10 Cr",   c100: "Rs.50,802",   c1000: "Rs.55,321",  c10000: "Rs.62,301",  c100000: "Rs.72,526"  },
  { turnover: "Above Rs.10 – 25 Cr",  c100: "Rs.53,947",   c1000: "Rs.58,475",  c10000: "Rs.65,459",  c100000: "Rs.75,688"  },
  { turnover: "Above Rs.25 – 50 Cr",  c100: "Rs.57,091",   c1000: "Rs.61,628",  c10000: "Rs.68,617",  c100000: "Rs.78,850"  },
  { turnover: "Above Rs.50 – 100 Cr", c100: "Rs.60,236",   c1000: "Rs.64,782",  c10000: "Rs.71,775",  c100000: "Rs.82,013"  },
  { turnover: "Above Rs.100 – 250 Cr",c100: "Rs.65,540",   c1000: "Rs.70,113",  c10000: "Rs.77,709",  c100000: "Rs.87,960"  },
  { turnover: "Above Rs.250 – 500 Cr",c100: "Rs.68,879",   c1000: "Rs.73,470",  c10000: "Rs.81,075",  c100000: "Rs.91,335"  },
  { turnover: "Above Rs.500 – 750 Cr",c100: "Rs.74,579",   c1000: "Rs.79,777",  c10000: "Rs.88,571",  c100000: "Rs.1,00,020"},
  { turnover: "Above Rs.750 – 1000 Cr",c100:"Rs.77,918",   c1000: "Rs.83,134",  c10000: "Rs.91,937",  c100000: "Rs.1,03,394"},
  { turnover: "Above Rs.1000 Cr",     c100: "Rs.85,187",   c1000: "Rs.90,438",  c10000: "Rs.1,00,439",c100000: "Rs.1,11,914", isTotal: true },
];

const BCGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          GS1 India – Indicative Total Fees (1-Year Tenure, At Actuals)
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Per GS1 India GCP Fee Structure effective 1 October 2025. Total = Registration Fee + Annual Subscription Fee + 18% GST + Rs.3,000 refundable Security Deposit. Multi-year tenures (2/3/5/10 years) cost less per year.
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>Annual Turnover</th>
                <th>100 GTINs – 1 Yr</th>
                <th>1,000 GTINs – 1 Yr</th>
                <th>10,000 GTINs – 1 Yr</th>
                <th>1,00,000 GTINs – 1 Yr</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={row.isTotal ? "opc-govtcosts-total-row" : ""}>
                  <td>{row.turnover}</td>
                  <td className="opc-govtcosts-range">{row.c100}</td>
                  <td className="opc-govtcosts-range">{row.c1000}</td>
                  <td className="opc-govtcosts-range">{row.c10000}</td>
                  <td className="opc-govtcosts-range">{row.c100000}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default BCGovtCosts;
