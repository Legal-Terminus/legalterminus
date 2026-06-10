import React, { Suspense } from 'react'
import "./BCRegistration.css";
import BCbreadcrum from '../../Components/BCbreadcrum/BCbreadcrum'

const BCplanandpricing = React.lazy(() => import('../../Components/BCplanandpricing/BCplanandpricing'))
const BCGovtCosts = React.lazy(() => import('../../Components/BCGovtCosts/BCGovtCosts'))
const BCtermcondition = React.lazy(() => import('../../Components/BCtermcondition/BCtermcondition'))
const BCpremium = React.lazy(() => import('../../Components/BCpremium/BCpremium'))
const BCtabs = React.lazy(() => import('../../Components/BCtabs/BCtabs'))
const BCcompany = React.lazy(() => import('../../Components/BCcompany/BCcompany'))
const BCtypes = React.lazy(() => import('../../Components/BCtypes/BCtypes'))
const BCrequirment = React.lazy(() => import('../../Components/BCrequirment/BCrequirment'))
const BCprocess = React.lazy(() => import('../../Components/BCprocess/BCprocess'))
const BCdocuments = React.lazy(() => import('../../Components/BCdocuments/BCdocuments'))
const BCfaq = React.lazy(() => import('../../Components/BCfaq/BCfaq'))

const BCRegistration = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <BCbreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <BCplanandpricing />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <BCGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <BCtermcondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <BCpremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <BCtabs />
      </Suspense>

      <div id="bc-nav-sections">

        <div className="section-divider" />

        <div id="company">
          <Suspense fallback={<div />}>
            <BCcompany />
          </Suspense>
        </div>

        <div className="section-divider" />

        <div id="types">
          <Suspense fallback={<div />}>
            <BCtypes />
          </Suspense>
        </div>

        <div className="section-divider" />

        <div id="requirements">
          <Suspense fallback={<div />}>
            <BCrequirment />
          </Suspense>
        </div>

        <div className="section-divider" />

        <div id="process">
          <Suspense fallback={<div />}>
            <BCprocess />
          </Suspense>
        </div>

        <div className="section-divider" />

        <div id="documents">
          <Suspense fallback={<div />}>
            <BCdocuments />
          </Suspense>
        </div>

        <div className="section-divider" />

        <div id="faq">
          <Suspense fallback={<div />}>
            <BCfaq />
          </Suspense>
        </div>

      </div>
    </div>
  );
};

export default BCRegistration;
