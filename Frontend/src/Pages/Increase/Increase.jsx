import React from 'react'
import IncreaseBreadcrum from '../../Components/IncreaseBreadcrum/IncreaseBreadcrum'
import IncreasePlanandPricing from '../../Components/IncreasePlanandPricing/IncreasePlanandPricing'
import IncreaseZolvitPremium from '../../Components/IncreaseZolvitPremium/IncreaseZolvitPremium'
import IncreaseTabs from '../../Components/IncreaseTabs/IncreaseTabs'
import IncreaseCompanyTab from '../../Components/IncreaseCompanyTab/IncreaseCompanyTab'
import IncreaseTypes from '../../Components/IncreaseTypes/IncreaseTypes'
import IncreaseRequirementsTab from '../../Components/IncreaseRequirementsTab/IncreaseRequirementsTab'
import IncreaseProcess from '../../Components/IncreaseProcess/IncreaseProcess'
import PvtltdDocument from '../../Components/PvtltdDocument/PvtltdDocument'
import IncreaseFAQ from '../../Components/IncreaseFAQ/IncreaseFAQ'
import IncreaseTermsCondition from '../../Components/IncreaseTermsCondition/IncreaseTermsCondition'
import IncreaseTestimonial from '../../Components/IncreaseTestimonial/IncreaseTestimonial'
import IncreaseVideoTestimonial from '../../Components/IncreaseVideoTestimonial/IncreaseVideoTestimonial'
import IncreaseOurclints from '../../Components/IncreaseOurclints/IncreaseOurclints'

const PrivateLimited = () => {
  return (
    <div>
      <IncreaseBreadcrum/>

      <div id="plans">
        <IncreasePlanandPricing/>
      </div>

      <IncreaseTermsCondition />


      <div id="premium">
        <IncreaseZolvitPremium />
      </div>

      <IncreaseTabs />

      <div id="company">
        <IncreaseCompanyTab />
      </div>

      <div id="types">
        <IncreaseTypes/>
      </div>

      <div id="requirements">
        <IncreaseRequirementsTab/>
      </div>

      <div id="process">
        {/* <IncreaseProcess /> */}
      </div>

      <div id="documents">
        {/* <PvtltdDocument /> */}
      </div>

      <div id="faq">
        <IncreaseFAQ/>
      </div>

      <IncreaseTestimonial/>
      <IncreaseVideoTestimonial />
      <IncreaseOurclints/>
      
    </div>
  );
};

export default PrivateLimited