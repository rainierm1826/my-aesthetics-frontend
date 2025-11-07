"use client";

import { useEffect } from "react";
import { useWebSocket } from "@/provider/WebSocketProvider";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAppointmentWebSocket = () => {
  const { socket, isConnected } = useWebSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join the appointments room to receive updates
    socket.emit("join_appointments");

    // Listen for new appointments
    socket.on("new_appointment", () => {
      toast.success("New Appointment");

      // Invalidate all queries that start with these keys
      queryClient.invalidateQueries({ 
        queryKey: ["appointment"],
        refetchType: 'all' // Refetch both active and inactive queries
      });
      queryClient.invalidateQueries({ 
        queryKey: ["history"],
        refetchType: 'all'
      });
    });

    // Listen for appointment updates
    socket.on("appointment_updated", () => {
      toast.info("Appointment Updated");

      // Invalidate all queries that start with these keys
      queryClient.invalidateQueries({ 
        queryKey: ["appointment"],
        refetchType: 'all'
      });
      queryClient.invalidateQueries({ 
        queryKey: ["history"],
        refetchType: 'all'
      });
    });


    // Cleanup listeners on unmount
    return () => {
      socket.off("new_appointment");
      socket.off("appointment_updated");
      socket.off("appointment_deleted");
      socket.emit("leave_appointments");
    };
  }, [socket, isConnected, queryClient]);

  return { socket, isConnected };
};
