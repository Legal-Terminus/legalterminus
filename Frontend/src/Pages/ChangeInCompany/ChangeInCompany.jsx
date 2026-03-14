import React from 'react'
import CICbreadcrum from '../../Components/CICbreadcrum/CICbreadcrum'
import CICplan from '../../Components/CICplan/CICplan'
import CICtermsconditions from '../../Components/CICtermsconditions/CICtermsconditions'
import CICpremium from '../../Components/CICpremium/CICpremium'
import CICtabs from '../../Components/CICtabs/CICtabs'
import CICcompany from '../../Components/CICcompany/CICcompany'
import CICtypes from '../../Components/CICtypes/CICtypes'
import CICrequirment from '../../Components/CICrequirment/CICrequirment'
import CICprocess from '../../Components/CICprocess/CICprocess'

import CICdocuments from '../../Components/CICdocuments/CICdocuments'

import CICfaq from '../../Components/CICfaq/CICfaq'
import CICtestimonial from '../../Components/CICtestimonial/CICtestimonial'
import CICvideo from '../../Components/CICvideo/CICvideo'
import CICclients from '../../Components/CICclients/CICclients'

const PrivateLimited = () => {
  return (
    <div>
     <CICbreadcrum />

      <div id="plans">
       <CICplan />
      </div>

      <CICtermsconditions />

      <div id="premium">
        <CICpremium />
      </div>

      <CICtabs />

      <div id="company">
       <CICcompany />
      </div>

      <div id="types">
       <CICtypes />
      </div>

      <div id="requirements">
       <CICrequirment />
      </div>

      <div id="process">
       {/* <CICprocess /> */}
      </div>

      <div id="documents">
        {/* <CICdocuments /> */}
      </div>

      <div id="faq">
       <CICfaq />
      </div>

      <CICtestimonial />
      <CICvideo />
     <CICclients />
    </div>
  );
};

export default PrivateLimited