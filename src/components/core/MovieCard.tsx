import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Movie } from "@/lib/types";
import { Pencil, Star, Trash2 } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  onRemove: (_id: string) => void;
  onShowDetails: (movie: Movie) => void;
  onEdit: (movie: Movie) => void;
}

export const MovieCard = ({ movie, onRemove, onShowDetails, onEdit }: MovieCardProps) => {
  return (
    <Card className="hover-lift group cursor-pointer overflow-hidden border-white/10" onClick={() => onShowDetails(movie)}>
      <div className="relative h-[20rem]">
        {movie.poster_path ? (
          <Image
            src={movie.poster_path}
            alt={`${movie.title} poster`}
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
          <Badge className="bg-sky-500/15 text-sky-300 border-sky-400/20">movie</Badge>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(movie);
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
                onRemove(movie._id);
              }}
              className="h-9 w-9 rounded-full"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline">{movie.year}</Badge>
            {movie.imdbRating && movie.imdbRating !== "N/A" ? (
              <Badge variant="outline">
                <Star className="mr-1 h-3 w-3 fill-current" />
                {movie.imdbRating}
              </Badge>
            ) : null}
            {movie.myRating ? <Badge>My {movie.myRating}/10</Badge> : null}
          </div>
          <h3 className="line-clamp-2 text-lg font-semibold text-white">{movie.title}</h3>
          {movie.genre ? <p className="mt-1 line-clamp-1 text-sm text-white/70">{movie.genre}</p> : null}
        </div>
      </div>
    </Card>
  );
};
