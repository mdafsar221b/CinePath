"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DetailedContent, Movie, TVShow } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Star, Heart } from "lucide-react";
import Image from "next/image";

interface DetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: (DetailedContent & Partial<Movie> & Partial<TVShow>) | null;
}

export const DetailsDialog = ({ open, onOpenChange, content }: DetailsDialogProps) => {
  if (!content) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/50 text-foreground max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            {content.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-shrink-0">
            {content.poster_path ? (
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src={content.poster_path}
                  alt={`${content.title} poster`}
                  width={320}
                  height={480}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-[480px] w-[320px] items-center justify-center rounded-2xl bg-muted/20 text-center text-sm text-muted-foreground">
                No Poster Available
              </div>
            )}
          </div>

          <div className="flex-1 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1">
                {content.year}
              </Badge>
              <Badge
                className={`px-3 py-1 ${
                  content.type === 'movie'
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                }`}
              >
                {content.type === 'movie' ? 'Movie' : 'TV Show'}
              </Badge>
              {content.imdbRating !== "N/A" && (
                <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full px-3 py-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium">{content.imdbRating}</span>
                </div>
              )}
              {content.myRating && (
                <div className="flex items-center gap-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full px-3 py-1">
                  <span className="font-medium">My Rating: {content.myRating}/10</span>
                </div>
              )}
              {content.isFavorite && (
                <div className="flex items-center gap-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-3 py-1">
                  <Heart className="w-4 h-4 fill-current" />
                  <span className="font-medium">Favorite</span>
                </div>
              )}
            </div>

            {content.genre && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {content.genre.split(', ').map((genre, index) => (
                    <Badge key={index} className="glass-card bg-muted/20 text-foreground border-muted/30 hover:bg-muted/30 transition-colors">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {content.plot && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary">Plot</h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {content.plot}
                </p>
              </div>
            )}

            {content.actors && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary">Cast</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {content.actors}
                </p>
              </div>
            )}

            {content.director && content.director !== "N/A" && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary">Director</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {content.director}
                </p>
              </div>
            )}

            {content.personalNotes && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary">My Notes</h3>
                <p className="text-muted-foreground leading-relaxed text-base italic">
                  {content.personalNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};