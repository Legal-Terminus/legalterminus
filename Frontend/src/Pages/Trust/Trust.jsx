import React from "react";
import TrustBreadcrum from "../../Components/TrustBreadcrum/TrustBreadcrum";
import TrustTabs from "../../Components/TrustTabs/TrustTabs";
import TrustPlanAndPricing from "../../Components/TrustPlanAndPricing/TrustPlanAndPricing";
import TrustTermsCondition from "../../Components/TrustTermsCondition/TrustTermsCondition";
import TrustPremium from "../../Components/TrustPremium/TrustPremium";
import TrustCompanyTabs from "../../Components/TrustCompanyTabs/TrustCompanyTabs";
import TrustPvtTypes from "../../Components/TrustPvtTypes/TrustPvtTypes";
import TrustRequirementsTab from "../../Components/TrustRequirementsTab/TrustRequirementsTab";
import TrustProcess from "../../Components/TrustProcess/TrustProcess";
import TrustFAQ from "../../Components/TrustFAQ/TrustFAQ";
import TrustTestimonial from "../../Components/TrustTestimonial/TrustTestimonial";
import TrustVideoTestimonial from "../../Components/TrustVideoTestimonial/TrustVideoTestimonial";
import TrustOurClients from "../../Components/TrustOurClients/TrustOurClients";
import TrustDocument from "../../Components/TrustDocument/TrustDocument";

const Trust = () => {
  return (
    <div>
      <TrustBreadcrum />
      <div id="plans">
        {/* <TrustPlanAndPricing /> */}
      </div>
      {/* <TrustTermsCondition /> */}

      <div id="premium">
        <TrustPremium />
      </div>

      <TrustTabs />
      <div id="company">
        <TrustCompanyTabs />
      </div>

      <div id="types">
        <TrustPvtTypes />
      </div>
      
      <div id="requirements">
        <TrustRequirementsTab />
      </div>
      <div id="process">
        {/* <TrustProcess /> */}
      </div>
      <div id="documents">
        {/* <TrustDocument /> */}
      </div>
      <div id="faq">
        <TrustFAQ />
      </div>
      <TrustTestimonial />
      <TrustVideoTestimonial />
      <TrustOurClients />
    </div>
  );
};

export default Trust;
