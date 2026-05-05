"use client";

import Image from "next/image";
import { FileText, Heart, Star, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DetailedContent, Movie, TVShow } from "@/lib/types";

type DetailedTVContent = DetailedContent &
  Partial<Movie> &
  Partial<TVShow> & {
    seriesStructure?: any;
    favoriteEpisodeIds?: string[];
  };

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

  content.seriesStructure.seasons.forEach((season: { seasonNumber: number; episodes: { id: string; episodeNumber: number }[] }) => {
    season.episodes.forEach((episode: { id: string; episodeNumber: number }) => {
      if (favoriteIds.has(episode.id)) {
        const seasonNum = String(season.seasonNumber).padStart(2, "0");
        const episodeNum = String(episode.episodeNumber).padStart(2, "0");
        favoriteEpisodes.push(`S${seasonNum}E${episodeNum}`);
      }
    });
  });

  return favoriteEpisodes;
};

export const DetailsDialog = ({ open, onOpenChange, content }: DetailsDialogProps) => {
  if (!content) return null;

  const isTVShow = content.type === "tv";
  const favoriteEpisodes = isTVShow ? mapFavoriteEpisodes(content) : [];
  const releaseYear =
    content.year && content.year > 0
      ? content.year
      : (content as TVShow).addedAt
        ? new Date((content as TVShow).addedAt).getFullYear()
        : "N/A";
  const category = isTVShow ? (content as TVShow).userCategory || "Regular Series" : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl overflow-hidden rounded-[1.75rem] p-0">
        <div className="px-6 pb-6 pt-6 sm:px-8">
          <DialogHeader>
            <DialogTitle className="font-display text-5xl text-primary sm:text-6xl">{content.title}</DialogTitle>
            <DialogDescription className="sr-only">
              Detailed library information for {content.title}, including synopsis, genres, ratings, and personal notes.
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
                <Badge variant="outline">{releaseYear}</Badge>
                <Badge className={content.type === "movie" ? "bg-sky-500/15 text-sky-300 border-sky-400/20" : "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/20"}>
                  {content.type === "movie" ? "movie" : "tv show"}
                </Badge>
                {category && category !== "Regular Series" ? <Badge>{category}</Badge> : null}
                {content.imdbRating && content.imdbRating !== "N/A" ? (
                  <Badge className="bg-amber-500/15 text-amber-100 border-amber-400/20">
                    <Star className="mr-1 h-3.5 w-3.5 fill-current" />
                    IMDb {content.imdbRating}
                  </Badge>
                ) : null}
              </div>

              {(content.myRating || (isTVShow && content.isFavorite)) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {content.myRating ? (
                    <div className="glass-card rounded-[1.5rem] p-5">
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Your rating</p>
                      <p className="mt-3 font-display text-5xl text-primary">{content.myRating}/10</p>
                    </div>
                  ) : null}
                  {isTVShow && content.isFavorite ? (
                    <div className="glass-card rounded-[1.5rem] p-5">
                      <p className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-red-200">
                        <Heart className="h-4 w-4 fill-current" />
                        favorite status
                      </p>
                      <p className="mt-3 text-lg font-semibold text-white">Marked as a favorite series</p>
                    </div>
                  ) : null}
                </div>
              )}

              {content.plot && content.plot !== "N/A" ? (
                <div className="glass-card rounded-[1.5rem] p-5">
                  <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
                    <FileText className="h-5 w-5 text-primary" />
                    Synopsis
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground">{content.plot}</p>
                </div>
              ) : null}

              {content.personalNotes ? (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-white">Personal Notes</h3>
                  <div className="glass-card rounded-[1.5rem] p-5 text-sm leading-7 text-muted-foreground">
                    {content.personalNotes}
                  </div>
                </div>
              ) : null}

              {favoriteEpisodes.length > 0 ? (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-white">Favorite Episodes</h3>
                  <div className="flex flex-wrap gap-2">
                    {favoriteEpisodes.map((episode) => (
                      <Badge key={episode} className="bg-red-500/15 text-red-200 border-red-400/20">
                        {episode}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              {content.genre && content.genre !== "N/A" ? (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-white">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {content.genre.split(", ").map((genre) => (
                      <Badge key={genre} variant="outline">
                        {genre.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              {content.actors && content.actors !== "N/A" ? (
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
                    <User className="h-5 w-5 text-primary" />
                    Cast
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground">{content.actors}</p>
                </div>
              ) : null}

              {content.type === "movie" && content.director && content.director !== "N/A" ? (
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-white">Director</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{content.director}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
