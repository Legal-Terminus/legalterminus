import React from 'react'
import AddBreadcrum from '../../Components/AddBreadcrum/AddBreadcrum'
import AddPlanandPricing from '../../Components/AddPlanandPricing/AddPlanandPricing'
import AddZolvitPremium from '../../Components/AddZolvitPremium/AddZolvitPremium'
import AddTabs from '../../Components/AddTabs/AddTabs'
import AddCompanyTab from '../../Components/AddCompanyTab/AddCompanyTab'
import AddTypes from '../../Components/AddTypes/AddTypes'
import AddRequirementsTab from '../../Components/AddRequirementsTab/AddRequirementsTab'
import AddProcess from '../../Components/AddProcess/AddProcess'
import PvtltdDocument from '../../Components/PvtltdDocument/PvtltdDocument'
import AddFAQ from '../../Components/AddFAQ/AddFAQ'
import AddTermsCondition from '../../Components/AddTermsCondition/AddTermsCondition'
import AddTestimonial from '../../Components/AddTestimonial/AddTestimonial'
import AddVideoTestimonial from '../../Components/AddVideoTestimonial/AddVideoTestimonial'
import AddOurclints from '../../Components/AddOurclints/AddOurclints'

const PrivateLimited = () => {
  return (
    <div>
      <AddBreadcrum />

      <div id="plans">
        <AddPlanandPricing />
      </div>

      <AddTermsCondition/>


      <div id="premium">
        <AddZolvitPremium />
      </div>

      <AddTabs/>

      <div id="company">
        <AddCompanyTab />
      </div>

      <div id="types">
        <AddTypes />
      </div>

      <div id="requirements">
        <AddRequirementsTab />
      </div>

      <div id="process">
        {/* <AddProcess /> */}
      </div>

      <div id="documents">
        {/* <PvtltdDocument /> */}
      </div>

      <div id="faq">
        <AddFAQ/>
      </div>

      <AddTestimonial />
      <AddVideoTestimonial />
      <AddOurclints />
      
    </div>
  );
};

export default PrivateLimited