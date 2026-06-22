import React, { Suspense } from 'react'
import '../CompanyRegOdisha/CompanyRegOdisha.css'
import CompanyRegHero from '../../Components/CompanyRegHero/CompanyRegHero'
import CompanyRegWhyChoose from '../../Components/CompanyRegWhyChoose/CompanyRegWhyChoose'
import companyLawImg from '../../assets/whypvt-imp.svg'
import companyRegImg from '../../assets/whypvt-imp1.svg'

const CompanyRegInfo = React.lazy(() => import('../../Components/CompanyRegInfo/CompanyRegInfo'))
const CompanyRegStructures = React.lazy(() => import('../../Components/CompanyRegStructures/CompanyRegStructures'))
const PvtltdProcess = React.lazy(() => import('../../Components/PvtltdProcess/PvtltdProcess'))
const CopyPvtDocument = React.lazy(() => import('../../Components/CopyPvtDocument/CopyPvtDocument'))
const CompanyRegPlans = React.lazy(() => import('../../Components/CompanyRegPlans/CompanyRegPlans'))
const CompanyRegTerms = React.lazy(() => import('../../Components/CompanyRegTerms/CompanyRegTerms'))
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

const CompanyRegistrationLanding = () => {
  return (
    <div className="cro-page">
      {/* New custom-designed hero */}
      <CompanyRegHero />

      {/* Client logos / social proof */}
      <Suspense fallback={<div />}>
        <OurClients />
      </Suspense>

      {/* Why choose Legal Terminus */}
      <CompanyRegWhyChoose />

      <div className="section-divider" />

      <div id="plans">
        <Suspense fallback={<div />}>
          <CompanyRegPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <CompanyRegTerms />
      </Suspense>

      <div className="section-divider" />

      {/* Understanding Company Law in India (text + illustration) */}
      <Suspense fallback={<div />}>
        <CompanyRegInfo
          title="Understanding Company Law in India"
          image={companyLawImg}
          imageAlt="Understanding company law in India"
          paragraphs={[
            "Company law in India is governed by the Companies Act, 2013, which sets rules for starting, running, and closing a company. The Ministry of Corporate Affairs (MCA) oversees the implementation of this law to ensure businesses follow legal guidelines.",
            "The Act focuses on important aspects like legal compliance, transparency, and accountability in business operations. In addition to this, some industries must follow extra rules set by other regulators like the Securities and Exchange Board of India (SEBI) for stock market-related companies and the Reserve Bank of India (RBI) for financial institutions. These organizations ensure that businesses in their sectors follow specific laws along with the general company law.",
          ]}
        />
      </Suspense>

      <div className="section-divider" />

      {/* What is Company Registration (illustration + text) */}
      <Suspense fallback={<div />}>
        <CompanyRegInfo
          title="What is Company Registration"
          image={companyRegImg}
          imageAlt="What is company registration"
          reverse
          paragraphs={[
            "Registering a company in Odisha is the first step to legally starting your business. The Companies Act, 2013, sets the rules for company formation, and the Ministry of Corporate Affairs (MCA) oversees the process. Once registered, your business gets a legal identity, along with rights and protections under Indian law.",
            "Choosing the right company type is important because it affects how your business operates and follows legal rules. Some common options include private limited companies, limited liability partnerships (LLPs), and one person company.",
            "Registering your company also helps you access government benefits, protect your business legally, and build trust in the market. The MCA provides an easy online process to complete company registration and ensure compliance with legal requirements.",
          ]}
        />
      </Suspense>

      <div className="section-divider" />

      {/* Types of Company Registration (cards) */}
      <Suspense fallback={<div />}>
        <CompanyRegStructures />
      </Suspense>

      <div className="section-divider" />

      {/* Steps (text from Private Limited page) */}
      <Suspense fallback={<div />}>
        <PvtltdProcess />
      </Suspense>

      <div className="section-divider" />

      {/* Documents (text from Private Limited page) */}
      <Suspense fallback={<div />}>
        <CopyPvtDocument />
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

export default CompanyRegistrationLanding
