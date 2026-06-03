import React, { Suspense } from 'react'
import BCbreadcrum from '../../Components/BCbreadcrum/BCbreadcrum'

// Lazy load below-fold components
const BCplanandpricing = React.lazy(() => import('../../Components/BCplanandpricing/BCplanandpricing'))
const BCtermcondition = React.lazy(() => import('../../Components/BCtermcondition/BCtermcondition'))
const BCpremium = React.lazy(() => import('../../Components/BCpremium/BCpremium'))
const BCtabs = React.lazy(() => import('../../Components/BCtabs/BCtabs'))
const BCcompany = React.lazy(() => import('../../Components/BCcompany/BCcompany'))
const BCtypes = React.lazy(() => import('../../Components/BCtypes/BCtypes'))
const BCrequirment = React.lazy(() => import('../../Components/BCrequirment/BCrequirment'))
const BCprocess = React.lazy(() => import('../../Components/BCprocess/BCprocess'))
const BCdocuments = React.lazy(() => import('../../Components/BCdocuments/BCdocuments'))
const BCfaq = React.lazy(() => import('../../Components/BCfaq/BCfaq'))
const BCtestimonial = React.lazy(() => import('../../Components/BCtestimonial/BCtestimonial'))
const BCvideo = React.lazy(() => import('../../Components/BCvideo/BCvideo'))
const BCclients = React.lazy(() => import('../../Components/BCclients/BCclients'))


const PrivateLimited = () => {
  return (
    <div>
     <BCbreadcrum />

      <div id="plans">
      <Suspense fallback={<div />}>
        <BCplanandpricing />
      </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <BCtermcondition />
      </Suspense>

      <div id="premium">
       <Suspense fallback={<div />}>
         <BCpremium />
       </Suspense>
      </div>

     <Suspense fallback={<div />}>
       <BCtabs />
     </Suspense>

      <div id="company">
       <Suspense fallback={<div />}>
         <BCcompany />
       </Suspense>
      </div>

      <div id="types">
        <Suspense fallback={<div />}>
          <BCtypes />
        </Suspense>
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <BCrequirment />
        </Suspense>
      </div>

      <div id="process">
      {/* <BCprocess /> */}
      </div>

      <div id="documents">
        {/* <BCdocuments /> */}
      </div>

      <div id="faq">
      <Suspense fallback={<div />}>
        <BCfaq />
      </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <BCtestimonial />
      </Suspense>
     <Suspense fallback={<div />}>
       <BCvideo />
     </Suspense>
      <Suspense fallback={<div />}>
        <BCclients />
      </Suspense>
    </div>
  );
};

export default PrivateLimited