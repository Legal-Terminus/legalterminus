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

      <div id="plans" className="copy-page-pricing">
        <PvtltdPlanandPricing />
      </div>

      <PvtltdTermsCondition />

      <div id="premium">
        <PvtltdZolvitPremium />
      </div>

      <PvtltdTabs />

      <div id="company">
        <PvtltdCompanyTab />
      </div>

      <div id="types">
        <CopyPvtTypes />
      </div>

      <div id="requirements">
        <PvtltdRequirementsTab />
      </div>

      <div id="process">
        <PvtltdProcess />
      </div>

      <div id="documents">
        <CopyPvtDocument />
      </div>

      <div id="faq">
        <PvtltdFAQ />
      </div>

      <PvtltdTestimonial />
      <PvtltdVideoTestimonial />
      <PvtltdOurclints />

    </div>
  );
};

export default PrivateLimitedCopy
