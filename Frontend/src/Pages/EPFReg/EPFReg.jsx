import React from 'react'
import './EPFReg.css'
import EPFRegBreadcrum from '../../Components/EPFRegBreadcrum/EPFRegBreadcrum'
import EPFRegPricing from '../../Components/EPFRegPricing/EPFRegPricing'
import EPFGovtCosts from '../../Components/EPFGovtCosts/EPFGovtCosts'
import EPFRegTermsCondition from '../../Components/EPFRegTermsCondition/EPFRegTermsCondition'
import EPFRegPriority from '../../Components/EPFRegPriority/EPFRegPriority'
import EPFRegTabs from '../../Components/EPFRegTabs/EPFRegTabs'
import EPFRegOverview from '../../Components/EPFRegOverview/EPFRegOverview'
import EPFRegApplicability from '../../Components/EPFRegApplicability/EPFRegApplicability'
import EPFRegBenefits from '../../Components/EPFRegBenefits/EPFRegBenefits'
import EPFRegProcess from '../../Components/EPFRegProcess/EPFRegProcess'
import EPFRegDocuments from '../../Components/EPFRegDocuments/EPFRegDocuments'
import EPFRegFAQ from '../../Components/EPFRegFAQ/EPFRegFAQ'

const EPFReg = () => {
  return (
    <div>
      <div className="copy-page-hero">
        <EPFRegBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="copy-page-pricing">
        <EPFRegPricing />
      </div>

      <div className="section-divider" />

      <EPFGovtCosts />

      <div className="section-divider" />

      <EPFRegTermsCondition />

      <div className="section-divider" />

      <div id="premium">
        <EPFRegPriority />
      </div>

      <EPFRegTabs />

      <div className="section-divider" />

      <div id="overview">
        <EPFRegOverview />
      </div>

      <div className="section-divider" />

      <div id="applicability">
        <EPFRegApplicability />
      </div>

      <div className="section-divider" />

      <div id="benefits">
        <EPFRegBenefits />
      </div>

      <div className="section-divider" />

      <div id="process">
        <EPFRegProcess />
      </div>

      <div className="section-divider" />

      <div id="documents">
        <EPFRegDocuments />
      </div>

      <div className="section-divider" />

      <div id="faq">
        <EPFRegFAQ />
      </div>
    </div>
  )
}

export default EPFReg
