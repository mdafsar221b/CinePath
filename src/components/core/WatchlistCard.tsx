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
    <Card className="glass-card hover-lift rounded-2xl p-6 group border-border/50 relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(item._id)}
        className="absolute top-4 right-4 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors duration-300 rounded-lg z-10"
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-6 pr-12">
        <div className="flex-shrink-0">
          {posterUrl ? (
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src={posterUrl}
                alt={`${item.title} poster`}
                width={80}
                height={120}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="flex h-[120px] w-[80px] items-center justify-center rounded-xl bg-muted/20 text-center text-xs text-muted-foreground">
              No Poster
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300 truncate">
            {item.title}
          </h3>
          
          <div className="flex items-center gap-3 mb-3">
            {item.year && (
              <Badge variant="outline" className="text-xs">
                {item.year}
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
            {item.imdbRating && item.imdbRating !== "N/A" && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm font-medium">{item.imdbRating}</span>
              </div>
            )}
          </div>
          
          {item.genre && (
            <p className="text-sm text-muted-foreground truncate mb-4">
              {item.genre}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => onShowDetails(item)}
              variant="outline"
              size="sm"
              className="glass-card hover:bg-muted/20 transition-colors duration-300"
            >
              <Eye className="h-4 w-4 mr-2" />
              Details
            </Button>
            <Button
              onClick={() => onMarkWatched(item)}
              className="bg-primary hover:bg-primary/90 transition-colors duration-300"
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              Mark Watched
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};