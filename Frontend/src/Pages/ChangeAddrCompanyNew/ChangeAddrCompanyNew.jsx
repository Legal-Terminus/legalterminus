import React, { Suspense } from 'react'
import "./ChangeAddrCompanyNew.css";
import CacomBreadcrum from '../../Components/CacomBreadcrum/CacomBreadcrum'

const CacomPlans = React.lazy(() => import('../../Components/CacomPlans/CacomPlans'))
const CacomGovtCosts = React.lazy(() => import('../../Components/CacomGovtCosts/CacomGovtCosts'))
const CacomTermCondition = React.lazy(() => import('../../Components/CacomTermCondition/CacomTermCondition'))
const CacomZolvitPremium = React.lazy(() => import('../../Components/CacomZolvitPremium/CacomZolvitPremium'))
const CacomTabs = React.lazy(() => import('../../Components/CacomTabs/CacomTabs'))
const CacomOverview = React.lazy(() => import('../../Components/CacomOverview/CacomOverview'))
const CacomFeatures = React.lazy(() => import('../../Components/CacomFeatures/CacomFeatures'))
const CacomBenefits = React.lazy(() => import('../../Components/CacomBenefits/CacomBenefits'))
const CacomElegibility = React.lazy(() => import('../../Components/CacomElegibility/CacomElegibility'))
const CacomDocuments = React.lazy(() => import('../../Components/CacomDocuments/CacomDocuments'))
const CacomFAQ = React.lazy(() => import('../../Components/CacomFAQ/CacomFAQ'))

const ChangeAddrCompanyNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <CacomBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <CacomPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <CacomGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <CacomTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <CacomZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <CacomTabs />
      </Suspense>

      <div id="cacom-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <CacomOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <CacomFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <CacomBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <CacomElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <CacomDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <CacomFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default ChangeAddrCompanyNew
