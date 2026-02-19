import React from "react";
import SocietyBreadcrum from "../../Components/SocietyBreadcrum/SocietyBreadcrum";
import SocietyPlanAndPricing from "../../Components/SccietyPlanAndPricing/SccietyPlanAndPricing";
import SocietyTermsCondition from "../../Components/SocietyTermsCondition/SocietyTermsCondition";
import SocietyPremium from "../../Components/SocietyPremium/SocietyPremium";
import SocietyTabs from "../../Components/SocietyTabs/SocietyTabs";
import SocietyCompanyTabs from "../../Components/SocietyCompanyTabs/SocietyCompanyTabs";
import SocietyPvtTypes from "../../Components/SocietyPvtTypes/SocietyPvtTypes";
import SocietyRequirementsTab from "../../Components/SocietyRequirementsTab/SocietyRequirementsTab";
import SocietyProcess from "../../Components/SocietyProcess/SocietyProcess";
import SocietyFAQ from "../../Components/SocietyFAQ/SocietyFAQ";
import SocietyTestimonial from "../../Components/SocietyTestimonial/SocietyTestimonial";
import SocietyVideoTestimonial from "../../Components/SocietyVideoTestimonial/SocietyVideoTestimonial";
import SocietyOurClients from "../../Components/SocietyOurClients/SocietyOurClients";
import SocietyDocument from "../../Components/SocietyDocument/SocietyDocument";
const Society = () => {
  return (
    <div>
      <SocietyBreadcrum />

      <div id="plans">
        {/* <SocietyPlanAndPricing /> */}
      </div>
      {/* <SocietyTermsCondition /> */}

      <div id="premium">
        <SocietyPremium />
      </div>

      <SocietyTabs />

      <div id="company">
        <SocietyCompanyTabs />
      </div>

      <div id="types">
        <SocietyPvtTypes />
      </div>
      
      <div id="requirements">
        <SocietyRequirementsTab />
      </div>

      <div id="process">
        {/* <SocietyProcess /> */}
      </div>
      
      <div id="documents">
        {/* <SocietyDocument /> */}
      </div>
      <div id="faq">
        <SocietyFAQ />
      </div>
      <SocietyTestimonial />
      <SocietyVideoTestimonial />
      <SocietyOurClients />
    </div>
  );
};

export default Society;
