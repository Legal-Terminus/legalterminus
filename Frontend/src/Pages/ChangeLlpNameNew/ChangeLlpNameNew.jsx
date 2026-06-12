import React, { Suspense } from 'react'
import "./ChangeLlpNameNew.css";
import CnllpBreadcrum from '../../Components/CnllpBreadcrum/CnllpBreadcrum'

const CnllpPlans = React.lazy(() => import('../../Components/CnllpPlans/CnllpPlans'))
const CnllpGovtCosts = React.lazy(() => import('../../Components/CnllpGovtCosts/CnllpGovtCosts'))
const CnllpTermCondition = React.lazy(() => import('../../Components/CnllpTermCondition/CnllpTermCondition'))
const CnllpZolvitPremium = React.lazy(() => import('../../Components/CnllpZolvitPremium/CnllpZolvitPremium'))
const CnllpTabs = React.lazy(() => import('../../Components/CnllpTabs/CnllpTabs'))
const CnllpOverview = React.lazy(() => import('../../Components/CnllpOverview/CnllpOverview'))
const CnllpFeatures = React.lazy(() => import('../../Components/CnllpFeatures/CnllpFeatures'))
const CnllpBenefits = React.lazy(() => import('../../Components/CnllpBenefits/CnllpBenefits'))
const CnllpElegibility = React.lazy(() => import('../../Components/CnllpElegibility/CnllpElegibility'))
const CnllpDocuments = React.lazy(() => import('../../Components/CnllpDocuments/CnllpDocuments'))
const CnllpFAQ = React.lazy(() => import('../../Components/CnllpFAQ/CnllpFAQ'))

const ChangeLlpNameNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <CnllpBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <CnllpPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <CnllpGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <CnllpTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <CnllpZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <CnllpTabs />
      </Suspense>

      <div id="cnllp-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <CnllpOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <CnllpFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <CnllpBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <CnllpElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <CnllpDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <CnllpFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default ChangeLlpNameNew
