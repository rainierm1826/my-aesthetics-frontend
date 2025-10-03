"use client";

import React from "react";
import { Appointment } from "@/lib/types/appointment-types";
import { HistoryCard } from "@/components/cards/HistoryCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

import { Clock, CheckCircle, XCircle } from "lucide-react";

const AppointmentsTab = ({
  activeAppointments,
  completedAppointments,
  cancelledAppointments,
}: {
  activeAppointments: Appointment[];
  completedAppointments: Appointment[];
  cancelledAppointments: Appointment[];
}) => {
  return (
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
        {activeAppointments.length > 0 ? (
          activeAppointments.map((appointment) => (
            <HistoryCard
              key={appointment.appointment_id}
              appointment={appointment}
            />
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
        {completedAppointments.length > 0 ? (
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
        {cancelledAppointments.length > 0 ? (
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
  );
};

export default AppointmentsTab;
