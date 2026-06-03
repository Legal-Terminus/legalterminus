import React, { Suspense } from 'react'
import ProFPLCBreadcrum from '../../Components/ProFOPCBreadcrum/ProFOPCBreadcrum'

// Lazy load below-fold components
const ProFPLCPlanandPricing = React.lazy(() => import('../../Components/ProFPLCPlanandPricing/ProFPLCPlanandPricing'))
const ProFPLCCondition = React.lazy(() => import('../../Components/ProFPLCCondition/ProFPLCCondition'))
const ProFPLCZolvitPremium = React.lazy(() => import('../../Components/ProFPLCZolvitPremium/ProFPLCZolvitPremium'))
const ProFPLCTabs = React.lazy(() => import('../../Components/ProFPLCTabs/ProFPLCTabs'))
const ProFPLCCompanyTab = React.lazy(() => import('../../Components/ProFPLCCompanyTab/ProFPLCCompanyTab'))
const ProFPLCTypes = React.lazy(() => import('../../Components/ProFPLCTypes/ProFPLCTypes'))
const ProFPLCRequirementsTab = React.lazy(() => import('../../Components/ProFPLCRequirementsTab/ProFPLCRequirementsTab'))
const ProFPLCProcess = React.lazy(() => import('../../Components/ProFPLCProcess/ProFPLCProcess'))
const ProFPLCDocument = React.lazy(() => import('../../Components/ProFPLCDocument/ProFPLCDocument'))
const ProFPLCFAQ = React.lazy(() => import('../../Components/ProFPLCFAQ/ProFPLCFAQ'))
const ProFPLCTestimonial = React.lazy(() => import('../../Components/ProFPLCTestimonial/ProFPLCTestimonial'))
const ProFPLCVideoTestimonial = React.lazy(() => import('../../Components/ProFPLCVideoTestimonial/ProFPLCVideoTestimonial'))
const ProFPLCOurclints = React.lazy(() => import('../../Components/ProFPLCOurclints/ProFPLCOurclints'))

const ProprietorshipPLC = () => {
  return (
    <div>
        <ProFPLCBreadcrum/>

        <div id="plans">
        <ProFPLCPlanandPricing/> 
      </div>

       <ProFPLCCondition/> 

      <div id="premium">
        <Suspense fallback={<div />}>
          <ProFPLCZolvitPremium />
        </Suspense>
      </div>

       <Suspense fallback={<div />}>
         <ProFPLCTabs/>
       </Suspense>

       <div id="company">
        <Suspense fallback={<div />}>
          <ProFPLCCompanyTab />
        </Suspense>
      </div>

       <div id="types">
         <Suspense fallback={<div />}>
           <ProFPLCTypes /> 
         </Suspense>
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <ProFPLCRequirementsTab/>
        </Suspense>
      </div>

      <div id="process">
         <Suspense fallback={<div />}>
           <ProFPLCProcess/> 
         </Suspense>
        </div>

      <div id="documents">
         <Suspense fallback={<div />}>
           <ProFPLCDocument/> 
         </Suspense>
      </div>

      <div id="faq">
              <Suspense fallback={<div />}>
                <ProFPLCFAQ/>
              </Suspense>
            </div>
        
        <Suspense fallback={<div />}>
          <ProFPLCTestimonial/>
        </Suspense>
        <Suspense fallback={<div />}>
          <ProFPLCVideoTestimonial/>
        </Suspense>
        <Suspense fallback={<div />}>
          <ProFPLCOurclints/>
        </Suspense>
      
      
      
    </div>
  )
}

export default ProprietorshipPLC
