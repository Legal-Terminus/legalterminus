import React from 'react'
import PartnershipLLPBreadcrum from '../../Components/PartnershipLLPBreadcrum/PartnershipLLPBreadcrum'
import PartnershipLLPPlanandPricing from '../../Components/PartnershipLLPPlanandPricing/PartnershipLLPPlanandPricing'
import PartnershipLLPTandC from '../../Components/PartnershipLLPTandC/PartnershipLLPTandC'
import PartnershipLLPZolvitPremium from '../../Components/PartnershipLLPZolvitPremium/PartnershipLLPZolvitPremium'
import PartnershipLLPTabs from '../../Components/PartnershipLLPTabs/PartnershipLLPTabs'
import PartnershipLLPCompanyTab from '../../Components/PartnershipLLPCompanyTab/PartnershipLLPCompanyTab'
import PartnershipLLPTypes from '../../Components/PartnershipLLPTypes/PartnershipLLPTypes'
import PartnershipLLPRequirementsTab from '../../Components/PartnershipLLPRequirementsTab/PartnershipLLPRequirementsTab'
import PartnershipLLPProcess from '../../Components/PartnershipLLPProcess/PartnershipLLPProcess'
import PartnershipLLPDocument from '../../Components/PartnershipLLPDocument/PartnershipLLPDocument'
import PartnershipLLPFAQ from '../../Components/PartnershipLLPFAQ/PartnershipLLPFAQ'
import PartnershipLLPTestimonial from '../../Components/PartnershipLLPTestimonial/PartnershipLLPTestimonial'
import PartnershipLLPVideoTestimonial from '../../Components/PartnershipLLPVideoTestimonial/PartnershipLLPVideoTestimonial'
import PartnershipLLPOurclints from '../../Components/PartnershipLLPOurclints/PartnershipLLPOurclints'

const PartnershipLLP = () => {
  return (
    <div>
        <PartnershipLLPBreadcrum/>

        <div id="plans">
            {/* <PartnershipLLPPlanandPricing/> */}
        </div>

        {/* <PartnershipLLPTandC/> */}

        <div id="premium">
        <PartnershipLLPZolvitPremium/>
        </div>

        <PartnershipLLPTabs/>
      
        <div id="company">
            <PartnershipLLPCompanyTab/>
        </div>

        <div id="types">
        <PartnershipLLPTypes/>
        </div>

        <div id="requirements">
            <PartnershipLLPRequirementsTab/>
        </div>

        <div id="process">
            {/* <PartnershipLLPProcess/> */}
        </div>

        <div id="documents">
            {/* <PartnershipLLPDocument/> */}
        </div>

        <div id="faq">
            <PartnershipLLPFAQ/>
        </div>

        <PartnershipLLPTestimonial/>
        <PartnershipLLPVideoTestimonial/>
        <PartnershipLLPOurclints/>
    </div>
  )
}

export default PartnershipLLP
