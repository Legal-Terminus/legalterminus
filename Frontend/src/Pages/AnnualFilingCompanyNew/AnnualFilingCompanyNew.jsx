import React, { Suspense } from 'react'
import "./AnnualFilingCompanyNew.css";
import AfcBreadcrum from '../../Components/AfcBreadcrum/AfcBreadcrum'

const AfcPlans = React.lazy(() => import('../../Components/AfcPlans/AfcPlans'))
const AfcGovtCosts = React.lazy(() => import('../../Components/AfcGovtCosts/AfcGovtCosts'))
const AfcTermCondition = React.lazy(() => import('../../Components/AfcTermCondition/AfcTermCondition'))
const AfcZolvitPremium = React.lazy(() => import('../../Components/AfcZolvitPremium/AfcZolvitPremium'))
const AfcTabs = React.lazy(() => import('../../Components/AfcTabs/AfcTabs'))
const AfcOverview = React.lazy(() => import('../../Components/AfcOverview/AfcOverview'))
const AfcFeatures = React.lazy(() => import('../../Components/AfcFeatures/AfcFeatures'))
const AfcBenefits = React.lazy(() => import('../../Components/AfcBenefits/AfcBenefits'))
const AfcElegibility = React.lazy(() => import('../../Components/AfcElegibility/AfcElegibility'))
const AfcDocuments = React.lazy(() => import('../../Components/AfcDocuments/AfcDocuments'))
const AfcFAQ = React.lazy(() => import('../../Components/AfcFAQ/AfcFAQ'))

const AnnualFilingCompanyNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <AfcBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <AfcPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <AfcGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <AfcTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <AfcZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <AfcTabs />
      </Suspense>

      <div id="afc-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <AfcOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <AfcFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <AfcBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <AfcElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <AfcDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <AfcFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default AnnualFilingCompanyNew
