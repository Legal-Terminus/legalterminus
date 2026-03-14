import React from 'react'
import ProFOPCBreadcrum from '../../Components/ProFOPCBreadcrum/ProFOPCBreadcrum'
import ProFOPCPlanandPricing from '../../Components/ProFOPCPlanandPricing/ProFOPCPlanandPricing'
import ProFOPCCondition from '../../Components/ProFOPCCondition/ProFOPCCondition'
import ProFOPCZolvitPremium from '../../Components/ProFOPCZolvitPremium/ProFOPCZolvitPremium'
import ProFOPCTabs from '../../Components/ProFOPCTabs/ProFOPCTabs'
import ProFOPCCompanyTab from '../../Components/ProFOPCCompanyTab/ProFOPCCompanyTab'
import ProFOPCTypes from '../../Components/ProFOPCTypes/ProFOPCTypes'
import ProFOPCRequirementsTab from '../../Components/ProFOPCRequirementsTab/ProFOPCRequirementsTab'
import ProFOPCProcess from '../../Components/ProFOPCProcess/ProFOPCProcess'
import ProFOPCDocument from '../../Components/ProFOPCDocument/ProFOPCDocument'
import ProFOPCFAQ from '../../Components/ProFOPCFAQ/ProFOPCFAQ'
import ProFOPCTestimonial from '../../Components/ProFOPCTestimonial/ProFOPCTestimonial'
import ProFOPCVideoTestimonial from '../../Components/ProFOPCVideoTestimonial/ProFOPCVideoTestimonial'
import ProFOPCOurclints from '../../Components/ProFOPCOurclints/ProFOPCOurclints'



const ProprietorshipOPC = () => {
  return (
   
      <div>
      <ProFOPCBreadcrum/>

      <div id="plans">
        <ProFOPCPlanandPricing/>
      </div>

      <ProFOPCCondition/> 

       <div id="premium">
        <ProFOPCZolvitPremium />
      </div>

      <ProFOPCTabs/>

      <div id="company">
        <ProFOPCCompanyTab />
      </div>

      <div id="types">
        {/* <ProFOPCTypes /> */}
      </div>

      <div id="requirements">
        <ProFOPCRequirementsTab />
      </div>

       <div id="process">
         <ProFOPCProcess /> 
      </div>

      <div id="documents">
         <ProFOPCDocument /> 
      </div>

       <div id="faq">
        <ProFOPCFAQ />
      </div>

      <ProFOPCTestimonial />
      <ProFOPCVideoTestimonial />
      <ProFOPCOurclints />

    </div>
  )
}

export default ProprietorshipOPC
