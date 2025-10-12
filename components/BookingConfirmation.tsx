"use client";

import React from "react";
import { Branch } from "@/lib/types/branch-types";
import { Service } from "@/lib/types/service-types";
import { Aesthetician } from "@/lib/types/aesthetician-types";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Award, User, Calendar, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/function";
import { Button } from "./ui/button";

interface BookingConfirmationProps {
  branch: Branch;
  service: Service;
  isConfirming: boolean;
  aesthetician: Aesthetician;
  appointmentDate: string;
  appointmentTime: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  branch,
  service,
  aesthetician,
  appointmentDate,
  appointmentTime,
  onConfirm,
  onCancel,
  isConfirming,
}) => {
  const fullName = `${aesthetician.first_name} ${aesthetician.last_name}`;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Pricing calculations (matching ReceiptCard logic)
  const serviceCost = service.discounted_price || service.price || 0;
  const professionalFee = aesthetician.experience == "pro" ? 1500 : 0;

  // Subtotal before down payment
  const subtotal = serviceCost + professionalFee;

  // Down payment (20% of subtotal)
  const downPaymentPercentage = 20;
  const downPayment = (subtotal * downPaymentPercentage) / 100;

  // Remaining balance (to pay on visit)
  const remainingBalance = subtotal - downPayment;

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

            {/* Aesthetician */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <User className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Aesthetician</h3>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{fullName}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {aesthetician.experience}
                  </p>
                </div>
              </div>
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
                <p className="font-medium text-lg">{appointmentTime}</p>
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
              {aesthetician.experience == "pro" && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Professional Fee</span>
                  <span className="font-medium text-amber-700">
                    +{formatCurrency(professionalFee)}
                  </span>
                </div>
              )}

              {/* Subtotal */}
              <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                <span className="text-lg font-semibold text-gray-900">
                  Subtotal
                </span>
                <div className="text-xl font-bold text-primary">
                  {formatCurrency(subtotal)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Breakdown */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-4">Payment Details</h3>

            <div className="space-y-3">
              {/* Down Payment */}
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">
                    Down Payment ({downPaymentPercentage}%)
                  </span>
                  <span className="text-xs font-medium text-primary">
                    Pay Now
                  </span>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(downPayment)}
                </div>
              </div>

              {/* Remaining Balance */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Balance Due</span>
                  <span className="text-xs font-medium text-gray-600">
                    Pay on Visit
                  </span>
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  {formatCurrency(remainingBalance)}
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
                      Pay {formatCurrency(downPayment)} now to secure your
                      booking
                    </li>
                    <li>
                      Pay the balance of {formatCurrency(remainingBalance)} when
                      you arrive for your appointment
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <Button
          onClick={onCancel}
          className="cursor-pointer flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </Button>
        <Button
          disabled={isConfirming}
          onClick={onConfirm}
          className="cursor-pointer flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          {isConfirming ? "Loading..." : "Confirm Booking"}
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
