import React from 'react'
import TMRenewBreadcrum from '../../Components/TMRenewBreadcrum/TMRenewBreadcrum'
import TMPlanandPricing from '../../Components/TMPlanandPricing/TMPlanandPricing'
import TMTermandCondition from '../../Components/TMTermandCondition/TMTermandCondition'
import TMZolvitPremium from '../../Components/TMZolvitPremium/TMZolvitPremium'
import TMTabs from '../../Components/TMTabs/TMTabs'
import TMCompanyTab from '../../Components/TMCompanyTab/TMCompanyTab'
import TMRenewalTypes from '../../Components/TMRenewalTypes/TMRenewalTypes'
import TMRequirementsTab from '../../Components/TMRequirementsTab/TMRequirementsTab'
import TMProcess from '../../Components/TMProcess/TMProcess'
import TMRenewalDocuments from '../../Components/TMRenewalDocuments/TMRenewalDocuments'
import TMFAQ from '../../Components/TMFAQ/TMFAQ'
import TMTestimonial from '../../Components/TMTestimonial/TMTestimonial'
import TMVideoTestimonial from '../../Components/TMVideoTestimonial/TMVideoTestimonial'
import TMOurclints from '../../Components/TMOurclints/TMOurclints'
const TMRenewal = () => {
  return (
    <div>
      <TMRenewBreadcrum/>

       <div id="plans">
        <TMPlanandPricing/>
       </div>
        
        <TMTermandCondition/>

        <div id="premium">
            <TMZolvitPremium/>
        </div>

        <TMTabs/>
        
        <div id="types">
            <TMCompanyTab/>
        </div>
        
        <div id="types">
            <TMRenewalTypes/>
        </div>

        <div id="requirements">
            <TMRequirementsTab/>
        </div>

        <div id="process">
            {/* <TMProcess/> */}
        </div>
        
        <div id="documents">
            {/* <TMRenewalDocuments/> */}
        </div>
        
        <div id="faq">
            <TMFAQ/>
        </div>

        <TMTestimonial/>
        <TMVideoTestimonial/>
        <TMOurclints/>

    </div>
  )
}

export default TMRenewal
