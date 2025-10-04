import { TVShow, SortOption } from "@/lib/types";
import { TVShowCard } from "@/components/core/TVShowCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectSeparator,
  SelectGroup, // ADDED
} from "@/components/ui/select";
import { SortSelector } from "@/components/ui/sort-selector";
import { ChevronLeft, ChevronRight, Tv2 } from "lucide-react";
import { AddTVShowDialog } from "@/components/modals/AddTVShowDialog";
import { ContentSectionSkeleton } from "@/components/ui/SkeletonCard";

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

  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onSetPage: (page: number) => void;
  onAddTVShow: (
    id: string,
    title: string,
    poster_path: string | null
  ) => Promise<void>;
  isLoading: boolean; // NEW PROP
}

// TVShowPlaceholder Component
const TVShowPlaceholder = ({
  onAddTVShow,
}: Pick<TVShowSectionProps, "onAddTVShow">) => (
  <div className="text-center py-12 px-6 glass-card rounded-2xl border border-primary/20 bg-primary/5 col-span-full">
    <Tv2 className="w-10 h-10 mx-auto text-primary mb-4" />
    <h3 className="text-xl font-semibold mb-2 text-foreground">
      Where Are Your TV Shows?
    </h3>
    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
      You haven't tracked any TV shows yet. Click the button below to add a show
      and begin episode-by-episode tracking!
    </p>
    <AddTVShowDialog onAddTVShow={onAddTVShow} />
  </div>
);

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
  currentPage,
  totalItems,
  itemsPerPage,
  onSetPage,
  onAddTVShow,
  isLoading,
}: TVShowSectionProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const showPagination = totalPages > 1;

  const showPlaceholder =
    filteredTVShows.length === 0 && tvGenreFilter === "all";

  if (isLoading) {
    return (
      <section id="tv-shows" className="mb-16">
        {/* Skeleton Header */}
        <div className="mb-8 h-8 w-40 bg-muted/50 rounded-lg animate-pulse" />
        <ContentSectionSkeleton />
      </section>
    );
  }

  return (
    <section id="tv-shows" className="mb-16">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-3">
          TV Shows Watched
          <Badge variant="outline" className="text-sm font-medium ml-1">
            {totalItems}
          </Badge>
        </h2>

        {/* FIX: Simplified container to flex-wrap for simple horizontal flow (desktop-first small items) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
          {/* Filter Selector Group */}
          <div className="flex items-center gap-2 flex-grow-0">
            <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:block">
              Filter by:
            </span>

            <Select value={tvGenreFilter} onValueChange={onSetTvGenreFilter}>
              {/* Fixed small width for filter dropdown */}
              <SelectTrigger className="w-[120px] glass-card">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                
                {/* FAVORITES FILTER */}
                <SelectItem
                  value="favorites"
                  className="font-semibold text-red-500"
                >
                  Favorites
                </SelectItem>
                
                <SelectSeparator />
                
                <SelectGroup> {/* WRAPPED Categories in SelectGroup */}
                  {/* NEW CATEGORY FILTERS */}
                  <SelectLabel>Categories</SelectLabel>
                  <SelectItem value="Regular Series">Regular Series</SelectItem>
                  <SelectItem value="Miniseries">Miniseries</SelectItem>
                  <SelectItem value="Hindi Tv shows">Hindi Tv shows</SelectItem>
                </SelectGroup>
                
                <SelectSeparator />
                
                <SelectGroup> {/* WRAPPED Genres in SelectGroup */}
                  {/* GENRE FILTERS */}
                  <SelectLabel>Genres</SelectLabel>
                  {tvGenres
                    .filter((genre) => genre !== "favorites" && genre !== "Regular Series" && genre !== "Miniseries" && genre !== "Hindi Tv shows")
                    .map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Filter Count and Clear Button */}
            {tvGenreFilter !== "all" && (
              <>
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/30 hidden sm:inline-flex"
                >
                  {totalItems} Items
                </Badge>
              </>
            )}
          </div>

          {/* Sort Selector */}
          <SortSelector value={tvShowSort} onValueChange={onSetTvShowSort} />

          {/* Add Button */}
          <AddTVShowDialog onAddTVShow={onAddTVShow} />
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {showPlaceholder ? (
          <TVShowPlaceholder onAddTVShow={onAddTVShow} />
        ) : filteredTVShows.length > 0 ? (
          filteredTVShows.map((show) => (
            <TVShowCard
              key={show._id.toString()}
              show={show as TVShow}
              onRemove={onRemove}
              onShowDetails={onShowDetails}
              onEdit={onEdit}
            />
          ))
        ) : (
          <div className="text-center py-12 col-span-full glass-card rounded-2xl">
            <p className="text-muted-foreground">
              No TV shows found for the selected filter.
            </p>
          </div>
        )}
      </div>

      {showPagination && (
        <div className="mt-8 flex items-center justify-center space-x-3 sm:space-x-4">
          <Button
            variant="outline"
            onClick={() => onSetPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="glass-card h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm md:text-base text-muted-foreground font-medium px-1">
            {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            onClick={() => onSetPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="glass-card h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
};