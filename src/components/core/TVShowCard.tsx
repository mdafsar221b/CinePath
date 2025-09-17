import { TVShow } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface TVShowCardProps {
  show: TVShow;
  onRemove: (_id: string) => void;
  onShowDetails: (show: TVShow) => void;
}

export const TVShowCard = ({ show, onRemove, onShowDetails }: TVShowCardProps) => {
  const totalEpisodes = show.seasonsWatched.reduce((sum, season) => sum + season.episodes, 0);
  const totalSeasons = show.seasonsWatched.length;
  const posterUrl = show.poster_path;

  return (
    <Card className="hover-lift rounded-2xl group border-border/50 relative overflow-hidden bg-secondary/30">
      <div className="relative w-full h-[300px] overflow-hidden rounded-t-2xl">
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
      </div>
      
      <div className="p-4 flex flex-col items-center text-center">
        <h3 className="text-lg font-semibold mb-1 truncate w-full">{show.title}</h3>
        <p className="text-sm text-muted-foreground mb-3">S0{totalSeasons} / {totalEpisodes} EPs</p>
        <div className="flex items-center gap-2">
            {show.imdbRating && show.imdbRating !== "N/A" && (
                <Badge variant="outline" className="text-xs">
                    ⭐ {show.imdbRating}
                </Badge>
            )}
            <Button
                variant="outline"
                size="sm"
                onClick={() => onShowDetails(show)}
                className="rounded-full"
            >
                <Eye className="h-4 w-4" />
            </Button>
            <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(show._id);
                }}
                className="rounded-full"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
      </div>
    </Card>
  );
};