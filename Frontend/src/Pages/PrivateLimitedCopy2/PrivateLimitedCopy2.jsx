import React from 'react'
import './PrivateLimitedCopy2.css'
import Breadcrum from '../../Components/Breadcrum/Breadcrum'
import PvtltdTabs from '../../Components/PvtltdTabs/PvtltdTabs'
import PvtltdCompanyTab from '../../Components/PvtltdCompanyTab/PvtltdCompanyTab'
import PvtltdRequirementsTab from '../../Components/PvtltdRequirementsTab/PvtltdRequirementsTab'
import PvtltdProcess from '../../Components/PvtltdProcess/PvtltdProcess'
import CopyPvtDocument from '../../Components/CopyPvtDocument/CopyPvtDocument'
import PvtltdFAQ from '../../Components/PvtltdFAQ/PvtltdFAQ'

const PrivateLimitedCopy2 = () => {
  return (
    <>
      <Breadcrum />

      <PvtltdTabs />

      <div id="company">
        <PvtltdCompanyTab />
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
    </>
  );
};

export default PrivateLimitedCopy2
