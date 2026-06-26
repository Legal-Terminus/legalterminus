import React from "react";
import "./ItrIndTermCondition.css";

const ItrIndTermCondition = () => {
  return (
    <section className="opctc-section">
      <div className="opctc-container">
        <div className="opctc-card">
          <h2 className="opctc-title">TERMS &amp; CONDITIONS</h2>

          <p className="opctc-subtitle">
            By subscribing to the above plans, you agree to abide by our following additional terms and conditions
          </p>

          <ol className="opctc-list">
            <li className="opctc-item">
              <strong>Per-Return Engagement Model:</strong> Our Individual ITR Filing plans are per-return engagements (one engagement, one ITR for ONE INDIVIDUAL for ONE ASSESSMENT YEAR). Plan tier defines scope per the 6-tier matrix — 3 Base plans by income level (ITR-1 Sahaj) + 3 Plus plans by complexity layers (ITR-2).
            </li>
            <li className="opctc-item">
              <strong>Plan Eligibility — BASE TIER (ITR-1 Sahaj):</strong> For Resident Individual with income from Salary + 1 House Property + Other Sources (interest) + Agricultural income up to ₹5,000. (a) ELEMENTAL (₹799/return) — INCOME UP TO ₹5 LAKH. (b) ENRICHED (₹1,499/return) — INCOME UP TO ₹10 LAKH. (c) SUPREME (₹1,999/return) — INCOME MORE THAN ₹10 LAKH (ITR-1 till ₹50L; ITR-2 if income exceeds ₹50L). NOT for: capital gains, foreign income, NRI, business income.
            </li>
            <li className="opctc-item">
              <strong>Plan Eligibility — PLUS TIER (ITR-2):</strong> For individuals with income types beyond basic salaried profile. (a) ELEMENTAL+ (₹4,499/return) — Salary + HP + Interest + CAPITAL GAINS (equity STCG 20% / LTCG 12.5% / property / debt). (b) ENRICHED+ (₹5,999/return) — All Elemental+ features + INCOME EARNED OUTSIDE INDIA (foreign dividend / interest / royalty / Schedule FA disclosure + Form 67 FTC). (c) SUPREME+ (₹7,999/return) — All Enriched+ features + NRI / NRO CASES + DTAA ADVISORY (Section 6 residential status + Tax Residency Certificate facilitation + treaty interpretation + multi-jurisdiction filing).
            </li>
            <li className="opctc-item">
              <strong>Income Tax Amount Payable to Government — Paid Directly by Client (per client T&amp;C):</strong> The INCOME TAX AMOUNT PAYABLE to the Government (self-assessment tax + advance tax + any other tax demand) SHALL BE PAID DIRECTLY BY THE CLIENT to the Government via authorised banks (NSDL / e-Pay tax / RTGS / NEFT / debit card / net banking). LT does NOT collect, hold, or remit Government tax on the client's behalf. Our professional fee is SEPARATE from any tax payable to the Government.
            </li>
            <li className="opctc-item">
              <strong>Statutory Anchor:</strong> Individual ITR Filing governed by INCOME TAX ACT, 1961 (Section 139 — ITR filing; Section 6 — Residential status; Section 87A — Rebate; Section 111A — STCG equity 20%; Section 112A — LTCG equity 12.5% over ₹1.25L; Section 115BAC — New Tax Regime default; Section 115BBH — VDA 30%; Section 194S — 1% TDS on VDA; Section 234F — Belated return penalty; Sections 234A/B/C — Interest; Section 139(4) — Belated; Section 139(5) — Revised; Section 139(8A) — Updated ITR-U). BLACK MONEY (Undisclosed Foreign Income &amp; Assets) and Imposition of Tax ACT, 2015 (Schedule FA disclosure — Plus tier). Filings on Income Tax portal.
            </li>
            <li className="opctc-item">
              <strong>Key Deadlines (for FY 2025–26 / AY 2026–27):</strong> (a) NON-AUDIT INDIVIDUAL ITR = 31 JULY 2026. (b) BELATED / REVISED return = 31 DECEMBER 2026 (with Section 234F penalty for belated). (c) UPDATED return (ITR-U) = up to 31 MARCH 2030 (within 48 months) with 25% / 50% / 60% / 70% additional tax penalty.
            </li>
            <li className="opctc-item">
              <strong>Government Fees:</strong> ITR filing on Income Tax portal has NIL GOVERNMENT FEE. Tax payment (if applicable) via challan to authorised banks — PAID DIRECTLY BY CLIENT (per T&amp;C #5). DSC vendor cost (₹1,500 – ₹3,000) typically not needed for Individual ITR — e-Verification via Aadhaar OTP / Net banking / DEMAT / Bank EVC is preferred + free.
            </li>
            <li className="opctc-item">
              <strong>FY 2025–26 Tax Slab Disclosure — New Tax Regime (Default under Section 115BAC):</strong> Up to ₹4L = NIL; ₹4–8L = 5%; ₹8–12L = 10%; ₹12–16L = 15%; ₹16–20L = 20%; ₹20–24L = 25%; Above ₹24L = 30%. SECTION 87A REBATE = ₹60,000 (resident individuals with total income up to ₹12 LAKH = NIL TAX). STANDARD DEDUCTION ₹75,000 (salaried / pensioners under New Regime). Effective tax-free salary = ₹12.75 LAKH. OLD REGIME (optional via Form 10-IEA): Up to ₹2.5L = NIL; ₹2.5–5L = 5%; ₹5–10L = 20%; Above ₹10L = 30% + Section 87A rebate up to ₹12,500 (income up to ₹5L) + Standard Deduction ₹50,000 (salaried) + all Chapter VI-A deductions (Section 80C / 80D / etc.) available.
            </li>
            <li className="opctc-item">
              <strong>Old vs New Regime Selection (Enriched onwards):</strong> We run BOTH regime calculations + recommend the LOWER-TAX option + file accordingly. For salaried individuals up to ₹12.75 lakh income, NEW REGIME typically wins (NIL tax). For higher incomes with significant Section 80 claims (Home Loan interest + HRA + 80C + 80D + 80CCD(1B) + 80G), OLD REGIME may still beat New Regime. Switching between regimes: salaried can switch every year; business income earners can switch ONCE in lifetime.
            </li>
            <li className="opctc-item">
              <strong>Capital Gains Disclosure (Plus Tier — ITR-2):</strong> Capital gains TAXED SEPARATELY at SPECIAL RATES regardless of regime: STCG on equity / equity MF (Section 111A) = 20%; LTCG on equity / equity MF (Section 112A) above ₹1.25 lakh = 12.5%; LTCG on property / debt / other assets = 12.5% WITHOUT INDEXATION (post Budget 2024 amendment). The Section 87A rebate DOES NOT APPLY to capital gains income. Carry-forward of capital losses: STCL set off STCG + LTCG; LTCL set off only LTCG. Forward carry: 8 assessment years.
            </li>
            <li className="opctc-item">
              <strong>Schedule FA + Black Money Act (Enriched+ / Supreme+):</strong> Resident Indians holding Foreign Assets (bank accounts, real estate, stocks, mutual funds, beneficial ownership, signing authority) at ANY TIME during the FY must disclose in SCHEDULE FA of ITR. Non-disclosure attracts BLACK MONEY ACT, 2015 penalty — ₹10 LAKH + prosecution under Sections 50/51. Enriched+ / Supreme+ tiers handle Schedule FA disclosure for resident individuals with overseas holdings.
            </li>
            <li className="opctc-item">
              <strong>GST on Our Fee:</strong> All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="opctc-item">
              <strong>Refund Policy:</strong> Full refund of professional fee (less ₹299 documentation handling) if ITR is NOT FILED within 7 working days from receipt of all required documents + Form 16 / 16A / Capital Gains statements + client confirmation. Once return is drafted + shared for client confirmation, NO REFUND payable.
            </li>
            <li className="opctc-item">
              <strong>Out-of-Scope Items:</strong> BUSINESS ITR filing (ITR-3 for Sole Proprietor / Profession — separate LT service — Business ITR Filing); ITR-5 Partnership / LLP; ITR-6 Company; ITR-7 Trust / Section 11; Tax Audit cases (Section 44AB — separate); Income Tax NOTICE Response / Scrutiny (Section 142(1) / 143(2) / 148 — separate); Appeals to CIT(A) / ITAT / High Court (separate); GST returns; TDS returns. Quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default ItrIndTermCondition;
