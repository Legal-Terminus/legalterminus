import React from "react";
import "./PublicltdOverview.css";

// Replace with your actual illustration
import pvtIllustration from "../../assets/whypvt-imp.svg";

const PvtLtdFull = () => {
  return (
    <div className="pvt-full-wrapper">

      {/* ===========================
          SECTION 1 — OVERVIEW
      ============================ */}
      {/* <div className="overview-wrapper">
        <h2 className="overview-title">Understanding the Basics
</h2>
        <p className="overview-text">
A Private Limited Company is a legally registered business under the Companies Act, 2013, with its own separate identity from its owners. It protects the personal assets of its members, limits who can own shares, and must have a registered office address. </p>
      </div> */}

      {/* ===========================
          SECTION 2 — INTRO
      ============================ */}
      <section className="pvt-intro-section">
        <div className="pvt-intro-container">
          {/* Illustration */}
          <div className="pvt-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="pvt-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="pvt-intro-content">
            <h2 className="pvt-intro-title">
              Why Choose Public Limited Company Registration in India
            </h2>
            <p className="pvt-intro-text">
              A Public Limited Company (PLC) is the only Indian corporate structure that can actually go public — list on the NSE / BSE, run an IPO, raise from the broader investing public. Even before you list, the PLC structure signals scale to institutional investors, foreign banks, and global procurement teams. Where a Private Limited caps you at 200 shareholders, a PLC has no upper limit, and where a Pvt Ltd locks share transfers, a PLC keeps them free-flowing.
              <br /><br />
              The flip side: 7 subscribers minimum, 3 directors minimum, heavier disclosure under the Companies Act, 2013, and SEBI overlay if and when you list. For founders who genuinely intend to scale, list, or attract institutional capital — PLC is the right starting structure rather than retrofitting later.
            </p>
          </div>
        </div>
      </section>


      {/* ===========================
          SECTION 4 — LISTED vs UNLISTED
      ============================ */}
      <section className="pub-compare-section">
        <div className="pub-compare-container">
          <h2 className="pub-compare-title">Listed vs Unlisted PLC: The Deep Dive</h2>
          <p className="pub-compare-subtitle">
            Every PLC is either Listed (shares trade on NSE / BSE / a SEBI-recognised exchange) or Unlisted (shares exist but aren't on any exchange). Most PLCs start unlisted and move to listed via an IPO once they hit SEBI's eligibility thresholds. The compliance load is dramatically different between the two.
          </p>
          <div className="pub-compare-table-wrapper">
            <table className="pub-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Unlisted PLC</th>
                  <th>Listed PLC</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Minimum Subscribers</td>
                  <td>7</td>
                  <td>7</td>
                </tr>
                <tr>
                  <td>Minimum Directors</td>
                  <td>3</td>
                  <td>6 (incl. ½ Independent)</td>
                </tr>
                <tr>
                  <td>Regulator</td>
                  <td>MCA / RoC</td>
                  <td>MCA + SEBI + Stock Exchange</td>
                </tr>
                <tr>
                  <td>Disclosure</td>
                  <td>Annual filings (MGT-7, AOC-4)</td>
                  <td>Quarterly + half-yearly + event-based</td>
                </tr>
                <tr>
                  <td>Share Liquidity</td>
                  <td>Private placement / NBFC routes</td>
                  <td>Open market trading</td>
                </tr>
                <tr>
                  <td>Capital Raise</td>
                  <td>Up to 200 in private placement</td>
                  <td>Public issue + rights + QIP</td>
                </tr>
                <tr>
                  <td>Audit Committee</td>
                  <td>If paid-up cap ≥ ₹10 cr</td>
                  <td>Mandatory</td>
                </tr>
                <tr>
                  <td>Annual Compliance Cost</td>
                  <td>₹1.5L – ₹4L</td>
                  <td>₹15L – ₹50L+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PvtLtdFull;
