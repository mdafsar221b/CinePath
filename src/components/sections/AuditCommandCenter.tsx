"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clapperboard,
  Film,
  ListChecks,
  Plus,
  Sparkles,
  Star,
  Tv2,
} from "lucide-react";
import { Movie, TVShow, WatchlistItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddMovieDialog } from "@/components/modals/AddMovieDialog";
import { AddTVShowDialog } from "@/components/modals/AddTVShowDialog";
import { cn } from "@/lib/utils";

type AuditEntry = {
  id: string;
  type: "movie" | "tv" | "watchlist";
  title: string;
  meta: string;
  timestamp: number;
  status: string;
};

interface AuditCommandCenterProps {
  movies: Movie[];
  tvShows: TVShow[];
  watchlist: WatchlistItem[];
  totalEpisodesWatched: number;
  totalSeasonsTracked: number;
  totalTVShowsTracked: number;
  onAddMovie: (movie: any) => void;
  onAddTVShow: (id: string, title: string, poster_path: string | null) => Promise<void>;
  statsButton?: React.ReactNode;
}

const getTimestamp = (value: unknown) => {
  const date = new Date(value as any);
  const time = date.getTime();
  return Number.isFinite(time) ? time : 0;
};

const formatRelative = (timestamp: number) => {
  const diffMs = Date.now() - timestamp;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths <= 1) return "1 month ago";
  return `${diffMonths} months ago`;
};

export const AuditCommandCenter = ({
  movies,
  tvShows,
  watchlist,
  totalEpisodesWatched,
  totalSeasonsTracked,
  totalTVShowsTracked,
  onAddMovie,
  onAddTVShow,
  statsButton,
}: AuditCommandCenterProps) => {
  const { data: session } = useSession();
  const viewerName = (session?.user?.name || session?.user?.email || "Viewer").split(" ")[0].split("@")[0];

  const auditEntries = useMemo<AuditEntry[]>(() => {
    const movieEntries = movies.map((movie) => ({
      id: `movie-${movie._id}`,
      type: "movie" as const,
      title: movie.title,
      meta: movie.genre || "Movie logged",
      timestamp: getTimestamp(movie.addedAt),
      status: movie.myRating ? `Rated ${movie.myRating}/10` : "Needs personal rating",
    }));

    const showEntries = tvShows.map((show) => ({
      id: `tv-${show._id}`,
      type: "tv" as const,
      title: show.title,
      meta:
        show.totalEpisodes && show.totalEpisodes > 0
          ? `${show.watchedEpisodeIds?.length || 0}/${show.totalEpisodes} episodes`
          : `${show.watchedEpisodeIds?.length || 0} episodes tracked`,
      timestamp: getTimestamp(show.addedAt),
      status: show.isFavorite ? "Marked favorite" : "Active series",
    }));

    const queueEntries = watchlist.map((item) => ({
      id: `watch-${item._id}`,
      type: "watchlist" as const,
      title: item.title,
      meta: item.type === "movie" ? "Queued film" : "Queued series",
      timestamp: getTimestamp(item.addedAt),
      status: "Waiting in queue",
    }));

    return [...movieEntries, ...showEntries, ...queueEntries]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 7);
  }, [movies, tvShows, watchlist]);

  const collectionHealth = useMemo(() => {
    const library = [...movies, ...tvShows];
    const missingRatings = library.filter((item) => !item.myRating).length;
    const missingNotes = library.filter((item) => !item.personalNotes?.trim()).length;
    const missingMetadata = library.filter(
      (item) => !item.genre || item.genre === "N/A" || !item.imdbRating || item.imdbRating === "N/A"
    ).length;
    const favorites = tvShows.filter((show) => show.isFavorite).length;

    return { missingRatings, missingNotes, missingMetadata, favorites };
  }, [movies, tvShows]);

  const seriesInProgress = useMemo(() => {
    return [...tvShows]
      .map((show) => {
        const watched = show.watchedEpisodeIds?.length || 0;
        const total = show.totalEpisodes || 0;
        const progress = total > 0 ? Math.min(100, Math.round((watched / total) * 100)) : 0;
        return {
          ...show,
          watched,
          total,
          progress,
        };
      })
      .sort((a, b) => b.progress - a.progress || b.watched - a.watched)
      .slice(0, 4);
  }, [tvShows]);

  const watchNext = useMemo(() => watchlist.slice(0, 4), [watchlist]);

  const statCards = [
    {
      label: "Movies logged",
      value: movies.length,
      detail: "Audited films in your archive",
      icon: Film,
    },
    {
      label: "Series tracked",
      value: totalTVShowsTracked,
      detail: `${totalSeasonsTracked} seasons under review`,
      icon: Tv2,
    },
    {
      label: "Queue pressure",
      value: watchlist.length,
      detail: "Titles waiting to be watched",
      icon: ListChecks,
    },
    {
      label: "Episodes logged",
      value: totalEpisodesWatched,
      detail: "Long-form viewing progress",
      icon: Activity,
    },
  ];

  return (
    <section className="mb-12 space-y-6">
      <div className="section-shell">
        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                audit command center
              </Badge>
              <Badge variant="outline">dashboard-first flow</Badge>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Primary workflow</p>
              <h1 className="font-display text-6xl text-primary sm:text-7xl">
                Audit The Story Of What {viewerName} Watches
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-muted-foreground sm:text-base">
                This is now the real product surface. Instead of dropping you into disconnected movie and TV grids,
                the app starts with queue pressure, recent activity, series progress, and collection health so you can
                audit your watching habits first and manage entries second.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <AddMovieDialog onAddMovie={onAddMovie}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Log Movie
                </Button>
              </AddMovieDialog>
              <AddTVShowDialog onAddTVShow={onAddTVShow}>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Track TV Show
                </Button>
              </AddTVShowDialog>
              {statsButton}
              <Button asChild variant="outline">
                <Link href="/#trending-popular">
                  Open Discovery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {statCards.map(({ label, value, detail, icon: Icon }) => (
              <div key={label} className="glass-card rounded-[1.5rem] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
                    <p className="mt-3 font-display text-5xl text-primary">{value}</p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/6 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="section-shell">
          <div className="relative z-10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Activity log</p>
                <h2 className="font-display text-4xl text-primary">Recent Audit Trail</h2>
              </div>
              <Badge variant="outline">{auditEntries.length} latest changes</Badge>
            </div>

            <div className="space-y-3">
              {auditEntries.length > 0 ? (
                auditEntries.map((entry) => (
                  <div key={entry.id} className="glass-card flex items-start justify-between gap-4 rounded-[1.35rem] p-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          className={cn(
                            entry.type === "movie" && "bg-sky-500/15 text-sky-300 border-sky-400/20",
                            entry.type === "tv" && "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/20",
                            entry.type === "watchlist" && "bg-emerald-500/15 text-emerald-200 border-emerald-400/20"
                          )}
                        >
                          {entry.type}
                        </Badge>
                        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {formatRelative(entry.timestamp)}
                        </span>
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-white">{entry.title}</h3>
                      <p className="text-sm leading-6 text-muted-foreground">{entry.meta}</p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-foreground/85">
                      {entry.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-card rounded-[1.35rem] p-6 text-sm text-muted-foreground">
                  No activity yet. Start by adding a movie or TV show and the audit trail will begin here.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="section-shell">
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Collection health</p>
              <h2 className="font-display text-4xl text-primary">What Needs Attention</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="glass-card rounded-[1.3rem] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Missing ratings</p>
                  <p className="mt-2 font-display text-4xl text-primary">{collectionHealth.missingRatings}</p>
                </div>
                <div className="glass-card rounded-[1.3rem] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Missing notes</p>
                  <p className="mt-2 font-display text-4xl text-primary">{collectionHealth.missingNotes}</p>
                </div>
                <div className="glass-card rounded-[1.3rem] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Metadata gaps</p>
                  <p className="mt-2 font-display text-4xl text-primary">{collectionHealth.missingMetadata}</p>
                </div>
                <div className="glass-card rounded-[1.3rem] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Favorite shows</p>
                  <p className="mt-2 font-display text-4xl text-primary">{collectionHealth.favorites}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="section-shell">
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Next up</p>
                  <h2 className="font-display text-4xl text-primary">Queue Snapshot</h2>
                </div>
                <Badge variant="outline">{watchlist.length} waiting</Badge>
              </div>

              <div className="space-y-3">
                {watchNext.length > 0 ? (
                  watchNext.map((item) => (
                    <div key={item._id} className="glass-card rounded-[1.3rem] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-base font-semibold text-white">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.type === "movie" ? "Queued film" : "Queued series"} {item.year ? `• ${item.year}` : ""}
                          </p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="glass-card rounded-[1.3rem] p-5 text-sm text-muted-foreground">
                    Your watchlist is clear. Use discovery or quick add actions to queue the next thing worth auditing.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-shell">
        <div className="relative z-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Progress board</p>
              <h2 className="font-display text-4xl text-primary">Series Under Review</h2>
            </div>
            <Badge variant="outline">{seriesInProgress.length} highlighted</Badge>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {seriesInProgress.length > 0 ? (
              seriesInProgress.map((show) => (
                <div key={show._id} className="glass-card rounded-[1.4rem] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-white">{show.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {show.total > 0 ? `${show.watched}/${show.total} episodes watched` : `${show.watched} episodes tracked`}
                      </p>
                    </div>
                    {show.isFavorite ? <Star className="h-5 w-5 fill-primary text-primary" /> : <Clapperboard className="h-5 w-5 text-primary" />}
                  </div>

                  <div className="mt-4 h-2 rounded-full bg-white/8">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${show.progress}%` }} />
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {show.progress}% completion
                  </p>
                </div>
              ))
            ) : (
              <div className="glass-card col-span-full rounded-[1.4rem] p-6 text-sm text-muted-foreground">
                Add a TV show and this board will highlight the series you are actively progressing through.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
