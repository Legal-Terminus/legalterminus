import React, { Suspense } from 'react'
import "./TMExamReplyNew.css";
import TmexrBreadcrum from '../../Components/TmexrBreadcrum/TmexrBreadcrum'

const TmexrPlans = React.lazy(() => import('../../Components/TmexrPlans/TmexrPlans'))
const TmexrGovtCosts = React.lazy(() => import('../../Components/TmexrGovtCosts/TmexrGovtCosts'))
const TmexrTermCondition = React.lazy(() => import('../../Components/TmexrTermCondition/TmexrTermCondition'))
const TmexrZolvitPremium = React.lazy(() => import('../../Components/TmexrZolvitPremium/TmexrZolvitPremium'))
const TmexrTabs = React.lazy(() => import('../../Components/TmexrTabs/TmexrTabs'))
const TmexrOverview = React.lazy(() => import('../../Components/TmexrOverview/TmexrOverview'))
const TmexrFeatures = React.lazy(() => import('../../Components/TmexrFeatures/TmexrFeatures'))
const TmexrBenefits = React.lazy(() => import('../../Components/TmexrBenefits/TmexrBenefits'))
const TmexrElegibility = React.lazy(() => import('../../Components/TmexrElegibility/TmexrElegibility'))
const TmexrDocuments = React.lazy(() => import('../../Components/TmexrDocuments/TmexrDocuments'))
const TmexrFAQ = React.lazy(() => import('../../Components/TmexrFAQ/TmexrFAQ'))

const TMExamReplyNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <TmexrBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <TmexrPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <TmexrGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <TmexrTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <TmexrZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <TmexrTabs />
      </Suspense>

      <div id="tmexr-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <TmexrOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <TmexrFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <TmexrBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <TmexrElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <TmexrDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <TmexrFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default TMExamReplyNew
