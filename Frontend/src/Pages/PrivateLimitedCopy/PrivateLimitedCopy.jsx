import React from 'react'
import './PrivateLimitedCopy.css'
import Breadcrum from '../../Components/Breadcrum/Breadcrum'
import PvtltdPlanandPricing from '../../Components/PvtltdPlanandPricing/PvtltdPlanandPricing'
import PvtltdZolvitPremium from '../../Components/PvtltdZolvitPremium/PvtltdZolvitPremium'
import PvtltdTabs from '../../Components/PvtltdTabs/PvtltdTabs'
import PvtltdCompanyTab from '../../Components/PvtltdCompanyTab/PvtltdCompanyTab'
import PvtltdRequirementsTab from '../../Components/PvtltdRequirementsTab/PvtltdRequirementsTab'
import PvtltdProcess from '../../Components/PvtltdProcess/PvtltdProcess'
import CopyPvtDocument from '../../Components/CopyPvtDocument/CopyPvtDocument'
import PvtltdFAQ from '../../Components/PvtltdFAQ/PvtltdFAQ'
import PvtltdTermsCondition from '../../Components/PvtltdTermsCondition/PvtltdTermsCondition'
import PvtltdTestimonial from '../../Components/PvtltdTestimonial/PvtltdTestimonial'
import PvtltdVideoTestimonial from '../../Components/PvtltdVideoTestimonial/PvtltdVideoTestimonial'
import PvtltdOurclints from '../../Components/PvtltdOurclints/PvtltdOurclints'
import CopyPvtTypes from '../../Components/CopyPvtTypes/CopyPvtTypes'

const PrivateLimitedCopy = () => {
  return (
    <div>
      <div className="copy-page-hero">
        <Breadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="copy-page-pricing">
        <PvtltdPlanandPricing />
      </div>

      <div className="section-divider" />

      <PvtltdTermsCondition />

      <div className="section-divider" />

      <div id="premium">
        <PvtltdZolvitPremium />
      </div>

      <div className="section-divider" />

      <PvtltdTabs />

      <div className="section-divider" />

      <div id="company">
        <PvtltdCompanyTab />
      </div>

      <div className="section-divider" />

      <div id="types">
        <CopyPvtTypes />
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <PvtltdRequirementsTab />
      </div>

      <div className="section-divider" />

      <div id="process">
        <PvtltdProcess />
      </div>

      <div className="section-divider" />

      <div id="documents">
        <CopyPvtDocument />
      </div>

      <div className="section-divider" />

      <div id="faq">
        <PvtltdFAQ />
      </div>

      <div className="section-divider" />

      <PvtltdTestimonial />
      <PvtltdVideoTestimonial />
      <PvtltdOurclints />

    </div>
  );
};

export default PrivateLimitedCopy
