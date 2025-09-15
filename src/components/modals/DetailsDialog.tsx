
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DetailedContent } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Image from "next/image";

interface DetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: DetailedContent | null;
}

export const DetailsDialog = ({ open, onOpenChange, content }: DetailsDialogProps) => {
  if (!content) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border border-border text-foreground max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light">{content.title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            {content.poster_path ? (
              <Image
                src={content.poster_path}
                alt={`${content.title} poster`}
                width={300}
                height={450}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-[450px] w-[300px] items-center justify-center rounded-lg bg-muted-foreground/20 text-center text-sm text-muted-foreground">
                Poster Not Available
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline">{content.year}</Badge>
              <Badge variant="outline">{content.rating}</Badge>
              <Badge variant="outline">{content.type === 'movie' ? 'Movie' : 'TV Show'}</Badge>
              {content.imdbRating !== "N/A" && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{content.imdbRating}</span>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Genre</h3>
              <div className="flex flex-wrap gap-2">
                {content.genre.split(', ').map((genre, index) => (
                  <Badge key={index} className="bg-primary/10 text-primary border-primary/20">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Plot</h3>
              <p className="text-muted-foreground leading-relaxed">{content.plot}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Cast</h3>
              <p className="text-muted-foreground">{content.actors}</p>
            </div>
            
            {content.director && content.director !== "N/A" && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Director</h3>
                <p className="text-muted-foreground">{content.director}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};