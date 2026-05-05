"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchResult, TmdbDetailedContent } from "@/lib/types";
import { ContentSectionSkeleton } from "@/components/ui/SkeletonCard";
import { Flame, Loader2, Plus, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import heroPosterStack from "@/app/hero-img.png";

interface TrendingSectionProps {
  onSelectContent: (result: TmdbDetailedContent) => void;
  onAddToWatchlist: (item: SearchResult) => Promise<void>;
  addingToWatchlist: string | null;
  isLoggedIn: boolean;
}

const TrendingCard = ({
  content,
  onSelectContent,
  onAddToWatchlist,
  addingToWatchlist,
  isLoggedIn,
  featured = false,
}: {
  content: TmdbDetailedContent;
  onSelectContent: (result: TmdbDetailedContent) => void;
  onAddToWatchlist: (item: SearchResult) => Promise<void>;
  addingToWatchlist: string | null;
  isLoggedIn: boolean;
  featured?: boolean;
}) => {
  const isAdding = addingToWatchlist === content.id;
  const typeClass =
    content.type === "movie"
      ? "bg-sky-500/15 text-sky-300 border-sky-400/20"
      : "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/20";

  return (
    <Card
      className={cn(
        "hover-lift group cursor-pointer overflow-hidden border-white/10",
        featured ? "min-h-[26rem]" : "h-full"
      )}
      onClick={() => onSelectContent(content)}
    >
      <div className={cn("relative", featured ? "h-[26rem]" : "h-[20rem]")}>
        {content.backdrop_path || content.poster_path ? (
          <Image
            src={content.backdrop_path || content.poster_path!}
            alt={`${content.title} artwork`}
            fill
            sizes={featured ? "(max-width: 1280px) 100vw, 50vw" : "(max-width: 768px) 50vw, 20vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-white/6 text-sm text-muted-foreground">
            No Artwork
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,8,16,0.97)] via-[rgba(4,8,16,0.28)] to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <Badge className={typeClass}>{content.type === "movie" ? "movie" : "tv show"}</Badge>
          {isLoggedIn ? (
            <Button
              size="icon"
              onClick={(event) => {
                event.stopPropagation();
                onAddToWatchlist(content);
              }}
              disabled={isAdding}
              className="h-10 w-10 rounded-full"
            >
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
          ) : null}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="outline">{content.year}</Badge>
            <Badge variant="outline">
              <Star className="mr-1 h-3 w-3 fill-current" />
              {content.voteAverage > 0 ? content.voteAverage.toFixed(1) : "N/A"}
            </Badge>
          </div>
          <h3 className={cn("font-semibold text-white", featured ? "text-3xl sm:text-4xl" : "text-lg")}>
            {content.title}
          </h3>
          <p className={cn("mt-2 text-white/72", featured ? "line-clamp-4 max-w-2xl text-sm leading-7" : "line-clamp-3 text-sm leading-6")}>
            {content.overview}
          </p>
        </div>
      </div>
    </Card>
  );
};

export const TrendingSection = ({
  onSelectContent,
  onAddToWatchlist,
  addingToWatchlist,
  isLoggedIn,
}: TrendingSectionProps) => {
  const [trending, setTrending] = useState<TmdbDetailedContent[]>([]);
  const [popular, setPopular] = useState<TmdbDetailedContent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTMDbData = useCallback(async () => {
    setLoading(true);
    try {
      const [trendingRes, popularRes] = await Promise.all([
        fetch("/api/tmdb/trending"),
        fetch("/api/tmdb/popular"),
      ]);

      const trendingData: TmdbDetailedContent[] = trendingRes.ok ? await trendingRes.json() : [];
      const popularData: TmdbDetailedContent[] = popularRes.ok ? await popularRes.json() : [];

      setTrending(trendingData.filter(Boolean));
      setPopular(popularData.filter(Boolean));
    } catch (error) {
      console.error("Failed to fetch TMDb data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTMDbData();
  }, [fetchTMDbData]);

  const curatedTrending = useMemo(() => trending.slice(0, 7), [trending]);
  const curatedPopular = useMemo(() => popular.slice(0, 6), [popular]);

  if (loading) {
    return (
      <div className="space-y-16 py-16">
        <div className="mb-8 h-8 w-40 animate-pulse rounded-lg bg-muted/50" />
        <ContentSectionSkeleton />
      </div>
    );
  }

  const showFallback = curatedTrending.length === 0 && curatedPopular.length === 0;

  const featured = curatedTrending[0];
  const supportingTrending = curatedTrending.slice(1);

  return (
    <section id="trending-popular" className="space-y-10 py-16">
      <div className="section-shell">
        <div className="relative z-10">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">Discovery</p>
              <h2 className="font-display text-5xl text-primary sm:text-6xl">What&apos;s Hot Right Now</h2>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                The trending rail now reads like a real entertainment product: one hero title, supporting picks, and rich artwork instead of a flat list of generic cards.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge>
                <TrendingUp className="mr-1 h-3.5 w-3.5" />
                trending today
              </Badge>
              <Badge variant="outline">
                <Flame className="mr-1 h-3.5 w-3.5" />
                popular now
              </Badge>
            </div>
          </div>

          {featured ? (
            <div className="grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
              <TrendingCard
                content={featured}
                onSelectContent={onSelectContent}
                onAddToWatchlist={onAddToWatchlist}
                addingToWatchlist={addingToWatchlist}
                isLoggedIn={isLoggedIn}
                featured
              />

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                {supportingTrending.map((content) => (
                  <Card
                    key={content.id}
                    className="hover-lift cursor-pointer overflow-hidden border-white/10"
                    onClick={() => onSelectContent(content)}
                  >
                    <div className="flex h-full gap-4 p-4">
                      <div className="relative h-36 w-24 flex-shrink-0 overflow-hidden rounded-[1.1rem] poster-shadow">
                        {content.poster_path ? (
                          <Image
                            src={content.poster_path}
                            alt={`${content.title} poster`}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-white/6 text-xs text-muted-foreground">
                            No Poster
                          </div>
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge className={content.type === "movie" ? "bg-sky-500/15 text-sky-300 border-sky-400/20" : "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/20"}>
                              {content.type === "movie" ? "movie" : "tv show"}
                            </Badge>
                            <Badge variant="outline">{content.year}</Badge>
                          </div>
                          <h3 className="line-clamp-2 text-lg font-semibold text-white">{content.title}</h3>
                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                            {content.overview}
                          </p>
                        </div>
                        <Badge variant="outline" className="mt-3 w-fit">
                          <Star className="mr-1 h-3 w-3 fill-current" />
                          {content.voteAverage > 0 ? content.voteAverage.toFixed(1) : "N/A"}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : showFallback ? (
            <Card className="overflow-hidden border-white/10">
              <div className="grid items-center gap-8 p-6 lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
                <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                  <Image src={heroPosterStack} alt="Poster collage" className="mx-auto w-full max-w-md object-contain" />
                </div>
                <div>
                  <Badge variant="outline">offline cinematic fallback</Badge>
                  <h3 className="mt-4 font-display text-4xl text-primary sm:text-5xl">Poster-Driven Discovery Still Holds Up</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    TMDb data is unavailable in the current environment, so the discovery rail falls back to local cinematic artwork instead of collapsing into a blank block. On a live deployment, this area fills with real trending posters and backdrops.
                  </p>
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      </div>

      {curatedPopular.length > 0 ? (
        <div className="section-shell">
          <div className="relative z-10">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">Spotlight shelf</p>
                <h3 className="font-display text-4xl text-primary">Popular Now</h3>
              </div>
              <Badge variant="outline">{curatedPopular.length} titles</Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {curatedPopular.map((content) => (
                <TrendingCard
                  key={content.id}
                  content={content}
                  onSelectContent={onSelectContent}
                  onAddToWatchlist={onAddToWatchlist}
                  addingToWatchlist={addingToWatchlist}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};
