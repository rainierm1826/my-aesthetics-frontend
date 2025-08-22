import { Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RatingStarProps {
  rating: number | null;
  max?: number;
}

export const RatingStar: React.FC<RatingStarProps> = ({ rating, max = 5 }) => {
  // Normalize rating: number in [0, max]
  const raw =
    typeof rating === "number" && Number.isFinite(rating) ? rating : 0;
  const safeRating = Math.min(Math.max(raw, 0), max);

  // If you only render full stars, rounding is fine:
  const fullStars = Math.round(safeRating); // or Math.floor/ceil depending on desired behavior

  const display = safeRating.toFixed(1);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className="relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <Star
                className={`h-5 w-5 ${
                  i < fullStars
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{display}</p>
            </TooltipContent>
          </Tooltip>
        </span>
      ))}
    </div>
  );
};
