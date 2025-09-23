
import { TVShow, SortOption } from "@/lib/types";
import { TVShowCard } from "@/components/core/TVShowCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortSelector } from "@/components/ui/sort-selector";

interface TVShowSectionProps {
  filteredTVShows: TVShow[];
  tvGenres: string[];
  tvGenreFilter: string;
  tvShowSort: SortOption;
  onSetTvGenreFilter: (value: string) => void;
  onSetTvShowSort: (value: SortOption) => void;
  onRemove: (_id: string) => void;
  onShowDetails: (show: TVShow) => void;
  onEdit: (show: TVShow) => void;
}

export const TVShowSection = ({
  filteredTVShows,
  tvGenres,
  tvGenreFilter,
  tvShowSort,
  onSetTvGenreFilter,
  onSetTvShowSort,
  onRemove,
  onShowDetails,
  onEdit,
}: TVShowSectionProps) => {
  return (
    <section className="mb-16">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-3">
          TV Shows Watched
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Filter by genre:</span>
          <Select value={tvGenreFilter} onValueChange={onSetTvGenreFilter}>
            <SelectTrigger className="w-[180px] glass-card">
              <SelectValue placeholder="All genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All genres</SelectItem>
              {tvGenres.map(genre => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {tvGenreFilter !== "all" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetTvGenreFilter("all")}
              className="glass-card"
            >
              Clear
            </Button>
          )}
          <SortSelector value={tvShowSort} onValueChange={onSetTvShowSort} />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredTVShows.length > 0 ? (
          filteredTVShows.map((show) => (
            <TVShowCard
              key={show._id.toString()}
              show={show as TVShow}
              onRemove={onRemove}
              onShowDetails={onShowDetails}
              onEdit={onEdit}
            />
          ))
        ) : tvGenreFilter !== "all" ? (
          <div className="text-center py-12 col-span-full glass-card rounded-2xl">
            <p className="text-muted-foreground">No TV shows found for the selected genre.</p>
          </div>
        ) : (
          <div className="text-center py-12 col-span-full glass-card rounded-2xl">
            <p className="text-muted-foreground">No TV shows added yet. Add one to get started!</p>
          </div>
        )}
      </div>
    </section>
  );
};