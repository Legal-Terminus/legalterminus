import React, { Suspense } from 'react'
import "./PvtToLlpNew.css";
import PvtllpBreadcrum from '../../Components/PvtllpBreadcrum/PvtllpBreadcrum'

const PvtllpPlans = React.lazy(() => import('../../Components/PvtllpPlans/PvtllpPlans'))
const PvtllpGovtCosts = React.lazy(() => import('../../Components/PvtllpGovtCosts/PvtllpGovtCosts'))
const PvtllpTermCondition = React.lazy(() => import('../../Components/PvtllpTermCondition/PvtllpTermCondition'))
const PvtllpZolvitPremium = React.lazy(() => import('../../Components/PvtllpZolvitPremium/PvtllpZolvitPremium'))
const PvtllpTabs = React.lazy(() => import('../../Components/PvtllpTabs/PvtllpTabs'))
const PvtllpOverview = React.lazy(() => import('../../Components/PvtllpOverview/PvtllpOverview'))
const PvtllpFeatures = React.lazy(() => import('../../Components/PvtllpFeatures/PvtllpFeatures'))
const PvtllpBenefits = React.lazy(() => import('../../Components/PvtllpBenefits/PvtllpBenefits'))
const PvtllpElegibility = React.lazy(() => import('../../Components/PvtllpElegibility/PvtllpElegibility'))
const PvtllpDocuments = React.lazy(() => import('../../Components/PvtllpDocuments/PvtllpDocuments'))
const PvtllpFAQ = React.lazy(() => import('../../Components/PvtllpFAQ/PvtllpFAQ'))

const PvtToLlpNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <PvtllpBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <PvtllpPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <PvtllpGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <PvtllpTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <PvtllpZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <PvtllpTabs />
      </Suspense>

      <div id="pvtllp-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <PvtllpOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <PvtllpFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <PvtllpBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <PvtllpElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <PvtllpDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <PvtllpFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default PvtToLlpNew
