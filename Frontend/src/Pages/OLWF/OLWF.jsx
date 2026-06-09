import React, { Suspense } from 'react'
import "./OLWF.css";
import OLWFBreadcrum from '../../Components/OLWFBreadcrum/OLWFBreadcrum'

const OLWFPlans = React.lazy(() => import('../../Components/OLWFPlans/OLWFPlans'))
const OLWFGovtCosts = React.lazy(() => import('../../Components/OLWFGovtCosts/OLWFGovtCosts'))
const OLWFTermCondition = React.lazy(() => import('../../Components/OLWFTermCondition/OLWFTermCondition'))
const OLWFPriority = React.lazy(() => import('../../Components/OLWFPriority/OLWFPriority'))
const OPCTabs = React.lazy(() => import('../../Components/OPCTabs/OPCTabs'))
const OLWFOverview = React.lazy(() => import('../../Components/OLWFOverview/OLWFOverview'))
const OPCFeatures = React.lazy(() => import('../../Components/OPCFeatures/OPCFeatures'))
const OPCBenefits = React.lazy(() => import('../../Components/OPCBenefits/OPCBenefits'))
const OPCElegibility = React.lazy(() => import('../../Components/OPCElegibility/OPCElegibility'))
const OPCDocuments = React.lazy(() => import('../../Components/OPCDocuments/OPCDocuments'))
const OPCFAQ = React.lazy(() => import('../../Components/OPCFAQ/OPCFAQ'))

const OLWF = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <OLWFBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <OLWFPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <OLWFGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <OLWFTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <OLWFPriority />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <OPCTabs />
      </Suspense>

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <OLWFOverview />
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
