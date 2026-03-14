import React from 'react'
import ProFPLCBreadcrum from '../../Components/ProFOPCBreadcrum/ProFOPCBreadcrum'
import ProFPLCPlanandPricing from '../../Components/ProFPLCPlanandPricing/ProFPLCPlanandPricing'
import ProFPLCCondition from '../../Components/ProFPLCCondition/ProFPLCCondition'
import ProFPLCZolvitPremium from '../../Components/ProFPLCZolvitPremium/ProFPLCZolvitPremium'
import ProFPLCTabs from '../../Components/ProFPLCTabs/ProFPLCTabs'
import ProFPLCCompanyTab from '../../Components/ProFPLCCompanyTab/ProFPLCCompanyTab'
import ProFPLCTypes from '../../Components/ProFPLCTypes/ProFPLCTypes'
import ProFPLCRequirementsTab from '../../Components/ProFPLCRequirementsTab/ProFPLCRequirementsTab'
import ProFPLCProcess from '../../Components/ProFPLCProcess/ProFPLCProcess'
import ProFPLCDocument from '../../Components/ProFPLCDocument/ProFPLCDocument'
import ProFPLCFAQ from '../../Components/ProFPLCFAQ/ProFPLCFAQ'
import ProFPLCTestimonial from '../../Components/ProFPLCTestimonial/ProFPLCTestimonial'
import ProFPLCVideoTestimonial from '../../Components/ProFPLCVideoTestimonial/ProFPLCVideoTestimonial'
import ProFPLCOurclints from '../../Components/ProFPLCOurclints/ProFPLCOurclints'

const ProprietorshipPLC = () => {
  return (
    <div>
        <ProFPLCBreadcrum/>

        <div id="plans">
        <ProFPLCPlanandPricing/> 
      </div>

       <ProFPLCCondition/> 

      <div id="premium">
        <ProFPLCZolvitPremium />
      </div>

       <ProFPLCTabs/>

       <div id="company">
        <ProFPLCCompanyTab />
      </div>

       <div id="types">
         <ProFPLCTypes /> 
      </div>

      <div id="requirements">
        <ProFPLCRequirementsTab/>
      </div>

      <div id="process">
         <ProFPLCProcess/> 
        </div>

      <div id="documents">
         <ProFPLCDocument/> 
      </div>

      <div id="faq">
              <ProFPLCFAQ/>
            </div>
        
        <ProFPLCTestimonial/>
        <ProFPLCVideoTestimonial/>
        <ProFPLCOurclints/>

      
      
      
    </div>
  )
}

export default ProprietorshipPLC
