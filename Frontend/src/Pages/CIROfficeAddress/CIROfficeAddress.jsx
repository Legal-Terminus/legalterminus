import React from 'react'
import CIRbreadcrum from '../../Components/CIRbreadcrum/CIRbreadcrum'
import CIRplans from '../../Components/CIRplans/CIRplans'
import CIRtermconditions from '../../Components/CIRtermconditions/CIRtermconditions'
import CIRpremium from '../../Components/CIRpremium/CIRpremium'
import CIRtabs from '../../Components/CIRtabs/CIRtabs'
import CIRcompany from '../../Components/CIRcompany/CIRcompany'
import CIRtypes from '../../Components/CIRtypes/CIRtypes'
import CIRrequirments from '../../Components/CIRrequirments/CIRrequirments'
import CIRprocess from '../../Components/CIRprocess/CIRprocess'

import CIRdocuments from '../../Components/CIRdocuments/CIRdocuments'
import CIRfaq from '../../Components/CIRfaq/CIRfaq'
import CIRtestimonial from '../../Components/CIRtestimonial/CIRtestimonial'
import CIRvideo from '../../Components/CIRvideo/CIRvideo'
import CIRclient from '../../Components/CIRclient/CIRclient'

const PrivateLimited = () => {
  return (
    <div>
    <CIRbreadcrum />

      <div id="plans">
        {/* <CIRplans /> */}
      </div>

     {/* <CIRtermconditions /> */}


      <div id="premium">
       <CIRpremium />
      </div>

      <CIRtabs />

      <div id="company">
       <CIRcompany />
      </div>

      <div id="types">
        <CIRtypes />
      </div>

      <div id="requirements">
        <CIRrequirments />
      </div>

      <div id="process">
       {/* <CIRprocess /> */}
      </div>

      <div id="documents">
        {/* <CIRdocuments /> */}
      </div>

      <div id="faq">
       <CIRfaq />
      </div>

      <CIRtestimonial />
      <CIRvideo />
      <CIRclient />
    </div>
  );
};

export default PrivateLimited