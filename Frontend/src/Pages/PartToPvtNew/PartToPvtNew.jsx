import React, { Suspense } from 'react'
import "./PartToPvtNew.css";
import PtpvtBreadcrum from '../../Components/PtpvtBreadcrum/PtpvtBreadcrum'

const PtpvtPlans = React.lazy(() => import('../../Components/PtpvtPlans/PtpvtPlans'))
const PtpvtGovtCosts = React.lazy(() => import('../../Components/PtpvtGovtCosts/PtpvtGovtCosts'))
const PtpvtTermCondition = React.lazy(() => import('../../Components/PtpvtTermCondition/PtpvtTermCondition'))
const PtpvtZolvitPremium = React.lazy(() => import('../../Components/PtpvtZolvitPremium/PtpvtZolvitPremium'))
const PtpvtTabs = React.lazy(() => import('../../Components/PtpvtTabs/PtpvtTabs'))
const PtpvtOverview = React.lazy(() => import('../../Components/PtpvtOverview/PtpvtOverview'))
const PtpvtFeatures = React.lazy(() => import('../../Components/PtpvtFeatures/PtpvtFeatures'))
const PtpvtBenefits = React.lazy(() => import('../../Components/PtpvtBenefits/PtpvtBenefits'))
const PtpvtElegibility = React.lazy(() => import('../../Components/PtpvtElegibility/PtpvtElegibility'))
const PtpvtDocuments = React.lazy(() => import('../../Components/PtpvtDocuments/PtpvtDocuments'))
const PtpvtFAQ = React.lazy(() => import('../../Components/PtpvtFAQ/PtpvtFAQ'))

const PartToPvtNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <PtpvtBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <PtpvtPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <PtpvtGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <PtpvtTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <PtpvtZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <PtpvtTabs />
      </Suspense>

      <div id="ptpvt-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <PtpvtOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <PtpvtFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <PtpvtBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <PtpvtElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <PtpvtDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <PtpvtFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default PartToPvtNew
