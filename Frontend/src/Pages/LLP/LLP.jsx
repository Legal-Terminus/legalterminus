import React from "react";
import LLPBreadcrum from "../../Components/LLPBreadcrum/LLPBreadcrum.jsx";
import LLPPlanandPrice from "../../Components/LLPPlanandPrice/LLPPlanandPrice";
import LLPTermandCondn from "../../Components/LLPTermandCondn/LLPTermandCondn";
import LLPZolvitPremium from "../../Components/LLPZolvitPremium/LLPZolvitPremium";
import LLPTabs from "../../Components/LLPTabs/LLPTabs";
import LLPCompanyTab from "../../Components/LLPCompanyTab/LLPCompanyTab";
import LLPTypes from "../../Components/LLPTypes/LLPTypes";
import LLPRequirementsTab from "../../Components/LLPRequirementsTab/LLPRequirementsTab";
import LLPProcess from "../../Components/LLPProcess/LLPProcess";
import LLPDocInfographic from "../../Components/LLPDocInfographic/LLPDocInfographic";
import LLPFAQ from "../../Components/LLPFAQ/LLPFAQ";

function LLP() {
  return (
    <div>
      {/* Breadcrumb */}
      <LLPBreadcrum />

      {/* Plans */}
      <div id="plans">
        <LLPPlanandPrice />
      </div>

      {/* Terms & Conditions */}
      <LLPTermandCondn />

      {/* Premium */}
      <div id="premium">
        <LLPZolvitPremium />
      </div>

      {/* Tabs */}
      <LLPTabs />

      {/* Company */}
      <div id="company">
        <LLPCompanyTab />
      </div>

      {/* Types */}
      <div id="types">
        {/* <LLPTypes /> */}
      </div>

      {/* Requirements */}
      <div id="requirements">
        <LLPRequirementsTab />
      </div>

      {/* Process */}
      <div id="process">
        <LLPProcess />
      </div>

      {/* Documents */}
      <div id="documents">
        <LLPDocInfographic />
      </div>

      {/* FAQ */}
      <div id="faq">
        <LLPFAQ />
      </div>

    </div>
  );
}

export default LLP;
