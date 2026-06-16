import React, { Suspense } from 'react'
import "./PartToLlpNew.css";
import PtollpBreadcrum from '../../Components/PtollpBreadcrum/PtollpBreadcrum'

const PtollpPlans = React.lazy(() => import('../../Components/PtollpPlans/PtollpPlans'))
const PtollpGovtCosts = React.lazy(() => import('../../Components/PtollpGovtCosts/PtollpGovtCosts'))
const PtollpTermCondition = React.lazy(() => import('../../Components/PtollpTermCondition/PtollpTermCondition'))
const PtollpZolvitPremium = React.lazy(() => import('../../Components/PtollpZolvitPremium/PtollpZolvitPremium'))
const PtollpTabs = React.lazy(() => import('../../Components/PtollpTabs/PtollpTabs'))
const PtollpOverview = React.lazy(() => import('../../Components/PtollpOverview/PtollpOverview'))
const PtollpFeatures = React.lazy(() => import('../../Components/PtollpFeatures/PtollpFeatures'))
const PtollpBenefits = React.lazy(() => import('../../Components/PtollpBenefits/PtollpBenefits'))
const PtollpElegibility = React.lazy(() => import('../../Components/PtollpElegibility/PtollpElegibility'))
const PtollpDocuments = React.lazy(() => import('../../Components/PtollpDocuments/PtollpDocuments'))
const PtollpFAQ = React.lazy(() => import('../../Components/PtollpFAQ/PtollpFAQ'))

const PartToLlpNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <PtollpBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <PtollpPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <PtollpGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <PtollpTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <PtollpZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <PtollpTabs />
      </Suspense>

      <div id="ptollp-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <PtollpOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <PtollpFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <PtollpBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <PtollpElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <PtollpDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <PtollpFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default PartToLlpNew
