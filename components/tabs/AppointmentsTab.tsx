"use client";

import React, { useState } from "react";
import { Appointment } from "@/lib/types/appointment-types";
import { HistoryCard } from "@/components/cards/HistoryCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Clock, CheckCircle, XCircle } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import { useAuthStore } from "@/provider/store/authStore";
import { AppointmentListSkeleton } from "../skeletons/SkeletonHistory";
import { useAppointmentWebSocket } from "@/hooks/useAppointmentWebSocket";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { patchAppointment } from "@/api/appointment";

const AppointmentsTab = () => {
  const { access_token } = useAuthStore();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  
  // Enable real-time appointment updates via WebSocket
  useAppointmentWebSocket();
  
  const { data, isFetching } = useHistory(access_token || "");
  const appointments: Appointment[] = data?.appointment ?? [];

  const activeAppointments: Appointment[] = appointments.filter((a) =>
    ["pending", "waiting", "on-process"].includes(a.status)
  );
  const completedAppointments: Appointment[] = appointments.filter(
    (a) => a.status === "completed"
  );
  const cancelledAppointments: Appointment[] = appointments.filter(
    (a) => a.status === "cancelled"
  );

  // Mutation for cancelling appointments
  const cancelMutation = useBaseMutation("patch", {
    updateFn: patchAppointment,
    queryKey: [
      ["appointment"],
      ["history"],
      ["aesthetician-name"],
      ["aesthetician"],
      ["appointment-summary"],
      ["sales-summary"],
      ["analytics-appointments"],
      ["analytics-sales"],
    ],
    successMessages: {
      update: "Appointment cancelled successfully",
    },
    onSuccess: () => {
      setCancelDialogOpen(false);
      setSelectedAppointmentId(null);
    },
  });

  const handleCancelClick = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    if (selectedAppointmentId) {
      cancelMutation.mutate({
        data: {
          appointment_id: selectedAppointmentId,
          status: "cancelled",
        },
        token: access_token || "",
      });
    }
  };

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
              {appointment.status === "pending" && (
                <div className="absolute top-4 right-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelClick(appointment.appointment_id)}
                    className="bg-red-500 hover:bg-red-400"
                  >
                    Cancel Appointment
                  </Button>
                </div>
              )}
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
    
    {/* Cancel Appointment Dialog */}
    <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel this appointment? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={cancelMutation.isPending}>
            No, Keep It
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancelConfirm}
            disabled={cancelMutation.isPending}
            className="bg-red-500 text-white hover:bg-red-400 disabled:opacity-50"
          >
            {cancelMutation.isPending ? "Cancelling..." : "Yes, Cancel"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};

export default AppointmentsTab;
