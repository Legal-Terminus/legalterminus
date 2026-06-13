import React, { Suspense } from 'react'
import ProFOPCBreadcrum from '../../Components/ProFOPCBreadcrum/ProFOPCBreadcrum'

// Lazy load below-fold components
const ProFOPCPlanandPricing = React.lazy(() => import('../../Components/ProFOPCPlanandPricing/ProFOPCPlanandPricing'))
const ProFOPCGovtCosts = React.lazy(() => import('../../Components/ProFOPCGovtCosts/ProFOPCGovtCosts'))
const ProFOPCCondition = React.lazy(() => import('../../Components/ProFOPCCondition/ProFOPCCondition'))
const ProFOPCZolvitPremium = React.lazy(() => import('../../Components/ProFOPCZolvitPremium/ProFOPCZolvitPremium'))
const ProFOPCTabs = React.lazy(() => import('../../Components/ProFOPCTabs/ProFOPCTabs'))
const ProFOPCCompanyTab = React.lazy(() => import('../../Components/ProFOPCCompanyTab/ProFOPCCompanyTab'))
const ProFOPCTypes = React.lazy(() => import('../../Components/ProFOPCTypes/ProFOPCTypes'))
const ProFOPCRequirementsTab = React.lazy(() => import('../../Components/ProFOPCRequirementsTab/ProFOPCRequirementsTab'))
const ProFOPCProcess = React.lazy(() => import('../../Components/ProFOPCProcess/ProFOPCProcess'))
const ProFOPCDocument = React.lazy(() => import('../../Components/ProFOPCDocument/ProFOPCDocument'))
const ProFOPCFAQ = React.lazy(() => import('../../Components/ProFOPCFAQ/ProFOPCFAQ'))
const ProFOPCTestimonial = React.lazy(() => import('../../Components/ProFOPCTestimonial/ProFOPCTestimonial'))
const ProFOPCVideoTestimonial = React.lazy(() => import('../../Components/ProFOPCVideoTestimonial/ProFOPCVideoTestimonial'))
const ProFOPCOurclints = React.lazy(() => import('../../Components/ProFOPCOurclints/ProFOPCOurclints'))



const ProprietorshipOPC = () => {
  return (
   
      <div>
      <ProFOPCBreadcrum/>

      <div id="plans">
        <ProFOPCPlanandPricing/>
      </div>

      <Suspense fallback={<div />}>
        <ProFOPCGovtCosts />
      </Suspense>

      <ProFOPCCondition/> 

       <div id="premium">
        <Suspense fallback={<div />}>
          <ProFOPCZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <ProFOPCTabs/>
      </Suspense>

      <div id="company">
        <Suspense fallback={<div />}>
          <ProFOPCCompanyTab />
        </Suspense>
      </div>

      <div id="types">
        {/* <ProFOPCTypes /> */}
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <ProFOPCRequirementsTab />
        </Suspense>
      </div>

       <div id="process">
         <Suspense fallback={<div />}>
           <ProFOPCProcess /> 
         </Suspense>
      </div>

      <div id="documents">
         <Suspense fallback={<div />}>
           <ProFOPCDocument /> 
         </Suspense>
      </div>

       <div id="faq">
        <Suspense fallback={<div />}>
          <ProFOPCFAQ />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <ProFOPCTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <ProFOPCVideoTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <ProFOPCOurclints />
      </Suspense>

    </div>
  )
}

export default ProprietorshipOPC
