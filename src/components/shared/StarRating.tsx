"use client";

import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  count: number;
  size?: number;
}

export function StarRating({ rating, count, size = 16 }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={size} className="text-yellow-400 fill-yellow-400" />
        ))}
        {halfStar === 1 && <StarHalf size={size} className="text-yellow-400 fill-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-yellow-400" />
        ))}
      </div>
      <span className="text-sm text-muted-foreground ml-1">
        ({count})
      </span>
    </div>
  );
}
