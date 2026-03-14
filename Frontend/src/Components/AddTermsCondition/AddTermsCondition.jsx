import React from "react";
import "./AddTermsCondition.css";

const AddTermsCondition= () => {
  return (
    <section className="Add-tc-section">
      <div className="Add-tc-container">
        {/* Heading */}
        <h2 className="Add-tc-title">TERMS &amp; CONDITIONS</h2>

        {/* Sub heading
        <p className="Add-tc-subtitle">
          Please note that the above plan includes applicable Govt. Fees
        </p> */}

        {/* List */}
        <ol className="Add-tc-list">
          <li className="Add-tc-item">
            Please note that the above plan includes applicable Govt. Fees
          </li>

          {/* <li className="Add-tc-item">
            The fees mentioned above are valid for Authorised Capital up to Rs. 15 Lakhs, where the government fee is minimum. For above Rs. 15 Lakhs, the government fee shall increase accordingly.
          </li>

          <li className="Add-tc-item">
            The above fee includes Name application for up to 4 choice names and in case all the 4 names are rejected by the department, an additional fee shall be charged.
          </li>

          <li className="Add-tc-item">
            The Audit Fees shall not be a part of our professional fees and shall be payable directly to the Auditor.
          </li>

          <li className="Add-tc-item">
            In case the above plan does not qualify your requirements, kindly contact our executive, we shall be happy to customize a plan for you.
          </li>

           <li className="Add-tc-item">
            18% GST applicable on professional fee.
          </li>

           <li className="Add-tc-item">
            Government fees and DSC charges shall be payable as per actuals.
          </li>

           <li className="Add-tc-item">
            In case any of the Directors/ Shareholders is a Foreign National or NRI, the incorporation fees shall be determined with mutual discussion.
          </li> */}
        </ol>
      </div>
    </section>
  );
};

export default AddTermsCondition;
