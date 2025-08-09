import { Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RatingStarProps {
  rating: number;
  max?: number;
}

export const RatingStar: React.FC<RatingStarProps> = ({ rating, max = 5 }) => {
  const fullStars = rating % 1 >= 0.5 ? Math.ceil(rating) : Math.floor(rating);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => {
        return (
          <span key={i} className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <Star
                  className={`w-5 h-5 ${
                    i < fullStars
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{rating.toFixed(1)}</p>
              </TooltipContent>
            </Tooltip>
          </span>
        );
      })}
    </div>
  );
};
