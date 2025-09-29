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
      <div className="relative w-full h-[250px] overflow-hidden rounded-t-2xl">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`${item.title} poster`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 15vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center rounded-t-xl bg-muted/20 text-center text-xs text-muted-foreground">
            No Poster
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col items-center text-center">
        <h3 className="text-lg font-semibold mb-1 truncate w-full">{item.title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{item.year}</p>
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onShowDetails(item)}
                className="rounded-full"
            >
                <Eye className="h-4 w-4" />
            </Button>
            <Button
                onClick={() => onMarkWatched(item)}
                size="sm"
                className="rounded-full"
            >
                <Play className="h-4 w-4" />
            </Button>
            <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemove(item._id)}
                className="rounded-full"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
      </div>
    </Card>
  );
};