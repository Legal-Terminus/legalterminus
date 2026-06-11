import React, { Suspense } from 'react'
import "./TMRenewalNew.css";
import TmrnwBreadcrum from '../../Components/TmrnwBreadcrum/TmrnwBreadcrum'

const TmrnwPlans = React.lazy(() => import('../../Components/TmrnwPlans/TmrnwPlans'))
const TmrnwGovtCosts = React.lazy(() => import('../../Components/TmrnwGovtCosts/TmrnwGovtCosts'))
const TmrnwTermCondition = React.lazy(() => import('../../Components/TmrnwTermCondition/TmrnwTermCondition'))
const TmrnwZolvitPremium = React.lazy(() => import('../../Components/TmrnwZolvitPremium/TmrnwZolvitPremium'))
const TmrnwTabs = React.lazy(() => import('../../Components/TmrnwTabs/TmrnwTabs'))
const TmrnwOverview = React.lazy(() => import('../../Components/TmrnwOverview/TmrnwOverview'))
const TmrnwFeatures = React.lazy(() => import('../../Components/TmrnwFeatures/TmrnwFeatures'))
const TmrnwBenefits = React.lazy(() => import('../../Components/TmrnwBenefits/TmrnwBenefits'))
const TmrnwElegibility = React.lazy(() => import('../../Components/TmrnwElegibility/TmrnwElegibility'))
const TmrnwDocuments = React.lazy(() => import('../../Components/TmrnwDocuments/TmrnwDocuments'))
const TmrnwFAQ = React.lazy(() => import('../../Components/TmrnwFAQ/TmrnwFAQ'))

const TMRenewalNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <TmrnwBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <TmrnwPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <TmrnwGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <TmrnwTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <TmrnwZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <TmrnwTabs />
      </Suspense>

      <div id="tmrnw-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <TmrnwOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <TmrnwFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <TmrnwBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <TmrnwElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <TmrnwDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <TmrnwFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default TMRenewalNew
