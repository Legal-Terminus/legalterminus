import React from 'react'
import './EPFReg.css'
import EPFRegBreadcrum from '../../Components/EPFRegBreadcrum/EPFRegBreadcrum'
import EPFRegTabs from '../../Components/EPFRegTabs/EPFRegTabs'
import EPFRegOverview from '../../Components/EPFRegOverview/EPFRegOverview'
import EPFRegBenefits from '../../Components/EPFRegBenefits/EPFRegBenefits'
import EPFRegApplicability from '../../Components/EPFRegApplicability/EPFRegApplicability'
import EPFRegDocuments from '../../Components/EPFRegDocuments/EPFRegDocuments'
import EPFRegProcess from '../../Components/EPFRegProcess/EPFRegProcess'
import EPFRegPenalties from '../../Components/EPFRegPenalties/EPFRegPenalties'
import EPFRegWhy from '../../Components/EPFRegWhy/EPFRegWhy'
import EPFRegFAQ from '../../Components/EPFRegFAQ/EPFRegFAQ'

const EPFReg = () => {
  return (
    <div>
      <div className="copy-page-hero">
        <EPFRegBreadcrum />
      </div>

      <div className="section-divider" />

      <EPFRegTabs />

      <div className="section-divider" />

      <div id="overview">
        <EPFRegOverview />
      </div>

      <div className="section-divider" />

      <div id="benefits">
        <EPFRegBenefits />
      </div>

      <div className="section-divider" />

      <div id="applicability">
        <EPFRegApplicability />
      </div>

      <div className="section-divider" />

      <div id="documents">
        <EPFRegDocuments />
      </div>

      <div className="section-divider" />

      <div id="process">
        <EPFRegProcess />
      </div>

      <div className="section-divider" />

      <div id="penalties">
        <EPFRegPenalties />
      </div>

      <div className="section-divider" />

      <div id="why">
        <EPFRegWhy />
      </div>

      <div className="section-divider" />

      <div id="faq">
        <EPFRegFAQ />
      </div>
    </div>
  )
}

export default EPFReg
