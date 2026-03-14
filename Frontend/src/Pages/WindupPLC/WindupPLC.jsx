import React from 'react'
import WindupPLCBreadcrum from '../../Components/WindupPLCBreadcrum/WindupPLCBreadcrum';
import WindupPLCPP from '../../Components/WindupPLCPP/WindupPLCPP';
import WindupTC from '../../Components/WindupTC/WindupTC';
import WindupZolvitPremium from '../../Components/WindupZolvitPremium/WindupZolvitPremium';
import WindupPLCTabs from '../../Components/WindupPLCTabs/WindupPLCTabs';
import WindupCompanyTab from '../../Components/WindupCompanyTab/WindupCompanyTab';
import WindupTypes from '../../Components/WindupTypes/WindupTypes';
import WindupPLCRequirements from '../../Components/WindupPLCRequirements/WindupPLCRequirements';
import WindupPLCProcess from '../../Components/WindupPLCProcess/WindupPLCProcess';
import WindupPLCFAQ from '../../Components/WindupPLCFAQ/WindupPLCFAQ';
import WindupPLCTestimonial from '../../Components/WindupPLCTestimonial/WindupPLCTestimonial';
import WindupPLCVideoTestimonial from '../../Components/WindupPLCVideoTestimonial/WindupPLCVideoTestimonial';
import WindupPLCOurclints from '../../Components/WindupPLCOurclints/WindupPLCOurclints';
import WindupPLCDocument from '../../Components/WindupPLCDocument/WindupPLCDocument';

const WindupPLC = () => {
  return (
    <div>

        <WindupPLCBreadcrum/>

        <div id="plans">
            <WindupPLCPP/>
        </div>

        <WindupTC/>

        <div id="premium">
            <WindupZolvitPremium/>
        </div>

        <WindupPLCTabs/>

        <div id="company">
            <WindupCompanyTab/>
        </div>

        <div id="types">
            <WindupTypes/>
        </div>

        <div id="requirements">
            <WindupPLCRequirements/>
        </div>

        <div id="process">
            <WindupPLCProcess/>
        </div>

        <div id="documents">
            <WindupPLCDocument/>
        </div>
        

        <div id="faq">
            <WindupPLCFAQ/>
        </div>

        <WindupPLCTestimonial/>
        <WindupPLCVideoTestimonial/>
        <WindupPLCOurclints/>
        
      
    </div>
  )
}

export default WindupPLC
