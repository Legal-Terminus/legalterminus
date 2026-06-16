import React, { Suspense } from 'react'
import "./PropToPvtNew.css";
import PtopvtBreadcrum from '../../Components/PtopvtBreadcrum/PtopvtBreadcrum'

const PtopvtPlans = React.lazy(() => import('../../Components/PtopvtPlans/PtopvtPlans'))
const PtopvtGovtCosts = React.lazy(() => import('../../Components/PtopvtGovtCosts/PtopvtGovtCosts'))
const PtopvtTermCondition = React.lazy(() => import('../../Components/PtopvtTermCondition/PtopvtTermCondition'))
const PtopvtZolvitPremium = React.lazy(() => import('../../Components/PtopvtZolvitPremium/PtopvtZolvitPremium'))
const PtopvtTabs = React.lazy(() => import('../../Components/PtopvtTabs/PtopvtTabs'))
const PtopvtOverview = React.lazy(() => import('../../Components/PtopvtOverview/PtopvtOverview'))
const PtopvtFeatures = React.lazy(() => import('../../Components/PtopvtFeatures/PtopvtFeatures'))
const PtopvtBenefits = React.lazy(() => import('../../Components/PtopvtBenefits/PtopvtBenefits'))
const PtopvtElegibility = React.lazy(() => import('../../Components/PtopvtElegibility/PtopvtElegibility'))
const PtopvtDocuments = React.lazy(() => import('../../Components/PtopvtDocuments/PtopvtDocuments'))
const PtopvtFAQ = React.lazy(() => import('../../Components/PtopvtFAQ/PtopvtFAQ'))

const PropToPvtNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <PtopvtBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <PtopvtPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <PtopvtGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <PtopvtTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <PtopvtZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <PtopvtTabs />
      </Suspense>

      <div id="ptopvt-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <PtopvtOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <PtopvtFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <PtopvtBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <PtopvtElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <PtopvtDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <PtopvtFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default PropToPvtNew
