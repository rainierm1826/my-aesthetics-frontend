"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { deleteData } from "@/lib/function";
import ActionCell from "@/components/ActionCell";
import ReceiptCard from "../cards/ReceiptCard";
import { Appointment, AppointmentService } from "@/lib/types/appointment-types";

export const appointmentColumn: ColumnDef<Appointment>[] = [
  {
    accessorKey: "appointment_id",
    header: "Appointment ID",
  },
  {
    accessorKey: "start_time",
    header: "First Service Time",
    cell: ({ row }) => {
      const time = row.original.services?.[0]?.start_time;
      if (!time) return "N/A";
      
      return new Date(time).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    },
  },
  {
    accessorKey: "customer_name_snapshot",
    header: "Customer",
  },
  {
    accessorKey: "to_pay",
    header: "To Pay",
    cell: ({ row }) => {
      const services = (row.original.services || []) as (AppointmentService & {
        service_status?: string;
        discounted_price_snapshot?: number;
        price_snapshot?: number;
        is_pro_snapshot?: boolean;
        discount_type_snapshot?: string | null;
        discount_snapshot?: number | null;
      })[];
      // Compute net amount of cancelled services to subtract from original to_pay
      let cancelledNet = 0;
      services.forEach(svc => {
        const status = (svc.service_status || "").toLowerCase();
        if (status !== "cancelled") return;
        const base = (svc.discounted_price_snapshot ?? svc.price_snapshot ?? 0) + (svc.is_pro_snapshot ? 1500 : 0);
        let discountApplied = 0;
        if (svc.discount_type_snapshot === "fixed") {
          discountApplied = svc.discount_snapshot ?? 0;
        } else if (svc.discount_type_snapshot === "percentage") {
          discountApplied = ((svc.discount_snapshot ?? 0) / 100) * base;
        }
        cancelledNet += Math.max(0, base - discountApplied);
      });
      const adjusted = Math.max(0, row.original.to_pay - cancelledNet);
      return `₱${adjusted.toFixed(2)}`;
    },
  },
  {
    // Show per-service status counts instead of overall status
    id: "service_status_counts",
    header: "Service Statuses",
    cell: ({ row }) => {
      const services = row.original.services || [];
      const counts: Record<string, number> = {};
      type ServiceLike = AppointmentService & { service_status?: string };
      (services as ServiceLike[]).forEach((svc) => {
        const raw = (svc.service_status ?? "").toLowerCase();
        const label = raw === "waiting" ? "Confirmed" : raw.charAt(0).toUpperCase() + raw.slice(1);
        counts[label] = (counts[label] || 0) + 1;
      });
      // Order by a sensible priority
      const priority = ["Pending", "Confirmed", "On-process", "Completed", "Cancelled"];
      const colorMap: Record<string, string> = {
        Pending: "bg-gray-100 text-gray-700",
        Confirmed: "bg-blue-100 text-blue-700",
        "On-process": "bg-yellow-100 text-yellow-700",
        Completed: "bg-green-100 text-green-700",
        Cancelled: "bg-red-100 text-red-700",
      };
      const parts = Object.entries(counts).sort((a, b) => priority.indexOf(a[0]) - priority.indexOf(b[0]));

      if (parts.length === 0) {
        return <Badge className="rounded-full bg-gray-100 text-gray-700">No services</Badge>;
      }

      return (
        <div className="flex flex-wrap gap-1">
          {parts.map(([label, n]) => (
            <Badge key={label} className={`rounded-full ${colorMap[label] || "bg-gray-100 text-gray-700"}`}>
              {n} {label}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { appointment_id, status } = row.original;
      
      // If appointment is completed or cancelled, only allow preview
      const isCompleted = status === "completed" || status === "cancelled";
      
      // Actions available:
      // - Preview: View receipt with all services and their individual statuses
      // - Delete: Only for non-completed/non-cancelled appointments

      return (
        <ActionCell
          deleteFn={!isCompleted ? (id: string) => deleteData({ id: id, url: "appointment" }) : undefined}
          deleteMessage={!isCompleted ? "Appointment has been deleted." : undefined}
          queryKey="appointment"
          id={appointment_id}
          previewDialog={<ReceiptCard appointment={row.original} />}
          isCompleted={isCompleted}
        />
      );
    },
  },
];
