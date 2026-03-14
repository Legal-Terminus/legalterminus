import React from 'react'
import CIObreadcrum from '../../Components/CIObreadcrum/CIObreadcrum'
import CIOplans from '../../Components/CIOplans/CIOplans'
import CIOtermconditions from '../../Components/CIOtermconditions/CIOtermconditions'
import CIOpremium from '../../Components/CIOpremium/CIOpremium'
import CIOtabs from '../../Components/CIOtabs/CIOtabs'
import CIOcompany from '../../Components/CIOcompany/CIOcompany'
import CIOtypes from '../../Components/CIOtypes/CIOtypes'
import CIOrequirments from '../../Components/CIOrequirments/CIOrequirments'
import CIOprocess from '../../Components/CIOprocess/CIOprocess'

import CIOdocument from '../../Components/CIOdocument/CIOdocument'

import CIOfaq from '../../Components/CIOfaq/CIOfaq'
import CIOtestimonial from '../../Components/CIOtestimonial/CIOtestimonial'
import CIOvideo from '../../Components/CIOvideo/CIOvideo'
import CIOclients from '../../Components/CIOclients/CIOclients'

const PrivateLimited = () => {
  return (
    <div>
     <CIObreadcrum />

      <div id="plans">
        {/* <CIOplans /> */}
      </div>

      {/* <CIOtermconditions /> */}


      <div id="premium">
       <CIOpremium />
      </div>

      <CIOtabs />
      <div id="company">
        <CIOcompany />
      </div>

      <div id="types">
       <CIOtypes />
      </div>

      <div id="requirements">
        <CIOrequirments />
      </div>

      <div id="process">
       {/* <CIOprocess /> */}
      </div>

      <div id="documents">
        {/* <CIOdocument /> */}
      </div>

      <div id="faq">
        <CIOfaq />
      </div>

     <CIOtestimonial />
      <CIOvideo />
      <CIOclients />
    </div>
  );
};

export default PrivateLimited