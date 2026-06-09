import React from "react";
import "../OPCOverview/OPCOverview.css";
import opcIllustration from "../../assets/whypvt-imp1.svg";

const OLWFOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={opcIllustration}
              alt="OLWF Registration illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Register for OLWF
            </h2>
            <p className="opc-intro-text">
              ODISHA LABOUR WELFARE FUND (OLWF) Registration is a mandatory labour compliance for establishments in Odisha employing 5 or more workers, under the Odisha Labour Welfare Fund Act, 1996. The scheme is managed by the Odisha Labour Welfare Board under the State Labour Department. Under this registration, both the employer and employees contribute a small half-yearly amount towards the Labour Welfare Fund. In return, workers and their families may become eligible for various welfare benefits offered by the Board, such as educational assistance, medical support, welfare schemes, recreational facilities, and other employee welfare initiatives.
              <br /><br />
              Apart from statutory compliance, OLWF Registration reflects responsible employment practices and helps establishments avoid penalties, notices, or compliance issues arising from non-registration or delayed contributions. The contribution amount is nominal, but the long-term welfare benefits for employees can be significant.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">OLWF vs ESIC vs EPF: The Deep Dive</h2>
          <p className="opc-compare-subtitle">
            Four worker-related contributions employers in Odisha often deal with. They serve different purposes and are NOT substitutes for each other:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>OLWF (Odisha)</th>
                  <th>ESIC (Central)</th>
                  <th>EPF (Central)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Governing Act</td>
                  <td>Odisha LWF Act 1996</td>
                  <td>ESI Act 1948</td>
                  <td>EPF &amp; MP Act 1952</td>
                </tr>
                <tr>
                  <td>Administered By</td>
                  <td>Odisha Labour Welfare Board</td>
                  <td>ESIC</td>
                  <td>EPFO</td>
                </tr>
                <tr>
                  <td>Mandatory Trigger</td>
                  <td>5+ workers in Odisha</td>
                  <td>10+ employees (notified area)</td>
                  <td>20+ employees</td>
                </tr>
                <tr>
                  <td>Wage Threshold</td>
                  <td>All workers covered</td>
                  <td>Gross wages &lt;= Rs.21K</td>
                  <td>Basic + DA &lt;= Rs.15K mandatory</td>
                </tr>
                <tr>
                  <td>Frequency</td>
                  <td>Half-yearly</td>
                  <td>Monthly</td>
                  <td>Monthly</td>
                </tr>
                <tr>
                  <td>Contribution Amount</td>
                  <td>Nominal per-worker</td>
                  <td>0.75% + 3.25% of gross wages</td>
                  <td>12% + 12.5% of basic + DA</td>
                </tr>
                <tr>
                  <td>Geographic Coverage</td>
                  <td>Odisha only</td>
                  <td>Pan-India (notified areas)</td>
                  <td>Pan-India</td>
                </tr>
                <tr>
                  <td>Worker Benefits</td>
                  <td>Scholarship / medical / housing / funeral</td>
                  <td>Medical + sickness + maternity etc.</td>
                  <td>Retirement provident fund + pension</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default OLWFOverview;
