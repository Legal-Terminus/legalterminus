const fs = require('fs');
const path = require('path');
const base = 'c:/Users/Shipra/OneDrive/Desktop/Legal-Terminus Project/Frontend/src/Components';

const files = [
  { rel: 'AddPlanandPricing/AddPlanandPricing.css', cls: '.Add-pp-card' },
  { rel: 'ChangeaddComPlanandPricing/ChangeaddComPlanandPricing.css', cls: '.plan-card' },
  { rel: 'ChangeLlpPlanandPrice/ChangeLlpPlanandPrice.css', cls: '.ChangeLlp-plan-card' },
  { rel: 'ChangeObjectComPlanandPricing/ChangeObjectComPlanandPricing.css', cls: '.Change-ob-Pp-plan-card' },
  { rel: 'ChangetoCompanyPlanandPrice/ChangetoCompanyPlanandPrice.css', cls: '.prp-price-card' },
  { rel: 'ChangetoLlpPlanandPrice/ChangetoLlpPlanandPrice.css', cls: '.llpprice-card' },
  { rel: 'DissolveLLPPlanAndPricing/DissolveLLPPlanAndPricing.css', cls: '.Dissllp-plan-card' },
  { rel: 'DissolvePrivatePlanAndPricing/DissolvePrivatePlanAndPricing.css', cls: '.DissolvePrivate-plan-card' },
  { rel: 'DPPlanAndPricing/DPPlanAndPricing.css', cls: '.DP-plan-card' },
  { rel: 'ESICRegPricing/ESICRegPricing.css', cls: '.plan-card' },
  { rel: 'FoodLicensePlans/FoodLicensePlans.css', cls: '.foodlicenseplan-card' },
  { rel: 'IECPlans/IECPlans.css', cls: '.iecplan-card' },
  { rel: 'IncreasePlanandPricing/IncreasePlanandPricing.css', cls: '.Increase-plan-card' },
  { rel: 'LlptoPrivatePlanandPrice/LlptoPrivatePlanandPrice.css', cls: '.plan-card' },
  { rel: 'PartnershipLLPPlanandPricing/PartnershipLLPPlanandPricing.css', cls: '.llp-plan-card' },
  { rel: 'PartnershiptoPrivatePlanandPricing/PartnershiptoPrivatePlanandPricing.css', cls: '.plan-card' },
  { rel: 'PritoLlpPlanandPricing/PritoLlpPlanandPricing.css', cls: '.plan-card' },
  { rel: 'PritoPublicPlanandPricing/PritoPublicPlanandPricing.css', cls: '.prp-price-card' },
  { rel: 'ProFOPCPlanandPricing/ProFOPCPlanandPricing.css', cls: '.profopc-plan-card' },
  { rel: 'ProFPLCPlanandPricing/ProFPLCPlanandPricing.css', cls: '.profplc-plan-card' },
  { rel: 'PublictoPrivateRightPlan/PublictoPrivateRightPlan.css', cls: '.plt-pr-card' },
  { rel: 'ReplyOfERPlanandPricing/ReplyOfERPlanandPricing.css', cls: '.Replyof-ER-plan--card' },
  { rel: 'SccietyPlanAndPricing/SccietyPlanAndPricing.css', cls: '.Society-plan-card' },
  { rel: 'ShopRegPlanandPricing/ShopRegPlanandPricing.css', cls: '.plan-card' },
  { rel: 'TMApplicaPlanandPricing/TMApplicaPlanandPricing.css', cls: '.Applica-card' },
  { rel: 'TMPlanandPricing/TMPlanandPricing.css', cls: '.TM-Renewal-card' },
  { rel: 'TradeLicensePlans/TradeLicensePlans.css', cls: '.tradeplan-card' },
  { rel: 'TrademarktoHearingPlans/TrademarktoHearingPlans.css', cls: '.thplan-card' },
  { rel: 'TrademarktoOppositionPlans/TrademarktoOppositionPlans.css', cls: '.tpl-card' },
  { rel: 'TrustPlanAndPricing/TrustPlanAndPricing.css', cls: '.trust-plan-card' },
  { rel: 'IncorptionPlanedPriceing/IncorporationPlanAndPricing.css', cls: '.incorp-plan-card' },
];

const BORDER = '  border: 1.5px solid rgba(34, 197, 94, 0.45);';
const HOVER_BORDER = '  border-color: rgba(34, 197, 94, 0.85);\n  box-shadow: 0 12px 36px rgba(34, 197, 94, 0.18);';

let patched = 0;
for (const item of files) {
  const p = path.join(base, item.rel);
  if (!fs.existsSync(p)) { console.log('NOT FOUND: ' + item.rel); continue; }
  let c = fs.readFileSync(p, 'utf8');

  // Escape special regex chars in class name
  const escaped = item.cls.replace(/[.[\]{}()*+?\\^$|]/g, function(ch) { return '\\' + ch; });

  // Match the base class block (not :hover, not --modifier)
  // We match the class followed by optional whitespace then {
  const basePattern = new RegExp(escaped + '\\s*\\{');
  const baseMatch = basePattern.exec(c);
  if (!baseMatch) { console.log('CLASS NOT FOUND IN: ' + item.rel + ' cls=' + item.cls); continue; }

  const blockStart = baseMatch.index + baseMatch[0].length;
  const blockEnd = c.indexOf('}', blockStart);
  const block = c.slice(blockStart, blockEnd);

  if (block.includes('border:') || block.includes('border ')) {
    console.log('ALREADY HAS BORDER: ' + item.rel);
    continue;
  }

  // Insert border after opening brace
  c = c.slice(0, blockStart) + '\n' + BORDER + c.slice(blockStart);

  // Update :hover block if present
  const hoverPattern = new RegExp(escaped + ':hover\\s*\\{');
  const hoverMatch = hoverPattern.exec(c);
  if (hoverMatch) {
    const hStart = hoverMatch.index + hoverMatch[0].length;
    const hEnd = c.indexOf('}', hStart);
    const hBlock = c.slice(hStart, hEnd);
    if (!hBlock.includes('border-color')) {
      c = c.slice(0, hStart) + '\n' + HOVER_BORDER + c.slice(hStart);
    }
  }

  fs.writeFileSync(p, c, 'utf8');
  console.log('PATCHED: ' + item.rel);
  patched++;
}
console.log('Done. Patched ' + patched + ' files.');
