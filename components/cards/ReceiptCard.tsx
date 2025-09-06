import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Appointment } from "@/lib/types/appointment-types";

interface ReceiptCardProps {
  appointment: Appointment;
  className?: string;
}

const ReceiptCard: React.FC<ReceiptCardProps> = ({
  appointment,
  className = "",
}) => {
  const customer = appointment.user || appointment.walk_in;
  const customerName = customer
    ? `${customer.first_name} ${
        customer.middle_initial ? customer.middle_initial + ". " : ""
      }${customer.last_name}`
    : "Walk-in Customer";

  const aestheticianName = `${appointment.aesthetician.first_name} ${
    appointment.aesthetician.middle_initial
      ? appointment.aesthetician.middle_initial + ". "
      : ""
  }${appointment.aesthetician.last_name}`;

  const isProfessional = appointment.aesthetician.experience == "pro";
  const professionalFee = isProfessional ? 1500 : 0;
  const serviceCost =
    appointment.service.discounted_price || appointment.service.final_price;
  const totalServiceCost = serviceCost + professionalFee;
  const finalAmount = totalServiceCost - (appointment.discount_amount || 0);

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className={`w-full mx-auto h-[450px] overflow-y-auto ${className}`}>
      <CardHeader className="text-center pb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">RECEIPT</h2>
          <p className="text-sm text-muted-foreground">
            #{appointment.appointment_id}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(appointment.created_at)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Information */}
        <div className="space-y-1">
          <h3 className="font-semibold text-sm">CUSTOMER</h3>
          <div className="text-sm">
            <p>{customerName}</p>
            {customer && (
              <p className="text-muted-foreground">{customer.phone_number}</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Branch & Aesthetician */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium">BRANCH</h4>
            <p className="text-muted-foreground">
              {appointment.branch.branch_name}
            </p>
            <p className="text-muted-foreground">
              Slot #{appointment.slot_number}
            </p>
          </div>
          <div>
            <h4 className="font-medium">AESTHETICIAN</h4>
            <p className="text-muted-foreground">{aestheticianName}</p>
            {isProfessional && (
              <p className="text-xs font-medium">Professional</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Service Details */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">SERVICE DETAILS</h3>

          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {appointment.service.service_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {appointment.service.category}
                </p>
              </div>
              <p className="text-sm">{formatCurrency(serviceCost)}</p>
            </div>

            {isProfessional && (
              <div className="flex justify-between items-center">
                <p className="text-sm">Professional Fee</p>
                <p className="text-sm">{formatCurrency(professionalFee)}</p>
              </div>
            )}

            <div className="flex justify-between items-center font-medium">
              <p className="text-sm">Subtotal</p>
              <p className="text-sm">{formatCurrency(totalServiceCost)}</p>
            </div>

            {appointment.discount_amount && appointment.discount_amount > 0 && (
              <div className="flex justify-between items-center">
                <p className="text-sm">
                  Discount
                  {appointment.voucher_code && `(${appointment.voucher_code})`}
                </p>
                <p className="text-sm">
                  -{formatCurrency(appointment.discount_amount)}
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Payment Information */}
        <div className="space-y-2">
          <div className="flex justify-between items-center font-bold">
            <p>TOTAL AMOUNT</p>
            <p>{formatCurrency(finalAmount)}</p>
          </div>

          {appointment.down_payment && appointment.down_payment > 0 && (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <p>Down Payment ({appointment.down_payment_method})</p>
                <p>{formatCurrency(appointment.down_payment)}</p>
              </div>
              {appointment.to_pay && (
                <div className="flex justify-between font-medium">
                  <p>Balance Due</p>
                  <p>{formatCurrency(appointment.to_pay)}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center text-sm">
            <p>Payment Status</p>
            <p className="font-medium">
              {appointment.payment_status.toUpperCase()}
            </p>
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>Status: {appointment.status.toUpperCase()}</p>
          <p>Thank you for choosing our services!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiptCard;
