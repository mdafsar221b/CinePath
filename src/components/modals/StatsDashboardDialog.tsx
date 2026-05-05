"use client";

import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  BarChart3,
  Calendar,
  Clapperboard,
  Film,
  ListVideo,
  MonitorPlay,
  Star,
  Tv2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Movie, TVShow, WatchlistItem } from "@/lib/types";
import { buildViewingAnalytics } from "@/lib/viewing-analytics";

interface StatsDashboardDialogProps {
  movies: Movie[];
  tvShows: TVShow[];
  watchlist: WatchlistItem[];
  totalEpisodesWatched: number;
  totalTVShowsTracked: number;
  totalSeasonsTracked: number;
}

const CompactRow = ({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) => {
  const width = max > 0 ? Math.max(8, Math.round((value / max) * 100)) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm text-white">{label}</p>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{value}</p>
      </div>
      <div className="h-2 rounded-full bg-white/8">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
};

export const StatsDashboardDialog = ({
  movies,
  tvShows,
  watchlist,
  totalEpisodesWatched,
  totalTVShowsTracked,
  totalSeasonsTracked,
}: StatsDashboardDialogProps) => {
  const { data: session } = useSession();
  const rawName = session?.user?.name || session?.user?.email || "Viewer";
  const firstName = rawName.split(" ")[0].split("@")[0];

  const analytics = buildViewingAnalytics({ movies, tvShows, watchlist });
  const maxYearCount = Math.max(...analytics.years.map((item) => item.value), 0);
  const maxGenreCount = Math.max(...analytics.genres.map((item) => item.value), 0);

  const statCards = [
    { title: "Movies Watched", value: movies.length, icon: Film },
    { title: "TV Shows Tracked", value: totalTVShowsTracked, icon: MonitorPlay },
    { title: "Seasons Tracked", value: totalSeasonsTracked, icon: Tv2 },
    { title: "Episodes Watched", value: totalEpisodesWatched, icon: ListVideo },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="glass-card hover:bg-muted/20 transition-all duration-300 rounded-xl"
          aria-label="View Dashboard Statistics"
        >
          <BarChart3 className="w-5 h-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="glass-card border-border/50 text-foreground max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-primary whitespace-normal">
            {firstName}&apos;s Viewing Dashboard
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            A richer breakdown of your watch habits, library shape, and what actually dominates your screen time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-2">
          <div className="grid gap-4 md:grid-cols-4">
            {statCards.map(({ title, value, icon: Icon }) => (
              <Card key={title} className="glass-card rounded-[1.25rem] border-white/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{title}</p>
                    <p className="mt-3 font-display text-4xl text-primary">{value}</p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/6 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <Card className="glass-card rounded-[1.4rem] border-white/10 p-5">
              <div className="mb-5 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="font-display text-3xl text-primary">Movies By Year</h3>
              </div>
              <div className="space-y-4">
                {analytics.years.length > 0 ? (
                  analytics.years.slice(0, 10).map((item) => (
                    <CompactRow key={item.label} label={item.label} value={item.value} max={maxYearCount} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No movie year data yet.</p>
                )}
              </div>
            </Card>

            <Card className="glass-card rounded-[1.4rem] border-white/10 p-5">
              <div className="mb-5 flex items-center gap-2">
                <Clapperboard className="h-5 w-5 text-primary" />
                <h3 className="font-display text-3xl text-primary">Genre Breakdown</h3>
              </div>
              <div className="space-y-4">
                {analytics.genres.length > 0 ? (
                  analytics.genres.slice(0, 10).map((item) => (
                    <CompactRow key={item.label} label={item.label} value={item.value} max={maxGenreCount} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Not enough genre data to map preferences.</p>
                )}
              </div>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <Card className="glass-card rounded-[1.4rem] border-white/10 p-5">
              <div className="mb-5 flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <h3 className="font-display text-3xl text-primary">Taste Signals</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.1rem] border border-white/8 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Preferred format</p>
                  <p className="mt-2 text-xl font-semibold text-white">{analytics.insights.preferredFormat}</p>
                </div>
                <div className="rounded-[1.1rem] border border-white/8 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Top genre</p>
                  <p className="mt-2 text-xl font-semibold text-white">{analytics.insights.topGenre}</p>
                </div>
                <div className="rounded-[1.1rem] border border-white/8 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Avg movie rating</p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    {analytics.insights.averageMovieRating > 0 ? `${analytics.insights.averageMovieRating}/10` : "N/A"}
                  </p>
                </div>
                <div className="rounded-[1.1rem] border border-white/8 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Avg show rating</p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    {analytics.insights.averageShowRating > 0 ? `${analytics.insights.averageShowRating}/10` : "N/A"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="glass-card rounded-[1.4rem] border-white/10 p-5">
              <div className="mb-5 flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <h3 className="font-display text-3xl text-primary">Highest Rated Titles</h3>
              </div>
              <div className="space-y-3">
                {analytics.topRatedTitles.length > 0 ? (
                  analytics.topRatedTitles.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 rounded-[1.1rem] border border-white/8 bg-white/5 p-3">
                      <div className="relative h-20 w-14 overflow-hidden rounded-[0.9rem] border border-white/10 bg-white/5">
                        {item.poster_path ? (
                          <Image src={item.poster_path} alt={`${item.title} poster`} fill sizes="56px" className="object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge className={item.type === "movie" ? "bg-sky-500/15 text-sky-300 border-sky-400/20" : "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/20"}>
                            {item.type}
                          </Badge>
                        </div>
                        <p className="mt-2 truncate text-lg font-semibold text-white">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.metric}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No personal ratings yet.</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
