import React, { Suspense } from 'react'
import TMRenewBreadcrum from '../../Components/TMRenewBreadcrum/TMRenewBreadcrum'

// Lazy load below-fold components
const TMPlanandPricing = React.lazy(() => import('../../Components/TMPlanandPricing/TMPlanandPricing'))
const TMTermandCondition = React.lazy(() => import('../../Components/TMTermandCondition/TMTermandCondition'))
const TMZolvitPremium = React.lazy(() => import('../../Components/TMZolvitPremium/TMZolvitPremium'))
const TMTabs = React.lazy(() => import('../../Components/TMTabs/TMTabs'))
const TMCompanyTab = React.lazy(() => import('../../Components/TMCompanyTab/TMCompanyTab'))
const TMRenewalTypes = React.lazy(() => import('../../Components/TMRenewalTypes/TMRenewalTypes'))
const TMRequirementsTab = React.lazy(() => import('../../Components/TMRequirementsTab/TMRequirementsTab'))
const TMProcess = React.lazy(() => import('../../Components/TMProcess/TMProcess'))
const TMRenewalDocuments = React.lazy(() => import('../../Components/TMRenewalDocuments/TMRenewalDocuments'))
const TMFAQ = React.lazy(() => import('../../Components/TMFAQ/TMFAQ'))
const TMTestimonial = React.lazy(() => import('../../Components/TMTestimonial/TMTestimonial'))
const TMVideoTestimonial = React.lazy(() => import('../../Components/TMVideoTestimonial/TMVideoTestimonial'))
const TMOurclints = React.lazy(() => import('../../Components/TMOurclints/TMOurclints'))
const TMRenewal = () => {
  return (
    <div>
      <TMRenewBreadcrum/>

       <div id="plans">
        <Suspense fallback={<div />}>
          <TMPlanandPricing/>
        </Suspense>
       </div>
        
        <Suspense fallback={<div />}>
          <TMTermandCondition/>
        </Suspense>

        <div id="premium">
            <Suspense fallback={<div />}>
              <TMZolvitPremium/>
            </Suspense>
        </div>

        <Suspense fallback={<div />}>
          <TMTabs/>
        </Suspense>
        
        <div id="types">
            <Suspense fallback={<div />}>
              <TMCompanyTab/>
            </Suspense>
        </div>
        
        <div id="types">
            <Suspense fallback={<div />}>
              <TMRenewalTypes/>
            </Suspense>
        </div>

        <div id="requirements">
            <Suspense fallback={<div />}>
              <TMRequirementsTab/>
            </Suspense>
        </div>

        <div id="process">
            {/* <TMProcess/> */}
        </div>
        
        <div id="documents">
            {/* <TMRenewalDocuments/> */}
        </div>
        
        <div id="faq">
            <Suspense fallback={<div />}>
              <TMFAQ/>
            </Suspense>
        </div>

        <Suspense fallback={<div />}>
          <TMTestimonial/>
        </Suspense>
        <Suspense fallback={<div />}>
          <TMVideoTestimonial/>
        </Suspense>
        <Suspense fallback={<div />}>
          <TMOurclints/>
        </Suspense>

    </div>
  )
}

export default TMRenewal
