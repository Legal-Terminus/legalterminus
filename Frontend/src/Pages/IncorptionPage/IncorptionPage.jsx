import React from "react";
import "./IncorptionPage.css";
import IncorptionBreadcrum from "../../Components/IncorptionBreadcrum/IncorptionBreadcrum";
import IncorporationPlanAndPricing from "../../Components/IncorptionPlanedPriceing/IncorptionPlanedPriceing";
import IncorporationTermsCondition from "../../Components/IncorptionTermsCondition/IncorptionTermsCondition";
import IncorporationPremium from "../../Components/IncorporationPremium/IncorporationPremium";
import IncorporationTabs from "../../Components/IncorporationTabs/IncorporationTabs";
import IncorporationCompanyTabs from "../../Components/IncorporationCompanyTabs/IncorporationCompanyTabs";
import IncorporationPvtTypes from "../../Components/IncorporationPvtTypes/IncorporationPvtTypes";
import IncorporationRequirementsTab from "../../Components/IncorporationRequirementsTab/IncorporationRequirementsTab";
import IncorporationProcess from "../../Components/IncorporationProcess/IncorporationProcess";
import IncorporationDocuments from "../../Components/IncorporationDocuments/IncorporationDocuments";
import IncorporationFAQ from "../../Components/IncorporationFAQ/IncorporationFAQ";

const IncorptionPage = () => {
  return (
    <div>
      <div className="incorp-page-hero">
        <IncorptionBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="incorp-page-pricing">
        <IncorporationPlanAndPricing />
      </div>

      <div className="section-divider" />

      <IncorporationTermsCondition />

      <div className="section-divider" />

      <div id="premium">
        <IncorporationPremium />
      </div>

      <IncorporationTabs />

      <div className="section-divider" />

      <div id="company">
        <IncorporationCompanyTabs />
      </div>

      <div className="section-divider" />

      <div id="types">
        <IncorporationPvtTypes />
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <IncorporationRequirementsTab />
      </div>

      <div className="section-divider" />

      <div id="process">
        <IncorporationProcess />
      </div>

      <div className="section-divider" />

      <div id="documents">
        <IncorporationDocuments />
      </div>

      <div className="section-divider" />

      <div id="faq">
        <IncorporationFAQ />
      </div>
    </div>
  );
};

export default IncorptionPage;
