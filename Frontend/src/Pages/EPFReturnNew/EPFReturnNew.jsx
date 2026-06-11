import React, { Suspense } from 'react'
import "./EPFReturnNew.css";
import EpfRetBreadcrum from '../../Components/EpfRetBreadcrum/EpfRetBreadcrum'

const EpfRetPlans = React.lazy(() => import('../../Components/EpfRetPlans/EpfRetPlans'))
const EpfRetGovtCosts = React.lazy(() => import('../../Components/EpfRetGovtCosts/EpfRetGovtCosts'))
const EpfRetTermCondition = React.lazy(() => import('../../Components/EpfRetTermCondition/EpfRetTermCondition'))
const EpfRetZolvitPremium = React.lazy(() => import('../../Components/EpfRetZolvitPremium/EpfRetZolvitPremium'))
const EpfRetTabs = React.lazy(() => import('../../Components/EpfRetTabs/EpfRetTabs'))
const EpfRetOverview = React.lazy(() => import('../../Components/EpfRetOverview/EpfRetOverview'))
const EpfRetFeatures = React.lazy(() => import('../../Components/EpfRetFeatures/EpfRetFeatures'))
const EpfRetBenefits = React.lazy(() => import('../../Components/EpfRetBenefits/EpfRetBenefits'))
const EpfRetElegibility = React.lazy(() => import('../../Components/EpfRetElegibility/EpfRetElegibility'))
const EpfRetDocuments = React.lazy(() => import('../../Components/EpfRetDocuments/EpfRetDocuments'))
const EpfRetFAQ = React.lazy(() => import('../../Components/EpfRetFAQ/EpfRetFAQ'))

const EPFReturnNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <EpfRetBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <EpfRetPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <EpfRetGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <EpfRetTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <EpfRetZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <EpfRetTabs />
      </Suspense>

      <div id="epfret-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <EpfRetOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <EpfRetFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <EpfRetBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <EpfRetElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <EpfRetDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <EpfRetFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default EPFReturnNew
