// --- Type definitions must be at the very top ---
import type { Appointment } from "@/lib/types/appointment-types";
import React, { useRef, useState } from "react";
import ChangeAestheticianModal from "../modals/ChangeAestheticianModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer, Calendar, MapPin, VenetianMask, Clock, CreditCard, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/function";
import { printHtmlContent } from "@/lib/print";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { patchAppointment } from "@/api/appointment";
import { useAuthStore } from "@/provider/store/authStore";

type AppointmentService = {
  id?: string;
  service_id: string;
  service_name_snapshot: string;
  category_snapshot: string;
  price_snapshot: number;
  discounted_price_snapshot?: number;
  is_sale_snapshot: boolean;
  is_pro_snapshot: boolean;
  discount_snapshot?: number | null;
  discount_type_snapshot?: string | null;
  voucher_code_snapshot?: string | null;
  aesthetician_name_snapshot?: string | null;
  start_time: string;
  status?: string;
};

type AppointmentWithServices = Appointment & { services: AppointmentService[] };

interface ReceiptCardProps {
  appointment: Appointment;
  className?: string;
}

const ReceiptCard: React.FC<ReceiptCardProps> = ({
  appointment,
  className = "",
}) => {
  const [openServiceIdx, setOpenServiceIdx] = useState<number | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    serviceId: string;
    serviceName: string;
    currentStatus: string;
    newStatus: string;
  } | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const { access_token } = useAuthStore();

  // Mutation for updating service status
  const statusUpdateMutation = useBaseMutation("patch", {
    updateFn: patchAppointment,
    queryKey: [
      ["appointment"],
      ["aesthetician-name"],
      ["aesthetician"],
      ["appointment-summary"],
      ["sales-summary"],
      ["analytics-appointments"],
      ["analytics-sales"],
    ],
    successMessages: {
      update: "Service status updated successfully",
    },
  });

  const handleStatusChange = (serviceId: string, newStatus: string) => {
    statusUpdateMutation.mutate({
      data: {
        appointment_id: appointment.appointment_id,
        service_id: serviceId,
        status: newStatus,
      },
      token: access_token || "",
    });
  };

  const handleStatusChangeRequest = (serviceId: string, serviceName: string, currentStatus: string, newStatus: string) => {
    setPendingStatusChange({ serviceId, serviceName, currentStatus, newStatus });
    setConfirmDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (pendingStatusChange) {
      handleStatusChange(pendingStatusChange.serviceId, pendingStatusChange.newStatus);
      setConfirmDialogOpen(false);
      setPendingStatusChange(null);
    }
  };

  const cancelStatusChange = () => {
    setConfirmDialogOpen(false);
    setPendingStatusChange(null);
  };

  // Aggregate costs for all services
  const services: AppointmentService[] = (
    (appointment as AppointmentWithServices).services || []
  ).sort((a, b) => {
    // Sort by start_time ascending
    if (!a.start_time) return 1;
    if (!b.start_time) return -1;
    return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
  });
  const subtotal = services.reduce((sum: number, s: AppointmentService) => {
    const serviceCost = s.discounted_price_snapshot ?? s.price_snapshot;
    const professionalFee = s.is_pro_snapshot ? 1500 : 0;
    return sum + serviceCost + professionalFee;
  }, 0);

  // Aggregate discounts (if any)
  let voucherDiscount = 0;
  services.forEach((s: AppointmentService) => {
    if (s.discount_type_snapshot === "fixed") {
      voucherDiscount += s.discount_snapshot ?? 0;
    } else if (s.discount_type_snapshot === "percentage") {
      const serviceCost = s.discounted_price_snapshot ?? s.price_snapshot;
      const professionalFee = s.is_pro_snapshot ? 1500 : 0;
      voucherDiscount += ((s.discount_snapshot ?? 0) / 100) * (serviceCost + professionalFee);
    }
  });

  const totalServiceCost = subtotal - voucherDiscount;

  const printReceipt = () => {
    if (!receiptRef.current) return;
    printHtmlContent(
      receiptRef.current,
      `Receipt - ${appointment.appointment_id}`
    );
  };

  // Helper to determine if editing is allowed at appointment level
  // Only block if ALL services are completed or cancelled
  const canEdit = appointment.branch_id && services.some(s => {
    const status = s.status || "pending";
    return status !== "completed" && status !== "cancelled";
  });

  // Helper to get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
      completed: { 
        label: "Completed", 
        className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", 
        icon: <CheckCircle2 className="w-3 h-3" /> 
      },
      cancelled: { 
        label: "Cancelled", 
        className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", 
        icon: <XCircle className="w-3 h-3" /> 
      },
      waiting: { 
        label: "Confirmed", 
        className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", 
        icon: <Clock className="w-3 h-3" /> 
      },
      "on-process": { 
        label: "On-process", 
        className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", 
        icon: <AlertCircle className="w-3 h-3" /> 
      },
      pending: { 
        label: "Pending", 
        className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", 
        icon: <AlertCircle className="w-3 h-3" /> 
      },
    };
    const config = statusConfig[status.toLowerCase()] || { 
      label: status, 
      className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", 
      icon: <AlertCircle className="w-3 h-3" /> 
    };
    return (
      <Badge className={`flex items-center gap-1 ${config.className}`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  
  // Helper to get status summary across all services
  const getStatusSummary = () => {
    const statusCounts = services.reduce((acc, service) => {
      const status = service.status || "pending";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const summaryParts: string[] = [];
    if (statusCounts["completed"]) summaryParts.push(`${statusCounts["completed"]} completed`);
    if (statusCounts["on-process"]) summaryParts.push(`${statusCounts["on-process"]} on-process`);
    if (statusCounts["waiting"]) summaryParts.push(`${statusCounts["waiting"]} confirmed`);
    if (statusCounts["pending"]) summaryParts.push(`${statusCounts["pending"]} pending`);
    if (statusCounts["cancelled"]) summaryParts.push(`${statusCounts["cancelled"]} cancelled`);

    return summaryParts.length > 0 ? summaryParts.join(", ") : "No services";
  };

  // Helper to get available status options based on current status
  const getAvailableStatusOptions = (currentStatus: string) => {
    // Completed and cancelled services cannot be changed
    if (currentStatus === "completed" || currentStatus === "cancelled") {
      return [currentStatus];
    }
    
    // For all other statuses, allow all transitions
    return ["pending", "waiting", "on-process", "completed", "cancelled"];
  };

  // Helper to check if a service can be edited
  const canEditService = (serviceStatus: string) => {
    return !(serviceStatus === "completed" || serviceStatus === "cancelled");
  };

  console.log("Rendering ReceiptCard for appointment:", appointment.services?.map(s => s.start_time) ?? "No services");

  return (
    <div className="space-y-4 max-h-[85vh] overflow-y-auto overflow-x-hidden">
      <div className="flex flex-wrap gap-3 justify-start sticky top-0 z-10 pb-3">
        <Button onClick={printReceipt} variant="outline" size="default">
          <Printer className="w-4 h-4 mr-2" />
          Print Receipt
        </Button>
      </div>

      <Card ref={receiptRef} className={`w-full mx-auto shadow-xl border-2 py-0 ${className}`}>
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b py-2">
          <div className="flex flex-col gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">RECEIPT</h2>
                <div className="flex flex-col items-end gap-1">
                  {getStatusBadge(appointment.status)}
                  {services.length > 0 && (
                    <p className="text-xs text-muted-foreground italic">
                      {getStatusSummary()}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span className="font-mono text-xs">#{appointment.appointment_id}</span>
                </p>
                <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="break-words">{services[0] ? new Date(services[0].start_time).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ""}</span>
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-3 shadow-sm border">
              <div className="flex items-center gap-2 mb-2">
                <VenetianMask className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Customer</p>
              </div>
              <p className="font-bold text-base break-words">{appointment.customer_name_snapshot}</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 break-words">{appointment.phone_number}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-6">
          <div className="space-y-6">
            {/* Branch Location */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-3 border-l-4 border-primary shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <h4 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Branch Location</h4>
              </div>
              <p className="font-semibold text-sm md:text-base break-words">{appointment.branch_name_snapshot}</p>
            </div>

            {/* Service Details */}
            <div>
              <h4 className="text-sm font-bold tracking-wide text-foreground uppercase mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-primary rounded-full"></div>
                Service Details
              </h4>
              <div className="space-y-4">
                {services.map((s: AppointmentService, idx: number) => {
                  const serviceCost = s.discounted_price_snapshot ?? s.price_snapshot;
                  const professionalFee = s.is_pro_snapshot ? 1500 : 0;
                  return (
                    <div key={s.id || idx} className="flex flex-col gap-3 p-3 md:p-4 border-2 rounded-lg hover:border-primary/50 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-transparent to-primary/5">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
                            <p className="font-bold text-base md:text-lg break-words">{s.service_name_snapshot}</p>
                          </div>
                          <div className="flex gap-1.5 flex-shrink-0">
                            {s.is_pro_snapshot && <Badge className="text-xs bg-green-500 rounded-full">Professional</Badge>}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex flex-col gap-1">
                            <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-2">
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              <span className="font-medium">
                                {s.start_time ? new Date(s.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : "N/A"}
                              </span>
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-2">
                              <VenetianMask className="w-3 h-3 flex-shrink-0" />
                              <span className="font-medium break-words">
                                {s.aesthetician_name_snapshot ?? <span className="italic text-destructive font-semibold">Unassigned</span>}
                              </span>
                            </p>
                            {/* Service Status */}
                            {s.status && (
                              <div className="flex items-center gap-2 mt-1">
                                {getStatusBadge(s.status)}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-right sm:text-right">
                            <p className="font-bold text-lg md:text-xl tabular-nums">{formatCurrency(serviceCost)}</p>
                            {s.is_sale_snapshot && (
                              <p className="text-xs text-muted-foreground line-through">{formatCurrency(s.price_snapshot)}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {s.is_pro_snapshot && (
                        <div className="text-xs md:text-sm bg-amber-50 dark:bg-amber-950/20 px-2 md:px-3 py-1.5 rounded-md border border-amber-200 dark:border-amber-800 flex justify-between items-center">
                          <span className="text-amber-700 dark:text-amber-300 font-semibold">Professional Fee:</span>
                          <span className="font-bold ml-2">{formatCurrency(professionalFee)}</span>
                        </div>
                      )}

                      {canEdit && (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="flex-1 shadow-sm" 
                            onClick={() => setOpenServiceIdx(idx)}
                            disabled={!canEditService(s.status || "pending")}
                          >
                            <VenetianMask className="w-3.5 h-3.5 mr-1.5" />
                            {s.aesthetician_name_snapshot ? "Change" : "Assign"}
                          </Button>
                          
                          {/* Service Status Dropdown */}
                          {s.aesthetician_name_snapshot && (
                            <Select 
                              value={s.status || "pending"} 
                              onValueChange={(value) => handleStatusChangeRequest(s.service_id, s.service_name_snapshot, s.status || "pending", value)}
                              disabled={!canEditService(s.status || "pending")}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Change Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableStatusOptions(s.status || "pending").map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status === "waiting" ? "Confirmed" : status.charAt(0).toUpperCase() + status.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      )}
                      
                      <Dialog open={openServiceIdx === idx} onOpenChange={(open) => setOpenServiceIdx(open ? idx : null)}>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Change Aesthetician</DialogTitle>
                          </DialogHeader>
                          <ChangeAestheticianModal
                            appointmentId={appointment.appointment_id}
                            serviceId={s.service_id}
                            isPro={s.is_pro_snapshot}
                            currentAestheticianId={s.aesthetician_name_snapshot || ""}
                            branchId={appointment.branch_id || ""}
                            onClose={() => setOpenServiceIdx(null)}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 shadow-lg border-2 border-primary/20">
              <h4 className="text-sm md:text-base font-bold tracking-wide mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                Payment Summary
              </h4>
              
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs md:text-sm">
                  <p className="text-muted-foreground">Subtotal</p>
                  <p className="font-semibold tabular-nums">{formatCurrency(subtotal)}</p>
                </div>
                
                {voucherDiscount > 0 && (
                  <div className="flex justify-between items-center text-xs md:text-sm bg-green-50 dark:bg-green-950/20 p-2 rounded-md border border-green-200 dark:border-green-800">
                    <p className="text-green-700 dark:text-green-300 font-medium">Discount</p>
                    <p className="font-bold tabular-nums text-green-700 dark:text-green-300">-{formatCurrency(voucherDiscount)}</p>
                  </div>
                )}

                <Separator className="my-3" />

                <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-2.5 md:p-3 rounded-lg shadow-sm border-2">
                  <p className="font-bold text-sm md:text-base">Total Due</p>
                  <p className="text-xl md:text-2xl font-bold tabular-nums text-primary">{formatCurrency(totalServiceCost)}</p>
                </div>

                <Separator className="my-3" />

                <div className="space-y-2 text-xs md:text-sm">
                  {appointment.final_payment_method && (
                    <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-slate-900/50 rounded-md gap-2">
                      <p className="text-muted-foreground flex items-center gap-1.5">
                        <CreditCard className="w-3 h-3 flex-shrink-0" />
                        <span>Payment Method</span>
                      </p>
                      <p className="font-semibold capitalize break-words text-right">{appointment.final_payment_method}</p>
                    </div>
                  )}
                  
                 
                  
                  <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-slate-900/50 rounded-md gap-2">
                    <p className="text-muted-foreground">Appointment</p>
                    <div>{getStatusBadge(appointment.status)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="text-center py-4">
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              Thank you for choosing our services! Please keep this receipt for your records.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Status Change Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status of this service?
            </DialogDescription>
          </DialogHeader>
          {pendingStatusChange && (
            <div className="space-y-3 py-4">
              <div className="flex flex-col gap-2 p-3 bg-muted rounded-lg">
                <p className="text-sm font-semibold">{pendingStatusChange.serviceName}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span>Current:</span>
                  {getStatusBadge(pendingStatusChange.currentStatus)}
                  <span>→</span>
                  {getStatusBadge(pendingStatusChange.newStatus)}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                This will update the service status and may affect the overall appointment status.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={cancelStatusChange}>
              Cancel
            </Button>
            <Button onClick={confirmStatusChange}>
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReceiptCard;
