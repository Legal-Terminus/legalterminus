import React from 'react'
import ChangeaddBreadcrum from '../../Components/ChangeaddComBreadcrum/ChangeaddComBreadcrum'
import ChangeaddComPlanandPricing from '../../Components/ChangeaddComPlanandPricing/ChangeaddComPlanandPricing'
import ChangeaddComZolvitPremium from '../../Components/ChangeaddComZolvitPremium/ChangeaddComZolvitPremium'
import ChangeaddComTabs from '../../Components/ChangeaddComTabs/ChangeaddComTabs'
import ChangeaddComCompanyTab from '../../Components/ChangeaddComCompanyTab/ChangeaddComCompanyTab'
import ChangeaddComTypes from '../../Components/ChangeaddComTypes/ChangeaddComTypes'
import ChangeaddComRequirementsTab from '../../Components/ChangeaddComRequirementsTab/ChangeaddComRequirementsTab'
import ChangeaddComProcess from '../../Components/ChangeaddComProcess/ChangeaddComProcess'

import ChangeaddComFAQ from '../../Components/ChangeaddComFAQ/ChangeaddComFAQ'
import ChangeaddComTermsCondition from '../../Components/ChangeaddComTermsCondition/ChangeaddComTermsCondition'
import ChangeaddComTestimonial from '../../Components/ChangeaddComTestimonial/ChangeaddComTestimonial'
import ChangeaddComVideoTestimonial from '../../Components/ChangeaddComVideoTestimonial/ChangeaddComVideoTestimonial'
import ChangeaddComOurclints from '../../Components/ChangeaddComOurclints/ChangeaddComOurclints'
import ChangeAddComInfographics from '../../Components/ChangeAddComInfographics/ChangeAddComInfographics'

const PrivateLimited = () => {
  return (
    <div>
      <ChangeaddBreadcrum />

      <div id="plans">
        <ChangeaddComPlanandPricing/>
      </div>

      <ChangeaddComTermsCondition/>


      <div id="premium">
        <ChangeaddComZolvitPremium />
      </div>

      <ChangeaddComTabs />

      <div id="company">
        <ChangeaddComCompanyTab/>
      </div>

      <div id="types">
        <ChangeaddComTypes />
      </div>

      <div id="requirements">
        <ChangeaddComRequirementsTab />
      </div>

      <div id="process">
        {/* <ChangeaddComProcess/> */}
      </div>

      <div id="documents">
      <ChangeAddComInfographics />
      </div>

      <div id="faq">
        <ChangeaddComFAQ />
      </div>

      <ChangeaddComTestimonial />
      <ChangeaddComVideoTestimonial />
      <ChangeaddComOurclints />
      
    </div>
  );
};

export default PrivateLimited