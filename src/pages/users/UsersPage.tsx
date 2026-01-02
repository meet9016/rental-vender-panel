"use client";

import { useState } from "react";
import Stepper from "./Stepper";
import StepPersonal from "./steps/StepPersonal";
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
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-2">KYC Verification</h1>
        <p className="text-gray-500 mb-8">
          Complete your KYC in a few simple steps
        </p>

        <Stepper steps={steps} currentStep={currentStep} />

        <div className="mt-10">
          {/* {currentStep === 0 && <StepPersonal />} */}
          {currentStep === 0 && <StepContact />}
          {currentStep === 1 && <StepIdentity />}
          {currentStep === 2 && <StepBankDetails />}
          {currentStep === 3 && <StepDocument />}
          {currentStep === 4 && <StepDeclaration />}
        </div>

        {/* Footer Buttons */}
        <div className="mt-12 flex items-center justify-between pt-6">
          {/* Back Button */}
          <div>
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s - 1)}
                className="px-6 py-2 rounded-lg border border-gray-300
                   text-gray-700 hover:bg-gray-100 transition"
              >
                Back
              </button>
            )}
          </div>

          {/* Next / Submit Button */}
          <div>
            <button
              type="button"
              onClick={() =>
                currentStep === steps.length - 1
                  ? alert("KYC Submitted")
                  : setCurrentStep((s) => s + 1)
              }
              className="px-8 py-2 rounded-lg bg-blue-600 text-white
                 hover:bg-blue-700 transition font-medium"
            >
              {currentStep === steps.length - 1 ? "Submit KYC" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
