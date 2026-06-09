import React from "react";
import "../OPCBenefits/OPCBenefits.css";

const OLWFBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of OLWF Registration
          </h2>
          <p className="opcben-subtitle">
            OLWF benefits are paid by the Fund directly to workers (not to employers). The benefits below describe what your registered workers and their families become eligible to claim — actual claims are filed by the workers individually with the Welfare Board (not by us under this service).
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Educational Scholarships for Workers' Children</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              The Welfare Board offers scholarships to children of registered workers for school, college, professional education, and skill development — subject to per-scheme eligibility (income, academic performance). One of the most utilised benefits across Odisha.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Medical Assistance & Health Camps</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Medical reimbursement / financial assistance for major surgery, chronic illness, hospitalisation expenses of workers and their dependants. Periodic health camps organised by the Welfare Board across districts. Eligibility and amount subject to fund availability and scheme rules.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Housing Scheme Support</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Subsidised housing loans / housing assistance schemes for registered workers — in partnership with state housing agencies and HUDCO-linked schemes where applicable. Application process is worker-side via the Welfare Board.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Recreation, Sports & Cultural Facilities</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Funding for worker recreation centres, sports facilities, cultural events, library facilities at industrial estates / commercial areas. Some establishments coordinate worker participation as a CSR-aligned engagement.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Funeral Assistance & Death Benefits to Dependants</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Lump-sum funeral expense assistance and financial support to dependants in case of worker's death (whether employment-related or otherwise). One of the most claimed benefits given workforce demographics.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Statutory Compliance + Inspector Avoidance</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              From the employer's perspective: avoiding Welfare Inspector visits, recovery proceedings under the OLWF Act, and per-day penalties for non-registration / non-contribution. The compliance value alone justifies the nominal contribution.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default OLWFBenefits;
