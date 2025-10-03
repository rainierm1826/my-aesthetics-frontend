"use client";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home } from "lucide-react";
import Link from "next/link";

// Payment Success Component
export default function PaymentSuccess() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-lg w-full text-center transform transition-all hover:scale-105 duration-300">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg animate-bounce">
            <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-emerald-400 opacity-20 animate-ping"></div>
        </div>

        {/* Title with gradient */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
          Payment Successful!
        </h1>

        {/* Message */}
        <p className="text-gray-600 text-lg mb-2">
          Your transaction has been completed successfully.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          A confirmation email has been sent to your inbox.
        </p>

        {/* Button */}
        <Link href={"/customer/dashboard"}>
          <Button className="w-full ">
            <Home className="w-5 h-5" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
