import React from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { RatingStar } from "./RatingStar";
import { Clock, MapPin, Phone } from "lucide-react";
import BookNowButton from "./BookNowButton";

const BranchCard = () => {
  return (
    <Card className="pt-0 group overflow-hidden border-none bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardContent className="p-0">
        {/* Branch Image Container */}
        <div className="relative w-full aspect-[16/10] overflow-hidden">
          <Image
            alt="Glow Beauty Studio - Lipa Branch"
            src="/branch1.webp"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Status Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            Open Now
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-4">
          {/* Branch Name & Rating */}
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 text-lg leading-tight">
              MY Aesthetics Brow Studio
            </h3>
            <p className="text-sm font-medium text-primary">
              Batangas City Branch
            </p>

            <div className="flex items-center gap-2 w-full">
              <div className="flex items-center gap-1 w-full">
                <RatingStar rating={5} />
                <span className="font-semibold text-gray-900">4.7</span>
              </div>
              <span className="text-sm text-gray-500 whitespace-nowrap">(156 reviews)</span>
              <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full whitespace-nowrap">
                Top Rated 
              </span>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-600 leading-relaxed">
              123 JP Rizal Avenue, Poblacion
              <br />
              Lipa City, Batangas 4217
            </div>
          </div>

          {/* Operating Hours */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Open until 8:00 PM</span>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">(043) 123-4567</span>
          </div>

          {/* Features/Amenities */}
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
              Parking Available
            </span>
            <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
              WiFi
            </span>
            <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">
              AC
            </span>
          </div>
        </div>
      </CardContent>

      {/* Action Section */}
      <div className="px-4">
        <BookNowButton size="w-full" />
      </div>
    </Card>
  );
};

export default BranchCard;
