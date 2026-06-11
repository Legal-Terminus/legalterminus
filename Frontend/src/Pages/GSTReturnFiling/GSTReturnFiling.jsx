import React, { Suspense } from 'react'
import "./GSTReturnFiling.css";
import GstFilingBreadcrum from '../../Components/GstFilingBreadcrum/GstFilingBreadcrum'

const GstFilingPlans = React.lazy(() => import('../../Components/GstFilingPlans/GstFilingPlans'))
const GstFilingGovtCosts = React.lazy(() => import('../../Components/GstFilingGovtCosts/GstFilingGovtCosts'))
const GstFilingTermCondition = React.lazy(() => import('../../Components/GstFilingTermCondition/GstFilingTermCondition'))
const GstFilingZolvitPremium = React.lazy(() => import('../../Components/GstFilingZolvitPremium/GstFilingZolvitPremium'))
const GstFilingTabs = React.lazy(() => import('../../Components/GstFilingTabs/GstFilingTabs'))
const GstFilingOverview = React.lazy(() => import('../../Components/GstFilingOverview/GstFilingOverview'))
const GstFilingFeatures = React.lazy(() => import('../../Components/GstFilingFeatures/GstFilingFeatures'))
const GstFilingBenefits = React.lazy(() => import('../../Components/GstFilingBenefits/GstFilingBenefits'))
const GstFilingElegibility = React.lazy(() => import('../../Components/GstFilingElegibility/GstFilingElegibility'))
const GstFilingDocuments = React.lazy(() => import('../../Components/GstFilingDocuments/GstFilingDocuments'))
const GstFilingFAQ = React.lazy(() => import('../../Components/GstFilingFAQ/GstFilingFAQ'))

const GSTReturnFiling = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <GstFilingBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <GstFilingPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <GstFilingGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <GstFilingTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <GstFilingZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <GstFilingTabs />
      </Suspense>

      <div id="gstf-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <GstFilingOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <GstFilingFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <GstFilingBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <GstFilingElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <GstFilingDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <GstFilingFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default GSTReturnFiling
