import React, { Suspense } from 'react'
import "./LlpToPvtNew.css";
import LtopvtBreadcrum from '../../Components/LtopvtBreadcrum/LtopvtBreadcrum'

const LtopvtPlans = React.lazy(() => import('../../Components/LtopvtPlans/LtopvtPlans'))
const LtopvtGovtCosts = React.lazy(() => import('../../Components/LtopvtGovtCosts/LtopvtGovtCosts'))
const LtopvtTermCondition = React.lazy(() => import('../../Components/LtopvtTermCondition/LtopvtTermCondition'))
const LtopvtZolvitPremium = React.lazy(() => import('../../Components/LtopvtZolvitPremium/LtopvtZolvitPremium'))
const LtopvtTabs = React.lazy(() => import('../../Components/LtopvtTabs/LtopvtTabs'))
const LtopvtOverview = React.lazy(() => import('../../Components/LtopvtOverview/LtopvtOverview'))
const LtopvtFeatures = React.lazy(() => import('../../Components/LtopvtFeatures/LtopvtFeatures'))
const LtopvtBenefits = React.lazy(() => import('../../Components/LtopvtBenefits/LtopvtBenefits'))
const LtopvtElegibility = React.lazy(() => import('../../Components/LtopvtElegibility/LtopvtElegibility'))
const LtopvtDocuments = React.lazy(() => import('../../Components/LtopvtDocuments/LtopvtDocuments'))
const LtopvtFAQ = React.lazy(() => import('../../Components/LtopvtFAQ/LtopvtFAQ'))

const LlpToPvtNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <LtopvtBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <LtopvtPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <LtopvtGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <LtopvtTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <LtopvtZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <LtopvtTabs />
      </Suspense>

      <div id="ltopvt-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <LtopvtOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <LtopvtFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <LtopvtBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <LtopvtElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <LtopvtDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <LtopvtFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default LlpToPvtNew
