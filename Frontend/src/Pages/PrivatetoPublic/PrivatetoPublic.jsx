import React, { Suspense } from 'react'
import PritoPublicBreadcrum from '../../Components/PritoPublicBreadcrum/PritoPublicBreadcrum'

// Lazy load below-fold components
const PritoPublicPlanandPricing = React.lazy(() => import('../../Components/PritoPublicPlanandPricing/PritoPublicPlanandPricing'))
const PritoPublicZolvitPremium = React.lazy(() => import('../../Components/PritoPublicZolvitPremium/PritoPublicZolvitPremium'))
const PritoPublicTabs = React.lazy(() => import('../../Components/PritoPublicTabs/PritoPublicTabs'))
const PritoPublicCompanyTab = React.lazy(() => import('../../Components/PritoPublicCompanyTab/PritoPublicCompanyTab'))
const PritoPublicPvtTypes = React.lazy(() => import('../../Components/PritoPublicPvtTypes/PritoPublicPvtTypes'))
const PritoPublicRequirementsTab = React.lazy(() => import('../../Components/PritoPublicRequirementsTab/PritoPublicRequirementsTab'))
const PritoPublicProcess = React.lazy(() => import('../../Components/PritoPublicProcess/PritoPublicProcess'))
const PritoPublicDocument = React.lazy(() => import('../../Components/PritoPublicDocument/PritoPublicDocument'))
const PritoPublicFAQ = React.lazy(() => import('../../Components/PritoPublicFAQ/PritoPublicFAQ'))
const PritoPublicTermsCondition = React.lazy(() => import('../../Components/PritoPublicTermsCondition/PritoPublicTermsCondition'))
const PritoPublicTestimonial = React.lazy(() => import('../../Components/PritoPublicTestimonial/PritoPublicTestimonial'))
const PritoPublicVideoTestimonial = React.lazy(() => import('../../Components/PritoPublicVideoTestimonial/PritoPublicVideoTestimonial'))
const PritoPublicOurclints = React.lazy(() => import('../../Components/PritoPublicOurclints/PritoPublicOurcilnts'))

const PrivateLimited = () => {
  return (
    <div>
      <PritoPublicBreadcrum />

      <div id="plans">
        <Suspense fallback={<div />}>
          <PritoPublicPlanandPricing/>
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <PritoPublicTermsCondition />
      </Suspense>


      <div id="premium">
        <Suspense fallback={<div />}>
          <PritoPublicZolvitPremium/>
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <PritoPublicTabs/>
      </Suspense>

      <div id="company">
        <Suspense fallback={<div />}>
          <PritoPublicCompanyTab/>
        </Suspense>
      </div>

      <div id="types">
        <Suspense fallback={<div />}>
          <PritoPublicPvtTypes />
        </Suspense>
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <PritoPublicRequirementsTab/>
        </Suspense>
      </div>

      <div id="process">
        <Suspense fallback={<div />}>
          <PritoPublicProcess/>
        </Suspense>
      </div>

      <div id="documents">
        <Suspense fallback={<div />}>
          <PritoPublicDocument />
        </Suspense>
      </div>

      <div id="faq">
        <Suspense fallback={<div />}>
          <PritoPublicFAQ />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <PritoPublicTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <PritoPublicVideoTestimonial/>
      </Suspense>
      <Suspense fallback={<div />}>
        <PritoPublicOurclints />
      </Suspense>
    </div>
  );
};

export default PrivateLimited