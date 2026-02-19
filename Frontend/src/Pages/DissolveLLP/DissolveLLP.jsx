import React from "react";
import DissolveLLPBreadcrum from "../../Components/DissolveLLPBreadcrum/DissolveLLPBreadcrum";
import DissolveLLPPlanAndPricing from "../../Components/DissolveLLPPlanAndPricing/DissolveLLPPlanAndPricing";
import DissolveLLPTermsCondition from "../../Components/DissolveLLPTermsCondition/DissolveLLPTermsCondition";
import DissolveLLPPremium from "../../Components/DissolveLLPPremium/DissolveLLPPremium";
import DissolveLLPTabs from "../../Components/DissolveLLPTabs/DissolveLLPTabs";
import DissolveLLPComapanyTabs from "../../Components/DissolveLLPComapanyTabs/DissolveLLPComapanyTabs";
import DissolveLLPRequiremwntsTab from "../../Components/DissolveLLPRequiremwntsTab/DissolveLLPRequiremwntsTab";
import DissolveLLPProcess from "../../Components/DissolveLLPProcess/DissolveLLPProcess";
import DissolveLLPDocuments from "../../Components/DissolveLLPDocuments/DissolveLLPDocuments";
import DissolveLLPFAQ from "../../Components/DissolveLLPFAQ/DissolveLLPFAQ";
import DissolveLLPTestimonial from "../../Components/DissolveLLPTestimonial/DissolveLLPTestimonial";
import DissolveLLPVideoTestimonial from "../../Components/DissolveLLPVideoTestimonial/DissolveLLPVideoTestimonial";
import DissolveLLPOurClients from "../../Components/DissolveLLPOurClients/DissolveLLPOurClients";
import DissolveLLPPvtTypes from "../../Components/DissolveLLPPvtTypes/DissolveLLPPvtTypes";

const DissolveLLP = () => {
  return (
    <div>
      <DissolveLLPBreadcrum />

      <div id="plans">
        <DissolveLLPPlanAndPricing />
      </div>
      <DissolveLLPTermsCondition />

      <div id="premium">
        <DissolveLLPPremium />
      </div>

      <DissolveLLPTabs />

      <div id="company">
        <DissolveLLPComapanyTabs />
      </div>

      <div id="types">
      {/* <DissolveLLPPvtTypes/> */}
      </div>

      <div id="requirements">
        <DissolveLLPRequiremwntsTab/>
      </div>

      <div id="process">
        {/* <DissolveLLPProcess/> */}
      </div>

      <div id="documents">
        {/* <DissolveLLPDocuments/> */}
      </div>

      <div id="faq">
        <DissolveLLPFAQ/>
      </div>
      <DissolveLLPTestimonial/>
      <DissolveLLPVideoTestimonial/>
      <DissolveLLPOurClients/>






    </div>
  );
};

export default DissolveLLP;
