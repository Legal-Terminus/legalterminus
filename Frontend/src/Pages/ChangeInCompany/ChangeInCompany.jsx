import React, { Suspense } from 'react'
import CICbreadcrum from '../../Components/CICbreadcrum/CICbreadcrum'

// Lazy load below-fold components
const CICplan = React.lazy(() => import('../../Components/CICplan/CICplan'))
const CICtermsconditions = React.lazy(() => import('../../Components/CICtermsconditions/CICtermsconditions'))
const CICpremium = React.lazy(() => import('../../Components/CICpremium/CICpremium'))
const CICtabs = React.lazy(() => import('../../Components/CICtabs/CICtabs'))
const CICcompany = React.lazy(() => import('../../Components/CICcompany/CICcompany'))
const CICtypes = React.lazy(() => import('../../Components/CICtypes/CICtypes'))
const CICrequirment = React.lazy(() => import('../../Components/CICrequirment/CICrequirment'))
const CICprocess = React.lazy(() => import('../../Components/CICprocess/CICprocess'))
const CICdocuments = React.lazy(() => import('../../Components/CICdocuments/CICdocuments'))
const CICfaq = React.lazy(() => import('../../Components/CICfaq/CICfaq'))
const CICtestimonial = React.lazy(() => import('../../Components/CICtestimonial/CICtestimonial'))
const CICvideo = React.lazy(() => import('../../Components/CICvideo/CICvideo'))
const CICclients = React.lazy(() => import('../../Components/CICclients/CICclients'))

const PrivateLimited = () => {
  return (
    <div>
     <CICbreadcrum />

      <div id="plans">
       <Suspense fallback={<div />}>
         <CICplan />
       </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <CICtermsconditions />
      </Suspense>

      <div id="premium">
        <Suspense fallback={<div />}>
          <CICpremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <CICtabs />
      </Suspense>

      <div id="company">
       <Suspense fallback={<div />}>
         <CICcompany />
       </Suspense>
      </div>

      <div id="types">
       <Suspense fallback={<div />}>
         <CICtypes />
       </Suspense>
      </div>

      <div id="requirements">
       <Suspense fallback={<div />}>
         <CICrequirment />
       </Suspense>
      </div>

      <div id="process">
       {/* <CICprocess /> */}
      </div>

      <div id="documents">
        {/* <CICdocuments /> */}
      </div>

      <div id="faq">
       <Suspense fallback={<div />}>
         <CICfaq />
       </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <CICtestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <CICvideo />
      </Suspense>
     <Suspense fallback={<div />}>
       <CICclients />
     </Suspense>
    </div>
  );
};

export default PrivateLimited