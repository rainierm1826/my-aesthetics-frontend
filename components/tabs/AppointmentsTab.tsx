"use client";

import React from "react";
import { Appointment } from "@/lib/types/appointment-types";
import { HistoryCard } from "@/components/cards/HistoryCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button"; // Not used after removing global cancel

import { Clock, CheckCircle, XCircle } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import { useAuthStore } from "@/provider/store/authStore";
import { AppointmentListSkeleton } from "../skeletons/SkeletonHistory";
import { useAppointmentWebSocket } from "@/hooks/useAppointmentWebSocket";
// Global cancel removed; only per-service cancel is allowed via HistoryCard

const AppointmentsTab = () => {
  const { access_token } = useAuthStore();
  
  // Enable real-time appointment updates via WebSocket
  useAppointmentWebSocket();
  
  const { data, isFetching } = useHistory(access_token || "");
  const appointmentsRaw: Appointment[] = data?.appointment ?? [];

  // Derive overall appointment status from per-service statuses
  const deriveStatus = (appt: Appointment): string => {
    const svcs = appt.services || [];
    if (!svcs.length) return appt.status;
    const activeStatuses = svcs
      .map((s) => String((s as { status?: string }).status || '').toLowerCase())
      .filter((s) => s !== 'cancelled');

    // If no active services (all cancelled) → cancelled
    if (activeStatuses.length === 0) return 'cancelled';

    if (activeStatuses.every((s) => s === 'completed')) return 'completed';
    if (activeStatuses.some((s) => s === 'on-process')) return 'on-process';
    if (activeStatuses.some((s) => s === 'waiting')) return 'waiting';
    if (activeStatuses.every((s) => s === 'pending')) return 'pending';

    return appt.status;
  };

  const appointments: Appointment[] = appointmentsRaw.map((a) => ({
    ...a,
    status: deriveStatus(a) as Appointment['status'],
  }));

  // Helper to get latest date/time among services (fallback to appointment.start_time)
  const getLatestTimestamp = (appt: Appointment): number => {
    const serviceTimes = (appt.services || [])
      .map((s) => {
        const t = (s as { start_time?: string }).start_time;
        return t ? Date.parse(t) : NaN;
      })
      .filter((n) => Number.isFinite(n)) as number[];
    const apptTime = appt.start_time ? Date.parse(appt.start_time) : NaN;
    const all = [...serviceTimes, apptTime].filter((n) => Number.isFinite(n)) as number[];
    return all.length ? Math.max(...all) : 0;
  };

  const sortByLatestDesc = (list: Appointment[]) =>
    list.slice().sort((a, b) => getLatestTimestamp(b) - getLatestTimestamp(a));

  const activeAppointments: Appointment[] = sortByLatestDesc(
    appointments.filter((a) => ["pending", "waiting", "on-process"].includes(a.status))
  );
  const completedAppointments: Appointment[] = sortByLatestDesc(
    appointments.filter((a) => a.status === "completed")
  );
  const cancelledAppointments: Appointment[] = sortByLatestDesc(
    appointments.filter((a) => a.status === "cancelled")
  );

  console.log("AppointmentsTab - appointments:", appointments);

  // Removed global cancel actions; per-service cancel is handled in HistoryCard

  return (
    <>
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="active">
          Active ({activeAppointments.length})
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed ({completedAppointments.length})
        </TabsTrigger>
        <TabsTrigger value="cancelled">
          Cancelled ({cancelledAppointments.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="active" className="mt-6">
        {isFetching ? (
          <AppointmentListSkeleton />
        ) : activeAppointments.length > 0 ? (
          activeAppointments.map((appointment) => (
            <div key={appointment.appointment_id} className="relative">
              <HistoryCard
                appointment={appointment}
              />
              {/* Global cancel removed; users can cancel per service within HistoryCard */}
            </div>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">No active appointments</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="completed" className="mt-6">
        {isFetching ? (
          <AppointmentListSkeleton />
        ) : completedAppointments.length > 0 ? (
          completedAppointments.map((appointment) => (
            <HistoryCard
              key={appointment.appointment_id}
              appointment={appointment}
              showRatingForm
            />
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">No completed appointments</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="cancelled" className="mt-6">
        {isFetching ? (
          <AppointmentListSkeleton />
        ) : cancelledAppointments.length > 0 ? (
          cancelledAppointments.map((appointment) => (
            <HistoryCard
              key={appointment.appointment_id}
              appointment={appointment}
            />
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <XCircle className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">No cancelled appointments</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
    
    {/* Global cancel dialog removed */}
    </>
  );
};

export default AppointmentsTab;
