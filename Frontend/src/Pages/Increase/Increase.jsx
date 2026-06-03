import React, { Suspense } from 'react'
import IncreaseBreadcrum from '../../Components/IncreaseBreadcrum/IncreaseBreadcrum'

// Lazy load below-fold components
const IncreasePlanandPricing = React.lazy(() => import('../../Components/IncreasePlanandPricing/IncreasePlanandPricing'))
const IncreaseZolvitPremium = React.lazy(() => import('../../Components/IncreaseZolvitPremium/IncreaseZolvitPremium'))
const IncreaseTabs = React.lazy(() => import('../../Components/IncreaseTabs/IncreaseTabs'))
const IncreaseCompanyTab = React.lazy(() => import('../../Components/IncreaseCompanyTab/IncreaseCompanyTab'))
const IncreaseTypes = React.lazy(() => import('../../Components/IncreaseTypes/IncreaseTypes'))
const IncreaseRequirementsTab = React.lazy(() => import('../../Components/IncreaseRequirementsTab/IncreaseRequirementsTab'))
const IncreaseProcess = React.lazy(() => import('../../Components/IncreaseProcess/IncreaseProcess'))
const PvtltdDocument = React.lazy(() => import('../../Components/PvtltdDocument/PvtltdDocument'))
const IncreaseFAQ = React.lazy(() => import('../../Components/IncreaseFAQ/IncreaseFAQ'))
const IncreaseTermsCondition = React.lazy(() => import('../../Components/IncreaseTermsCondition/IncreaseTermsCondition'))
const IncreaseTestimonial = React.lazy(() => import('../../Components/IncreaseTestimonial/IncreaseTestimonial'))
const IncreaseVideoTestimonial = React.lazy(() => import('../../Components/IncreaseVideoTestimonial/IncreaseVideoTestimonial'))
const IncreaseOurclints = React.lazy(() => import('../../Components/IncreaseOurclints/IncreaseOurclints'))

const PrivateLimited = () => {
  return (
    <div>
      <IncreaseBreadcrum/>

      <div id="plans">
        <Suspense fallback={<div />}>
          <IncreasePlanandPricing/>
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <IncreaseTermsCondition />
      </Suspense>


      <div id="premium">
        <Suspense fallback={<div />}>
          <IncreaseZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <IncreaseTabs />
      </Suspense>

      <div id="company">
        <Suspense fallback={<div />}>
          <IncreaseCompanyTab />
        </Suspense>
      </div>

      <div id="types">
        <Suspense fallback={<div />}>
          <IncreaseTypes/>
        </Suspense>
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <IncreaseRequirementsTab/>
        </Suspense>
      </div>

      <div id="process">
        {/* <IncreaseProcess /> */}
      </div>

      <div id="documents">
        {/* <PvtltdDocument /> */}
      </div>

      <div id="faq">
        <Suspense fallback={<div />}>
          <IncreaseFAQ/>
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <IncreaseTestimonial/>
      </Suspense>
      <Suspense fallback={<div />}>
        <IncreaseVideoTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <IncreaseOurclints/>
      </Suspense>
      
    </div>
  );
};

export default PrivateLimited