import React from "react";
import "./GstFilingTermCondition.css";

const GstFilingTermCondition = () => {
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
              Monthly Subscription Model: Our GST Return Filing plans are MONTHLY SUBSCRIPTIONS - billed monthly, no lock-in, cancellable with 30 days' notice. Subscription anchors to your filing cycle: GSTR-1 due 11th of next month; GSTR-3B due 20th of next month (or 22nd / 24th for QRMP filers depending on State). Subscription includes ALL the monthly filings for your GSTIN per the plan tier.
            </li>
            <li className="opctc-item">
              Plan Eligibility (4 Tiers): ELEMENTAL (Rs.499 / month) - Nil transactions in the month, ENRICHED (Rs.999 / month) - Up to 100 outward + inward invoices / month; annual Turnover up to Rs.50 lakh OR Nil filer with annual Turnover Rs.50 lakh - Rs.5 crore. SUPREME (Rs.1,999 / month) - Up to 100 invoices / month OR contractor / multi-services; annual Turnover Rs.50 lakh - Rs.2 crore. SUPREME+ (Rs.2,999 / month) - Above 100 invoices / month OR contractor with multi-services; annual Turnover Rs.2 crore - Rs.5 crore. Above Rs.5 crore Turnover = custom quote with mandatory GSTR-9C reconciliation handling.
            </li>
            <li className="opctc-item">
              2026 Regime - GSTR-3B Hard-Locking: Effective July 2025, GSTR-3B Tables 3.1 (outward taxable / zero-rated / exempt / nil-rated supplies) and 3.2 (inter-state supplies to unregistered / composition / UIN) are AUTO-POPULATED from GSTR-1 / GSTR-1A / IFF and HARD-LOCKED - NO manual override. ITC Table 4 hard-locking targeted ~July 2026. Implication: accuracy at the GSTR-1 stage is now non-negotiable. We catch errors at GSTR-1 + GSTR-1A stage, not at GSTR-3B.
            </li>
            <li className="opctc-item">
              Invoice Management System (IMS) - Effective 14 Oct 2024: IMS lets the recipient ACCEPT / REJECT / PEND every supplier invoice that flows to their GSTR-2B. Rejected / pending invoices DO NOT enter recipient's GSTR-2B (ITC blocked) and are added back to supplier's downstream GSTR-3B liability. We run monthly IMS reviews (Supreme / Supreme+) so neither side gets stuck.
            </li>
            <li className="opctc-item">
              3-Year Time-Bar (effective FY 2026-27): Per Notification 28/2024-CT, GST returns CANNOT be filed beyond 3 YEARS from the original due date. Old / pending returns must be filed before the 3-year window closes - ITC sitting in unfiled returns is permanently forfeited beyond this period. Supreme+ tier handles backlog clean-up; otherwise quoted separately.
            </li>
            <li className="opctc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout. Your business GSTIN can claim the entire GST charged on our fee as Input Tax Credit (we issue compliant GST invoices monthly).
            </li>
            <li className="opctc-item">
              Plan Capacity + Surcharges: Plans cover the invoice volume mentioned above. Beyond capacity: surcharge of Rs.5 per invoice (Supreme)/(Supreme+) applies. All plans cover 1 GSTIN. Additional GSTINs are billed separate per month. Tier upgrades / downgrades are effective from the next month's filing.
            </li>
            <li className="opctc-item">
              Late Fee + Interest - Pass-Through: Statutory late fees (under CGST Act Section 47) and interest (under Section 50, 18% p.a. on tax dues) are payable to the Government - NOT our fee. We plan filings to avoid late fees entirely; where the client provides data late or skips a month, the late fee is the client's liability and paid through the GST portal at filing.
            </li>
            <li className="opctc-item">
              QRMP Scheme: Quarterly Return Monthly Payment (QRMP) scheme for filers with turnover up to Rs.5 crore - file GSTR-1 / GSTR-3B QUARTERLY but pay tax MONTHLY via PMT-06 / IFF (Invoice Furnishing Facility). We assess QRMP eligibility + opt-in / opt-out per FY (all plans).
            </li>
            <li className="opctc-item">
              Refund Policy: Pro-rated refund of unused months is available on cancellation with 30 days' notice (less Rs.499 closure fee). For first month: full refund if no filing has been performed; partial refund proportionate to filings done. Government late fees / penalties paid via the portal are non-refundable.
            </li>
            <li className="opctc-item">
              Out-of-Scope Items: GST Registration / Amendment / Cancellation (These are separate LT services), GSTR-9C Reconciliation Statement for turnover above Rs.5 Cr (separately quoted under Supreme+), GST Refund processing beyond Supreme+ free allowance, GST audit by tax department, GST appellate matters (DRC notices, departmental adjudication, tribunal appeals), transfer pricing reviews, customs / SEZ-specific filings, OIDAR specific filings, and GST notices BEYOND Supreme+ tier's 1-per-year-free allowance are quoted separately.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default GstFilingTermCondition;
