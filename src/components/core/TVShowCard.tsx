import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TVShow } from "@/lib/types";
import { Heart, Pencil, Star, Trash2 } from "lucide-react";

interface TVShowCardProps {
  show: TVShow;
  onRemove: (_id: string) => void;
  onShowDetails: (show: TVShow) => void;
  onEdit: (show: TVShow) => void;
}

export const TVShowCard = ({ show, onRemove, onShowDetails, onEdit }: TVShowCardProps) => {
  const totalEpisodesWatched = show.watchedEpisodeIds?.length || 0;
  const totalEpisodes = show.totalEpisodes || 0;
  const progressText =
    totalEpisodes > 0 ? `${totalEpisodesWatched}/${totalEpisodes} episodes watched` : `${totalEpisodesWatched} episodes tracked`;

  return (
    <Card className="hover-lift group cursor-pointer overflow-hidden border-white/10" onClick={() => onShowDetails(show)}>
      <div className="relative h-[20rem]">
        {show.poster_path ? (
          <Image
            src={show.poster_path}
            alt={`${show.title} poster`}
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
          <Badge className="bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/20">tv show</Badge>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(show);
              }}
              className="h-9 w-9 rounded-full"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={(event) => {
                event.stopPropagation();
                onRemove(show._id);
              }}
              className="h-9 w-9 rounded-full"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline">{progressText}</Badge>
            {show.imdbRating && show.imdbRating !== "N/A" ? (
              <Badge variant="outline">
                <Star className="mr-1 h-3 w-3 fill-current" />
                {show.imdbRating}
              </Badge>
            ) : null}
            {show.isFavorite ? (
              <Badge className="bg-red-500/15 text-red-200 border-red-400/20">
                <Heart className="mr-1 h-3 w-3 fill-current" />
                favorite
              </Badge>
            ) : null}
          </div>
          <h3 className="line-clamp-2 text-lg font-semibold text-white">{show.title}</h3>
          {show.genre ? <p className="mt-1 line-clamp-1 text-sm text-white/70">{show.genre}</p> : null}
        </div>
      </div>
    </Card>
  );
};
