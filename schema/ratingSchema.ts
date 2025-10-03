import { z } from "zod";

export const ratingFormSchema = z.object({
  branch_rating: z.number().min(1).max(5),
  service_rating: z.number().min(1).max(5),
  aesthetician_rating: z.number().min(1).max(5),
  branch_comment: z.string().min(1, "Branch comment is required"),
  service_comment: z.string().min(1, "Service comment is required"),
  aesthetician_comment: z.string().min(1, "Aesthetician comment is required"),
});

export type RatingFormValues = z.infer<typeof ratingFormSchema>;