import { WatchlistItem } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { X, Play, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface WatchlistCardProps {
  item: WatchlistItem;
  onRemove: (_id: string) => void;
  onShowDetails: (item: WatchlistItem) => void;
  onMarkWatched: (item: WatchlistItem) => void;
}

export const WatchlistCard = ({ item, onRemove, onShowDetails, onMarkWatched }: WatchlistCardProps) => {
  const posterUrl = item.poster_path;

  return (
    <Card className="hover-lift rounded-2xl group border-border/50 relative overflow-hidden bg-secondary/30">
      {/* Reduced height for 4-column layout: h-32 is roughly 1:1.5 poster ratio */}
      <div className="relative w-full h-32 sm:h-[250px] overflow-hidden rounded-t-2xl">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`${item.title} poster`}
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
                    onShowDetails(item);
                }}
                className="rounded-full bg-background/50 backdrop-blur-sm h-6 w-6 sm:h-10 sm:w-10"
            >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onMarkWatched(item);
                }}
                className="rounded-full bg-background/50 backdrop-blur-sm h-6 w-6 sm:h-10 sm:w-10"
            >
                <Play className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
                variant="destructive"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item._id);
                }}
                className="rounded-full bg-background/50 backdrop-blur-sm h-6 w-6 sm:h-10 sm:w-10"
            >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
        </div>
      </div>
      
      {/* Details: Smaller typography (text-sm) and padding (p-2) */}
      <div className="p-2 sm:p-4 flex flex-col items-center text-center">
        <h3 className="text-sm sm:text-lg font-semibold mb-0 truncate w-full">{item.title}</h3>
        <p className="text-xs text-muted-foreground mb-1 sm:mb-3">{item.year}</p>
        <div className="flex items-center gap-1">
            {item.imdbRating && item.imdbRating !== "N/A" && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                    ⭐ {item.imdbRating}
                </Badge>
            )}
            <Badge 
                className={`text-xs ${
                    item.type === 'movie' 
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                      : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                }`}
            >
                {item.type === 'movie' ? 'Movie' : 'TV Show'}
            </Badge>
        </div>
      </div>
    </Card>
  );
};