import React from "react";
import "./IECOverview.css";
import iecIllustration from "../../assets/whypvt-imp1.svg";

const IECOverview = () => {
  return (
    <div className="iec-full-wrapper">

      {/* ===========================
          SECTION 1 — INTRO
      ============================ */}
      <section className="iec-intro-section">
        <div className="iec-intro-container">
          {/* Illustration */}
          <div className="iec-intro-illustration-wrap">
            <img
              src={iecIllustration}
              alt="Import Export Code illustration"
              className="iec-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="iec-intro-content">
            <h2 className="iec-intro-title">
              Why Get an IEC
            </h2>
            <p className="iec-intro-text">
              Import Export Code (IEC) is the 10-digit alphanumeric code issued by the Directorate General of Foreign Trade (DGFT) under the Ministry of Commerce, governed by the Foreign Trade (Development &amp; Regulation) Act, 1992. It's the foundational compliance for ANY cross-border trade out of or into India - goods exports, goods imports, service exports billed in foreign currency, and software / technology transfers. Without IEC, banks cannot process your foreign exchange receipts, customs cannot clear your shipments, and DGFT cannot extend any export incentive to you.
            </p>
            <p className="iec-intro-text">
              Since the 1 July 2017 DGFT reform, IEC is PAN-based - your 10-digit IEC number IS your 10-character PAN. One PAN can have only one IEC. The 1-2 day online issuance + lifetime validity + free annual update (in April-June window) makes IEC one of the easiest mandatory registrations in India - provided you actually keep up with the annual update. Missed updates = IEC deactivated = export operations frozen until reactivated.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default IECOverview;
