// "use client";

// import { getAestheticianSlot } from "@/api/aesthetician";
// import { AvailableSlotsResponse } from "@/lib/types/aesthetician-types";
// import { keepPreviousData, useQuery } from "@tanstack/react-query";

// export function useAestheticianSlot({
//   aestheticianId,
//   serviceId,
//   date,
//   token,
// }: {
//   date: string;
//   serviceId: string;
//   aestheticianId: string;
//   token: string;
// }) {
//   return useQuery<AvailableSlotsResponse, Error>({
//     queryKey: ["aesthetician-slots", aestheticianId, serviceId, date],
//     queryFn: () =>
//       getAestheticianSlot({
//         aesthetician_id: aestheticianId,
//         service_id: serviceId,
//         date,
//         token,
//       }),
//     enabled: !!aestheticianId && !!serviceId && !!date && !!token,
//     placeholderData: keepPreviousData,
//     refetchOnMount: true,
//     refetchOnWindowFocus: false,
//     staleTime: 30 * 1000, // 30 seconds - shorter stale time for real-time booking
//   });
// }
