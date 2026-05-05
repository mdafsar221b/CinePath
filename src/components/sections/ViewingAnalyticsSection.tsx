"use client";

import Image from "next/image";
import { BarChart3, Clapperboard, Film, Heart, Star, Tv2, Users2 } from "lucide-react";
import { Movie, TVShow, WatchlistItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { buildViewingAnalytics } from "@/lib/viewing-analytics";

interface ViewingAnalyticsSectionProps {
  movies: Movie[];
  tvShows: TVShow[];
  watchlist: WatchlistItem[];
}

const MeterRow = ({
  label,
  value,
  max,
  suffix = "",
}: {
  label: string;
  value: number;
  max: number;
  suffix?: string;
}) => {
  const width = max > 0 ? Math.max(10, Math.round((value / max) * 100)) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium text-white">{label}</p>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {value}
          {suffix}
        </p>
      </div>
      <div className="h-2 rounded-full bg-white/8">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary via-amber-300 to-accent"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

export const ViewingAnalyticsSection = ({
  movies,
  tvShows,
  watchlist,
}: ViewingAnalyticsSectionProps) => {
  const analytics = buildViewingAnalytics({ movies, tvShows, watchlist });
  const maxYearCount = Math.max(...analytics.years.map((item) => item.value), 0);
  const maxGenreCount = Math.max(...analytics.genres.map((item) => item.value), 0);

  return (
    <section className="mb-12 space-y-6">
      <div className="section-shell">
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">Deep analysis</p>
            <h2 className="font-display text-5xl text-primary sm:text-6xl">Your Viewing Intelligence</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              This layer reads the library like a real watch audit. It surfaces output by year, genre gravity,
              strongest preferences, and the series that are actually consuming your time.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>
              <BarChart3 className="mr-1 h-3.5 w-3.5" />
              richer than simple counts
            </Badge>
            <Badge variant="outline">{analytics.insights.totalTrackedEntries} tracked entries</Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="section-shell border-white/10">
          <div className="relative z-10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Yearly movie output</p>
                <h3 className="font-display text-4xl text-primary">Movies By Release Year</h3>
              </div>
              <Film className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-4">
              {analytics.years.length > 0 ? (
                analytics.years.slice(0, 8).map((item) => (
                  <MeterRow key={item.label} label={item.label} value={item.value} max={maxYearCount} />
                ))
              ) : (
                <div className="glass-card rounded-[1.3rem] p-5 text-sm text-muted-foreground">
                  Add movies to unlock yearly output analysis.
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="section-shell border-white/10">
          <div className="relative z-10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Genre pressure</p>
                <h3 className="font-display text-4xl text-primary">What You Watch Most</h3>
              </div>
              <Clapperboard className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-4">
              {analytics.genres.length > 0 ? (
                analytics.genres.slice(0, 8).map((item) => (
                  <MeterRow key={item.label} label={item.label} value={item.value} max={maxGenreCount} />
                ))
              ) : (
                <div className="glass-card rounded-[1.3rem] p-5 text-sm text-muted-foreground">
                  Genre data is missing on your entries, so there is nothing meaningful to rank yet.
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="section-shell border-white/10">
          <div className="relative z-10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Taste profile</p>
                <h3 className="font-display text-4xl text-primary">What You Like Most</h3>
              </div>
              <Heart className="h-5 w-5 text-primary" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="glass-card rounded-[1.35rem] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Preferred format</p>
                <p className="mt-2 text-2xl font-semibold text-white">{analytics.insights.preferredFormat}</p>
              </div>
              <div className="glass-card rounded-[1.35rem] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Top genre</p>
                <p className="mt-2 text-2xl font-semibold text-white">{analytics.insights.topGenre}</p>
              </div>
              <div className="glass-card rounded-[1.35rem] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Average movie rating</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {analytics.insights.averageMovieRating > 0 ? `${analytics.insights.averageMovieRating}/10` : "N/A"}
                </p>
              </div>
              <div className="glass-card rounded-[1.35rem] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Average show rating</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {analytics.insights.averageShowRating > 0 ? `${analytics.insights.averageShowRating}/10` : "N/A"}
                </p>
              </div>
              <div className="glass-card rounded-[1.35rem] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Most recurring actor</p>
                <p className="mt-2 text-lg font-semibold text-white">{analytics.insights.topActor}</p>
              </div>
              <div className="glass-card rounded-[1.35rem] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Most recurring director</p>
                <p className="mt-2 text-lg font-semibold text-white">{analytics.insights.topDirector}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="section-shell border-white/10">
          <div className="relative z-10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Behavior signals</p>
                <h3 className="font-display text-4xl text-primary">How The Library Behaves</h3>
              </div>
              <Tv2 className="h-5 w-5 text-primary" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="glass-card rounded-[1.35rem] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Rated entries</p>
                <p className="mt-2 font-display text-4xl text-primary">{analytics.insights.ratedEntries}</p>
              </div>
              <div className="glass-card rounded-[1.35rem] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Favorite shows</p>
                <p className="mt-2 font-display text-4xl text-primary">{analytics.insights.favoriteShowsCount}</p>
              </div>
              <div className="glass-card rounded-[1.35rem] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">70%+ completed series</p>
                <p className="mt-2 font-display text-4xl text-primary">{analytics.insights.completionHeavyShows}</p>
              </div>
              <div className="glass-card rounded-[1.35rem] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Watchlist pressure</p>
                <p className="mt-2 font-display text-4xl text-primary">{watchlist.length}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="section-shell border-white/10">
          <div className="relative z-10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Personal favorites</p>
                <h3 className="font-display text-4xl text-primary">Highest Rated Titles</h3>
              </div>
              <Star className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-3">
              {analytics.topRatedTitles.length > 0 ? (
                analytics.topRatedTitles.map((item) => (
                  <div key={item.id} className="glass-card flex items-center gap-4 rounded-[1.35rem] p-3">
                    <div className="relative h-20 w-14 overflow-hidden rounded-[0.9rem] border border-white/10 bg-white/5">
                      {item.poster_path ? (
                        <Image src={item.poster_path} alt={`${item.title} poster`} fill sizes="56px" className="object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={item.type === "movie" ? "bg-sky-500/15 text-sky-300 border-sky-400/20" : "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/20"}>
                          {item.type === "movie" ? "movie" : "tv"}
                        </Badge>
                      </div>
                      <p className="mt-2 truncate text-lg font-semibold text-white">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.metric}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-card rounded-[1.35rem] p-5 text-sm text-muted-foreground">
                  Add personal ratings and this panel will identify what you actually love most.
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="section-shell border-white/10">
          <div className="relative z-10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Time sink</p>
                <h3 className="font-display text-4xl text-primary">Most Watched Series</h3>
              </div>
              <Users2 className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-3">
              {analytics.mostWatchedSeries.length > 0 ? (
                analytics.mostWatchedSeries.map((item) => (
                  <div key={item.id} className="glass-card flex items-center gap-4 rounded-[1.35rem] p-3">
                    <div className="relative h-20 w-14 overflow-hidden rounded-[0.9rem] border border-white/10 bg-white/5">
                      {item.poster_path ? (
                        <Image src={item.poster_path} alt={`${item.title} poster`} fill sizes="56px" className="object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-lg font-semibold text-white">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.metric}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-card rounded-[1.35rem] p-5 text-sm text-muted-foreground">
                  Track TV progress and this panel will expose the shows that are taking the most viewing time.
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
