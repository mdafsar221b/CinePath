// src/components/ui/SkeletonCard.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

// Base skeleton card mimicking the movie/tv card dimensions
export const SkeletonCard = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "rounded-2xl border border-border/50 bg-secondary/30 relative overflow-hidden animate-pulse",
      className
    )}
  >
    {/* Poster Skeleton (h-32 to h-250px) */}
    <div className="relative w-full h-32 sm:h-[250px] bg-muted/50 rounded-t-2xl" />
    
    {/* Text Details Skeleton */}
    <div className="p-2 sm:p-4 flex flex-col items-center text-center">
      {/* Title Placeholder */}
      <div className="h-4 w-3/4 bg-muted/50 rounded mb-2" />
      {/* Subtitle Placeholder */}
      <div className="h-3 w-1/3 bg-muted/50 rounded mb-3" />
      {/* Badge/Rating Placeholder */}
      <div className="h-3 w-1/4 bg-muted/50 rounded" />
    </div>
  </div>
);

// Skeleton wrapper for the Watchlist section (5 items)
export const WatchlistSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} />
        ))}
    </div>
);

// Skeleton wrapper for the Movie/TV Sections (6 items)
export const ContentSectionSkeleton = () => (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
        ))}
    </div>
);