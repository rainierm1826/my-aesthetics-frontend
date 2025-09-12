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
  const professionalFee = appointment.is_pro_snapshot ? 1500 : 0;

  const serviceCost =
    appointment.discounted_price_snapshot || appointment.price_snapshot;
  const totalServiceCost = serviceCost + professionalFee;

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
            <p>{appointment.customer_name_snapshot}</p>
            <p className="text-muted-foreground">{appointment.phone_number}</p>
          </div>
        </div>

        <Separator />

        {/* Branch & Aesthetician */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium">BRANCH</h4>
            <p className="text-muted-foreground">
              {appointment.branch_name_snapshot}
            </p>
            <p className="text-muted-foreground">
              Slot #{appointment.slot_number}
            </p>
          </div>
          <div>
            <h4 className="font-medium">AESTHETICIAN</h4>
            <p className="text-muted-foreground">
              {appointment.aesthetician_name_snapshot}
            </p>
            {appointment.is_pro_snapshot && (
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
                  {appointment.service_name_snapshot}
                </p>
                {appointment.is_sale_snapshot && (
                  <p className="text-xs text-green-600 font-medium">ON SALE</p>
                )}
                
                
              </div>
              <p className="text-sm">{formatCurrency(serviceCost)}</p>
            </div>

            {appointment.is_pro_snapshot && (
              <div className="flex justify-between items-center">
                <p className="text-sm">Professional Fee</p>
                <p className="text-sm">{formatCurrency(professionalFee)}</p>
              </div>
            )}

            <div className="flex justify-between items-center font-medium">
              <p className="text-sm">Subtotal</p>
              <p className="text-sm">{formatCurrency(totalServiceCost)}</p>
            </div>

            {appointment.discount_snapshot &&
              appointment.discount_snapshot > 0 && (
                <div className="flex justify-between items-center">
                  <p className="text-sm">
                    Discount
                    {appointment.voucher_code_snapshot &&
                      ` (${appointment.voucher_code_snapshot})`}
                  </p>
                  <p className="text-sm">
                    -{formatCurrency(appointment.discount_snapshot)}
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
            <p>{formatCurrency(totalServiceCost)}</p>
          </div>

          {appointment.down_payment && appointment.down_payment > 0 && (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <p>Down Payment ({appointment.down_payment_method})</p>
                <p>{formatCurrency(appointment.down_payment)}</p>
              </div>
              {appointment.to_pay &&
                appointment.to_pay > 0 &&
                appointment.down_payment && (
                  <div className="flex justify-between font-medium">
                    <p>Balance Due</p>
                    <p>
                      {formatCurrency(
                        appointment.to_pay - appointment.down_payment
                      )}
                    </p>
                  </div>
                )}
            </div>
          )}

          {appointment.final_payment_method && (
            <div className="flex justify-between items-center text-sm">
              <p>Final Payment Method</p>
              <p className="font-medium capitalize">{appointment.final_payment_method}</p>
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
