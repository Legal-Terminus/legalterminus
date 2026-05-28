import React from 'react'
import "./Parternership.css";
import PRFbreadcrum from '../../Components/PFRbreadcrum/PFRbreadcrum'
import PRFlandpricing from '../../Components/PRFlandpricing/PRFlandpricing'
import PFRtermscondition from '../../Components/PFRtermscondition/PFRtermscondition'
import PFRpremium from '../../Components/PFRpremium/PFRpremium'
import PFRtabs from '../../Components/PFRtabs/PFRtabs'
import PFRcompanytab from '../../Components/PFRcompanytab/PFRcompanytab'
import PFRtypes from '../../Components/PFRtypes/PFRtypes'
import PFRrequirmentTabs from '../../Components/PFRrequirmentTabs/PFRrequirmentTabs'
import PFRprocess from '../../Components/PFRprocess/PFRprocess'
import PFRdocument from '../../Components/PFRdocument/PFRdocument'
import PFRfaq from '../../Components/PFRfaq/PFRfaq'

const PrivateLimited = () => {
  return (
    <div>
      <div className="pfr-page-hero">
        <PRFbreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="pfr-page-pricing">
        <PRFlandpricing />
      </div>

      <div className="section-divider" />

      <PFRtermscondition />

      <div className="section-divider" />

      <div id="premium">
        <PFRpremium />
      </div>

      <PFRtabs />

      <div className="section-divider" />

      <div id="company">
        <PFRcompanytab />
      </div>

      <div className="section-divider" />

      <div id="types">
        <PFRtypes />
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <PFRrequirmentTabs />
      </div>

      <div className="section-divider" />

      <div id="process">
        <PFRprocess />
      </div>

      <div className="section-divider" />

      <div id="documents">
        <PFRdocument />
      </div>

      <div className="section-divider" />

      <div id="faq">
        <PFRfaq />
      </div>
    </div>
  );
};

export default PrivateLimited
