import { z } from "zod";

// Per-service review schema: include both service and aesthetician ratings/comments
export const serviceReviewSchema = z.object({
  service_id: z.string().min(1),
  service_rating: z.number().min(1).max(5),
  service_comment: z.string().min(1, "Service comment is required"),
  aesthetician_rating: z.number().min(1).max(5),
  aesthetician_comment: z.string().min(1, "Aesthetician comment is required"),
});

export const ratingFormSchema = z.object({
  branch_rating: z.number().min(1).max(5),
  branch_comment: z.string().min(1, "Branch comment is required"),
  services: z.array(serviceReviewSchema).min(1, "At least one service to review"),
});

export type ServiceReviewValues = z.infer<typeof serviceReviewSchema>;
export type RatingFormValues = z.infer<typeof ratingFormSchema>;