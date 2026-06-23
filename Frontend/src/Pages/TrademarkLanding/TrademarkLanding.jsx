import React, { Suspense } from 'react'
import '../CompanyRegOdisha/CompanyRegOdisha.css'
import TrademarkHero from '../../Components/TrademarkHero/TrademarkHero'
import TrademarkWhyChoose from '../../Components/TrademarkWhyChoose/TrademarkWhyChoose'
import tmLawImg from '../../assets/whypvt-imp.svg'
import tmRegImg from '../../assets/whypvt-imp1.svg'

const CompanyRegInfo = React.lazy(() => import('../../Components/CompanyRegInfo/CompanyRegInfo'))
const TrademarkTypes = React.lazy(() => import('../../Components/TrademarkTypes/TrademarkTypes'))
const TmarkElegibility = React.lazy(() => import('../../Components/TmarkElegibility/TmarkElegibility'))
const TmarkDocuments = React.lazy(() => import('../../Components/TmarkDocuments/TmarkDocuments'))
const TrademarkImportance = React.lazy(() => import('../../Components/TrademarkImportance/TrademarkImportance'))
const TmarkFAQ = React.lazy(() => import('../../Components/TmarkFAQ/TmarkFAQ'))
const TrademarkPlans = React.lazy(() => import('../../Components/TrademarkPlans/TrademarkPlans'))
const TrademarkTerms = React.lazy(() => import('../../Components/TrademarkTerms/TrademarkTerms'))
const OurClients = React.lazy(() => import('../../Components/OurClients/OurClients'))

const TrademarkLanding = () => {
  return (
    <div className="cro-page">
      {/* Custom-designed hero */}
      <TrademarkHero />

      {/* Client logos / social proof */}
      <Suspense fallback={<div />}>
        <OurClients />
      </Suspense>

      {/* Why choose Legal Terminus */}
      <TrademarkWhyChoose />

      <div className="section-divider" />

      <div id="plans">
        <Suspense fallback={<div />}>
          <TrademarkPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <TrademarkTerms />
      </Suspense>

      <div className="section-divider" />

      {/* Understanding Trademark Law in India (text + illustration) */}
      <Suspense fallback={<div />}>
        <CompanyRegInfo
          title="Understanding Trademark Law in India"
          image={tmLawImg}
          imageAlt="Understanding trademark law in India"
          paragraphs={[
            "Trademark law in India is governed by the Trade Marks Act, 1999, which protects brand names, logos, taglines, and other marks that distinguish your goods and services. The Trade Marks Registry, under the Controller General of Patents, Designs and Trade Marks (CGPDTM), administers registration through the IP India portal.",
            "A registered trademark grants the owner exclusive rights over the mark and the ability to take legal action against unauthorized use. Marks are filed under the Nice Classification — 45 classes covering goods (1–34) and services (35–45) — and protection lasts 10 years, renewable indefinitely.",
          ]}
        />
      </Suspense>

      <div className="section-divider" />

      {/* What is Trademark Registration (illustration + text) */}
      <Suspense fallback={<div />}>
        <CompanyRegInfo
          title="What is Trademark Registration"
          image={tmRegImg}
          imageAlt="What is trademark registration"
          reverse
          paragraphs={[
            "Registering a trademark is the first step to legally securing your brand identity. The Trade Marks Act, 1999 sets the rules for filing, and the Trade Marks Registry oversees the process. Once registered, your brand gets exclusive legal protection and the right to use the ® symbol.",
            "Choosing the right type of mark — word mark, logo, combination, or non-conventional marks — and the correct class is important, because it defines the scope of your protection. You can start using the ™ symbol as soon as your application is filed.",
            "Registering your trademark also builds customer trust, increases brand and business value, and unlocks access to marketplace brand-protection programmes and IP-backed financing. We handle the complete TM-A process for you on the IP India portal.",
          ]}
        />
      </Suspense>

      <div className="section-divider" />

      {/* Types of Trademark Registration (cards) */}
      <Suspense fallback={<div />}>
        <TrademarkTypes />
      </Suspense>

      <div className="section-divider" />

      {/* Steps */}
      <Suspense fallback={<div />}>
        <TmarkElegibility />
      </Suspense>

      <div className="section-divider" />

      {/* Documents */}
      <Suspense fallback={<div />}>
        <TmarkDocuments />
      </Suspense>

      <div className="section-divider" />

      {/* Why is Trademark Registration Important? */}
      <Suspense fallback={<div />}>
        <TrademarkImportance />
      </Suspense>

      <div className="section-divider" />

      {/* FAQ */}
      <div id="faq">
        <Suspense fallback={<div />}>
          <TmarkFAQ />
        </Suspense>
      </div>
    </div>
  )
}

export default TrademarkLanding
