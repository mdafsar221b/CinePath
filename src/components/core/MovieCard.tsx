// src/components/core/MovieCard.tsx
import { Movie } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Image from "next/image";

interface MovieCardProps {
  movie: Movie;
  onRemove: (_id: string) => void;
  onShowDetails: (movie: Movie) => void;
}

export const MovieCard = ({ movie, onRemove, onShowDetails }: MovieCardProps) => {
  const posterUrl = movie.poster_path;

  return (
    <Card className="relative bg-card border border-border rounded-lg p-4 transition-transform duration-300 hover:scale-[1.02] flex items-center justify-between">
      <div 
        className="flex items-center gap-4 flex-1 cursor-pointer" 
        onClick={() => onShowDetails(movie)}
      >
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`${movie.title} poster`}
            width={75}
            height={112}
            className="rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-[112px] w-[75px] items-center justify-center rounded-lg bg-muted-foreground/20 text-center text-[10px] text-muted-foreground">
            Poster Not Available
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-light">{movie.title}</h3>
          <p className="text-sm text-muted-foreground">{movie.year}</p>
          {movie.genre && (
            <p className="text-xs text-muted-foreground mt-1">{movie.genre}</p>
          )}
        </div>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onRemove(movie._id);
        }} 
        className="text-muted-foreground hover:text-foreground/80 transition-colors duration-200 ml-4"
      >
        <XCircle size={18} />
      </button>
    </Card>
  );
};