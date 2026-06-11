import React, { Suspense } from 'react'
import "./ITRBusinessNew.css";
import ItrBizBreadcrum from '../../Components/ItrBizBreadcrum/ItrBizBreadcrum'

const ItrBizPlans = React.lazy(() => import('../../Components/ItrBizPlans/ItrBizPlans'))
const ItrBizGovtCosts = React.lazy(() => import('../../Components/ItrBizGovtCosts/ItrBizGovtCosts'))
const ItrBizTermCondition = React.lazy(() => import('../../Components/ItrBizTermCondition/ItrBizTermCondition'))
const ItrBizZolvitPremium = React.lazy(() => import('../../Components/ItrBizZolvitPremium/ItrBizZolvitPremium'))
const ItrBizTabs = React.lazy(() => import('../../Components/ItrBizTabs/ItrBizTabs'))
const ItrBizOverview = React.lazy(() => import('../../Components/ItrBizOverview/ItrBizOverview'))
const ItrBizFeatures = React.lazy(() => import('../../Components/ItrBizFeatures/ItrBizFeatures'))
const ItrBizBenefits = React.lazy(() => import('../../Components/ItrBizBenefits/ItrBizBenefits'))
const ItrBizElegibility = React.lazy(() => import('../../Components/ItrBizElegibility/ItrBizElegibility'))
const ItrBizDocuments = React.lazy(() => import('../../Components/ItrBizDocuments/ItrBizDocuments'))
const ItrBizFAQ = React.lazy(() => import('../../Components/ItrBizFAQ/ItrBizFAQ'))

const ITRBusinessNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <ItrBizBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <ItrBizPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <ItrBizGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <ItrBizTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <ItrBizZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <ItrBizTabs />
      </Suspense>

      <div id="itrbiz-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <ItrBizOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <ItrBizFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <ItrBizBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <ItrBizElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <ItrBizDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <ItrBizFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default ITRBusinessNew
