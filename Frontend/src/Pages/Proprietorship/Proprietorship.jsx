import React, { Suspense } from 'react'
import ProprietorshipBreadcrumb from '../../Components/ProprietorshipBreadcrumb/ProprietorshipBreadcrumb'

// Lazy load below-fold components
const ProGovtCosts = React.lazy(() => import('../../Components/ProGovtCosts/ProGovtCosts'))
const ProZolvitPremium = React.lazy(() => import('../../Components/ProZolvitPremium/ProZolvitPremium'))
const Protabs = React.lazy(() => import('../../Components/Protabs/Protabs'))
const ProCompanyTab = React.lazy(() => import('../../Components/ProCompanyTab/ProCompanyTab'))
const ProPvtTypes = React.lazy(() => import('../../Components/ProPvtTypes/ProPvtTypes'))
const ProRequirementsTab = React.lazy(() => import('../../Components/ProRequirementsTab/ProRequirementsTab'))
const ProProcess = React.lazy(() => import('../../Components/ProProcess/ProProcess'))
const ProDocument = React.lazy(() => import('../../Components/ProDocument/ProDocument'))
const ProFAQ = React.lazy(() => import('../../Components/ProFAQ/ProFAQ'))
const ProTermsCondition = React.lazy(() => import('../../Components/ProTermsCondition/ProTermsCondition'))
const ProTestimonial = React.lazy(() => import('../../Components/ProTestimonial/ProTestimonial'))
const ProVideoTestimonial = React.lazy(() => import('../../Components/ProVideoTestimonial/ProVideoTestimonial'))
const ProOurclints = React.lazy(() => import('../../Components/ProOurclints/ProOurclints'))
const ProPlanandPricing = React.lazy(() => import('../../Components/ProPlanandPricing/ProPlanandPricing'))

const PrivateLimited = () => {
  return (
    <div>
      <ProprietorshipBreadcrumb />

      <div id="plans">
        <Suspense fallback={<div />}>
          <ProPlanandPricing />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <ProGovtCosts />
      </Suspense>

      <Suspense fallback={<div />}>
        <ProTermsCondition/>
      </Suspense>

      <div id="premium">
        <Suspense fallback={<div />}>
          <ProZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <Protabs />
      </Suspense>

      <div id="company">
        <Suspense fallback={<div />}>
          <ProCompanyTab />
        </Suspense>
      </div>

      <div id="types">
        <Suspense fallback={<div />}>
          <ProPvtTypes/>
        </Suspense>
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <ProRequirementsTab />
        </Suspense>
      </div>

      <div id="process">
        <Suspense fallback={<div />}>
          <ProProcess/>
        </Suspense>
      </div>

      <div id="documents">
        <Suspense fallback={<div />}>
          <ProDocument />
        </Suspense>
      </div>

      <div id="faq">
        <Suspense fallback={<div />}>
          <ProFAQ/>
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <ProTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <ProVideoTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <ProOurclints />
      </Suspense>
    </div>
  );
};

export default PrivateLimited
