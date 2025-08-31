import { TVShow } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TVShowCardProps {
  show: TVShow;
  onRemove: (id: string) => void;
}

export const TVShowCard = ({ show, onRemove }: TVShowCardProps) => {
  const totalEpisodes = show.seasonsWatched.reduce((sum, season) => sum + season.episodes, 0);
  const seasonBadges = show.seasonsWatched
    .sort((a, b) => a.season - b.season)
    .map(season => `S${season.season.toString().padStart(2, '0')}`);

  return (
    <Card className="relative bg-card border border-border rounded-lg p-4 transition-transform duration-300 hover:scale-[1.02] flex items-center justify-between">
      <div className="flex-1">
        <h3 className="text-lg font-light">{show.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          <span className="font-semibold text-foreground">Seasons Watched:</span> {seasonBadges.join(', ')}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          <span className="font-semibold text-foreground">Total Episodes:</span> EP-{totalEpisodes}
        </p>
      </div>
      <button onClick={() => onRemove(show.id)} className="text-muted-foreground hover:text-foreground/80 transition-colors duration-200 ml-4">
        <XCircle size={18} />
      </button>
    </Card>
  );
};