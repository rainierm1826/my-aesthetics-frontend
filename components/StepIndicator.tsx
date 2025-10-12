"use client";

import { Check, ChevronRight } from "lucide-react";
import React from "react";

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
      {/* Step 1: Branch */}
      <div
        className={`flex items-center gap-2 ${currentStep >= 1 ? "text-primary" : "text-gray-400"}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${currentStep >= 1 ? "bg-primary text-white" : "bg-gray-200"}`}
        >
          {currentStep > 1 ? <Check className="w-5 h-5" /> : "1"}
        </div>
        <span className="font-semibold whitespace-nowrap">Branch</span>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />

      {/* Step 2: Service */}
      <div
        className={`flex items-center gap-2 ${currentStep >= 2 ? "text-primary" : "text-gray-400"}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${currentStep >= 2 ? "bg-primary text-white" : "bg-gray-200"}`}
        >
          {currentStep > 2 ? <Check className="w-5 h-5" /> : "2"}
        </div>
        <span className="font-semibold whitespace-nowrap">Service</span>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />

      {/* Step 3: Aesthetician */}
      <div
        className={`flex items-center gap-2 ${currentStep >= 3 ? "text-primary" : "text-gray-400"}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${currentStep >= 3 ? "bg-primary text-white" : "bg-gray-200"}`}
        >
          {currentStep > 3 ? <Check className="w-5 h-5" /> : "3"}
        </div>
        <span className="font-semibold whitespace-nowrap">Aesthetician</span>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />

      {/* Step 4: Date & Time */}
      <div
        className={`flex items-center gap-2 ${currentStep >= 4 ? "text-primary" : "text-gray-400"}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${currentStep >= 4 ? "bg-primary text-white" : "bg-gray-200"}`}
        >
          {currentStep > 4 ? <Check className="w-5 h-5" /> : "4"}
        </div>
        <span className="font-semibold whitespace-nowrap">Time</span>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />

      {/* Step 5: Confirm */}
      <div
        className={`flex items-center gap-2 ${currentStep >= 5 ? "text-primary" : "text-gray-400"}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${currentStep >= 5 ? "bg-primary text-white" : "bg-gray-200"}`}
        >
          {currentStep > 5 ? <Check className="w-5 h-5" /> : "5"}
        </div>
        <span className="font-semibold whitespace-nowrap">Confirm</span>
      </div>
    </div>
  );
};

export default StepIndicator;
