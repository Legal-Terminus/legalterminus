import React, { Suspense } from 'react'
import "./ITRIndividualNew.css";
import ItrIndBreadcrum from '../../Components/ItrIndBreadcrum/ItrIndBreadcrum'

const ItrIndPlans = React.lazy(() => import('../../Components/ItrIndPlans/ItrIndPlans'))
const ItrIndPlanInfo = React.lazy(() => import('../../Components/ItrIndPlanInfo/ItrIndPlanInfo'))
const ItrIndTermCondition = React.lazy(() => import('../../Components/ItrIndTermCondition/ItrIndTermCondition'))
const ItrIndZolvitPremium = React.lazy(() => import('../../Components/ItrIndZolvitPremium/ItrIndZolvitPremium'))
const ItrIndTabs = React.lazy(() => import('../../Components/ItrIndTabs/ItrIndTabs'))
const ItrIndOverview = React.lazy(() => import('../../Components/ItrIndOverview/ItrIndOverview'))
const ItrIndFeatures = React.lazy(() => import('../../Components/ItrIndFeatures/ItrIndFeatures'))
const ItrIndBenefits = React.lazy(() => import('../../Components/ItrIndBenefits/ItrIndBenefits'))
const ItrIndElegibility = React.lazy(() => import('../../Components/ItrIndElegibility/ItrIndElegibility'))
const ItrIndDocuments = React.lazy(() => import('../../Components/ItrIndDocuments/ItrIndDocuments'))
const ItrIndFAQ = React.lazy(() => import('../../Components/ItrIndFAQ/ItrIndFAQ'))

const ITRIndividualNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <ItrIndBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <ItrIndPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <ItrIndPlanInfo />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <ItrIndTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <ItrIndZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <ItrIndTabs />
      </Suspense>

      <div id="itrind-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <ItrIndOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <ItrIndFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <ItrIndBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <ItrIndElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <ItrIndDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <ItrIndFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default ITRIndividualNew
