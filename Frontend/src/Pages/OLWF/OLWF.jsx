import React, { Suspense } from 'react'
import "./OLWF.css";
import OLWFBreadcrum from '../../Components/OLWFBreadcrum/OLWFBreadcrum'

const OLWFPlans = React.lazy(() => import('../../Components/OLWFPlans/OLWFPlans'))
const OLWFGovtCosts = React.lazy(() => import('../../Components/OLWFGovtCosts/OLWFGovtCosts'))
const OLWFTermCondition = React.lazy(() => import('../../Components/OLWFTermCondition/OLWFTermCondition'))
const OLWFPriority = React.lazy(() => import('../../Components/OLWFPriority/OLWFPriority'))
const OPCTabs = React.lazy(() => import('../../Components/OPCTabs/OPCTabs'))
const OLWFOverview = React.lazy(() => import('../../Components/OLWFOverview/OLWFOverview'))
const OLWFFeatures = React.lazy(() => import('../../Components/OLWFFeatures/OLWFFeatures'))
const OLWFBenefits = React.lazy(() => import('../../Components/OLWFBenefits/OLWFBenefits'))
const OLWFElegibility = React.lazy(() => import('../../Components/OLWFElegibility/OLWFElegibility'))
const OLWFDocuments = React.lazy(() => import('../../Components/OLWFDocuments/OLWFDocuments'))
const OLWFFAQ = React.lazy(() => import('../../Components/OLWFFAQ/OLWFFAQ'))

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
          <OLWFFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <OLWFBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <OLWFElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <OLWFDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <OLWFFAQ />
        </Suspense>
      </div>

    </div>
  )
}

export default OLWF
