"use client";

import React, { useState } from "react";
import { Branch } from "@/lib/types/branch-types";
import { Service } from "@/lib/types/service-types";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Award, User, Calendar, Clock, Ticket } from "lucide-react";
import { formatCurrency } from "@/lib/function";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";

interface BookingConfirmationProps {
  branch: Branch;
  service: Service;
  isConfirming: boolean;
  aestheticianExperience: "pro" | "regular";
  appointmentDate: string;
  appointmentTime: string;
  onConfirm: (voucherCode?: string) => void;
  onCancel: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  branch,
  service,
  aestheticianExperience,
  appointmentDate,
  appointmentTime,
  onConfirm,
  onCancel,
  isConfirming,
}) => {
  const [addVoucher, setAddVoucher] = useState<boolean>(false);
  const [voucherCode, setVoucherCode] = useState<string>("");

  // Format date for display
  const formatDate = (dateString: string) => {
    // Parse as local date to avoid timezone issues
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time to show both 24-hour and 12-hour formats
  const formatTime = (timeString: string) => {
    // Extract start time from range like "04:40 PM-05:00 PM" or "17:30"
    const startTimeStr = timeString.includes("-") 
      ? timeString.split("-")[0].trim() 
      : timeString.trim();
    
    let hours24: number;
    let minutes: number;
    
    // Check if it's already in 12-hour format (contains AM/PM)
    if (startTimeStr.includes("AM") || startTimeStr.includes("PM")) {
      const [time, period] = startTimeStr.split(" ");
      const [h, m] = time.split(":").map(Number);
      minutes = m;
      hours24 = period === "PM" && h !== 12
        ? h + 12
        : period === "AM" && h === 12
          ? 0
          : h;
    } else {
      // Already in 24-hour format
      const [h, m] = startTimeStr.split(":").map(Number);
      hours24 = h;
      minutes = m;
    }
    
    // Convert to 12-hour format
    const hours12 = hours24 % 12 || 12;
    const period = hours24 >= 12 ? "PM" : "AM";
    
    // Format strings
    const time24 = `${String(hours24).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    const time12 = `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
    
    return `${time24} (${time12})`;
  };

  // Pricing calculations
  const serviceCost = service.discounted_price || service.price || 0;
  const professionalFee = aestheticianExperience === "pro" ? 1500 : 0;

  // For display: original price if there's a discount
  const originalPrice = service.price || 0;
  const hasDiscount =
    service.discounted_price && service.discounted_price < originalPrice;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Confirm Your Booking</h2>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="text-xl font-bold mb-4">Appointment Details</h2>

            {/* Branch */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Branch</h3>
              </div>
              <p className="font-medium">{branch.branch_name}</p>
              <p className="text-sm text-gray-600">
                {[branch.address.province, branch.address.city]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>

            <hr />

            {/* Service */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Service</h3>
              </div>
              <p className="font-medium">{service.service_name}</p>
              <p className="text-sm text-gray-600">{service.category}</p>
            </div>

            <hr />

            {/* Aesthetician Experience */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <User className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Aesthetician Type</h3>
              </div>
              <p className="font-medium capitalize">
                {aestheticianExperience === "pro" ? "Pro Aesthetician" : "Regular Aesthetician"}
              </p>
              <p className="text-sm text-gray-600">
                {aestheticianExperience === "pro"
                  ? "Professional aesthetician with advanced experience"
                  : "Trained aesthetician"}
              </p>
            </div>

            <hr />

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Date</h3>
                </div>
                <p className="font-medium">{formatDate(appointmentDate)}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Time</h3>
                </div>
                <p className="font-medium text-lg">{formatTime(appointmentTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Breakdown */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-4">Price Breakdown</h3>

            <div className="space-y-3">
              {/* Service Cost */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Service Cost</span>
                <div className="text-right">
                  <span className="font-medium text-gray-900">
                    {formatCurrency(serviceCost)}
                  </span>
                  {hasDiscount && (
                    <div className="text-sm text-gray-400 line-through">
                      {formatCurrency(originalPrice)}
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Fee */}
              {aestheticianExperience === "pro" && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Professional Fee</span>
                  <span className="font-medium text-amber-700">
                    +{formatCurrency(professionalFee)}
                  </span>
                </div>
              )}

              {/* Total Amount */}
              <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                <span className="text-lg font-semibold text-gray-900">
                  Total Amount Due
                </span>
                <div className="text-xl font-bold text-primary">
                  {formatCurrency(serviceCost + professionalFee)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-4">Payment Details</h3>

            <div className="space-y-3">
              {/* Full Payment */}
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">
                    Full Payment Due
                  </span>
                  <span className="text-xs font-medium text-primary">
                    Due on Visit
                  </span>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(serviceCost + professionalFee)}
                </div>
              </div>
            </div>

            {/* Payment Note */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-1">Payment Instructions:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      Pay {formatCurrency(serviceCost + professionalFee)} when
                      you arrive for your appointment
                    </li>
                    <li>We accept cash and card payments</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voucher Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center shadow-sm rounded-sm px-2 py-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Ticket className="w-5 h-5 text-primary" />
                  <p className="text-sm font-medium">Add voucher</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Apply a discount voucher
                </p>
              </div>
              <Switch
                checked={addVoucher}
                onCheckedChange={() => {
                  setAddVoucher((value) => !value);
                  setVoucherCode("");
                }}
              />
            </div>
            {addVoucher && (
              <div className="mt-4">
                <Input
                  placeholder="Enter voucher code"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="w-full"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <Button
          onClick={onCancel}
          className="cursor-pointer flex-1 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          variant={"outline"}
        >
          Cancel
        </Button>
        <Button
          disabled={isConfirming}
          onClick={() => onConfirm(addVoucher ? voucherCode : undefined)}
          className="cursor-pointer flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          {isConfirming ? "Loading..." : "Confirm Booking"}
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
