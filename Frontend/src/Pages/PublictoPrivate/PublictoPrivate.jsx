import React, { Suspense } from 'react'
import PublictoPrivateBreadcrum from '../../Components/PublictoPrivateBreadcrum/PublictoPrivateBreadcrum'

// Lazy load below-fold components
const PublictoPrivateRightPlan = React.lazy(() => import('../../Components/PublictoPrivateRightPlan/PublictoPrivateRightPlan'))
const PublictoPriTermsCondition = React.lazy(() => import('../../Components/PublictoPriTermsCondition/PublictoPriTermsCondition'))
const PublictoPriZolvitPremium = React.lazy(() => import('../../Components/PublictoPriZolvitPremium/PublictoPriZolvitPremium'))
const PublictoPriTab = React.lazy(() => import('../../Components/PublictoPriTab/PublictoPriTab'))
const PublictoPriOverview = React.lazy(() => import('../../Components/PublictoPriOverview/PublictoPriOverview'))
const PublictoPriFeatures = React.lazy(() => import('../../Components/PublictoPriFeatures/PublictoPriFeatures'))
const PublictoPriBenifits = React.lazy(() => import('../../Components/PublictoPriBenifits/PublictoPriBenifits'))
const PublictoPriDocument = React.lazy(() => import('../../Components/PublictoPriDocument/PublictoPriDocument'))
const PublictoPriProcess = React.lazy(() => import('../../Components/PublictoPriProcess/PublictoPriProcess'))
const PublictoPriWhy = React.lazy(() => import('../../Components/PublictoPriWhy/PublictoPriWhy'))
const PublictoPriFAQ = React.lazy(() => import('../../Components/PublictoPriFAQ/PublictoPriFAQ'))



const Publicltd = () => {
  return (
    <div>
      <PublictoPrivateBreadcrum/>
      <Suspense fallback={<div />}>
        <PublictoPrivateRightPlan />
      </Suspense>
      <Suspense fallback={<div />}>
        <PublictoPriTermsCondition />
      </Suspense>
      <Suspense fallback={<div />}>
        <PublictoPriZolvitPremium />
      </Suspense>
      <Suspense fallback={<div />}>
        <PublictoPriTab />
      </Suspense>

      <div id="company">
        <Suspense fallback={<div />}>
          < PublictoPriOverview/>
        </Suspense>
      </div>
      
      <div id="features">
        <Suspense fallback={<div />}>
          <PublictoPriFeatures/>
        </Suspense>
      </div>

      <div id="benefits">
        <Suspense fallback={<div />}>
          <PublictoPriBenifits/>
        </Suspense>
      </div>

      
      <div id="documents">
        <Suspense fallback={<div />}>
          <PublictoPriDocument/>
        </Suspense>
      </div>

      <div id="process">
        <Suspense fallback={<div />}>
          <PublictoPriProcess />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <PublictoPriWhy />
      </Suspense>

      <div id="faq">
        <Suspense fallback={<div />}>
          <PublictoPriFAQ />
        </Suspense>
      </div>
      


    </div>
  )
}

export default Publicltd
