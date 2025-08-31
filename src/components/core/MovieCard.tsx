import { Movie } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { XCircle } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  onRemove: (id: string) => void;
}

export const MovieCard = ({ movie, onRemove }: MovieCardProps) => {
  return (
    <Card className="relative bg-card border border-border rounded-lg p-4 transition-transform duration-300 hover:scale-[1.02] flex items-center justify-between">
      <div className="flex-1">
        <h3 className="text-lg font-light">{movie.title}</h3>
        <p className="text-sm text-muted-foreground">{movie.year}</p>
      </div>
      <button onClick={() => onRemove(movie.id)} className="text-muted-foreground hover:text-foreground/80 transition-colors duration-200 ml-4">
        <XCircle size={18} />
      </button>
    </Card>
  );
};