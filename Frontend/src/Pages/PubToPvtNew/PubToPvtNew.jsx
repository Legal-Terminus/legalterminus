import React, { Suspense } from 'react'
import "./PubToPvtNew.css";
import PubpvtBreadcrum from '../../Components/PubpvtBreadcrum/PubpvtBreadcrum'

const PubpvtPlans = React.lazy(() => import('../../Components/PubpvtPlans/PubpvtPlans'))
const PubpvtGovtCosts = React.lazy(() => import('../../Components/PubpvtGovtCosts/PubpvtGovtCosts'))
const PubpvtTermCondition = React.lazy(() => import('../../Components/PubpvtTermCondition/PubpvtTermCondition'))
const PubpvtZolvitPremium = React.lazy(() => import('../../Components/PubpvtZolvitPremium/PubpvtZolvitPremium'))
const PubpvtTabs = React.lazy(() => import('../../Components/PubpvtTabs/PubpvtTabs'))
const PubpvtOverview = React.lazy(() => import('../../Components/PubpvtOverview/PubpvtOverview'))
const PubpvtFeatures = React.lazy(() => import('../../Components/PubpvtFeatures/PubpvtFeatures'))
const PubpvtBenefits = React.lazy(() => import('../../Components/PubpvtBenefits/PubpvtBenefits'))
const PubpvtElegibility = React.lazy(() => import('../../Components/PubpvtElegibility/PubpvtElegibility'))
const PubpvtDocuments = React.lazy(() => import('../../Components/PubpvtDocuments/PubpvtDocuments'))
const PubpvtFAQ = React.lazy(() => import('../../Components/PubpvtFAQ/PubpvtFAQ'))

const PubToPvtNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <PubpvtBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <PubpvtPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <PubpvtGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <PubpvtTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <PubpvtZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <PubpvtTabs />
      </Suspense>

      <div id="pubpvt-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <PubpvtOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <PubpvtFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <PubpvtBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <PubpvtElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <PubpvtDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <PubpvtFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default PubToPvtNew
