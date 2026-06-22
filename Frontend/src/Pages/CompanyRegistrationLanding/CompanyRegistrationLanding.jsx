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
const CompanyRegImportance = React.lazy(() => import('../../Components/CompanyRegImportance/CompanyRegImportance'))
const PvtltdFAQ = React.lazy(() => import('../../Components/PvtltdFAQ/PvtltdFAQ'))
const CompanyRegPlans = React.lazy(() => import('../../Components/CompanyRegPlans/CompanyRegPlans'))
const CompanyRegTerms = React.lazy(() => import('../../Components/CompanyRegTerms/CompanyRegTerms'))
const OurClients = React.lazy(() => import('../../Components/OurClients/OurClients'))

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

      {/* Why is Company Registration Important? */}
      <Suspense fallback={<div />}>
        <CompanyRegImportance />
      </Suspense>

      <div className="section-divider" />

      {/* FAQ (text from Private Limited page) */}
      <div id="faq">
        <Suspense fallback={<div />}>
          <PvtltdFAQ />
        </Suspense>
      </div>
    </div>
  )
}

export default CompanyRegistrationLanding
