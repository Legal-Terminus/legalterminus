import React, { Suspense } from 'react'
import CIObreadcrum from '../../Components/CIObreadcrum/CIObreadcrum'

// Lazy load below-fold components
const CIOplans = React.lazy(() => import('../../Components/CIOplans/CIOplans'))
const CIOtermconditions = React.lazy(() => import('../../Components/CIOtermconditions/CIOtermconditions'))
const CIOpremium = React.lazy(() => import('../../Components/CIOpremium/CIOpremium'))
const CIOtabs = React.lazy(() => import('../../Components/CIOtabs/CIOtabs'))
const CIOcompany = React.lazy(() => import('../../Components/CIOcompany/CIOcompany'))
const CIOtypes = React.lazy(() => import('../../Components/CIOtypes/CIOtypes'))
const CIOrequirments = React.lazy(() => import('../../Components/CIOrequirments/CIOrequirments'))
const CIOprocess = React.lazy(() => import('../../Components/CIOprocess/CIOprocess'))
const CIOdocument = React.lazy(() => import('../../Components/CIOdocument/CIOdocument'))
const CIOfaq = React.lazy(() => import('../../Components/CIOfaq/CIOfaq'))
const CIOtestimonial = React.lazy(() => import('../../Components/CIOtestimonial/CIOtestimonial'))
const CIOvideo = React.lazy(() => import('../../Components/CIOvideo/CIOvideo'))
const CIOclients = React.lazy(() => import('../../Components/CIOclients/CIOclients'))

const PrivateLimited = () => {
  return (
    <div>
     <CIObreadcrum />

      <div id="plans">
        {/* <CIOplans /> */}
      </div>

      {/* <CIOtermconditions /> */}


      <div id="premium">
       <Suspense fallback={<div />}>
         <CIOpremium />
       </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <CIOtabs />
      </Suspense>
      <div id="company">
        <Suspense fallback={<div />}>
          <CIOcompany />
        </Suspense>
      </div>

      <div id="types">
       <Suspense fallback={<div />}>
         <CIOtypes />
       </Suspense>
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <CIOrequirments />
        </Suspense>
      </div>

      <div id="process">
       {/* <CIOprocess /> */}
      </div>

      <div id="documents">
        {/* <CIOdocument /> */}
      </div>

      <div id="faq">
        <Suspense fallback={<div />}>
          <CIOfaq />
        </Suspense>
      </div>

     <Suspense fallback={<div />}>
       <CIOtestimonial />
     </Suspense>
      <Suspense fallback={<div />}>
        <CIOvideo />
      </Suspense>
      <Suspense fallback={<div />}>
        <CIOclients />
      </Suspense>
    </div>
  );
};

export default PrivateLimited