import React from "react";
import "./EPFRegProcess.css";

const steps = [
  {
    title: "Visit the EPFO Website",
    text: "Visit the official EPFO website and click the 'Establishment Registration' button on the home page to start the registration process."
  },
  {
    title: "Register on USSP",
    text: "After clicking the establishment registration button, the Unified Shram Suvidha Portal (USSP) sign-up page appears. Click the 'Sign Up' button to create your account."
  },
  {
    title: "Log in to the USSP",
    text: "Once the account is created on the USSP, log in with your credentials. Select 'Registration for EPFO-ESIC' and then click 'Apply for New Registration'."
  },
  {
    title: "Select the Applicable Act",
    text: "You will see two options — the Employees' Provident Fund and Miscellaneous Provision Act, 1952 and the Employees State Insurance Act, 1948. Select the EPF option and click Submit."
  },
  {
    title: "Fill Out the Registration Form",
    text: "The EPFO registration form will open. Fill in all required sections accurately — establishment details, employee count, address, and business information."
  },
  {
    title: "Attach Digital Signature Certificate",
    text: "After completing the form, attach the Digital Signature Certificate (DSC) by clicking the digital signature button on the next page."
  },
  {
    title: "Receive Confirmation Message",
    text: "After uploading the DSC, you will receive a successful completion message. A confirmation email will be sent from USSP confirming that EPFO registration is complete."
  }
];

const EPFProcess = () => {
  return (
    <section className="epf-timeline-wrapper">
      <h2 className="epf-timeline-heading">
        Employee PF Registration Process for Employers
      </h2>
      <p className="epf-timeline-subheading">
        A step-by-step guide to completing EPF registration on the EPFO USSP portal. Average time: 10–15 working days.
      </p>

      <div className="epf-timeline">
        <div className="epf-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`epf-timeline-item ${index % 2 === 0 ? "left" : "right"} ${index === 0 ? "first" : ""} ${index === steps.length - 1 ? "last" : ""}`}
          >
            <div className="epf-timeline-dot">{index + 1}</div>

            <div className="epf-timeline-card">
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EPFProcess;
