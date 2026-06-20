import React, { Suspense } from 'react'
import "../CompanyRegOdisha/CompanyRegOdisha.css";
import CroBreadcrum from '../../Components/CroBreadcrum/CroBreadcrum'

const CroPlans = React.lazy(() => import('../../Components/CroPlans/CroPlans'))
const CroGovtCosts = React.lazy(() => import('../../Components/CroGovtCosts/CroGovtCosts'))
const CroTermCondition = React.lazy(() => import('../../Components/CroTermCondition/CroTermCondition'))
const CroPriority = React.lazy(() => import('../../Components/CroPriority/CroPriority'))
const CroTabs = React.lazy(() => import('../../Components/CroTabs/CroTabs'))
const CroOverview = React.lazy(() => import('../../Components/CroOverview/CroOverview'))
const CroTypes = React.lazy(() => import('../../Components/CroTypes/CroTypes'))
const CroBenefits = React.lazy(() => import('../../Components/CroBenefits/CroBenefits'))
const CroProcess = React.lazy(() => import('../../Components/CroProcess/CroProcess'))
const CroDocuments = React.lazy(() => import('../../Components/CroDocuments/CroDocuments'))
const CroFAQ = React.lazy(() => import('../../Components/CroFAQ/CroFAQ'))
const OurClients = React.lazy(() => import('../../Components/OurClients/OurClients'))
const CroTestimonials = React.lazy(() => import('../../Components/CroTestimonials/CroTestimonials'))
const CroContact = React.lazy(() => import('../../Components/CroContact/CroContact'))

const CompanyRegistrationOdisha = () => {
  return (
    <div className="cro-page">
      <div className="cro-page-hero">
        <CroBreadcrum />
      </div>

      {/* Client logos / social proof */}
      <Suspense fallback={<div />}>
        <OurClients />
      </Suspense>

      <div className="section-divider" />

      <div id="plans" className="cro-page-pricing">
        <Suspense fallback={<div />}>
          <CroPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <CroGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <CroTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <CroPriority />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <CroTabs />
      </Suspense>

      <div id="pubpvt-nav-sections">

        <div className="section-divider" />

        <div id="company">
          <Suspense fallback={<div />}>
            <CroOverview />
          </Suspense>
        </div>

        <div className="section-divider" />

        <div id="types">
          <Suspense fallback={<div />}>
            <CroTypes />
          </Suspense>
        </div>

        <div className="section-divider" />

        <div id="requirements">
          <Suspense fallback={<div />}>
            <CroBenefits />
          </Suspense>
        </div>

        <div className="section-divider" />

        <div id="process">
          <Suspense fallback={<div />}>
            <CroProcess />
          </Suspense>
        </div>

        <div className="section-divider" />

        <div id="documents">
          <Suspense fallback={<div />}>
            <CroDocuments />
          </Suspense>
        </div>

        <div className="section-divider" />

        <div id="faq">
          <Suspense fallback={<div />}>
            <CroFAQ />
          </Suspense>
        </div>

      </div>

      {/* Testimonials */}
      <div className="section-divider" />
      <Suspense fallback={<div />}>
        <CroTestimonials />
      </Suspense>

      {/* Contact / book consultation + office + disclaimer */}
      <Suspense fallback={<div />}>
        <CroContact />
      </Suspense>
    </div>
  )
}

export default CompanyRegistrationOdisha
