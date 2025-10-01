

import { TVShow, SortOption } from "@/lib/types";
import { TVShowCard } from "@/components/core/TVShowCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortSelector } from "@/components/ui/sort-selector";
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import { AddTVShowDialog } from "@/components/modals/AddTVShowDialog";

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
}: TVShowSectionProps) => {

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const showPagination = totalPages > 1;

  return (
    <section id="tv-shows"className="mb-16">
    
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-3">
          TV Shows Watched
          <Badge variant="outline" className="text-sm font-medium ml-1">
            {totalItems}
          </Badge>
        </h2>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:block">Filter by genre:</span>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={tvGenreFilter} onValueChange={onSetTvGenreFilter}>
              <SelectTrigger className="w-[150px] sm:w-[180px] glass-card">
                <SelectValue placeholder="All genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All genres</SelectItem>
                {/* NEW FILTER OPTION */}
                <SelectItem value="favorites" className="font-semibold text-red-500">
                    Favorites
                </SelectItem>
                {/* Dynamically generated genres, filtering out 'favorites' which is already added */}
                {tvGenres
                    .filter(genre => genre !== 'favorites')
                    .map(genre => (
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
          </div>
        
          <SortSelector value={tvShowSort} onValueChange={onSetTvShowSort} />
          
          <AddTVShowDialog onAddTVShow={onAddTVShow} /> 
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
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
            <p className="text-muted-foreground">No TV shows found for the selected filter.</p>
          </div>
        ) : (
          <div className="text-center py-12 col-span-full glass-card rounded-2xl">
            <p className="text-muted-foreground">No TV shows added yet. Add one to get started!</p>
          </div>
        )}
      </div>

      {showPagination && (
        <div className="mt-8 flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            onClick={() => onSetPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="glass-card"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => onSetPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="glass-card"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </section>
  );
};