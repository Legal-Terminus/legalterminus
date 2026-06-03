import React, { Suspense } from 'react'
import PartnershiptoPrivateBreadcrumb from '../../Components/PartnershiptoPrivateBreadcrumb/PartnershiptoPrivateBreadcrumb'

// Lazy load below-fold components
const PartnershiptoPrivatePlanandPricing = React.lazy(() => import('../../Components/PartnershiptoPrivatePlanandPricing/PartnershiptoPrivatePlanandPricing'))
const ParttoPriZolvitPremium = React.lazy(() => import('../../Components/ParttoPriZolvitPremium/ParttoPriZolvitPremium'))
const ParttoPriTabs = React.lazy(() => import('../../Components/ParttoPriTabs/ParttoPriTabs'))
const ParttoPriCompanyTab = React.lazy(() => import('../../Components/ParttoPriCompanyTab/ParttoPriCompanyTab'))
const ParttoPriPvtTypes = React.lazy(() => import('../../Components/ParttoPriPvtTypes/ParttoPriPvtTypes'))
const ParttoPriRequirementsTab = React.lazy(() => import('../../Components/ParttoPriRequirementsTab/ParttoPriRequirementsTab'))
const ParttoPriProcess = React.lazy(() => import('../../Components/ParttoPriProcess/ParttoPriProcess'))
const ParttoPriDocument = React.lazy(() => import('../../Components/ParttoPriDocument/ParttoPriDocument'))
const ParttoPriFAQ = React.lazy(() => import('../../Components/ParttoPriFAQ/ParttoPriFAQ'))
const ParttoPriTermsCondition = React.lazy(() => import('../../Components/ParttoPriTermsCondition/ParttoPriTermsCondition'))
const ParttoPriTestimonial = React.lazy(() => import('../../Components/ParttoPriTestimonial/ParttoPriTestimonial'))
const ParttoPriVideoTestimonial = React.lazy(() => import('../../Components/ParttoPriVideoTestimonial/ParttoPriVideoTestimonial'))
const ParttoPriOurclints = React.lazy(() => import('../../Components/ParttoPriOurclints/ParttoPriOurclints'))

const PrivateLimited = () => {
  return (
    <div>
      <PartnershiptoPrivateBreadcrumb />

      <div id="plans">
        {/* <PartnershiptoPrivatePlanandPricing/> */}
      </div>

      {/* <ParttoPriTermsCondition /> */}


      <div id="premium">
        <Suspense fallback={<div />}>
          <ParttoPriZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <ParttoPriTabs />
      </Suspense>

      <div id="company">
        <Suspense fallback={<div />}>
          < ParttoPriCompanyTab/>
        </Suspense>
      </div>

      <div id="types">
        {/* <ParttoPriPvtTypes /> */}
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <ParttoPriRequirementsTab />
        </Suspense>
      </div>

      <div id="process">
        {/* <ParttoPriProcess/> */}
      </div>

      <div id="documents">
        {/* <ParttoPriDocument /> */}
      </div>

      <div id="faq">
        <Suspense fallback={<div />}>
          <ParttoPriFAQ />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <ParttoPriTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <ParttoPriVideoTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <ParttoPriOurclints/>
      </Suspense>
    </div>
  );
};

export default PrivateLimited