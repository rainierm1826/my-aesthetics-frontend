"use client";

import { Check, ChevronRight } from "lucide-react";
import React, { useState } from "react";

const StepIndicator = () => {
  const [step, setStep] = useState<number>(1);

  return (
    <div className="flex items-center gap-2 mb-6">
      <div
        className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-gray-400"}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-white" : "bg-gray-200"}`}
        >
          {step > 1 ? <Check className="w-5 h-5" /> : "1"}
        </div>
        <span className="font-semibold">Branch</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
      <div
        className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-gray-400"}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-white" : "bg-gray-200"}`}
        >
          {step > 2 ? <Check className="w-5 h-5" /> : "2"}
        </div>
        <span className="font-semibold">Service</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
      <div
        className={`flex items-center gap-2 ${step >= 3 ? "text-primary" : "text-gray-400"}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-white" : "bg-gray-200"}`}
        >
          {step > 3 ? <Check className="w-5 h-5" /> : "3"}
        </div>
        <span className="font-semibold">Aesthetician</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
      <div
        className={`flex items-center gap-2 ${step >= 4 ? "text-primary" : "text-gray-400"}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 4 ? "bg-primary text-white" : "bg-gray-200"}`}
        >
          {step === 4 ? <Check className="w-5 h-5" /> : "4"}
        </div>
        <span className="font-semibold">Confirm</span>
      </div>
    </div>
  );
};

export default StepIndicator;
