import React from 'react'
import PartnershiptoPrivateBreadcrumb from '../../Components/PartnershiptoPrivateBreadcrumb/PartnershiptoPrivateBreadcrumb'
import PartnershiptoPrivatePlanandPricing from '../../Components/PartnershiptoPrivatePlanandPricing/PartnershiptoPrivatePlanandPricing'
import ParttoPriZolvitPremium from '../../Components/ParttoPriZolvitPremium/ParttoPriZolvitPremium'
import ParttoPriTabs from '../../Components/ParttoPriTabs/ParttoPriTabs'
import ParttoPriCompanyTab from '../../Components/ParttoPriCompanyTab/ParttoPriCompanyTab'
import ParttoPriPvtTypes from '../../Components/ParttoPriPvtTypes/ParttoPriPvtTypes'
import ParttoPriRequirementsTab from '../../Components/ParttoPriRequirementsTab/ParttoPriRequirementsTab'
import ParttoPriProcess from '../../Components/ParttoPriProcess/ParttoPriProcess'
import ParttoPriDocument from '../../Components/ParttoPriDocument/ParttoPriDocument'
import ParttoPriFAQ from '../../Components/ParttoPriFAQ/ParttoPriFAQ'
import ParttoPriTermsCondition from '../../Components/ParttoPriTermsCondition/ParttoPriTermsCondition'
import ParttoPriTestimonial from '../../Components/ParttoPriTestimonial/ParttoPriTestimonial'
import ParttoPriVideoTestimonial from '../../Components/ParttoPriVideoTestimonial/ParttoPriVideoTestimonial'
import ParttoPriOurclints from '../../Components/ParttoPriOurclints/ParttoPriOurclints'

const PrivateLimited = () => {
  return (
    <div>
      <PartnershiptoPrivateBreadcrumb />

      <div id="plans">
        {/* <PartnershiptoPrivatePlanandPricing/> */}
      </div>

      {/* <ParttoPriTermsCondition /> */}


      <div id="premium">
        <ParttoPriZolvitPremium />
      </div>

      <ParttoPriTabs />

      <div id="company">
        < ParttoPriCompanyTab/>
      </div>

      <div id="types">
        {/* <ParttoPriPvtTypes /> */}
      </div>

      <div id="requirements">
        <ParttoPriRequirementsTab />
      </div>

      <div id="process">
        {/* <ParttoPriProcess/> */}
      </div>

      <div id="documents">
        {/* <ParttoPriDocument /> */}
      </div>

      <div id="faq">
        <ParttoPriFAQ />
      </div>

      <ParttoPriTestimonial />
      <ParttoPriVideoTestimonial />
      <ParttoPriOurclints/>
    </div>
  );
};

export default PrivateLimited