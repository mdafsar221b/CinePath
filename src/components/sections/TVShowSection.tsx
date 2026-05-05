import { ChevronLeft, ChevronRight, Tv2 } from "lucide-react";
import { TVShow, SortOption } from "@/lib/types";
import { TVShowCard } from "@/components/core/TVShowCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddTVShowDialog } from "@/components/modals/AddTVShowDialog";
import { ContentSectionSkeleton } from "@/components/ui/SkeletonCard";
import { SortSelector } from "@/components/ui/sort-selector";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  onAddTVShow: (id: string, title: string, poster_path: string | null) => Promise<void>;
  isLoading: boolean;
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
  currentPage,
  totalItems,
  itemsPerPage,
  onSetPage,
  onAddTVShow,
  isLoading,
}: TVShowSectionProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const showPagination = totalPages > 1;

  if (isLoading) {
    return (
      <section id="tv-shows" className="mb-16">
        <div className="mb-8 h-8 w-40 animate-pulse rounded-lg bg-muted/50" />
        <ContentSectionSkeleton />
      </section>
    );
  }

  return (
    <section id="tv-shows" className="mb-16">
      <div className="section-shell">
        <div className="relative z-10">
          <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">Library section</p>
              <h2 className="font-display text-5xl text-primary sm:text-6xl">TV Shows Tracked</h2>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                Long-form viewing needs better structure. This section keeps series, progress, and favorites visual instead of buried.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline">{totalItems} titles</Badge>
              <Select value={tvGenreFilter} onValueChange={onSetTvGenreFilter}>
                <SelectTrigger className="w-[165px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="favorites">Favorites</SelectItem>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="Regular Series">Regular Series</SelectItem>
                    <SelectItem value="Miniseries">Miniseries</SelectItem>
                    <SelectItem value="Hindi Tv shows">Hindi Tv shows</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Genres</SelectLabel>
                    {tvGenres
                      .filter((genre) => !["favorites", "Regular Series", "Miniseries", "Hindi Tv shows"].includes(genre))
                      .map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <SortSelector value={tvShowSort} onValueChange={onSetTvShowSort} />
              <AddTVShowDialog onAddTVShow={onAddTVShow} />
            </div>
          </div>

          {filteredTVShows.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {filteredTVShows.map((show) => (
                <TVShowCard
                  key={show._id.toString()}
                  show={show}
                  onRemove={onRemove}
                  onShowDetails={onShowDetails}
                  onEdit={onEdit}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card flex flex-col items-center rounded-[1.5rem] px-6 py-14 text-center">
              <Tv2 className="h-10 w-10 text-primary" />
              <h3 className="mt-4 text-2xl font-semibold text-white">No series on the board yet</h3>
              <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
                Add a show and CinePath will turn it into a progress-driven collection with episodes, favorites, and better context.
              </p>
              <div className="mt-6">
                <AddTVShowDialog onAddTVShow={onAddTVShow} />
              </div>
            </div>
          )}

          {showPagination ? (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button variant="outline" onClick={() => onSetPage(currentPage - 1)} disabled={currentPage === 1} className="h-10 w-10 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Badge variant="outline">
                page {currentPage} of {totalPages}
              </Badge>
              <Button variant="outline" onClick={() => onSetPage(currentPage + 1)} disabled={currentPage === totalPages} className="h-10 w-10 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
