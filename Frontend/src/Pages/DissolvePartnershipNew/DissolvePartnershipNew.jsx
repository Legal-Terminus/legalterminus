import React, { Suspense } from 'react'
import "./DissolvePartnershipNew.css";
import DpartBreadcrum from '../../Components/DpartBreadcrum/DpartBreadcrum'

const DpartPlans = React.lazy(() => import('../../Components/DpartPlans/DpartPlans'))
const DpartGovtCosts = React.lazy(() => import('../../Components/DpartGovtCosts/DpartGovtCosts'))
const DpartTermCondition = React.lazy(() => import('../../Components/DpartTermCondition/DpartTermCondition'))
const DpartZolvitPremium = React.lazy(() => import('../../Components/DpartZolvitPremium/DpartZolvitPremium'))
const DpartTabs = React.lazy(() => import('../../Components/DpartTabs/DpartTabs'))
const DpartOverview = React.lazy(() => import('../../Components/DpartOverview/DpartOverview'))
const DpartFeatures = React.lazy(() => import('../../Components/DpartFeatures/DpartFeatures'))
const DpartBenefits = React.lazy(() => import('../../Components/DpartBenefits/DpartBenefits'))
const DpartElegibility = React.lazy(() => import('../../Components/DpartElegibility/DpartElegibility'))
const DpartDocuments = React.lazy(() => import('../../Components/DpartDocuments/DpartDocuments'))
const DpartFAQ = React.lazy(() => import('../../Components/DpartFAQ/DpartFAQ'))

const DissolvePartnershipNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <DpartBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <DpartPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <DpartGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <DpartTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <DpartZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <DpartTabs />
      </Suspense>

      <div id="dpart-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <DpartOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <DpartFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <DpartBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <DpartElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <DpartDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <DpartFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default DissolvePartnershipNew
