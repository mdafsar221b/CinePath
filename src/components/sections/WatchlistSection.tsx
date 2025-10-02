import { WatchlistItem } from "@/lib/types";
import { WatchlistCard } from "@/components/core/WatchlistCard";
import { Badge } from "@/components/ui/badge";
import { Search, ListVideo, ArrowRight, Play } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface WatchlistSectionProps {
  watchlist: WatchlistItem[];
  onRemove: (_id: string) => void;
  onShowDetails: (item: WatchlistItem) => void;
  onMarkWatched: (item: WatchlistItem) => void;
}

// NEW: WatchlistPlaceholder Component
const WatchlistPlaceholder = () => (
  <div className="text-center py-12 px-6 glass-card rounded-2xl border border-primary/20 bg-primary/5">
    <ListVideo className="w-10 h-10 mx-auto text-primary mb-4" />
    <h3 className="text-xl font-semibold mb-2 text-foreground">
      Your Watchlist is Empty
    </h3>
    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
      Start your cinematic journey by adding movies and TV shows you want to watch next.
    </p>
    
    <div className="flex flex-col items-center justify-center space-y-4">
        {/* Step 1: Search */}
        <div className="flex items-center text-left p-4 rounded-xl border border-border/50 bg-background/50 max-w-sm w-full">
            <Search className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
            <p className="text-sm font-medium text-foreground">
                1. Use the **Search Bar** at the top of the page.
            </p>
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground" />
        {/* Step 2: Add to Watchlist */}
        <div className="flex items-center text-left p-4 rounded-xl border border-border/50 bg-background/50 max-w-sm w-full">
            <Button size="sm" className="w-10 h-10 p-0 mr-3 flex-shrink-0 rounded-lg">
                <Play className="w-4 h-4" />
            </Button>
            <p className="text-sm font-medium text-foreground">
                2. Click the **"Watchlist" button** on a search result.
            </p>
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground" />
        {/* Step 3: Track */}
        <div className="flex items-center text-left p-4 rounded-xl border border-border/50 bg-background/50 max-w-sm w-full">
            <Button size="sm" variant="outline" className="w-10 h-10 p-0 mr-3 flex-shrink-0 rounded-lg">
                <Play className="w-4 h-4" />
            </Button>
            <p className="text-sm font-medium text-foreground">
                3. When watched, click the **Play icon** on the card to move it to your main list.
            </p>
        </div>
    </div>
  </div>
);


export const WatchlistSection = ({ watchlist, onRemove, onShowDetails, onMarkWatched }: WatchlistSectionProps) => {
  
  const showPlaceholder = watchlist.length === 0;
    
  return (
    <section id="watchlist" className="mb-16">
      <h2 className="text-2xl md:text-3xl font-semibold mb-8 flex items-center gap-3">
        Watchlist
        {watchlist.length > 0 && (
            <Badge variant="outline" className="ml-2 text-xs">
              {watchlist.length}
            </Badge>
        )}
      </h2>
      
      {showPlaceholder ? (
        <WatchlistPlaceholder />
      ) : (
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
      )}
    </section>
  );
};