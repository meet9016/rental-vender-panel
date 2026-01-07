"use client";

import { useState } from "react";
import Stepper from "./Stepper";
import StepContact from "./steps/StepContact";
import StepIdentity from "./steps/StepIdentity";
import StepBankDetails from "./steps/StepBankDetails";
import StepDocument from "./steps/StepDocument";
import StepDeclaration from "./steps/StepDeclaration";

const steps = [
  "Contact Details",
  "Identity",
  "Bank",
  "Documents",
  "Declaration",
];

export default function KYCPage() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 py-6 md:py-10 px-3">
      <div className="
        max-w-7xl mx-auto bg-white rounded-xl md:rounded-2xl 
        shadow-lg p-4 md:p-8
      ">
        <h1 className="text-xl md:text-2xl font-bold mb-1">
          KYC Verification
        </h1>

        <p className="text-gray-500 text-sm md:text-base mb-6 md:mb-8">
          Complete your KYC in a few simple steps
        </p>

        {/* Stepper scroll on mobile */}
        <div className="overflow-x-auto">
          <div className="min-w-max md:min-w-0">
            <Stepper steps={steps} currentStep={currentStep} />
          </div>
        </div>

        {/* Form Body */}
        <div className="
          mt-6 md:mt-10 
          h-[350px] md:h-[450px]
          overflow-y-auto 
          pr-1 md:pr-3 
          pb-28 md:pb-20
        ">
          {currentStep === 0 && <StepContact />}
          {currentStep === 1 && <StepIdentity />}
          {currentStep === 2 && <StepBankDetails />}
          {currentStep === 3 && <StepDocument />}
          {currentStep === 4 && <StepDeclaration />}
        </div>

        {/* Sticky Footer */}
        <div
          className="
            sticky bottom-0 left-0 right-0 
            bg-white py-3 md:py-4 
            flex flex-col md:flex-row 
            gap-3 md:gap-0
            items-center justify-between 
            border-t z-50
          "
        >
          {/* Back Button */}
          {currentStep > 0 ? (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="
                px-6 py-2 w-full md:w-auto 
                rounded-lg border border-gray-300
                text-gray-700 hover:bg-gray-100 transition
              "
            >
              Back
            </button>
          ) : (
            <div className="hidden md:block" />
          )}

          {/* Next / Submit */}
          <button
            onClick={() =>
              currentStep === steps.length - 1
                ? alert("KYC Submitted")
                : setCurrentStep((s) => s + 1)
            }
            className="
              px-8 py-2 w-full md:w-auto 
              rounded-lg bg-blue-600 text-white
              hover:bg-blue-700 transition font-medium
            "
          >
            {currentStep === steps.length - 1 ? "Submit KYC" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
