import React, { Suspense } from 'react'
import "./Publicltd.css";
import PublicBreadcrum from '../../Components/PublicBreadcrum/PublicBreadcrum'

// Lazy load below-fold components
const PublicltdRightPlan = React.lazy(() => import('../../Components/PublicltdRightPlan/PublicltdRightPlan'))
const PublicltdGovtCosts = React.lazy(() => import('../../Components/PublicltdGovtCosts/PublicltdGovtCosts'))
const PublicltdTermsCondition = React.lazy(() => import('../../Components/PublicltdTermsCondition/PublicltdTermsCondition'))
const PublicltdZolvitPremium = React.lazy(() => import('../../Components/PublicltdZolvitPremium/PublicltdZolvitPremium'))
const PublicltdTab = React.lazy(() => import('../../Components/PublicltdTab/PublicltdTab'))
const PublicltdOverview = React.lazy(() => import('../../Components/PublicltdOverview/PublicltdOverview'))
const PublicltdFeatures = React.lazy(() => import('../../Components/PublicltdFeatures/PublicltdFeatures'))
const PublicltdBenifits = React.lazy(() => import('../../Components/PublicltdBenifits/PublicltdBenifits'))
const PublicltdDocument = React.lazy(() => import('../../Components/PublicltdDocument/PublicltdDocument'))
const PublicltdProcess = React.lazy(() => import('../../Components/PublicltdProcess/PublicltdProcess'))
const PublicltdFAQ = React.lazy(() => import('../../Components/PublicltdFAQ/PublicltdFAQ'))

const Publicltd = () => {
  return (
    <div>
      <PublicBreadcrum />

      <div className="section-divider" />

      <div id="plans" className="pub-page-pricing">
        <Suspense fallback={<div />}>
          <PublicltdRightPlan />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <PublicltdGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <PublicltdTermsCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <PublicltdZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <PublicltdTab />
      </Suspense>

      <div id="publicltd-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <PublicltdOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="features">
        <Suspense fallback={<div />}>
          <PublicltdFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="benefits">
        <Suspense fallback={<div />}>
          <PublicltdBenifits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <PublicltdProcess />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <PublicltdDocument />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <PublicltdFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default Publicltd
