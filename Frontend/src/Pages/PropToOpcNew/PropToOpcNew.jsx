import React, { Suspense } from 'react'
import "./PropToOpcNew.css";
import PtoopcBreadcrum from '../../Components/PtoopcBreadcrum/PtoopcBreadcrum'

const PtoopcPlans = React.lazy(() => import('../../Components/PtoopcPlans/PtoopcPlans'))
const PtoopcGovtCosts = React.lazy(() => import('../../Components/PtoopcGovtCosts/PtoopcGovtCosts'))
const PtoopcTermCondition = React.lazy(() => import('../../Components/PtoopcTermCondition/PtoopcTermCondition'))
const PtoopcZolvitPremium = React.lazy(() => import('../../Components/PtoopcZolvitPremium/PtoopcZolvitPremium'))
const PtoopcTabs = React.lazy(() => import('../../Components/PtoopcTabs/PtoopcTabs'))
const PtoopcOverview = React.lazy(() => import('../../Components/PtoopcOverview/PtoopcOverview'))
const PtoopcTypes = React.lazy(() => import('../../Components/PtoopcTypes/PtoopcTypes'))
const PtoopcBenefits = React.lazy(() => import('../../Components/PtoopcBenefits/PtoopcBenefits'))
const PtoopcSteps = React.lazy(() => import('../../Components/PtoopcSteps/PtoopcSteps'))
const PtoopcDocuments = React.lazy(() => import('../../Components/PtoopcDocuments/PtoopcDocuments'))
const PtoopcFAQ = React.lazy(() => import('../../Components/PtoopcFAQ/PtoopcFAQ'))

const PropToOpcNew = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <PtoopcBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <PtoopcPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <PtoopcGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <PtoopcTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <PtoopcZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <PtoopcTabs />
      </Suspense>

      <div id="ptoopc-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <PtoopcOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <PtoopcTypes />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <PtoopcBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <PtoopcSteps />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <PtoopcDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <PtoopcFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default PropToOpcNew
