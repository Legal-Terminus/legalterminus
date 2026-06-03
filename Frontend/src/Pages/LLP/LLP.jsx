import React, { Suspense } from "react";
import "./LLP.css";
import LLPBreadcrum from "../../Components/LLPBreadcrum/LLPBreadcrum.jsx";

// Lazy load below-fold components
const LLPPlanandPrice = React.lazy(() => import("../../Components/LLPPlanandPrice/LLPPlanandPrice"));
const LLPTermandCondn = React.lazy(() => import("../../Components/LLPTermandCondn/LLPTermandCondn"));
const LLPZolvitPremium = React.lazy(() => import("../../Components/LLPZolvitPremium/LLPZolvitPremium"));
const LLPTabs = React.lazy(() => import("../../Components/LLPTabs/LLPTabs"));
const LLPCompanyTab = React.lazy(() => import("../../Components/LLPCompanyTab/LLPCompanyTab"));
const LLPRequirementsTab = React.lazy(() => import("../../Components/LLPRequirementsTab/LLPRequirementsTab"));
const LLPProcess = React.lazy(() => import("../../Components/LLPProcess/LLPProcess"));
const LLPDocInfographic = React.lazy(() => import("../../Components/LLPDocInfographic/LLPDocInfographic"));
const LLPFAQ = React.lazy(() => import("../../Components/LLPFAQ/LLPFAQ"));

function LLP() {
  return (
    <div>
      <div className="llp-page-hero">
        <LLPBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="llp-page-pricing">
        <Suspense fallback={<div />}>
          <LLPPlanandPrice />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <LLPTermandCondn />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <LLPZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <LLPTabs />
      </Suspense>

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <LLPCompanyTab />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <LLPRequirementsTab />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <LLPProcess />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <LLPDocInfographic />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <LLPFAQ />
        </Suspense>
      </div>
    </div>
  );
}

export default LLP;
