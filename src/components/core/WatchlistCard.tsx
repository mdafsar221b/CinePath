// src/components/core/WatchlistCard.tsx
import { WatchlistItem } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { XCircle, Play, Eye } from "lucide-react";
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
    <Card className="relative bg-card border border-border rounded-lg p-4 transition-transform duration-300 hover:scale-[1.02]">
      <div className="flex items-center gap-4">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`${item.title} poster`}
            width={75}
            height={112}
            className="rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="flex h-[112px] w-[75px] items-center justify-center rounded-lg bg-muted-foreground/20 text-center text-[10px] text-muted-foreground flex-shrink-0">
            Poster Not Available
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-light truncate">{item.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            {item.year && <p className="text-sm text-muted-foreground">{item.year}</p>}
            <Badge variant="outline" className="text-xs">
              {item.type === 'movie' ? 'Movie' : 'TV Show'}
            </Badge>
          </div>
          {item.genre && (
            <p className="text-xs text-muted-foreground mt-1 truncate">{item.genre}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => onShowDetails(item)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Details
          </Button>
          <Button
            onClick={() => onMarkWatched(item)}
            variant="default"
            size="sm"
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Mark Watched
          </Button>
        </div>
      </div>
      <button 
        onClick={() => onRemove(item._id)} 
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground/80 transition-colors duration-200"
      >
        <XCircle size={16} />
      </button>
    </Card>
  );
};