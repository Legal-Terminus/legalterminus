import React, { Suspense } from 'react'
import PublictoPrivateBreadcrum from '../../Components/PublictoPrivateBreadcrum/PublictoPrivateBreadcrum'

// Lazy load below-fold components
const PublictoPrivateRightPlan = React.lazy(() => import('../../Components/PublictoPrivateRightPlan/PublictoPrivateRightPlan'))
const PublictoPriGovtCosts = React.lazy(() => import('../../Components/PublictoPriGovtCosts/PublictoPriGovtCosts'))
const PublictoPriTermsCondition = React.lazy(() => import('../../Components/PublictoPriTermsCondition/PublictoPriTermsCondition'))
const PublictoPriZolvitPremium = React.lazy(() => import('../../Components/PublictoPriZolvitPremium/PublictoPriZolvitPremium'))
const PublictoPriTab = React.lazy(() => import('../../Components/PublictoPriTab/PublictoPriTab'))
const PublictoPriOverview = React.lazy(() => import('../../Components/PublictoPriOverview/PublictoPriOverview'))
const PublictoPriTypes = React.lazy(() => import('../../Components/PublictoPriTypes/PublictoPriTypes'))
const PublictoPriBenifits = React.lazy(() => import('../../Components/PublictoPriBenifits/PublictoPriBenifits'))
const PublictoPriProcess = React.lazy(() => import('../../Components/PublictoPriProcess/PublictoPriProcess'))
const PublictoPriDocument = React.lazy(() => import('../../Components/PublictoPriDocument/PublictoPriDocument'))
const PublictoPriFAQ = React.lazy(() => import('../../Components/PublictoPriFAQ/PublictoPriFAQ'))
const PublictoPriTestimonial = React.lazy(() => import('../../Components/PublictoPriTestimonial/PublictoPriTestimonial'))
const PublictoPriVideoTestimonial = React.lazy(() => import('../../Components/PublictoPriVideoTestimonial/PublictoPriVideoTestimonial'))
const ProFOPCOurclints = React.lazy(() => import('../../Components/ProFOPCOurclints/ProFOPCOurclints'))

const PublictoPrivate = () => {
  return (
    <div>
      <PublictoPrivateBreadcrum />

      <div id="plans">
        <Suspense fallback={<div />}>
          <PublictoPrivateRightPlan />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <PublictoPriGovtCosts />
      </Suspense>

      <Suspense fallback={<div />}>
        <PublictoPriTermsCondition />
      </Suspense>

      <div id="premium">
        <Suspense fallback={<div />}>
          <PublictoPriZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <PublictoPriTab />
      </Suspense>

      <div id="company">
        <Suspense fallback={<div />}>
          <PublictoPriOverview />
        </Suspense>
      </div>

      <div id="types">
        <Suspense fallback={<div />}>
          <PublictoPriTypes />
        </Suspense>
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <PublictoPriBenifits />
        </Suspense>
      </div>

      <div id="process">
        <Suspense fallback={<div />}>
          <PublictoPriProcess />
        </Suspense>
      </div>

      <div id="documents">
        <Suspense fallback={<div />}>
          <PublictoPriDocument />
        </Suspense>
      </div>

      <div id="faq">
        <Suspense fallback={<div />}>
          <PublictoPriFAQ />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <PublictoPriTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <PublictoPriVideoTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <ProFOPCOurclints />
      </Suspense>

    </div>
  )
}

export default PublictoPrivate
