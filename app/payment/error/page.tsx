import { Button } from "@/components/ui/button";
import {  XCircle, Home } from "lucide-react";
import Link from "next/link";

export default function page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-lg w-full text-center transform transition-all hover:scale-105 duration-300">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-orange-500 shadow-lg animate-pulse">
            <XCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-red-400 opacity-20 animate-ping"></div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-3">
          Payment Failed
        </h1>

        {/* Message */}
        <p className="text-gray-600 text-lg mb-2">
          We couldn&apos;t process your payment.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Please check your payment details and try again, or contact support if
          the issue persists.
        </p>

        <Link href={"/customer/dashbaord"}>
          <Button className="w-full ">
            <Home className="w-5 h-5" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
