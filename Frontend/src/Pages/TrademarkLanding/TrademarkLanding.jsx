import React, { Suspense } from 'react'
import '../CompanyRegOdisha/CompanyRegOdisha.css'
import TrademarkHero from '../../Components/TrademarkHero/TrademarkHero'
import tmLawImg from '../../assets/whypvt-imp.svg'
import tmRegImg from '../../assets/whypvt-imp1.svg'

const CompanyRegInfo = React.lazy(() => import('../../Components/CompanyRegInfo/CompanyRegInfo'))
const TrademarkCommonMarks = React.lazy(() => import('../../Components/TrademarkCommonMarks/TrademarkCommonMarks'))
const TrademarkHowItWorks = React.lazy(() => import('../../Components/TrademarkHowItWorks/TrademarkHowItWorks'))
const TrademarkComparison = React.lazy(() => import('../../Components/TrademarkComparison/TrademarkComparison'))
const TrademarkSymbols = React.lazy(() => import('../../Components/TrademarkSymbols/TrademarkSymbols'))
const TrademarkRights = React.lazy(() => import('../../Components/TrademarkRights/TrademarkRights'))
const TrademarkImportance = React.lazy(() => import('../../Components/TrademarkImportance/TrademarkImportance'))
const TrademarkWhyChooseUs = React.lazy(() => import('../../Components/TrademarkWhyChooseUs/TrademarkWhyChooseUs'))
const TrademarkTypes = React.lazy(() => import('../../Components/TrademarkTypes/TrademarkTypes'))
const TmarkElegibility = React.lazy(() => import('../../Components/TmarkElegibility/TmarkElegibility'))
const TmarkDocuments = React.lazy(() => import('../../Components/TmarkDocuments/TmarkDocuments'))
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

      {/* Most Commonly Filed Trademarks */}
      <Suspense fallback={<div />}>
        <TrademarkCommonMarks />
      </Suspense>

      <div className="section-divider" />

      {/* How It Works */}
      <Suspense fallback={<div />}>
        <TrademarkHowItWorks />
      </Suspense>

      <div className="section-divider" />

      {/* Trademark Registration in Odisha (illustration + text) */}
      <Suspense fallback={<div />}>
        <CompanyRegInfo
          title="Trademark Registration in Odisha"
          image={tmRegImg}
          imageAlt="Trademark registration in Odisha"
          reverse
          paragraphs={[
            "Trademark registration in Odisha protects your business name, logo, or symbol, giving you the legal right to stop others from copying or using it without permission. The process starts with a trademark search to see if your name or logo is available. Then, we help you file your trademark application with IP India, a government body.",
            <>
              At <strong style={{ color: "#16a34a" }}>Legal Terminus</strong>, we guide you through
              every step of the process. We handle all the paperwork, help you pick the right
              trademark class (from 45 available classes), and track your application status until you
              receive the trademark certificate. Your trademark is valid for ten years and can be
              renewed easily.
            </>,
            "Trademark registration gives your brand long-term legal protection, covering specific goods or services in different categories (classes 1–34 for goods and classes 35–45 for services). Our fees are transparent, and we ensure a smooth registration process. Protecting your brand with a trademark is a smart step to secure your business identity.",
          ]}
        />
      </Suspense>

      <div className="section-divider" />

      {/* Know what is Trademark? (text + illustration) */}
      <Suspense fallback={<div />}>
        <CompanyRegInfo
          title="Know what is Trademark?"
          image={tmLawImg}
          imageAlt="What is a trademark"
          paragraphs={[
            "A trademark is a special word, letter, or symbol that makes your brand unique and easy to recognize. It gives your brand legal protection, so others can't use a similar name or logo. This protects your brand's identity and prevents trademark disputes.",
            "To register a trademark in India, you apply through the IP India Office. Once registered, your trademark is protected for 10 years, and you can renew it to keep the protection.",
            "Before applying, it's important to do a trademark search to make sure no one else is already using a similar mark. There are different types of trademarks, like certification marks, which help protect your products or services. After registration, you can use the ® symbol to show your trademark is officially protected.",
          ]}
        />
      </Suspense>

      <div className="section-divider" />

      {/* Differences Between Patents, Trademarks, and Copyrights */}
      <Suspense fallback={<div />}>
        <TrademarkComparison />
      </Suspense>

      <div className="section-divider" />

      {/* Types of Trademark Registration (cards) */}
      <Suspense fallback={<div />}>
        <TrademarkTypes />
      </Suspense>

      <div className="section-divider" />

      {/* Types of Trademark Symbols */}
      <Suspense fallback={<div />}>
        <TrademarkSymbols />
      </Suspense>

      <div className="section-divider" />

      {/* Understanding Rights of a Registered Trademark User */}
      <Suspense fallback={<div />}>
        <TrademarkRights />
      </Suspense>

      <div className="section-divider" />

      {/* Why is Trademark Registration Important? */}
      <Suspense fallback={<div />}>
        <TrademarkImportance />
      </Suspense>

      <div className="section-divider" />

      {/* Why Choose Legal Terminus for Trademark Registration? */}
      <Suspense fallback={<div />}>
        <TrademarkWhyChooseUs />
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
