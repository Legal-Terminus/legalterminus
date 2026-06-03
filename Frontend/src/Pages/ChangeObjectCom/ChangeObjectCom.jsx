import React, { Suspense } from 'react'
import ChangeObjectComBreadcrum from '../../Components/ChangeObjectComBreadcrum/ChangeObjectComBreadcrum'

// Lazy load below-fold components
const ChangeObjectComPlanandPricing = React.lazy(() => import('../../Components/ChangeObjectComPlanandPricing/ChangeObjectComPlanandPricing'))
const ChangeObjectComZolvitPremium = React.lazy(() => import('../../Components/ChangeObjectComZolvitPremium/ChangeObjectComZolvitPremium'))
const ChangeObjectComTabs = React.lazy(() => import('../../Components/ChangeObjectComTabs/ChangeObjectComTabs'))
const ChangeObjectCompanyTab = React.lazy(() => import('../../Components/ChangeObjectCompanyTab/ChangeObjectCompanyTab'))
const ChangeObjectComTypes = React.lazy(() => import('../../Components/ChangeObjectComTypes/ChangeObjectComTypes'))
const ChangeObjectComRequirementsTab = React.lazy(() => import('../../Components/ChangeObjectComRequirementsTab/ChangeObjectComRequirementsTab'))
const ChangeObjectComProcess = React.lazy(() => import('../../Components/ChangeObjectComProcess/ChangeObjectComProcess'))
const ChangeObjectComFAQ = React.lazy(() => import('../../Components/ChangeObjectComFAQ/ChangeObjectComFAQ'))
const ChangeObjectComTermsCondition = React.lazy(() => import('../../Components/ChangeObjectComTermsCondition/ChangeObjectComTermsCondition'))
const ChangeObjectComTestimonial = React.lazy(() => import('../../Components/ChangeObjectComTestimonial/ChangeObjectComTestimonial'))
const ChangeObjectComVideoTestimonial = React.lazy(() => import('../../Components/ChangeObjectComVideoTestimonial/ChangeObjectComVideoTestimonial'))
const ChangeObjectComOurclints = React.lazy(() => import('../../Components/ChangeObjectComOurclints/ChangeObjectComOurclints'))
const ChangeObjInfographics = React.lazy(() => import('../../Components/ChangeObjInfographics/ChangeObjInfographics'))

const PrivateLimited = () => {
  return (
    <div>
      <ChangeObjectComBreadcrum />

      <div id="plans">
        <Suspense fallback={<div />}>
          <ChangeObjectComPlanandPricing />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <ChangeObjectComTermsCondition/>
      </Suspense>


      <div id="premium">
        <Suspense fallback={<div />}>
          <ChangeObjectComZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <ChangeObjectComTabs />
      </Suspense>

      <div id="company">
        <Suspense fallback={<div />}>
          <ChangeObjectCompanyTab />
        </Suspense>
      </div>

      <div id="types">
        <Suspense fallback={<div />}>
          <ChangeObjectComTypes />
        </Suspense>
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <ChangeObjectComRequirementsTab />
        </Suspense>
      </div>

      <div id="process">
        {/* <ChangeObjectComProcess /> */}
      </div>

      <div id="documents">
        <Suspense fallback={<div />}>
          <ChangeObjInfographics />
        </Suspense>
      </div>

      <div id="faq">
        <Suspense fallback={<div />}>
          <ChangeObjectComFAQ/>
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <ChangeObjectComTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <ChangeObjectComVideoTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <ChangeObjectComOurclints />
      </Suspense>
      
    </div>
  );
};

export default PrivateLimited