import React, { Suspense } from 'react'
import TMApplicaBreadcrum from '../../Components/TMApplicaBreadcrum/TMApplicaBreadcrum'

// Lazy load below-fold components
const TMApplicaPlanandPricing = React.lazy(() => import('../../Components/TMApplicaPlanandPricing/TMApplicaPlanandPricing'))
const TMApplicaTandC = React.lazy(() => import('../../Components/TMApplicaTandC/TMApplicaTandC'))
const TMApplicaZolvitPremium = React.lazy(() => import('../../Components/TMApplicaZolvitPremium/TMApplicaZolvitPremium'))
const TMApplicaTabs = React.lazy(() => import('../../Components/TMApplicaTabs/TMApplicaTabs'))
const TMApplicaCompanyTab = React.lazy(() => import('../../Components/TMApplicaCompanyTab/TMApplicaCompanyTab'))
const TMApplicaTypes = React.lazy(() => import('../../Components/TMApplicaTypes/TMApplicaTypes'))
const TMApplicaRequirementsTab = React.lazy(() => import('../../Components/TMApplicaRequirementsTab/TMApplicaRequirementsTab'))
const TMApplicaProcess = React.lazy(() => import('../../Components/TMApplicaProcess/TMApplicaProcess'))
const TMApplicaDocument = React.lazy(() => import('../../Components/TMApplicaDocument/TMApplicaDocument'))
const TMApplicaFAQ = React.lazy(() => import('../../Components/TMApplicaFAQ/TMApplicaFAQ'))
const TMApplicaTestimonial = React.lazy(() => import('../../Components/TMApplicaTestimonial/TMApplicaTestimonial'))
const TMApplicaVideoTestimonial = React.lazy(() => import('../../Components/TMApplicaVideoTestimonial/TMApplicaVideoTestimonial'))
const TMApplicaOurclints = React.lazy(() => import('../../Components/TMApplicaOurclints/TMApplicaOurclints'))

const TMApplication = () => {
  return (
    <div>

        <TMApplicaBreadcrum/>

        <div id="plans">
        <Suspense fallback={<div />}>
          <TMApplicaPlanandPricing/>
        </Suspense>
        </div>

        <Suspense fallback={<div />}>
          <TMApplicaTandC/>
        </Suspense>

        <div id="premium">
        <Suspense fallback={<div />}>
          <TMApplicaZolvitPremium/>
        </Suspense>
        </div>

        <Suspense fallback={<div />}>
          <TMApplicaTabs/>
        </Suspense>

        <div id="company">
        <Suspense fallback={<div />}>
          <TMApplicaCompanyTab/>
        </Suspense>
        </div>

        <div id="types">
        <Suspense fallback={<div />}>
          <TMApplicaTypes />
        </Suspense>
        </div>

        <div id="requirements">
        <Suspense fallback={<div />}>
          <TMApplicaRequirementsTab />
        </Suspense>
        </div>

        <div id="process">
            <Suspense fallback={<div />}>
              <TMApplicaProcess/>
            </Suspense>
        </div>

        <div id="documents">
          <Suspense fallback={<div />}>
            <TMApplicaDocument/>
          </Suspense>
        </div>

        <div id="faq">
            <Suspense fallback={<div />}>
              <TMApplicaFAQ/>
            </Suspense>
        </div>

        <Suspense fallback={<div />}>
          <TMApplicaTestimonial/>
        </Suspense>
        <Suspense fallback={<div />}>
          <TMApplicaVideoTestimonial/>
        </Suspense>
        <Suspense fallback={<div />}>
          <TMApplicaOurclints/>
        </Suspense>
      
    </div>
  )
}

export default TMApplication
