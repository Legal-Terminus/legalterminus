import React, { Suspense } from 'react'
import "./TMOppositionNew.css";
import TmoppBreadcrum from '../../Components/TmoppBreadcrum/TmoppBreadcrum'

const TmoppPlans = React.lazy(() => import('../../Components/TmoppPlans/TmoppPlans'))
const TmoppGovtCosts = React.lazy(() => import('../../Components/TmoppGovtCosts/TmoppGovtCosts'))
const TmoppTermCondition = React.lazy(() => import('../../Components/TmoppTermCondition/TmoppTermCondition'))
const TmoppZolvitPremium = React.lazy(() => import('../../Components/TmoppZolvitPremium/TmoppZolvitPremium'))
const TmoppTabs = React.lazy(() => import('../../Components/TmoppTabs/TmoppTabs'))
const TmoppOverview = React.lazy(() => import('../../Components/TmoppOverview/TmoppOverview'))
const TmoppFeatures = React.lazy(() => import('../../Components/TmoppFeatures/TmoppFeatures'))
const TmoppBenefits = React.lazy(() => import('../../Components/TmoppBenefits/TmoppBenefits'))
const TmoppElegibility = React.lazy(() => import('../../Components/TmoppElegibility/TmoppElegibility'))
const TmoppDocuments = React.lazy(() => import('../../Components/TmoppDocuments/TmoppDocuments'))
const TmoppFAQ = React.lazy(() => import('../../Components/TmoppFAQ/TmoppFAQ'))

const TMOppositionNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <TmoppBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <TmoppPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <TmoppGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <TmoppTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <TmoppZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <TmoppTabs />
      </Suspense>

      <div id="tmopp-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <TmoppOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <TmoppFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <TmoppBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <TmoppElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <TmoppDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <TmoppFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default TMOppositionNew
