// src/components/modals/DetailsDialog.tsx

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DetailedContent, Movie, TVShow } from "@/lib/types"; 
import { Badge } from "@/components/ui/badge";
import { Star, Heart, FileText, User } from "lucide-react"; 
import Image from "next/image";

// Extended Content Type from useCinePath
type DetailedTVContent = (DetailedContent & Partial<Movie> & Partial<TVShow> & {
    seriesStructure?: any;
    favoriteEpisodeIds?: string[];
});

interface DetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: DetailedTVContent | null;
}

const mapFavoriteEpisodes = (content: DetailedTVContent) => {
    if (!content.seriesStructure || !content.favoriteEpisodeIds || content.favoriteEpisodeIds.length === 0) {
        return [];
    }

    const favoriteEpisodes: string[] = [];
    const favoriteIds = new Set(content.favoriteEpisodeIds);
    
    // Flatten all episodes and check if their ID is in favoriteIds
    content.seriesStructure.seasons.forEach((season: { seasonNumber: number; episodes: { id: string; episodeNumber: number }[] }) => {
        season.episodes.forEach((episode: { id: string; episodeNumber: number }) => {
            if (favoriteIds.has(episode.id)) {
                // Format: S02E05
                const seasonNum = String(season.seasonNumber).padStart(2, '0');
                const episodeNum = String(episode.episodeNumber).padStart(2, '0');
                favoriteEpisodes.push(`S${seasonNum}E${episodeNum}`);
            }
        });
    });

    return favoriteEpisodes;
};


export const DetailsDialog = ({ open, onOpenChange, content }: DetailsDialogProps) => {
  if (!content) return null;

  const isTVShow = content.type === 'tv';
  const favoriteEpisodes = isTVShow ? mapFavoriteEpisodes(content) : [];
  
  // Use the release year if available, otherwise fall back to addedAt year
  const releaseYear = content.year && content.year > 0 
    ? content.year 
    : (content as TVShow).addedAt 
      ? new Date((content as TVShow).addedAt).getFullYear() 
      : 'N/A';
  
  // NEW: Get category, defaulting to "Regular Series" if TV show and missing
  const category = isTVShow 
    ? (content as TVShow).userCategory || 'Regular Series' 
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Increased dialog width slightly for desktop readability */}
      <DialogContent className="glass-card border-border/50 text-foreground max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            {content.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-shrink-0 w-full sm:w-auto">
            {content.poster_path ? (
              <div className="relative overflow-hidden rounded-2xl mx-auto w-3/5 max-w-[200px] lg:w-[320px]">
                <Image
                  src={content.poster_path}
                  alt={`${content.title} poster`}
                  width={320}
                  height={480}
                  className="object-cover w-full h-auto"
                />
              </div>
            ) : (
              <div className="flex w-3/5 max-w-[200px] lg:w-[320px] h-[300px] mx-auto items-center justify-center rounded-2xl bg-muted/20 text-center text-sm text-muted-foreground">
                No Poster Available
              </div>
            )}
          </div>

          <div className="flex-1 space-y-6">
            
            {/* Row 1: Core Details */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {/* Release Year */}
              <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1">
                Released: {releaseYear}
              </Badge>
              {/* Type */}
              <Badge
                className={`px-3 py-1 ${
                  content.type === 'movie'
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                }`}
              >
                {content.type === 'movie' ? 'Movie' : 'TV Show'}
              </Badge>
              
              {/* NEW: TV Show Category Badge */}
              {isTVShow && category && category !== 'Regular Series' && (
                 <Badge 
                    className={`px-3 py-1 ${
                      category === 'Hindi Tv shows' 
                        ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                        : category === 'Miniseries'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' 
                            : 'bg-primary/20 text-primary border-primary/30' 
                    }`}
                 >
                   {category}
                 </Badge>
              )}
              
              {/* IMDb Rating */}
              {content.imdbRating && content.imdbRating !== "N/A" && (
                <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full px-3 py-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium">IMDb: {content.imdbRating}</span>
                </div>
              )}
            </div>
            
            {/* --- PERSONAL TRACKING DETAILS (Compact Redesign) --- */}
            
            {(content.myRating || (isTVShow && content.isFavorite)) && (
                <div className="space-y-4 pt-2 border-t border-border/50">
                    <h3 className="text-xl font-semibold text-primary">Your Tracking</h3>
                    
                    {/* Grid for compact My Rating / Favorite Status */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {/* My Rating Card (Compact) */}
                        {content.myRating && (
                            <div className="rounded-xl p-3 sm:p-4 shadow-md bg-card border border-border/50 hover:bg-muted/10 transition-colors">
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-green-400 text-green-400" />
                                    My Rating
                                </p>
                                <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">
                                    {content.myRating}<span className="text-sm font-normal text-muted-foreground">/10</span>
                                </p>
                            </div>
                        )}
                        
                        {/* Favorite Series Card (Compact) */}
                        {isTVShow && content.isFavorite && (
                            <div className="rounded-xl p-3 sm:p-4 shadow-md bg-card border border-red-500/30 hover:bg-red-500/10 transition-colors">
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <Heart className="w-4 h-4 fill-red-500" />
                                    Favorite Status
                                </p>
                                <p className="text-xl sm:text-xl font-bold text-foreground mt-1">
                                    Marked
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Personal Notes */}
            {content.personalNotes && (
              <div className="pt-2">
                <h4 className="text-lg font-semibold mb-2 text-primary flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Personal Notes
                </h4>
                <p className="text-muted-foreground leading-relaxed text-base italic glass-card rounded-xl p-3 border border-border/50">
                  {content.personalNotes}
                </p>
              </div>
            )}
            
            {/* Favorite Episodes (TV Show Section) */}
            {isTVShow && favoriteEpisodes.length > 0 && (
                <div className="pt-2">
                    <h3 className="text-lg font-semibold mb-3 text-red-400 flex items-center gap-2">
                         <Heart className="w-5 h-5 fill-red-400" />
                        Favorite Episodes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {favoriteEpisodes.map(ep => (
                            <Badge key={ep} className="bg-red-500/10 text-red-400 border-red-500/30 px-3 py-1 text-sm font-medium">
                                {ep}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}


            {/* Genres */}
            {content.genre && content.genre !== "N/A" && (
              <div className="pt-2">
                <h3 className="text-lg font-semibold mb-3 text-primary">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {content.genre.split(', ').map((genre, index) => (
                    <Badge key={index} className="glass-card bg-muted/20 text-foreground border-muted/30 hover:bg-muted/30 transition-colors">
                      {genre.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Cast */}
            {content.actors && content.actors !== "N/A" && (
              <div className="pt-2">
                <h3 className="text-lg font-semibold mb-3 text-primary flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Cast
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {content.actors}
                </p>
              </div>
            )}

            {/* Director (Only for Movies) */}
            {content.type === 'movie' && content.director && content.director !== "N/A" && (
              <div className="pt-2">
                <h3 className="text-lg font-semibold mb-3 text-primary">Director</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {content.director}
                </p>
              </div>
            )}
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};