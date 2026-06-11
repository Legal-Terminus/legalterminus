import React, { Suspense } from 'react'
import "./ESIReturnNew.css";
import EsiRetBreadcrum from '../../Components/EsiRetBreadcrum/EsiRetBreadcrum'

const EsiRetPlans = React.lazy(() => import('../../Components/EsiRetPlans/EsiRetPlans'))
const EsiRetGovtCosts = React.lazy(() => import('../../Components/EsiRetGovtCosts/EsiRetGovtCosts'))
const EsiRetTermCondition = React.lazy(() => import('../../Components/EsiRetTermCondition/EsiRetTermCondition'))
const EsiRetZolvitPremium = React.lazy(() => import('../../Components/EsiRetZolvitPremium/EsiRetZolvitPremium'))
const EsiRetTabs = React.lazy(() => import('../../Components/EsiRetTabs/EsiRetTabs'))
const EsiRetOverview = React.lazy(() => import('../../Components/EsiRetOverview/EsiRetOverview'))
const EsiRetFeatures = React.lazy(() => import('../../Components/EsiRetFeatures/EsiRetFeatures'))
const EsiRetBenefits = React.lazy(() => import('../../Components/EsiRetBenefits/EsiRetBenefits'))
const EsiRetElegibility = React.lazy(() => import('../../Components/EsiRetElegibility/EsiRetElegibility'))
const EsiRetDocuments = React.lazy(() => import('../../Components/EsiRetDocuments/EsiRetDocuments'))
const EsiRetFAQ = React.lazy(() => import('../../Components/EsiRetFAQ/EsiRetFAQ'))

const ESIReturnNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <EsiRetBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <EsiRetPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <EsiRetGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <EsiRetTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <EsiRetZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <EsiRetTabs />
      </Suspense>

      <div id="esiret-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <EsiRetOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <EsiRetFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <EsiRetBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <EsiRetElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <EsiRetDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <EsiRetFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default ESIReturnNew
