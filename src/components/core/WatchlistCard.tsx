import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WatchlistItem } from "@/lib/types";
import { Eye, Play, Star, Trash2 } from "lucide-react";

interface WatchlistCardProps {
  item: WatchlistItem;
  onRemove: (_id: string) => void;
  onShowDetails: (item: WatchlistItem) => void;
  onMarkWatched: (item: WatchlistItem) => void;
}

export const WatchlistCard = ({ item, onRemove, onShowDetails, onMarkWatched }: WatchlistCardProps) => {
  return (
    <Card className="hover-lift group overflow-hidden border-white/10">
      <div className="relative h-[20rem]">
        {item.poster_path ? (
          <Image
            src={item.poster_path}
            alt={`${item.title} poster`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 16vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-white/6 text-sm text-muted-foreground">
            No Poster
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,8,16,0.98)] via-[rgba(4,8,16,0.18)] to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <Badge className={item.type === "movie" ? "bg-sky-500/15 text-sky-300 border-sky-400/20" : "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/20"}>
            {item.type === "movie" ? "movie" : "tv show"}
          </Badge>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => onShowDetails(item)} className="h-9 w-9 rounded-full">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="icon" onClick={() => onMarkWatched(item)} className="h-9 w-9 rounded-full">
              <Play className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={() => onRemove(item._id)} className="h-9 w-9 rounded-full">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="mb-2 flex items-center gap-2">
            {item.year ? <Badge variant="outline">{item.year}</Badge> : null}
            {item.imdbRating && item.imdbRating !== "N/A" ? (
              <Badge variant="outline">
                <Star className="mr-1 h-3 w-3 fill-current" />
                {item.imdbRating}
              </Badge>
            ) : null}
          </div>
          <h3 className="line-clamp-2 text-lg font-semibold text-white">{item.title}</h3>
          <p className="mt-1 text-sm text-white/70">Queued for your next session</p>
        </div>
      </div>
    </Card>
  );
};
