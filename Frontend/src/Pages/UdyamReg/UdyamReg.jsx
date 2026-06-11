import React, { Suspense } from 'react'
import UdyamRegBreadcrum from '../../Components/UdyamRegBreadcrum/UdyamRegBreadcrum'
import UdyamRegTabs from '../../Components/UdyamRegTabs/UdyamRegTabs'

const UdyamRegPlanAndPricing = React.lazy(() => import('../../Components/UdyamRegPlanAndPricing/UdyamRegPlanAndPricing'))
const UdyamRegGovtCosts = React.lazy(() => import('../../Components/UdyamRegGovtCosts/UdyamRegGovtCosts'))
const UdyamRegTermsCondition = React.lazy(() => import('../../Components/UdyamRegTermsCondition/UdyamRegTermsCondition'))
const UdyamRegPriority = React.lazy(() => import('../../Components/UdyamRegPriority/UdyamRegPriority'))

const UdyamRegAbout = React.lazy(() => import('../../Components/UdyamRegAbout/UdyamRegAbout'))
const UdyamRegWho = React.lazy(() => import('../../Components/UdyamRegWho/UdyamRegWho'))
const UdyamRegBenefits = React.lazy(() => import('../../Components/UdyamRegBenefits/UdyamRegBenefits'))
const UdyamRegDocuments = React.lazy(() => import('../../Components/UdyamRegDocuments/UdyamRegDocuments'))
const UdyamRegProcess = React.lazy(() => import('../../Components/UdyamRegProcess/UdyamRegProcess'))
const UdyamRegFAQ = React.lazy(() => import('../../Components/UdyamRegFAQ/UdyamRegFAQ'))

const UdyamReg = () => {
  return (
    <div>
      <UdyamRegBreadcrum />

      <div className="section-divider" />

      <div id="plans">
        <Suspense fallback={<div />}><UdyamRegPlanAndPricing /></Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}><UdyamRegGovtCosts /></Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}><UdyamRegTermsCondition /></Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}><UdyamRegPriority /></Suspense>

      <div className="section-divider" />

      <UdyamRegTabs />

      <div id="udyam-nav-sections">

      <div id="about">
        <Suspense fallback={<div />}><UdyamRegAbout /></Suspense>
      </div>

      <div className="section-divider" />

      <div id="who">
        <Suspense fallback={<div />}><UdyamRegWho /></Suspense>
      </div>

      <div className="section-divider" />

      <div id="benefits">
        <Suspense fallback={<div />}><UdyamRegBenefits /></Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}><UdyamRegProcess /></Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}><UdyamRegDocuments /></Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}><UdyamRegFAQ /></Suspense>
      </div>

      </div>
    </div>
  )
}

export default UdyamReg
