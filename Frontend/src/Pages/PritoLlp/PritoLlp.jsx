import React from 'react'
import PritoLlpBreadcrum from '../../Components/PritoLlpBreadcrum/PritoLlpBreadcrum'
import PritoLlpPlanandPricing from '../../Components/PritoLlpPlanandPricing/PritoLlpPlanandPricing'
import PritoLlpZolvitPremium from '../../Components/PritoLlpZolvitPremium/PritoLlpZolvitPremium'
import PritoLlpTabs from '../../Components/PritopLlpTabs/PritopLlpTabs'
import PritoLlpCompanyTab from '../../Components/PritoLlpCompanyTab/PritoLlpCompanyTab'
import PritoLlpTypes from '../../Components/PritoLlpTypes/PritoLlpTypes'
import PritoLlpRequirementsTab from '../../Components/PritoLlpRequirementsTab/PritoLlpRequirementsTab'
import PritoLlpProcess from '../../Components/PritoLlpProcess/PritoLlpProcess'
import PritoLlpDocument from '../../Components/PritoLlpDocument/PritoLlpDocument'
import PritoLlpFAQ from '../../Components/PritoLlpFAQ/PritoLlpFAQ'
import PritoLlpTermsCondition from '../../Components/PritoLlpTermsCondition/PritoLlpTermsCondition'
import PritoLlpTestimonial from '../../Components/PritoLlpTestimonial/PritoLlpTestimonial'
import PritoLlpVideoTestimonial from '../../Components/PritoLlpVideoTestimonial/PritoLlpVideoTestimonial'
import PritoLlpOurclints from '../../Components/PritoLlpOurclints/PritoLlpOurclints'

const PrivateLimited = () => {
  return (
    <div>
      <PritoLlpBreadcrum />

      <div id="plans">
        {/* <PritoLlpPlanandPricing /> */}
      </div>

      {/* <PritoLlpTermsCondition/> */}


      <div id="premium">
        <PritoLlpZolvitPremium />
      </div>

      <PritoLlpTabs/>

      <div id="company">
        <PritoLlpCompanyTab />
      </div>

      <div id="types">
        {/* <PritoLlpTypes /> */}
      </div>

      <div id="requirements">
        <PritoLlpRequirementsTab/>
      </div>

      <div id="process">
        {/* <PritoLlpProcess /> */}
      </div>

      <div id="documents">
        {/* <PritoLlpDocument /> */}
      </div>

      <div id="faq">
        <PritoLlpFAQ />
      </div>

      <PritoLlpTestimonial />
      <PritoLlpVideoTestimonial />
      <PritoLlpOurclints />
    </div>
  );
};

export default PrivateLimited