import React, { Suspense } from 'react'
import "./DissolveLLPNew.css";
import DllpBreadcrum from '../../Components/DllpBreadcrum/DllpBreadcrum'

const DllpPlans = React.lazy(() => import('../../Components/DllpPlans/DllpPlans'))
const DllpGovtCosts = React.lazy(() => import('../../Components/DllpGovtCosts/DllpGovtCosts'))
const DllpTermCondition = React.lazy(() => import('../../Components/DllpTermCondition/DllpTermCondition'))
const DllpZolvitPremium = React.lazy(() => import('../../Components/DllpZolvitPremium/DllpZolvitPremium'))
const DllpTabs = React.lazy(() => import('../../Components/DllpTabs/DllpTabs'))
const DllpOverview = React.lazy(() => import('../../Components/DllpOverview/DllpOverview'))
const DllpFeatures = React.lazy(() => import('../../Components/DllpFeatures/DllpFeatures'))
const DllpBenefits = React.lazy(() => import('../../Components/DllpBenefits/DllpBenefits'))
const DllpElegibility = React.lazy(() => import('../../Components/DllpElegibility/DllpElegibility'))
const DllpDocuments = React.lazy(() => import('../../Components/DllpDocuments/DllpDocuments'))
const DllpFAQ = React.lazy(() => import('../../Components/DllpFAQ/DllpFAQ'))

const DissolveLLPNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <DllpBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <DllpPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <DllpGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <DllpTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <DllpZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <DllpTabs />
      </Suspense>

      <div id="dllp-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <DllpOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <DllpFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <DllpBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <DllpElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <DllpDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <DllpFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default DissolveLLPNew
