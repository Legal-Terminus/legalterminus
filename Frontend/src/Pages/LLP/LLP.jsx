import React from "react";
import "./LLP.css";
import LLPBreadcrum from "../../Components/LLPBreadcrum/LLPBreadcrum.jsx";
import LLPPlanandPrice from "../../Components/LLPPlanandPrice/LLPPlanandPrice";
import LLPTermandCondn from "../../Components/LLPTermandCondn/LLPTermandCondn";
import LLPZolvitPremium from "../../Components/LLPZolvitPremium/LLPZolvitPremium";
import LLPTabs from "../../Components/LLPTabs/LLPTabs";
import LLPCompanyTab from "../../Components/LLPCompanyTab/LLPCompanyTab";
import LLPRequirementsTab from "../../Components/LLPRequirementsTab/LLPRequirementsTab";
import LLPProcess from "../../Components/LLPProcess/LLPProcess";
import LLPDocInfographic from "../../Components/LLPDocInfographic/LLPDocInfographic";
import LLPFAQ from "../../Components/LLPFAQ/LLPFAQ";

function LLP() {
  return (
    <div>
      <div className="llp-page-hero">
        <LLPBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="llp-page-pricing">
        <LLPPlanandPrice />
      </div>

      <div className="section-divider" />

      <LLPTermandCondn />

      <div className="section-divider" />

      <div id="premium">
        <LLPZolvitPremium />
      </div>

      <LLPTabs />

      <div className="section-divider" />

      <div id="company">
        <LLPCompanyTab />
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <LLPRequirementsTab />
      </div>

      <div className="section-divider" />

      <div id="process">
        <LLPProcess />
      </div>

      <div className="section-divider" />

      <div id="documents">
        <LLPDocInfographic />
      </div>

      <div className="section-divider" />

      <div id="faq">
        <LLPFAQ />
      </div>
    </div>
  );
}

export default LLP;
