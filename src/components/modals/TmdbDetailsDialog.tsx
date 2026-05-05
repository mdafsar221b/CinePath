"use client";

import Image from "next/image";
import { Calendar, FileText, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TmdbDetailedContent } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TmdbDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: TmdbDetailedContent | null;
}

const genreMap: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10765: "Sci-Fi & Fantasy",
  10768: "War & Politics",
};

const mapGenreIds = (ids: number[]) => ids.map((id) => genreMap[id] || "Unknown").filter(Boolean);

export const TmdbDetailsDialog = ({ open, onOpenChange, content }: TmdbDetailsDialogProps) => {
  if (!content) return null;

  const isTVShow = content.type === "tv";
  const displayRating = content.voteAverage > 0 ? content.voteAverage.toFixed(1) : "N/A";
  const genres = mapGenreIds(content.genreIds);
  const ratingColor =
    content.voteAverage >= 7
      ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/20"
      : "bg-amber-500/15 text-amber-100 border-amber-400/20";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl overflow-hidden rounded-[1.75rem] p-0">
        <div className="relative">
          {content.backdrop_path ? (
            <div className="relative h-56 sm:h-72">
              <Image src={content.backdrop_path} alt={`${content.title} backdrop`} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,10,18,0.98)] via-[rgba(6,10,18,0.48)] to-[rgba(6,10,18,0.16)]" />
            </div>
          ) : null}

          <div className="relative px-6 pb-6 pt-6 sm:px-8">
            <DialogHeader>
              <DialogTitle className="font-display text-5xl text-primary sm:text-6xl">{content.title}</DialogTitle>
              <DialogDescription className="sr-only">
                TMDb discovery details for {content.title}, including overview, genres, year, and rating.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
              <div className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-[1.5rem] poster-shadow">
                {content.poster_path ? (
                  <Image src={content.poster_path} alt={`${content.title} poster`} width={560} height={840} className="h-auto w-full object-cover" />
                ) : (
                  <div className="flex h-[24rem] items-center justify-center bg-white/6 text-sm text-muted-foreground">No Poster Available</div>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={isTVShow ? "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/20" : "bg-sky-500/15 text-sky-300 border-sky-400/20"}>
                    {isTVShow ? "tv show" : "movie"}
                  </Badge>
                  <Badge variant="outline">
                    <Calendar className="mr-1 h-3.5 w-3.5" />
                    {content.year}
                  </Badge>
                  <Badge className={cn("border", ratingColor)}>
                    <Star className="mr-1 h-3.5 w-3.5 fill-current" />
                    TMDb {displayRating}
                  </Badge>
                </div>

                <div className="glass-card rounded-[1.5rem] p-5">
                  <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
                    <FileText className="h-5 w-5 text-primary" />
                    Overview
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {content.overview || "No overview available from TMDb."}
                  </p>
                </div>

                {genres.length > 0 ? (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-white">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {genres.map((genre) => (
                        <Badge key={genre} variant="outline">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}

                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Add this title to your library to unlock richer personal tracking, notes, and detailed series progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
