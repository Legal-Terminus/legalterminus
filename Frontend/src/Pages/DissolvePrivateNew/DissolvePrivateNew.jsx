import React, { Suspense } from 'react'
import "./DissolvePrivateNew.css";
import DpvtBreadcrum from '../../Components/DpvtBreadcrum/DpvtBreadcrum'

const DpvtPlans = React.lazy(() => import('../../Components/DpvtPlans/DpvtPlans'))
const DpvtGovtCosts = React.lazy(() => import('../../Components/DpvtGovtCosts/DpvtGovtCosts'))
const DpvtTermCondition = React.lazy(() => import('../../Components/DpvtTermCondition/DpvtTermCondition'))
const DpvtZolvitPremium = React.lazy(() => import('../../Components/DpvtZolvitPremium/DpvtZolvitPremium'))
const DpvtTabs = React.lazy(() => import('../../Components/DpvtTabs/DpvtTabs'))
const DpvtOverview = React.lazy(() => import('../../Components/DpvtOverview/DpvtOverview'))
const DpvtFeatures = React.lazy(() => import('../../Components/DpvtFeatures/DpvtFeatures'))
const DpvtBenefits = React.lazy(() => import('../../Components/DpvtBenefits/DpvtBenefits'))
const DpvtElegibility = React.lazy(() => import('../../Components/DpvtElegibility/DpvtElegibility'))
const DpvtDocuments = React.lazy(() => import('../../Components/DpvtDocuments/DpvtDocuments'))
const DpvtFAQ = React.lazy(() => import('../../Components/DpvtFAQ/DpvtFAQ'))

const DissolvePrivateNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <DpvtBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <DpvtPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <DpvtGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <DpvtTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <DpvtZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <DpvtTabs />
      </Suspense>

      <div id="dpvt-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <DpvtOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <DpvtFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <DpvtBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <DpvtElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <DpvtDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <DpvtFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default DissolvePrivateNew
