// src/components/modals/TmdbDetailsDialog.tsx

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TmdbDetailedContent } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Star, Film, MonitorPlay, Calendar, FileText } from "lucide-react"; 
import Image from "next/image";
import { cn } from "@/lib/utils"; // FIX: Import cn

interface TmdbDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: TmdbDetailedContent | null;
}

const genreMap: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction', 10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western', 10765: 'Sci-Fi & Fantasy', 10768: 'War & Politics'
};
const mapGenreIds = (ids: number[]) => {
    return ids.map(id => genreMap[id] || 'Unknown').join(', ');
};


export const TmdbDetailsDialog = ({ open, onOpenChange, content }: TmdbDetailsDialogProps) => {
  if (!content) return null;

  const isTVShow = content.type === 'tv';
  const ratingColor = content.voteAverage >= 7 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  const displayRating = content.voteAverage > 0 ? content.voteAverage.toFixed(1) : 'N/A';
  const genres = mapGenreIds(content.genreIds);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              
              <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {content.year}
              </Badge>
              
              <Badge
                className={`px-3 py-1 ${
                  isTVShow
                    ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                }`}
              >
                {isTVShow ? 'TV Show (TMDb)' : 'Movie (TMDb)'}
              </Badge>
              
              <div className={cn("flex items-center gap-2 rounded-full px-3 py-1", ratingColor)}>
                <Star className="w-4 h-4 fill-current" />
                <span className="font-medium">TMDb: {displayRating}</span>
              </div>
            </div>
            
            {/* Overview / Plot */}
            {content.overview && content.overview !== "No overview available from TMDb." && (
              <div className="pt-2">
                <h4 className="text-lg font-semibold mb-2 text-primary flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Overview
                </h4>
                <p className="text-muted-foreground leading-relaxed text-base italic glass-card rounded-xl p-3 border border-border/50">
                  {content.overview}
                </p>
              </div>
            )}


            {/* Genres */}
            {genres && (
              <div className="pt-2">
                <h3 className="text-lg font-semibold mb-3 text-primary">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {genres.split(', ').map((genre, index) => (
                    <Badge key={index} className="glass-card bg-muted/20 text-foreground border-muted/30 hover:bg-muted/30 transition-colors">
                      {genre.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 text-xs text-muted-foreground border-t border-border/50">
                 Note: Full cast/crew and personal tracking features are only available for content added to your library.
            </div>
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};