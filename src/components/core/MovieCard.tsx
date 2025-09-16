import { Movie } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface MovieCardProps {
  movie: Movie;
  onRemove: (_id: string) => void;
  onShowDetails: (movie: Movie) => void;
}

export const MovieCard = ({ movie, onRemove, onShowDetails }: MovieCardProps) => {
  const posterUrl = movie.poster_path;

  return (
    <Card className="glass-card hover-lift rounded-2xl p-6 group cursor-pointer border-border/50">
      <div className="flex items-center gap-6">
        <div 
          className="flex-shrink-0"
          onClick={() => onShowDetails(movie)}
        >
          {posterUrl ? (
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src={posterUrl}
                alt={`${movie.title} poster`}
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
        
        <div 
          className="flex-1 min-w-0"
          onClick={() => onShowDetails(movie)}
        >
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300 truncate">
            {movie.title}
          </h3>
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="outline" className="text-xs">
              {movie.year}
            </Badge>
            {movie.imdbRating && movie.imdbRating !== "N/A" && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm font-medium">{movie.imdbRating}</span>
              </div>
            )}
          </div>
          {movie.genre && (
            <p className="text-sm text-muted-foreground truncate">
              {movie.genre}
            </p>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(movie._id);
          }}
          className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors duration-300 rounded-lg"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};