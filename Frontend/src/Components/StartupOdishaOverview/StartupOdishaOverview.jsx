import React from "react";
import "../PvtltdCompanyTab/PvtltdCompanyTab.css";
import pvtIllustration from "../../assets/whypvt-imp1.svg";

const StartupOdishaOverview = () => {
  return (
    <div className="pvt-full-wrapper">

      <section className="pvt-intro-section">
        <div className="pvt-intro-container">
          <div className="pvt-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Startup Odisha Registration illustration"
              className="pvt-intro-illustration"
            />
          </div>

          <div className="pvt-intro-content">
            <h2 className="pvt-intro-title">
              Why Register Under Startup Odisha
            </h2>
            <p className="pvt-intro-text">
              Startup Odisha, under the Odisha Startup Policy 2022, is one of India's most progressive state startup programmes. Unlike recognition-only schemes, Startup Odisha directly disburses capital subsidies to eligible startups — up to ₹50 lakhs depending on investment, sector, and employment generation. The state government also funds access to world-class incubation facilities at STPI Bhubaneswar, IIT Bhubaneswar's TBI, and KIIT-TBI, where subsidised office space, lab access, and mentorship are available.
            </p>
            <p className="pvt-intro-text">
              Beyond funding, Startup Odisha gives your business a state-government endorsement that opens doors to procurement, partnerships, and investors in Odisha's rapidly growing industrial ecosystem. The scheme is especially valuable for startups in sectors like technology, agri-tech, health-tech, manufacturing, and clean energy — sectors that Odisha's government is actively developing. If your startup is based in or plans to operate in Odisha, this is a non-negotiable registration.
            </p>
          </div>
        </div>
      </section>

      <section className="pvt-compare-section">
        <div className="pvt-compare-container">
          <h2 className="pvt-compare-title">Startup Odisha vs. DPIIT (Startup India): How They Compare</h2>
          <p className="pvt-compare-subtitle">
            Both recognitions are complementary — here's what each uniquely delivers:
          </p>
          <div className="pvt-compare-table-wrapper">
            <table className="pvt-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Startup Odisha</th>
                  <th>DPIIT (Startup India)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Issuing Authority</td>
                  <td>Government of Odisha</td>
                  <td>Government of India (DPIIT)</td>
                </tr>
                <tr>
                  <td>Capital Subsidy</td>
                  <td>Up to ₹50 lakhs (direct disbursement)</td>
                  <td>No direct subsidy — access to FoF &amp; SISFS</td>
                </tr>
                <tr>
                  <td>Income Tax Benefit</td>
                  <td>State-level tax incentives (sector-specific)</td>
                  <td>3-year 80-IAC holiday (IMB approval needed)</td>
                </tr>
                <tr>
                  <td>Angel Tax Relief</td>
                  <td>No direct angel tax relief</td>
                  <td>Full exemption via Form 2</td>
                </tr>
                <tr>
                  <td>Office / Incubation</td>
                  <td>Subsidised space at STPI, KIIT-TBI, IIT TBI</td>
                  <td>Not directly — SIDBI-funded incubators</td>
                </tr>
                <tr>
                  <td>Mentorship</td>
                  <td>Structured mentor network via Startup Odisha</td>
                  <td>General mentor connect via MAARG portal</td>
                </tr>
                <tr>
                  <td>Patent Benefit</td>
                  <td>No direct patent fee rebate</td>
                  <td>80% patent fee rebate + fast-track exam</td>
                </tr>
                <tr>
                  <td>Geographic Requirement</td>
                  <td>Entity must be registered in Odisha</td>
                  <td>Entity must be incorporated in India</td>
                </tr>
                <tr>
                  <td>Government Fee</td>
                  <td>Nil</td>
                  <td>Nil</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default StartupOdishaOverview;
