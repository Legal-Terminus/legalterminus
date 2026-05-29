import React from 'react'
import "./Publicltd.css";
import PublicBreadcrum from '../../Components/PublicBreadcrum/PublicBreadcrum'
import PublicltdRightPlan from '../../Components/PublicltdRightPlan/PublicltdRightPlan'
import PublicltdTermsCondition from '../../Components/PublicltdTermsCondition/PublicltdTermsCondition'
import PublicltdZolvitPremium from '../../Components/PublicltdZolvitPremium/PublicltdZolvitPremium'
import PublicltdTab from '../../Components/PublicltdTab/PublicltdTab'
import PublicltdOverview from '../../Components/PublicltdOverview/PublicltdOverview'
import PublicltdFeatures from '../../Components/PublicltdFeatures/PublicltdFeatures'
import PublicltdBenifits from '../../Components/PublicltdBenifits/PublicltdBenifits'
import PublicltdDocument from '../../Components/PublicltdDocument/PublicltdDocument'
import PublicltdProcess from '../../Components/PublicltdProcess/PublicltdProcess'
import PublicltdFAQ from '../../Components/PublicltdFAQ/PublicltdFAQ'

const Publicltd = () => {
  return (
    <div>
      <PublicBreadcrum />

      <div className="section-divider" />

      <div id="plans" className="pub-page-pricing">
        <PublicltdRightPlan />
      </div>

      <div className="section-divider" />

      <PublicltdTermsCondition />

      <div className="section-divider" />

      <div id="premium">
        <PublicltdZolvitPremium />
      </div>

      <PublicltdTab />

      <div className="section-divider" />

      <div id="company">
        <PublicltdOverview />
      </div>

      <div className="section-divider" />

      <div id="features">
        <PublicltdFeatures />
      </div>

      <div className="section-divider" />

      <div id="benefits">
        <PublicltdBenifits />
      </div>

      <div className="section-divider" />

      <div id="process">
        <PublicltdProcess />
      </div>

      <div className="section-divider" />

      <div id="documents">
        <PublicltdDocument />
      </div>

      <div className="section-divider" />

      <div id="faq">
        <PublicltdFAQ />
      </div>
    </div>
  )
}

export default Publicltd
