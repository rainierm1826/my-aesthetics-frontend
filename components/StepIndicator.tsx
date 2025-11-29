"use client";

import { Check, ChevronRight } from "lucide-react";
import React from "react";

interface StepIndicatorProps {
  currentStep: number; // 1-based index of current step
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { label: "Branch" },
    { label: "Service" },
    { label: "Experience" },
    { label: "Date & Time" },
    { label: "Confirm" },
  ];

  return (
    <div className="flex items-center gap-1 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2">
      {/* Step 1: Branch */}
      {steps.map((step, idx) => {
        const stepNumber = idx + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const textColor = isCurrent || isCompleted ? "text-primary" : "text-gray-400";
        const circleClass = isCurrent
          ? "bg-primary text-white"
          : isCompleted
            ? "bg-primary text-white"
            : "bg-gray-200";
        return (
          <React.Fragment key={step.label}>
            <div className={`flex items-center gap-1 sm:gap-2 ${textColor}`}>
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs sm:text-base ${circleClass}`}>
                {isCompleted ? (
                  <Check className="w-3 h-3 sm:w-5 sm:h-5" />
                ) : (
                  stepNumber
                )}
              </div>
              <span className="text-xs sm:text-base font-semibold whitespace-nowrap">{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <ChevronRight className="w-3 h-3 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
            )}
          </React.Fragment>
        );
      })}

      
    </div>
  );
};

export default StepIndicator;
