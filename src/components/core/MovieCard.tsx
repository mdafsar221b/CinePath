import { Movie } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface MovieCardProps {
  movie: Movie;
  onRemove: (_id: string) => void;
  onShowDetails: (movie: Movie) => void;
  onEdit: (movie: Movie) => void;
}

export const MovieCard = ({ movie, onRemove, onShowDetails, onEdit }: MovieCardProps) => {
  const posterUrl = movie.poster_path;

  return (
    <Card 
      className="hover-lift rounded-2xl group border-border/50 relative overflow-hidden bg-secondary/30 cursor-pointer"
      onClick={() => onShowDetails(movie)}
    >
      {/* Reduced height for 4-column layout: h-32 is roughly 1:1.5 poster ratio */}
      <div className="relative w-full h-32 sm:h-[250px] overflow-hidden rounded-t-2xl">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`${movie.title} poster`}
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
                    onEdit(movie);
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
                    onRemove(movie._id);
                }}
                className="rounded-full bg-background/50 backdrop-blur-sm h-6 w-6 sm:h-10 sm:w-10"
            >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
        </div>
      </div>
      
      {/* Details: Smaller typography (text-sm) and padding (p-2) */}
      <div className="p-2 sm:p-4 flex flex-col items-center text-center">
        <h3 className="text-sm sm:text-lg font-semibold mb-0 truncate w-full">{movie.title}</h3>
        <p className="text-xs text-muted-foreground mb-1 sm:mb-3">{movie.year}</p>
        <div className="flex items-center gap-1">
            {movie.imdbRating && movie.imdbRating !== "N/A" && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                    ⭐ {movie.imdbRating}
                </Badge>
            )}
            {movie.myRating && (
                <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30 px-1 py-0">
                    My: {movie.myRating}
                </Badge>
            )}
        </div>
      </div>
    </Card>
  );
};