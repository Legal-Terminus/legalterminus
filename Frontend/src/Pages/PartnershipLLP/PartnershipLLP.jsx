import React, { Suspense } from 'react'
import PartnershipLLPBreadcrum from '../../Components/PartnershipLLPBreadcrum/PartnershipLLPBreadcrum'

// Lazy load below-fold components
const PartnershipLLPPlanandPricing = React.lazy(() => import('../../Components/PartnershipLLPPlanandPricing/PartnershipLLPPlanandPricing'))
const PartnershipLLPTandC = React.lazy(() => import('../../Components/PartnershipLLPTandC/PartnershipLLPTandC'))
const PartnershipLLPZolvitPremium = React.lazy(() => import('../../Components/PartnershipLLPZolvitPremium/PartnershipLLPZolvitPremium'))
const PartnershipLLPTabs = React.lazy(() => import('../../Components/PartnershipLLPTabs/PartnershipLLPTabs'))
const PartnershipLLPCompanyTab = React.lazy(() => import('../../Components/PartnershipLLPCompanyTab/PartnershipLLPCompanyTab'))
const PartnershipLLPTypes = React.lazy(() => import('../../Components/PartnershipLLPTypes/PartnershipLLPTypes'))
const PartnershipLLPRequirementsTab = React.lazy(() => import('../../Components/PartnershipLLPRequirementsTab/PartnershipLLPRequirementsTab'))
const PartnershipLLPProcess = React.lazy(() => import('../../Components/PartnershipLLPProcess/PartnershipLLPProcess'))
const PartnershipLLPDocument = React.lazy(() => import('../../Components/PartnershipLLPDocument/PartnershipLLPDocument'))
const PartnershipLLPFAQ = React.lazy(() => import('../../Components/PartnershipLLPFAQ/PartnershipLLPFAQ'))
const PartnershipLLPTestimonial = React.lazy(() => import('../../Components/PartnershipLLPTestimonial/PartnershipLLPTestimonial'))
const PartnershipLLPVideoTestimonial = React.lazy(() => import('../../Components/PartnershipLLPVideoTestimonial/PartnershipLLPVideoTestimonial'))
const PartnershipLLPOurclints = React.lazy(() => import('../../Components/PartnershipLLPOurclints/PartnershipLLPOurclints'))

const PartnershipLLP = () => {
  return (
    <div>
        <PartnershipLLPBreadcrum/>

        <div id="plans">
            {/* <PartnershipLLPPlanandPricing/> */}
        </div>

        {/* <PartnershipLLPTandC/> */}

        <div id="premium">
        <Suspense fallback={<div />}>
          <PartnershipLLPZolvitPremium/>
        </Suspense>
        </div>

        <Suspense fallback={<div />}>
          <PartnershipLLPTabs/>
        </Suspense>
      
        <div id="company">
            <Suspense fallback={<div />}>
              <PartnershipLLPCompanyTab/>
            </Suspense>
        </div>

        <div id="types">
        <Suspense fallback={<div />}>
          <PartnershipLLPTypes/>
        </Suspense>
        </div>

        <div id="requirements">
            <Suspense fallback={<div />}>
              <PartnershipLLPRequirementsTab/>
            </Suspense>
        </div>

        <div id="process">
            {/* <PartnershipLLPProcess/> */}
        </div>

        <div id="documents">
            {/* <PartnershipLLPDocument/> */}
        </div>

        <div id="faq">
            <Suspense fallback={<div />}>
              <PartnershipLLPFAQ/>
            </Suspense>
        </div>

        <Suspense fallback={<div />}>
          <PartnershipLLPTestimonial/>
        </Suspense>
        <Suspense fallback={<div />}>
          <PartnershipLLPVideoTestimonial/>
        </Suspense>
        <Suspense fallback={<div />}>
          <PartnershipLLPOurclints/>
        </Suspense>
    </div>
  )
}

export default PartnershipLLP
