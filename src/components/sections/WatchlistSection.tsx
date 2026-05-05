import { ArrowRight, ListVideo, Play, Search } from "lucide-react";
import { WatchlistItem } from "@/lib/types";
import { WatchlistCard } from "@/components/core/WatchlistCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WatchlistSkeleton } from "@/components/ui/SkeletonCard";

interface WatchlistSectionProps {
  watchlist: WatchlistItem[];
  onRemove: (_id: string) => void;
  onShowDetails: (item: WatchlistItem) => void;
  onMarkWatched: (item: WatchlistItem) => void;
  isLoading: boolean;
}

const WatchlistPlaceholder = () => (
  <div className="glass-card rounded-[1.5rem] px-6 py-12">
    <div className="mx-auto max-w-2xl text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-primary/12 text-primary">
        <ListVideo className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-3xl font-semibold text-white">Your watchlist is waiting for its first title</h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        The queue should feel alive. Search for something you want to watch next, add it to the watchlist, and move it into the main library when you finish it.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 text-left">
          <Search className="h-5 w-5 text-primary" />
          <p className="mt-3 text-sm font-semibold text-white">1. Search first</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Use the discovery search bar on the homepage to pull in movies and series.</p>
        </div>
        <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 text-left">
          <ArrowRight className="h-5 w-5 text-primary" />
          <p className="mt-3 text-sm font-semibold text-white">2. Queue it up</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Add interesting titles to the watchlist so they stay visible and ready.</p>
        </div>
        <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 text-left">
          <Play className="h-5 w-5 text-primary" />
          <p className="mt-3 text-sm font-semibold text-white">3. Move when watched</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Promote finished titles straight into the main archive with one click.</p>
        </div>
      </div>
    </div>
  </div>
);

export const WatchlistSection = ({
  watchlist,
  onRemove,
  onShowDetails,
  onMarkWatched,
  isLoading,
}: WatchlistSectionProps) => {
  if (isLoading) {
    return (
      <section id="watchlist" className="mb-16">
        <div className="mb-8 h-8 w-40 animate-pulse rounded-lg bg-muted/50" />
        <WatchlistSkeleton />
      </section>
    );
  }

  return (
    <section id="watchlist" className="mb-16">
      <div className="section-shell">
        <div className="relative z-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">Queue</p>
              <h2 className="font-display text-5xl text-primary sm:text-6xl">Watchlist</h2>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                A holding area for the next movie night, the next binge, and everything not watched yet.
              </p>
            </div>
            <Badge variant="outline">{watchlist.length} queued</Badge>
          </div>

          {watchlist.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {watchlist.map((item) => (
                <WatchlistCard
                  key={item._id}
                  item={item}
                  onRemove={onRemove}
                  onShowDetails={onShowDetails}
                  onMarkWatched={onMarkWatched}
                />
              ))}
            </div>
          ) : (
            <WatchlistPlaceholder />
          )}
        </div>
      </div>
    </section>
  );
};
