import React, { Suspense } from 'react'
import ChangeaddBreadcrum from '../../Components/ChangeaddComBreadcrum/ChangeaddComBreadcrum'

// Lazy load below-fold components
const ChangeaddComPlanandPricing = React.lazy(() => import('../../Components/ChangeaddComPlanandPricing/ChangeaddComPlanandPricing'))
const ChangeaddComZolvitPremium = React.lazy(() => import('../../Components/ChangeaddComZolvitPremium/ChangeaddComZolvitPremium'))
const ChangeaddComTabs = React.lazy(() => import('../../Components/ChangeaddComTabs/ChangeaddComTabs'))
const ChangeaddComCompanyTab = React.lazy(() => import('../../Components/ChangeaddComCompanyTab/ChangeaddComCompanyTab'))
const ChangeaddComTypes = React.lazy(() => import('../../Components/ChangeaddComTypes/ChangeaddComTypes'))
const ChangeaddComRequirementsTab = React.lazy(() => import('../../Components/ChangeaddComRequirementsTab/ChangeaddComRequirementsTab'))
const ChangeaddComProcess = React.lazy(() => import('../../Components/ChangeaddComProcess/ChangeaddComProcess'))
const ChangeaddComFAQ = React.lazy(() => import('../../Components/ChangeaddComFAQ/ChangeaddComFAQ'))
const ChangeaddComTermsCondition = React.lazy(() => import('../../Components/ChangeaddComTermsCondition/ChangeaddComTermsCondition'))
const ChangeaddComTestimonial = React.lazy(() => import('../../Components/ChangeaddComTestimonial/ChangeaddComTestimonial'))
const ChangeaddComVideoTestimonial = React.lazy(() => import('../../Components/ChangeaddComVideoTestimonial/ChangeaddComVideoTestimonial'))
const ChangeaddComOurclints = React.lazy(() => import('../../Components/ChangeaddComOurclints/ChangeaddComOurclints'))
const ChangeAddComInfographics = React.lazy(() => import('../../Components/ChangeAddComInfographics/ChangeAddComInfographics'))

const PrivateLimited = () => {
  return (
    <div>
      <ChangeaddBreadcrum />

      <div id="plans">
        <Suspense fallback={<div />}>
          <ChangeaddComPlanandPricing/>
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <ChangeaddComTermsCondition/>
      </Suspense>


      <div id="premium">
        <Suspense fallback={<div />}>
          <ChangeaddComZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <ChangeaddComTabs />
      </Suspense>

      <div id="company">
        <Suspense fallback={<div />}>
          <ChangeaddComCompanyTab/>
        </Suspense>
      </div>

      <div id="types">
        <Suspense fallback={<div />}>
          <ChangeaddComTypes />
        </Suspense>
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <ChangeaddComRequirementsTab />
        </Suspense>
      </div>

      <div id="process">
        {/* <ChangeaddComProcess/> */}
      </div>

      <div id="documents">
      <Suspense fallback={<div />}>
        <ChangeAddComInfographics />
      </Suspense>
      </div>

      <div id="faq">
        <Suspense fallback={<div />}>
          <ChangeaddComFAQ />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <ChangeaddComTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <ChangeaddComVideoTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <ChangeaddComOurclints />
      </Suspense>
      
    </div>
  );
};

export default PrivateLimited