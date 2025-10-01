import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Appointment } from "@/lib/types/appointment-types";
import { formatCurrency, toLongDate } from "@/lib/function";

interface ReceiptCardProps {
  appointment: Appointment;
  className?: string;
}

const ReceiptCard: React.FC<ReceiptCardProps> = ({
  appointment,
  className = "",
}) => {
  const serviceCost =
    appointment.discounted_price_snapshot ?? appointment.price_snapshot;

  const professionalFee = appointment.is_pro_snapshot ? 1500 : 0;

  const subtotal = serviceCost + professionalFee;

  let voucherDiscount = 0;
  const downPayment = appointment.down_payment ? appointment.down_payment : 0

  if (appointment.voucher_discount_type_snapshot === "fixed") {
    voucherDiscount = appointment.discount_snapshot ?? 0;
  } else if (appointment.voucher_discount_type_snapshot === "percentage") {
    voucherDiscount = ((appointment.discount_snapshot ?? 0) / 100) * subtotal;
  }

  const totalServiceCost = subtotal - voucherDiscount - downPayment;


  return (
    <Card
      className={`w-full mx-auto max-w-md shadow-lg h-[450px] overflow-y-scroll ${className}`}
    >
      <CardHeader className="text-center">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-wide">RECEIPT</h2>
          <div className="space-y-1">
            <p className="text-lg font-mono font-semibold">
              #{appointment.appointment_id}
            </p>
            <p className="text-sm text-muted-foreground">
              {toLongDate(appointment.created_at)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Customer Information */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
            Customer
          </h3>
          <div className="space-y-1">
            <p className="text-lg font-semibold">
              {appointment.customer_name_snapshot}
            </p>
            <p className="text-sm text-muted-foreground">
              {appointment.phone_number}
            </p>
          </div>
        </div>

        <Separator />

        {/* Branch & Aesthetician */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
              Branch
            </h4>
            <div>
              <p className="font-medium">{appointment.branch_name_snapshot}</p>
              <p className="text-sm text-muted-foreground">
                Slot #{appointment.slot_number}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
              Aesthetician
            </h4>
            <div>
              <p className="font-medium">
                {appointment.aesthetician_name_snapshot}
              </p>
              {appointment.is_pro_snapshot && (
                <p className="text-xs font-semibold text-green-500">
                  Professional
                </p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Service Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
            Service Details
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <p className="font-semibold text-lg leading-tight">
                  {appointment.service_name_snapshot}
                </p>
                <p className="text-sm text-muted-foreground">
                  {appointment.category_snapshot}
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold tabular-nums shrink-0 min-w-[80px] text-right">
                  {formatCurrency(serviceCost)}
                </p>
                {appointment.is_sale_snapshot && (
                  <p className="text-sm text-muted-foreground line-through text-right">
                    {formatCurrency(appointment.price_snapshot)}
                  </p>
                )}
              </div>
            </div>

            {appointment.is_pro_snapshot && (
              <div className="flex justify-between items-center py-1">
                <p className="text-sm">Professional Fee</p>
                <p className="font-medium tabular-nums">
                  {formatCurrency(professionalFee)}
                </p>
              </div>
            )}

            <Separator className="my-2" />

            <div className="flex justify-between items-center">
              <p className="font-medium">Subtotal</p>
              <p className="font-semibold tabular-nums">
                {formatCurrency(subtotal)}
              </p>
            </div>

            {appointment.discount_snapshot &&
              appointment.discount_snapshot > 0 && (
                <div className="flex justify-between items-center">
                  <p className="text-sm">
                    Discount
                    {appointment.voucher_code_snapshot &&
                      ` (${appointment.voucher_code_snapshot})`}
                  </p>
                  <p className="text-sm font-medium tabular-nums text-red-500">
                    -
                    {appointment.voucher_discount_type_snapshot == "fixed"
                      ? formatCurrency(appointment.discount_snapshot)
                      : `${appointment.discount_snapshot}%`}
                  </p>
                </div>
              )}
          </div>
        </div>

        <Separator />

        {/* Payment Information */}
        <div className="space-y-4">
          <div className="bg-primary text-primary-foreground rounded-lg p-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold">TOTAL</p>
              <p className="text-2xl font-bold tabular-nums">
                {formatCurrency(totalServiceCost)}
              </p>
            </div>
          </div>

          {appointment.down_payment && appointment.down_payment > 0 && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <p>Down Payment ({appointment.down_payment_method})</p>
                <p className="font-medium tabular-nums">
                  {formatCurrency(appointment.down_payment)}
                </p>
              </div>
              {appointment.to_pay &&
                appointment.to_pay > 0 &&
                appointment.down_payment && (
                  <div className="flex justify-between items-center font-medium">
                    <p>Balance Due</p>
                    <p className="tabular-nums">
                      {formatCurrency(
                        appointment.to_pay
                      )}
                    </p>
                  </div>
                )}
            </div>
          )}

          <div className="space-y-2 text-sm">
            {appointment.final_payment_method && (
              <div className="flex justify-between items-center">
                <p>Payment Method</p>
                <p className="font-medium capitalize">
                  {appointment.final_payment_method}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <p>Payment Status</p>
              <p className="font-semibold uppercase">
                {appointment.payment_status}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <p>Appointment Status</p>
              <p className="font-semibold uppercase">{appointment.status}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <div className="text-center space-y-2 pb-2">
          <p className="text-sm font-medium">
            Thank you for choosing our services!
          </p>
          <p className="text-xs text-muted-foreground">
            Please keep this receipt for your records
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiptCard;
