import React from "react";
import "./CompanyRegBottomBar.css";

const CompanyRegBottomBar = () => {
  return (
    <div className="crbb-bottom">
      <div className="crbb-disclaimer">
        <p>
          <strong>Disclaimer:</strong> This website is privately operated consultancy service provider
          and is not affiliated with any government authority. We provide assistance in documentation,
          preparation and filing services only. Government approvals / registrations are issued by the
          respective government departments. Fees charged on this website are professional consultancy
          fees only and do not include government fees. By using this website, you acknowledge that we
          are a private service provider.
        </p>
      </div>

      <div className="crbb-copyright">
        © 2023-2026 Legal Terminus Private Limited. All Rights Reserved. | Powered by Legal Terminus
        Developed by{" "}
        <a
          href="https://infynialabs.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="crbb-pr"
        >
          AI Agents from InfyniaLabs
        </a>
      </div>
    </div>
  );
};

export default CompanyRegBottomBar;
