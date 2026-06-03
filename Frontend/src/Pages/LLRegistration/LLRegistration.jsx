import React, { Suspense } from 'react'
import LLRbreadcrum from '../../Components/LLRbreadcrum/LLRbreadcrum'

// Lazy load below-fold components
const LLRlandpricing = React.lazy(() => import('../../Components/LLRlandpricing/LLRlandpricing'))
const LLRtermcondition = React.lazy(() => import('../../Components/LLRtermcondition/LLRtermcondition'))
const LLRpremium = React.lazy(() => import('../../Components/LLRpremium/LLRpremium'))
const LLRtabs = React.lazy(() => import('../../Components/LLRtabs/LLRtabs'))
const LLRcompanytab = React.lazy(() => import('../../Components/LLRcompanytab/LLRcompanytab'))
const LLRtypes = React.lazy(() => import('../../Components/LLRtypes/LLRtypes'))
const LLRrequirments = React.lazy(() => import('../../Components/LLRrequirments/LLRrequirments'))
const LLRprocess = React.lazy(() => import('../../Components/LLRprocess/LLRprocess'))
const LLRdocument = React.lazy(() => import('../../Components/LLRdocument/LLRdocument'))
const LLRfaq = React.lazy(() => import('../../Components/LLRfaq/LLRfaq'))
const LLRtestimonial = React.lazy(() => import('../../Components/LLRtestimonial/LLRtestimonial'))
const LLRvideotestimonial = React.lazy(() => import('../../Components/LLRvideotestimonial/LLRvideotestimonial'))
const LLRclients = React.lazy(() => import('../../Components/LLRclients/LLRclients'))

const PrivateLimited = () => {
  return (
    <div>
     <LLRbreadcrum />

      <div id="plans">
        {/* <LLRlandpricing /> */}
      </div>

      {/* <LLRtermcondition /> */}


      <div id="premium">
       <Suspense fallback={<div />}>
         <LLRpremium />
       </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <LLRtabs />
      </Suspense>

      <div id="company">
       <Suspense fallback={<div />}>
         <LLRcompanytab/>
       </Suspense>
      </div>

      <div id="types">
        <Suspense fallback={<div />}>
          <LLRtypes />
        </Suspense>
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <LLRrequirments />
        </Suspense>
      </div>

      <div id="process">
        <Suspense fallback={<div />}>
          <LLRprocess />
        </Suspense>
      </div>

      <div id="documents">
        <Suspense fallback={<div />}>
          <LLRdocument />
        </Suspense>
      </div>

      <div id="faq">
       <Suspense fallback={<div />}>
         <LLRfaq />
       </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <LLRtestimonial />
      </Suspense>
     <Suspense fallback={<div />}>
       <LLRvideotestimonial />
     </Suspense>
     <Suspense fallback={<div />}>
       <LLRclients />
     </Suspense>
    </div>
  );
};

export default PrivateLimited