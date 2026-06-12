import React, { Suspense } from 'react'
import "./TMHearingNew.css";
import TmhearBreadcrum from '../../Components/TmhearBreadcrum/TmhearBreadcrum'

const TmhearPlans = React.lazy(() => import('../../Components/TmhearPlans/TmhearPlans'))
const TmhearGovtCosts = React.lazy(() => import('../../Components/TmhearGovtCosts/TmhearGovtCosts'))
const TmhearTermCondition = React.lazy(() => import('../../Components/TmhearTermCondition/TmhearTermCondition'))
const TmhearZolvitPremium = React.lazy(() => import('../../Components/TmhearZolvitPremium/TmhearZolvitPremium'))
const TmhearTabs = React.lazy(() => import('../../Components/TmhearTabs/TmhearTabs'))
const TmhearOverview = React.lazy(() => import('../../Components/TmhearOverview/TmhearOverview'))
const TmhearFeatures = React.lazy(() => import('../../Components/TmhearFeatures/TmhearFeatures'))
const TmhearBenefits = React.lazy(() => import('../../Components/TmhearBenefits/TmhearBenefits'))
const TmhearElegibility = React.lazy(() => import('../../Components/TmhearElegibility/TmhearElegibility'))
const TmhearDocuments = React.lazy(() => import('../../Components/TmhearDocuments/TmhearDocuments'))
const TmhearFAQ = React.lazy(() => import('../../Components/TmhearFAQ/TmhearFAQ'))

const TMHearingNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <TmhearBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <TmhearPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <TmhearGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <TmhearTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <TmhearZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <TmhearTabs />
      </Suspense>

      <div id="tmhear-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <TmhearOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <TmhearFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <TmhearBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <TmhearElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <TmhearDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <TmhearFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default TMHearingNew
