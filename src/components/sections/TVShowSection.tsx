


import { TVShow, SortOption } from "@/lib/types";
import { TVShowCard } from "@/components/core/TVShowCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortSelector } from "@/components/ui/sort-selector";
import { ChevronLeft, ChevronRight, Tv2 } from "lucide-react"; 
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

// TVShowPlaceholder Component
const TVShowPlaceholder = ({ onAddTVShow }: Pick<TVShowSectionProps, 'onAddTVShow'>) => (
    <div className="text-center py-12 px-6 glass-card rounded-2xl border border-primary/20 bg-primary/5 col-span-full">
        <Tv2 className="w-10 h-10 mx-auto text-primary mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-foreground">
            Where Are Your TV Shows?
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You haven't tracked any TV shows yet. Click the button below to add a show and begin episode-by-episode tracking!
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
}: TVShowSectionProps) => {

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const showPagination = totalPages > 1;

  const showPlaceholder = filteredTVShows.length === 0 && tvGenreFilter === "all";

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
              {/* Reduced width on mobile, and display short placeholder text */}
              <SelectTrigger className="w-[100px] sm:w-[180px] glass-card">
                <span className="hidden sm:inline">
                    <SelectValue placeholder="All genres" />
                </span>
                <span className="sm:hidden">
                    <SelectValue placeholder="Genre" /> 
                </span>
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
            {/* UX IMPROVEMENT: Show item count when filter is active */}
            {tvGenreFilter !== "all" && (
              <>
                {/* Badge showing the count of filtered items */}
                <Badge 
                  variant="outline" 
                  className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/30 hidden sm:inline-flex"
                >
                  {totalItems} Items
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSetTvGenreFilter("all")}
                  className="glass-card"
                >
                  Clear
                </Button>
              </>
            )}
          </div>
        
          <SortSelector value={tvShowSort} onValueChange={onSetTvShowSort} />
          
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
            <p className="text-muted-foreground">No TV shows found for the selected filter.</p>
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