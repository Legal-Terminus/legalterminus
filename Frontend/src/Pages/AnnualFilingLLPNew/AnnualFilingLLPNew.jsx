import React, { Suspense } from 'react'
import "./AnnualFilingLLPNew.css";
import AflBreadcrum from '../../Components/AflBreadcrum/AflBreadcrum'

const AflPlans = React.lazy(() => import('../../Components/AflPlans/AflPlans'))
const AflGovtCosts = React.lazy(() => import('../../Components/AflGovtCosts/AflGovtCosts'))
const AflTermCondition = React.lazy(() => import('../../Components/AflTermCondition/AflTermCondition'))
const AflZolvitPremium = React.lazy(() => import('../../Components/AflZolvitPremium/AflZolvitPremium'))
const AflTabs = React.lazy(() => import('../../Components/AflTabs/AflTabs'))
const AflOverview = React.lazy(() => import('../../Components/AflOverview/AflOverview'))
const AflFeatures = React.lazy(() => import('../../Components/AflFeatures/AflFeatures'))
const AflBenefits = React.lazy(() => import('../../Components/AflBenefits/AflBenefits'))
const AflElegibility = React.lazy(() => import('../../Components/AflElegibility/AflElegibility'))
const AflDocuments = React.lazy(() => import('../../Components/AflDocuments/AflDocuments'))
const AflFAQ = React.lazy(() => import('../../Components/AflFAQ/AflFAQ'))

const AnnualFilingLLPNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <AflBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <AflPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <AflGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <AflTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <AflZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <AflTabs />
      </Suspense>

      <div id="afl-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <AflOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <AflFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <AflBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <AflElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <AflDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <AflFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default AnnualFilingLLPNew
