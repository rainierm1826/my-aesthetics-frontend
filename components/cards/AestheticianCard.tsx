import Image from "next/image";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { RatingStar } from "../RatingStar";
import BookNowButton from "../buttons/BookNowButton";
import { AestheticianCardProps } from "@/lib/types/aesthetician-types";
import Link from "next/link";

const AestheticianCard = ({
  action,
  image,
  experience,
  firstName,
  lastName,
  middleInitial,
  rating,
  availability,
  aesthetician_id,
}: AestheticianCardProps) => {
  return (
    <Link href={`/aesthetician/${aesthetician_id}`} passHref>
      <Card className="cursor-pointer py-0 group overflow-hidden border-none bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
        <CardContent className="p-0 flex flex-col h-full min-w-[300px]">
          {/* Profile Image Container */}
          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              alt={firstName}
              src={image ?? "/fallbackImage.jpg"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110 mt-5"
            />
            {/* Pro Badge */}
            <div
              className={`absolute top-5 right-10 bg-gradient-to-r text-white text-xs font-semibold px-3 py-1 rounded-full ${
                experience == "pro"
                  ? "from-green-500 to-green-200"
                  : "from-gray-700 to gray-500"
              }`}
            >
              {experience.charAt(0).toUpperCase() + experience.slice(1) == "Pro"
                ? "Professional"
                : experience.charAt(0).toUpperCase() + experience.slice(1)}
            </div>
            {/* Availability Status */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  availability == "available"
                    ? "bg-green-500"
                    : availability == "working"
                    ? "bg-yellow-500"
                    : availability == "off-duty"
                    ? "bg-red-500"
                    : availability == "break"
                    ? "bg-orange-500"
                    : ""
                }`}
              ></div>
              <span className="text-xs font-medium text-gray-700">
                {availability.charAt(0).toUpperCase() + availability.slice(1)}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 space-y-3">
            {/* Name & Title */}
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 text-lg">{`${firstName} ${middleInitial}. ${lastName}`}</h3>
              <p className="text-sm text-gray-500">Licensed Aesthetician</p>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-center gap-2">
              <RatingStar rating={rating} />
              <span className="text-sm font-medium text-gray-700">
                {rating}
              </span>
            </div>
          </div>
        </CardContent>

        {/* Action Section */}
        {action && (
          <div className="px-4 pb-4 space-y-2">
            <BookNowButton size="w-full" />
          </div>
        )}
      </Card>
    </Link>
  );
};

export default AestheticianCard;
