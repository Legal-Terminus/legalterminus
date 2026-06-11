import React, { Suspense } from 'react'
import "./ProfessionalReg.css";
import ProfTaxBreadcrum from '../../Components/ProfTaxBreadcrum/ProfTaxBreadcrum'

const ProfTaxPlans = React.lazy(() => import('../../Components/ProfTaxPlans/ProfTaxPlans'))
const ProfTaxGovtCosts = React.lazy(() => import('../../Components/ProfTaxGovtCosts/ProfTaxGovtCosts'))
const ProfTaxTermCondition = React.lazy(() => import('../../Components/ProfTaxTermCondition/ProfTaxTermCondition'))
const ProfTaxPriority = React.lazy(() => import('../../Components/ProfTaxPriority/ProfTaxPriority'))
const ProfTaxTabs = React.lazy(() => import('../../Components/ProfTaxTabs/ProfTaxTabs'))
const ProfTaxOverview = React.lazy(() => import('../../Components/ProfTaxOverview/ProfTaxOverview'))
const ProfTaxTypes = React.lazy(() => import('../../Components/ProfTaxTypes/ProfTaxTypes'))
const ProfTaxBenefits = React.lazy(() => import('../../Components/ProfTaxBenefits/ProfTaxBenefits'))
const ProfTaxProcess = React.lazy(() => import('../../Components/ProfTaxProcess/ProfTaxProcess'))
const ProfTaxDocuments = React.lazy(() => import('../../Components/ProfTaxDocuments/ProfTaxDocuments'))
const ProfTaxFAQ = React.lazy(() => import('../../Components/ProfTaxFAQ/ProfTaxFAQ'))

const ProfessionalReg = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <ProfTaxBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <ProfTaxPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <ProfTaxGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <ProfTaxTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <ProfTaxPriority />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <ProfTaxTabs />
      </Suspense>

      <div id="proftax-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <ProfTaxOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <ProfTaxTypes />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <ProfTaxBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <ProfTaxProcess />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <ProfTaxDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <ProfTaxFAQ />
        </Suspense>
      </div>

      </div>

    </div>
  )
}

export default ProfessionalReg
