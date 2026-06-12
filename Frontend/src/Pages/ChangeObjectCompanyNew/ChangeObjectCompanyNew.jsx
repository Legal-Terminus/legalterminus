import React, { Suspense } from 'react'
import "./ChangeObjectCompanyNew.css";
import CocomBreadcrum from '../../Components/CocomBreadcrum/CocomBreadcrum'

const CocomPlans = React.lazy(() => import('../../Components/CocomPlans/CocomPlans'))
const CocomGovtCosts = React.lazy(() => import('../../Components/CocomGovtCosts/CocomGovtCosts'))
const CocomTermCondition = React.lazy(() => import('../../Components/CocomTermCondition/CocomTermCondition'))
const CocomZolvitPremium = React.lazy(() => import('../../Components/CocomZolvitPremium/CocomZolvitPremium'))
const CocomTabs = React.lazy(() => import('../../Components/CocomTabs/CocomTabs'))
const CocomOverview = React.lazy(() => import('../../Components/CocomOverview/CocomOverview'))
const CocomFeatures = React.lazy(() => import('../../Components/CocomFeatures/CocomFeatures'))
const CocomBenefits = React.lazy(() => import('../../Components/CocomBenefits/CocomBenefits'))
const CocomElegibility = React.lazy(() => import('../../Components/CocomElegibility/CocomElegibility'))
const CocomDocuments = React.lazy(() => import('../../Components/CocomDocuments/CocomDocuments'))
const CocomFAQ = React.lazy(() => import('../../Components/CocomFAQ/CocomFAQ'))

const ChangeObjectCompanyNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <CocomBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <CocomPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <CocomGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <CocomTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <CocomZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <CocomTabs />
      </Suspense>

      <div id="cocom-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <CocomOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <CocomFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <CocomBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <CocomElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <CocomDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <CocomFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default ChangeObjectCompanyNew
