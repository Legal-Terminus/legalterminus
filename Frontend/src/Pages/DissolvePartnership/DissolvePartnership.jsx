import React from "react";
import DPBreadcrum from "../../Components/DPBreadcrum/DPBreadcrum";
import DPPlanAndPricing from "../../Components/DPPlanAndPricing/DPPlanAndPricing";
import DPTermsCondition from "../../Components/DPTermsCondition/DPTermsCondition";
import DPPremium from "../../Components/DPPremium/DPPremium";
import DPTabs from "../../Components/DPTabs/DPTabs";
import DPCompanyTabs from "../../Components/DPCompanyTabs/DPCompanyTabs";
import DPPvtTypes from "../../Components/DPPvtTypes/DPPvtTypes";
import DPRequirementsTab from "../../Components/DPRequirementsTab/DPRequirementsTab";
import DPDocument from "../../Components/DPDocument/DPDocument";
import DPFAQ from "../../Components/DPFAQ/DPFAQ";
import DPTestimonial from "../../Components/DPTestimonial/DPTestimonial";
import DPVideoTestimonial from "../../Components/DPVideoTestimonial/DPVideoTestimonial";
import DPOurClients from "../../Components/DPOurClients/DPOurClients";
import DPProcess from "../../Components/DPProcess/DPProcess";

const DissolvePartnership = () => {
  return (
    <div>

      <DPBreadcrum />

      <div id="plans">
        {/* <DPPlanAndPricing /> */}
      </div>
      {/* <DPTermsCondition /> */}
      <div id="premium">
        <DPPremium />
      </div>

      <DPTabs />

      <div id="company">
        <DPCompanyTabs />
      </div>

      <div id="types">
        {/* <DPPvtTypes /> */}
      </div>

      <div id="requirements">
        <DPRequirementsTab />
      </div>

      <div id="process">
        {/* <DPProcess /> */}
      </div>

      <div id="documents">
        {/* <DPDocument /> */}
      </div>

      <div id="faq">
        <DPFAQ />
      </div>
      
      <DPTestimonial/>
      <DPVideoTestimonial/>
      <DPOurClients/>
    </div>
  );
};

export default DissolvePartnership;
