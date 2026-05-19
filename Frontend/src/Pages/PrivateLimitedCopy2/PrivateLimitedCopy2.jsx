import React from 'react'
import './PrivateLimitedCopy2.css'
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
import CopyPvtTypes from '../../Components/CopyPvtTypes/CopyPvtTypes'

const PrivateLimitedCopy2 = () => {
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

    </div>
  );
};

export default PrivateLimitedCopy2
