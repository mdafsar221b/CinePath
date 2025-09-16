import { TVShow } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <Card className="glass-card hover-lift rounded-2xl p-6 group cursor-pointer border-border/50">
      <div className="flex items-center gap-6">
        <div 
          className="flex-shrink-0"
          onClick={() => onShowDetails(show)}
        >
          {posterUrl ? (
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src={posterUrl}
                alt={`${show.title} poster`}
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
          onClick={() => onShowDetails(show)}
        >
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300 truncate">
            {show.title}
          </h3>
          
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Seasons:</span>
              {seasonBadges.map((badge, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                  {badge}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">
                {totalEpisodes} Episodes
              </Badge>
              {show.imdbRating && show.imdbRating !== "N/A" && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-sm font-medium">{show.imdbRating}</span>
                </div>
              )}
            </div>
          </div>
          
          {show.genre && (
            <p className="text-sm text-muted-foreground truncate">
              {show.genre}
            </p>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(show._id);
          }}
          className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors duration-300 rounded-lg"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};