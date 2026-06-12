import React, { Suspense } from 'react'
import "./IncreaseCapitalNew.css";
import IacapBreadcrum from '../../Components/IacapBreadcrum/IacapBreadcrum'

const IacapPlans = React.lazy(() => import('../../Components/IacapPlans/IacapPlans'))
const IacapGovtCosts = React.lazy(() => import('../../Components/IacapGovtCosts/IacapGovtCosts'))
const IacapTermCondition = React.lazy(() => import('../../Components/IacapTermCondition/IacapTermCondition'))
const IacapZolvitPremium = React.lazy(() => import('../../Components/IacapZolvitPremium/IacapZolvitPremium'))
const IacapTabs = React.lazy(() => import('../../Components/IacapTabs/IacapTabs'))
const IacapOverview = React.lazy(() => import('../../Components/IacapOverview/IacapOverview'))
const IacapFeatures = React.lazy(() => import('../../Components/IacapFeatures/IacapFeatures'))
const IacapBenefits = React.lazy(() => import('../../Components/IacapBenefits/IacapBenefits'))
const IacapElegibility = React.lazy(() => import('../../Components/IacapElegibility/IacapElegibility'))
const IacapDocuments = React.lazy(() => import('../../Components/IacapDocuments/IacapDocuments'))
const IacapFAQ = React.lazy(() => import('../../Components/IacapFAQ/IacapFAQ'))

const IncreaseCapitalNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <IacapBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <IacapPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <IacapGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <IacapTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <IacapZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <IacapTabs />
      </Suspense>

      <div id="iacap-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <IacapOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <IacapFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <IacapBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <IacapElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <IacapDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <IacapFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default IncreaseCapitalNew
