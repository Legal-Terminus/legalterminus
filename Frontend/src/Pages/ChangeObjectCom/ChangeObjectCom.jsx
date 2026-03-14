import React from 'react'
import ChangeObjectComBreadcrum from '../../Components/ChangeObjectComBreadcrum/ChangeObjectComBreadcrum'
import ChangeObjectComPlanandPricing from '../../Components/ChangeObjectComPlanandPricing/ChangeObjectComPlanandPricing'
import ChangeObjectComZolvitPremium from '../../Components/ChangeObjectComZolvitPremium/ChangeObjectComZolvitPremium'
import ChangeObjectComTabs from '../../Components/ChangeObjectComTabs/ChangeObjectComTabs'
import ChangeObjectCompanyTab from '../../Components/ChangeObjectCompanyTab/ChangeObjectCompanyTab'
import ChangeObjectComTypes from '../../Components/ChangeObjectComTypes/ChangeObjectComTypes'
import ChangeObjectComRequirementsTab from '../../Components/ChangeObjectComRequirementsTab/ChangeObjectComRequirementsTab'
import ChangeObjectComProcess from '../../Components/ChangeObjectComProcess/ChangeObjectComProcess'
import PvtltdDocument from '../../Components/PvtltdDocument/PvtltdDocument'
import ChangeObjectComFAQ from '../../Components/ChangeObjectComFAQ/ChangeObjectComFAQ'
import ChangeObjectComTermsCondition from '../../Components/ChangeObjectComTermsCondition/ChangeObjectComTermsCondition'
import ChangeObjectComTestimonial from '../../Components/ChangeObjectComTestimonial/ChangeObjectComTestimonial'
import ChangeObjectComVideoTestimonial from '../../Components/ChangeObjectComVideoTestimonial/ChangeObjectComVideoTestimonial'
import ChangeObjectComOurclints from '../../Components/ChangeObjectComOurclints/ChangeObjectComOurclints'

const PrivateLimited = () => {
  return (
    <div>
      <ChangeObjectComBreadcrum />

      <div id="plans">
        <ChangeObjectComPlanandPricing />
      </div>

      <ChangeObjectComTermsCondition/>


      <div id="premium">
        <ChangeObjectComZolvitPremium />
      </div>

      <ChangeObjectComTabs />

      <div id="company">
        <ChangeObjectCompanyTab />
      </div>

      <div id="types">
        <ChangeObjectComTypes />
      </div>

      <div id="requirements">
        <ChangeObjectComRequirementsTab />
      </div>

      <div id="process">
        {/* <ChangeObjectComProcess /> */}
      </div>

      <div id="documents">
        {/* <PvtltdDocument /> */}
      </div>

      <div id="faq">
        <ChangeObjectComFAQ/>
      </div>

      <ChangeObjectComTestimonial />
      <ChangeObjectComVideoTestimonial />
      <ChangeObjectComOurclints />
      
    </div>
  );
};

export default PrivateLimited