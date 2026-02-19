import React from "react";
import DissolvePrivateBreadcrum from "../../Components/DissolvePrivateBreadcrum/DissolvePrivateBreadcrum";
import DissolvePrivatePlanAndPricing from "../../Components/DissolvePrivatePlanAndPricing/DissolvePrivatePlanAndPricing";
import DissolvePrivateTermsCondition from "../../Components/DissolvePrivateTermsCondition/DissolvePrivateTermsCondition";
import DissolvePrivatePremium from "../../Components/DissolvePrivatePremium/DissolvePrivatePremium";
import DissolvePrivateTabs from "../../Components/DissolavePrivateTabs/DissolavePrivateTabs";
import DissolvePrivateCompanyTabs from "../../Components/DissolvePrivateCompanyTabs/DissolvePrivateCompanyTabs";
import DissolavePrivateTypesTabs from "../../Components/DissolvePrivatePvtTypes/DissolvePrivatePvtTypes";
import DissolvePrivateRequirementsTab from "../../Components/DissolvePrivateRequirementsTab/DissolvePrivateRequirementsTab";
import DissolvePrivateProcess from "../../Components/DissolvePrivateProcess/DissolvePrivateProcess";
import DissolvePrivateDocument from "../../Components/DissolvePrivateDocument/DissolvePrivateDocument";
import DissolvePrivateFAQ from "../../Components/DissolvePrivateFAQ/DissolvePrivateFAQ";
import DissolavePrivatesTestimonial from "../../Components/DissolvePrivateTestimonial/DissolvePrivateTestimonial";
import DissolveVideoTestimonial from "../../Components/DissolveVideoTestimonial/DissolveVideoTestimonial";
import DissolaveOurClients from "../../Components/DissolaveOurClients/DissolaveOurClients";


const DissolvePrivate = () => {
  return (
    <div>
      <DissolvePrivateBreadcrum />
      <div id="plans">
        <DissolvePrivatePlanAndPricing />
      </div>
      <DissolvePrivateTermsCondition />

      <div id="premium">
        <DissolvePrivatePremium />
      </div>

      <DissolvePrivateTabs />
      
      <div id="company">
        <DissolvePrivateCompanyTabs />
      </div>

      <div id="types">
        {/* <DissolavePrivateTypesTabs /> */}
      </div>

      <div id="requirements">
        <DissolvePrivateRequirementsTab />
      </div>
      <div id="process">
        {/* <DissolvePrivateProcess /> */}
      </div>

      <div id="documents">
        {/* <DissolvePrivateDocument/> */}
      </div>
      <div id="faq">
        <DissolvePrivateFAQ/>
      </div>
      <DissolavePrivatesTestimonial />
      <DissolveVideoTestimonial/>
      <DissolaveOurClients/>
      

    </div>
  );
};

export default DissolvePrivate;
