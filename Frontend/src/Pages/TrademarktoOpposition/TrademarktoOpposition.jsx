import React from "react";

import TrademarktoOppositionBreadcrum from "../../Components/TrademarktoOppositionBreadcrum/TrademarktoOppositionBreadcrum";
import TrademarktoOppositionPlans from "../../Components/TrademarktoOppositionBreadcrum/TrademarktoOppositionBreadcrum";
import TrademarktoOppositionTermCondition from "../../Components/TrademarktoOppositionTermCondition/TrademarktoOppositionTermCondition";
import TrademarktoOppositionZolvitPremium from "../../Components/TrademarktoOppositionZolvitPremium/TrademarktoOppositionZolvitPremium";
import TrademarktoOppositionTabs from "../../Components/TrademarktoOppositionTabs/TrademarktoOppositionTabs";
import TrademarktoOppositionOverview from "../../Components/TrademarktoOppositionOverview/TrademarktoOppositionOverview";
import TrademarktoOppositionFeatures from "../../Components/TrademarktoOppositionFeatures/TrademarktoOppositionFeatures";
import TrademarktoOppositionBenefits from "../../Components/TrademarktoOppositionBenefits/TrademarktoOppositionBenefits";
import TrademarktoOppositionElegibility from "../../Components/TrademarktoOppositionElegibility/TrademarktoOppositionElegibility";
import TrademarktoOppositionDocuments from "../../Components/TrademarktoOppositionDocuments/TrademarktoOppositionDocuments";
import TrademarktoOppositionFAQ from "../../Components/TrademarktoOppositionFAQ/TrademarktoOppositionFAQ";
import TrademarktoOppositionProcess from "../../Components/TrademarktoOppositionProcess/TrademarktoOppositionProcess";
import TrademarktoOppositionWhy from "../../Components/TrademarktoOppositionWhy/TrademarktoOppositionWhy";
import TrademarktoOppositionOurclients from "../../Components/TrademarktoOppositionOurclients/TrademarktoOppositionOurclients";

const TradeLicense = () => {
  return (
    <div>
      <TrademarktoOppositionBreadcrum />

      <div id="plans">
        <TrademarktoOppositionPlans />
      </div>

      <TrademarktoOppositionTermCondition />

      <div id="premium">
        <TrademarktoOppositionZolvitPremium/>
      </div>

      <TrademarktoOppositionTabs />

      <div id="company">
        <TrademarktoOppositionOverview />
      </div>

      <div id="types">
        <TrademarktoOppositionFeatures/>
      </div>

      <div id="requirements">
        <TrademarktoOppositionBenefits/>
      </div>

      <div id="process">
        <TrademarktoOppositionElegibility />
      </div>

     <div id="documents">
        <TrademarktoOppositionDocuments/>
      </div>

      <div id="faq">
        <TrademarktoOppositionFAQ/>
      </div>

      <TrademarktoOppositionProcess />
      <TrademarktoOppositionWhy />
      <TrademarktoOppositionOurclients/>
    </div>
  );
};

export default TradeLicense;
