// mdafsar221b/cinepath/CinePath-ed0512876bf9ae6b339c553aeb3a48201202f7b2/src/components/core/TVShowCard.tsx

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
      <div className="relative w-full h-[250px] overflow-hidden rounded-t-2xl">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`${show.title} poster`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center rounded-t-xl bg-muted/20 text-center text-xs text-muted-foreground">
            No Poster
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(show);
                }}
                className="rounded-full bg-background/50 backdrop-blur-sm"
            >
                <Pencil className="h-4 w-4" />
            </Button>
            <Button
                variant="destructive"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(show._id);
                }}
                className="rounded-full bg-background/50 backdrop-blur-sm"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
      </div>
      
      <div className="p-4 flex flex-col items-center text-center">
        <h3 className="text-lg font-semibold mb-1 truncate w-full">{show.title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{totalSeasons} Seasons / {totalEpisodes} Episodes Watched</p>
        <div className="flex items-center gap-2">
            {show.imdbRating && show.imdbRating !== "N/A" && (
                <Badge variant="outline" className="text-xs">
                    ⭐ {show.imdbRating}
                </Badge>
            )}
            {show.myRating && (
                <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                    My Rating: {show.myRating}
                </Badge>
            )}
        </div>
      </div>
    </Card>
  );
};