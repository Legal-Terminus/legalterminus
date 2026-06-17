import React, { Suspense } from 'react'
import "./PvtToPublicNew.css";
import PtpubBreadcrum from '../../Components/PtpubBreadcrum/PtpubBreadcrum'

// Lazy load below-fold components
const PtpubRightPlan = React.lazy(() => import('../../Components/PtpubRightPlan/PtpubRightPlan'))
const PtpubGovtCosts = React.lazy(() => import('../../Components/PtpubGovtCosts/PtpubGovtCosts'))
const PtpubTermsCondition = React.lazy(() => import('../../Components/PtpubTermsCondition/PtpubTermsCondition'))
const PtpubZolvitPremium = React.lazy(() => import('../../Components/PtpubZolvitPremium/PtpubZolvitPremium'))
const PtpubTab = React.lazy(() => import('../../Components/PtpubTab/PtpubTab'))
const PtpubOverview = React.lazy(() => import('../../Components/PtpubOverview/PtpubOverview'))
const PtpubFeatures = React.lazy(() => import('../../Components/PtpubFeatures/PtpubFeatures'))
const PtpubBenifits = React.lazy(() => import('../../Components/PtpubBenifits/PtpubBenifits'))
const PtpubDocument = React.lazy(() => import('../../Components/PtpubDocument/PtpubDocument'))
const PtpubProcess = React.lazy(() => import('../../Components/PtpubProcess/PtpubProcess'))
const PtpubFAQ = React.lazy(() => import('../../Components/PtpubFAQ/PtpubFAQ'))

const PvtToPublicNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <PtpubBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <PtpubRightPlan />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <PtpubGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <PtpubTermsCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <PtpubZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <PtpubTab />
      </Suspense>

      <div id="ptpub-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <PtpubOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="features">
        <Suspense fallback={<div />}>
          <PtpubFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="benefits">
        <Suspense fallback={<div />}>
          <PtpubBenifits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <PtpubProcess />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <PtpubDocument />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <PtpubFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default PvtToPublicNew
