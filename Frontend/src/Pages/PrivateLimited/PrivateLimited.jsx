import React from 'react'
import "./PrivateLimited.css";
import Breadcrum from '../../Components/Breadcrum/Breadcrum'
import PvtltdPlanandPricing from '../../Components/PvtltdPlanandPricing/PvtltdPlanandPricing'
import PvtltdZolvitPremium from '../../Components/PvtltdZolvitPremium/PvtltdZolvitPremium'
import PvtltdTabs from '../../Components/PvtltdTabs/PvtltdTabs'
import PvtltdCompanyTab from '../../Components/PvtltdCompanyTab/PvtltdCompanyTab'
import PvtltdPvtTypes from '../../Components/PvtltdPvtTypes/PvtltdPvtTypes'
import PvtltdRequirementsTab from '../../Components/PvtltdRequirementsTab/PvtltdRequirementsTab'
import PvtltdProcess from '../../Components/PvtltdProcess/PvtltdProcess'
import PvtltdDocument from '../../Components/PvtltdDocument/PvtltdDocument'
import PvtltdFAQ from '../../Components/PvtltdFAQ/PvtltdFAQ'
import PvtltdTermsCondition from '../../Components/PvtltdTermsCondition/PvtltdTermsCondition'
import PvtltdGovtCosts from '../../Components/PvtltdGovtCosts/PvtltdGovtCosts'

const PrivateLimited = () => {
  return (
    <div>
      <div className="pvtltd-page-hero">
        <Breadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="pvtltd-page-pricing">
        <PvtltdPlanandPricing />
      </div>

      <div className="section-divider" />

      <PvtltdGovtCosts />

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
        <PvtltdPvtTypes />
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
        <PvtltdDocument />
      </div>

      <div className="section-divider" />

      <div id="faq">
        <PvtltdFAQ />
      </div>
    </div>
  );
};

export default PrivateLimited
