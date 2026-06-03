import React, { Suspense } from 'react'
import ISObreadcrum from '../../Components/ISObreadcrum/ISObreadcrum'

// Lazy load below-fold components
const ISOplan = React.lazy(() => import('../../Components/ISOplan/ISOplan'))
const ISOtermandcondition = React.lazy(() => import('../../Components/ISOtermandcondition/ISOtermandcondition'))
const ISOpremium = React.lazy(() => import('../../Components/ISOpremium/ISOpremium'))
const ISOtabs = React.lazy(() => import('../../Components/ISOtabs/ISOtabs'))
const ISOcompany = React.lazy(() => import('../../Components/ISOcompany/ISOcompany'))
const ISOtypes = React.lazy(() => import('../../Components/ISOtypes/ISOtypes'))
const ISOrequirments = React.lazy(() => import('../../Components/ISOrequirments/ISOrequirments'))
const ISOprocess = React.lazy(() => import('../../Components/ISOprocess/ISOprocess'))
const ISOdocument = React.lazy(() => import('../../Components/ISOdocument/ISOdocument'))
const ISOfaq = React.lazy(() => import('../../Components/ISOfaq/ISOfaq'))
const ISOtestimonial = React.lazy(() => import('../../Components/ISOtestimonial/ISOtestimonial'))
const ISOvideo = React.lazy(() => import('../../Components/ISOvideo/ISOvideo'))
const ISOclients = React.lazy(() => import('../../Components/ISOclients/ISOclients'))

const PrivateLimited = () => {
  return (
    <div>
      <ISObreadcrum />

      <div id="plans">
       <Suspense fallback={<div />}>
         <ISOplan />
       </Suspense>
      </div>

     <Suspense fallback={<div />}>
       <ISOtermandcondition />
     </Suspense>


      <div id="premium">
        <Suspense fallback={<div />}>
          <ISOpremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <ISOtabs />
      </Suspense>

      <div id="company">
       <Suspense fallback={<div />}>
         <ISOcompany />
       </Suspense>
      </div>

      <div id="types">
      <Suspense fallback={<div />}>
        <ISOtypes />
      </Suspense>
      </div>

      <div id="requirements">
       <Suspense fallback={<div />}>
         <ISOrequirments />
       </Suspense>
      </div>

      <div id="process">
        {/* <ISOprocess /> */}
      </div>

      <div id="documents">
       {/* <ISOdocument /> */}
      </div>

      <div id="faq">
       <Suspense fallback={<div />}>
         <ISOfaq />
       </Suspense>
      </div>

     <Suspense fallback={<div />}>
       <ISOtestimonial />
     </Suspense>
     <Suspense fallback={<div />}>
       <ISOvideo/>
     </Suspense>
    <Suspense fallback={<div />}>
      <ISOclients />
    </Suspense>
    </div>
  );
};

export default PrivateLimited