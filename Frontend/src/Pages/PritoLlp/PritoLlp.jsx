import React, { Suspense } from 'react'
import PritoLlpBreadcrum from '../../Components/PritoLlpBreadcrum/PritoLlpBreadcrum'

// Lazy load below-fold components
const PritoLlpPlanandPricing = React.lazy(() => import('../../Components/PritoLlpPlanandPricing/PritoLlpPlanandPricing'))
const PritoLlpZolvitPremium = React.lazy(() => import('../../Components/PritoLlpZolvitPremium/PritoLlpZolvitPremium'))
const PritoLlpTabs = React.lazy(() => import('../../Components/PritopLlpTabs/PritopLlpTabs'))
const PritoLlpCompanyTab = React.lazy(() => import('../../Components/PritoLlpCompanyTab/PritoLlpCompanyTab'))
const PritoLlpTypes = React.lazy(() => import('../../Components/PritoLlpTypes/PritoLlpTypes'))
const PritoLlpRequirementsTab = React.lazy(() => import('../../Components/PritoLlpRequirementsTab/PritoLlpRequirementsTab'))
const PritoLlpProcess = React.lazy(() => import('../../Components/PritoLlpProcess/PritoLlpProcess'))
const PritoLlpDocument = React.lazy(() => import('../../Components/PritoLlpDocument/PritoLlpDocument'))
const PritoLlpFAQ = React.lazy(() => import('../../Components/PritoLlpFAQ/PritoLlpFAQ'))
const PritoLlpTermsCondition = React.lazy(() => import('../../Components/PritoLlpTermsCondition/PritoLlpTermsCondition'))
const PritoLlpTestimonial = React.lazy(() => import('../../Components/PritoLlpTestimonial/PritoLlpTestimonial'))
const PritoLlpVideoTestimonial = React.lazy(() => import('../../Components/PritoLlpVideoTestimonial/PritoLlpVideoTestimonial'))
const PritoLlpOurclints = React.lazy(() => import('../../Components/PritoLlpOurclints/PritoLlpOurclints'))

const PrivateLimited = () => {
  return (
    <div>
      <PritoLlpBreadcrum />

      <div id="plans">
        {/* <PritoLlpPlanandPricing /> */}
      </div>

      {/* <PritoLlpTermsCondition/> */}


      <div id="premium">
        <Suspense fallback={<div />}>
          <PritoLlpZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <PritoLlpTabs/>
      </Suspense>

      <div id="company">
        <Suspense fallback={<div />}>
          <PritoLlpCompanyTab />
        </Suspense>
      </div>

      <div id="types">
        {/* <PritoLlpTypes /> */}
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <PritoLlpRequirementsTab/>
        </Suspense>
      </div>

      <div id="process">
        {/* <PritoLlpProcess /> */}
      </div>

      <div id="documents">
        {/* <PritoLlpDocument /> */}
      </div>

      <div id="faq">
        <Suspense fallback={<div />}>
          <PritoLlpFAQ />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <PritoLlpTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <PritoLlpVideoTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <PritoLlpOurclints />
      </Suspense>
    </div>
  );
};

export default PrivateLimited