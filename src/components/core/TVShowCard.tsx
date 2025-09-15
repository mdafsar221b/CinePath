// src/components/core/TVShowCard.tsx
import { TVShow } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Image from "next/image";

interface TVShowCardProps {
  show: TVShow;
  onRemove: (_id: string) => void;
  onShowDetails: (show: TVShow) => void;
}

export const TVShowCard = ({ show, onRemove, onShowDetails }: TVShowCardProps) => {
  const totalEpisodes = show.seasonsWatched.reduce((sum, season) => sum + season.episodes, 0);
  const seasonBadges = show.seasonsWatched
    .sort((a, b) => a.season - b.season)
    .map(season => `S${season.season.toString().padStart(2, '0')}`);

  const posterUrl = show.poster_path;

  return (
    <Card className="relative bg-card border border-border rounded-lg p-4 transition-transform duration-300 hover:scale-[1.02] flex items-center justify-between">
      <div 
        className="flex items-center gap-4 flex-1 cursor-pointer" 
        onClick={() => onShowDetails(show)}
      >
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`${show.title} poster`}
            width={75}
            height={112}
            className="rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-[112px] w-[75px] items-center justify-center rounded-lg bg-muted-foreground/20 text-center text-[10px] text-muted-foreground">
            Poster Not Available
          </div>
        )}
        <div>
          <h3 className="text-lg font-light">{show.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-semibold text-foreground">Seasons Watched:</span> {seasonBadges.join(', ')}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-semibold text-foreground">Total Episodes:</span> EP-{totalEpisodes}
          </p>
          {show.genre && (
            <p className="text-xs text-muted-foreground mt-1">{show.genre}</p>
          )}
        </div>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onRemove(show._id);
        }} 
        className="text-muted-foreground hover:text-foreground/80 transition-colors duration-200 ml-4"
      >
        <XCircle size={18} />
      </button>
    </Card>
  );
};