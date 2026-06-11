import React, { Suspense } from 'react'
import "./TMApplicationNew.css";
import TmarkBreadcrum from '../../Components/TmarkBreadcrum/TmarkBreadcrum'

const TmarkPlans = React.lazy(() => import('../../Components/TmarkPlans/TmarkPlans'))
const TmarkGovtCosts = React.lazy(() => import('../../Components/TmarkGovtCosts/TmarkGovtCosts'))
const TmarkTermCondition = React.lazy(() => import('../../Components/TmarkTermCondition/TmarkTermCondition'))
const TmarkZolvitPremium = React.lazy(() => import('../../Components/TmarkZolvitPremium/TmarkZolvitPremium'))
const TmarkTabs = React.lazy(() => import('../../Components/TmarkTabs/TmarkTabs'))
const TmarkOverview = React.lazy(() => import('../../Components/TmarkOverview/TmarkOverview'))
const TmarkFeatures = React.lazy(() => import('../../Components/TmarkFeatures/TmarkFeatures'))
const TmarkBenefits = React.lazy(() => import('../../Components/TmarkBenefits/TmarkBenefits'))
const TmarkElegibility = React.lazy(() => import('../../Components/TmarkElegibility/TmarkElegibility'))
const TmarkDocuments = React.lazy(() => import('../../Components/TmarkDocuments/TmarkDocuments'))
const TmarkFAQ = React.lazy(() => import('../../Components/TmarkFAQ/TmarkFAQ'))

const TMApplicationNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <TmarkBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <TmarkPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <TmarkGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <TmarkTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <TmarkZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <TmarkTabs />
      </Suspense>

      <div id="tmark-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <TmarkOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <TmarkFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <TmarkBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <TmarkElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <TmarkDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <TmarkFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default TMApplicationNew
