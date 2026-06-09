import React, { Suspense } from 'react'
import "./OLWF.css";
import OPCBreadcrum from '../../Components/OPCBreadcrum/OPCBreadcrum'

const OPCPlans = React.lazy(() => import('../../Components/OPCPlans/OPCPlans'))
const OPCGovtCosts = React.lazy(() => import('../../Components/OPCGovtCosts/OPCGovtCosts'))
const OPCTermCondition = React.lazy(() => import('../../Components/OPCTermCondition/OPCTermCondition'))
const OpcZolvitPremium = React.lazy(() => import('../../Components/OpcZolvitPremium/OpcZolvitPremium'))
const OPCTabs = React.lazy(() => import('../../Components/OPCTabs/OPCTabs'))
const OPCOverview = React.lazy(() => import('../../Components/OPCOverview/OPCOverview'))
const OPCFeatures = React.lazy(() => import('../../Components/OPCFeatures/OPCFeatures'))
const OPCBenefits = React.lazy(() => import('../../Components/OPCBenefits/OPCBenefits'))
const OPCElegibility = React.lazy(() => import('../../Components/OPCElegibility/OPCElegibility'))
const OPCDocuments = React.lazy(() => import('../../Components/OPCDocuments/OPCDocuments'))
const OPCFAQ = React.lazy(() => import('../../Components/OPCFAQ/OPCFAQ'))

const OLWF = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <OPCBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <OPCPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <OPCGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <OPCTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <OpcZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <OPCTabs />
      </Suspense>

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <OPCOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <OPCFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <OPCBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <OPCElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <OPCDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <OPCFAQ />
        </Suspense>
      </div>

    </div>
  )
}

export default OLWF
