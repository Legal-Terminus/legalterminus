import React from 'react'
import "./OPC.css";
import OPCBreadcrum from '../../Components/OPCBreadcrum/OPCBreadcrum'
import OPCPlans from '../../Components/OPCPlans/OPCPlans'
import OPCTermCondition from '../../Components/OPCTermCondition/OPCTermCondition'
import OpcZolvitPremium from '../../Components/OpcZolvitPremium/OpcZolvitPremium'
import OPCTabs from '../../Components/OPCTabs/OPCTabs'
import OPCOverview from '../../Components/OPCOverview/OPCOverview'
import OPCFeatures from '../../Components/OPCFeatures/OPCFeatures'
import OPCBenefits from '../../Components/OPCBenefits/OPCBenefits'
import OPCElegibility from '../../Components/OPCElegibility/OPCElegibility'
import OPCDocuments from '../../Components/OPCDocuments/OPCDocuments'
import OPCFAQ from '../../Components/OPCFAQ/OPCFAQ'
import OPCWhy from '../../Components/OPCWhy/OPCWhy'
import OPCOurclints from '../../Components/OPCOurclints/OPCOurclints'


const OPC = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <OPCBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <OPCPlans />
      </div>

      <div className="section-divider" />

      <OPCTermCondition />

      <div className="section-divider" />

      <div id="premium">
        <OpcZolvitPremium />
      </div>

      <OPCTabs />

      <div className="section-divider" />

      <div id="company">
        <OPCOverview />
      </div>

      <div className="section-divider" />

      <div id="types">
        <OPCFeatures />
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <OPCBenefits />
      </div>

      <div className="section-divider" />

      <div id="process">
        <OPCElegibility />
      </div>

      <div className="section-divider" />

      <div id="documents">
        <OPCDocuments />
      </div>

      <div className="section-divider" />

      <div id="faq">
        <OPCFAQ />
      </div>

      <OPCWhy />
      <OPCOurclints />
    </div>
  )
}

export default OPC
