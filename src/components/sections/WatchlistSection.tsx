
import { WatchlistItem } from "@/lib/types";
import { WatchlistCard } from "@/components/core/WatchlistCard";
import { Badge } from "@/components/ui/badge";

interface WatchlistSectionProps {
  watchlist: WatchlistItem[];
  onRemove: (_id: string) => void;
  onShowDetails: (item: WatchlistItem) => void;
  onMarkWatched: (item: WatchlistItem) => void;
}

export const WatchlistSection = ({ watchlist, onRemove, onShowDetails, onMarkWatched }: WatchlistSectionProps) => {
  if (watchlist.length === 0) return null;

  return (
    <section id="watchlist" className="mb-16">
      <h2 className="text-2xl md:text-3xl font-semibold mb-8 flex items-center gap-3">
        Watchlist
        <Badge variant="outline" className="ml-2 text-xs">
          {watchlist.length}
        </Badge>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
    </section>
  );
};