import Image from "next/image";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { RatingStar } from "./RatingStar";
import BookNowButton from "./BookNowButton";

const AestheticianCard = () => {
  return (
    <Card className="group overflow-hidden border-none bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardContent className="p-0">
        {/* Profile Image Container */}
        <div className="relative w-full aspect-square overflow-hidden">
          <Image
            alt="Sarah Chen - Professional Aesthetician"
            src="/aesthetician1.png"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {/* Pro Badge */}
          <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-200 text-white text-xs font-semibold px-3 py-1 rounded-full">
            PRO
          </div>
          {/* Availability Status */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-700">Available</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Name & Title */}
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 text-lg">
              Sarah Chen
            </h3>
            <p className="text-sm text-gray-500">Licensed Aesthetician</p>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-center gap-2">
            <RatingStar rating={4.8} />
            <span className="text-sm font-medium text-gray-700">4.8</span>
            <span className="text-xs text-gray-500">(89 reviews)</span>
          </div>

        
        </div>
      </CardContent>

      {/* Action Section */}
      <div className="px-4 pb-4 space-y-2">
        <BookNowButton size="w-full"/>
      </div>
    </Card>
  );
};

export default AestheticianCard;
