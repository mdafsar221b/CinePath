import { TVShow } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface TVShowCardProps {
  show: TVShow;
  onRemove: (_id: string) => void;
  onShowDetails: (show: TVShow) => void;
  onEdit: (show: TVShow) => void;
}

export const TVShowCard = ({ show, onRemove, onShowDetails, onEdit }: TVShowCardProps) => {
  const totalEpisodes = show.seasonsWatched.reduce((sum, season) => sum + (season.watchedEpisodes?.length || 0), 0);
  const totalSeasons = show.seasonsWatched.length;
  const posterUrl = show.poster_path;

  return (
    <Card 
      className="hover-lift rounded-2xl group border-border/50 relative overflow-hidden bg-secondary/30 cursor-pointer"
      onClick={() => onShowDetails(show)}
    >
      {/* Reduced height for 4-column layout: h-32 is roughly 1:1.5 poster ratio */}
      <div className="relative w-full h-32 sm:h-[250px] overflow-hidden rounded-t-2xl">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`${show.title} poster`}
            fill
            sizes="(max-width: 640px) 25vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center rounded-t-xl bg-muted/20 text-center text-xs text-muted-foreground">
            No Poster
          </div>
        )}
        {/* Buttons: Smaller size (h-6 w-6) for mobile */}
        <div className="absolute top-1 right-1 flex flex-col gap-1 transition-opacity duration-300">
            <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(show);
                }}
                className="rounded-full bg-background/50 backdrop-blur-sm h-6 w-6 sm:h-10 sm:w-10"
            >
                <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
                variant="destructive"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(show._id);
                }}
                className="rounded-full bg-background/50 backdrop-blur-sm h-6 w-6 sm:h-10 sm:w-10"
            >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
        </div>
      </div>
      
      {/* Details: Smaller typography (text-sm) and padding (p-2) */}
      <div className="p-2 sm:p-4 flex flex-col items-center text-center">
        <h3 className="text-sm sm:text-lg font-semibold mb-0 truncate w-full">{show.title}</h3>
        <p className="text-xs text-muted-foreground mb-1 sm:mb-3">{totalSeasons} S / {totalEpisodes} E Watched</p>
        <div className="flex items-center gap-1">
            {show.imdbRating && show.imdbRating !== "N/A" && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                    ⭐ {show.imdbRating}
                </Badge>
            )}
        </div>
      </div>
    </Card>
  );
};