import { Movie, SortOption } from "@/lib/types";
import { MovieCard } from "@/components/core/MovieCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortSelector } from "@/components/ui/sort-selector";
import { ChevronLeft, ChevronRight, Film, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddMovieDialog } from "@/components/modals/AddMovieDialog";
import { ContentSectionSkeleton } from "@/components/ui/SkeletonCard"; // NEW IMPORT

interface MovieSectionProps {
  filteredMovies: Movie[];
  movieGenres: string[];
  movieGenreFilter: string;
  movieSort: SortOption;
  onSetMovieGenreFilter: (value: string) => void;
  onSetMovieSort: (value: SortOption) => void;
  onRemove: (_id: string) => void;
  onShowDetails: (movie: Movie) => void;
  onEdit: (movie: Movie) => void;

  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onSetPage: (page: number) => void;
  onAddMovie: (movie: any) => void;
  isLoading: boolean; // NEW PROP
}

// MoviePlaceholder Component
const MoviePlaceholder = () => (
  <div className="text-center py-12 px-6 glass-card rounded-2xl border border-primary/20 bg-primary/5 col-span-full">
    <Film className="w-10 h-10 mx-auto text-primary mb-4" />
    <h3 className="text-xl font-semibold mb-2 text-foreground">
      Start Tracking Your Movies
    </h3>
    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
      You haven't added any movies yet. Use the button below to quickly search
      and log what you've watched!
    </p>
    <AddMovieDialog onAddMovie={() => {}} />
  </div>
);

export const MovieSection = ({
  filteredMovies,
  movieGenres,
  movieGenreFilter,
  movieSort,
  onSetMovieGenreFilter,
  onSetMovieSort,
  onRemove,
  onShowDetails,
  onEdit,
  currentPage,
  totalItems,
  itemsPerPage,
  onSetPage,
  onAddMovie,
  isLoading,
}: MovieSectionProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const showPagination = totalPages > 1;

  const showPlaceholder =
    filteredMovies.length === 0 && movieGenreFilter === "all";

  if (isLoading) {
    return (
      <section id="movies" className="mb-16">
        {/* Skeleton Header */}
        <div className="mb-8 h-8 w-40 bg-muted/50 rounded-lg animate-pulse" />
        <ContentSectionSkeleton />
      </section>
    );
  }

  return (
    <section id="movies" className="mb-16">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-3">
          Movies Watched
          <Badge variant="outline" className="text-sm font-medium ml-1">
            {totalItems}
          </Badge>
        </h2>

        {/* FIX: Simplified container to flex-wrap for simple horizontal flow (desktop-first small items) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
          {/* Filter Selector Group */}
          <div className="flex items-center gap-2 flex-grow-0">
            <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:block">
              Filter by genre:
            </span>

            <Select
              value={movieGenreFilter}
              onValueChange={onSetMovieGenreFilter}
            >
              {/* Fixed small width for filter dropdown */}
              <SelectTrigger className="w-[120px] glass-card">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All genres</SelectItem>
                {movieGenres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter Count and Clear Button */}
            {movieGenreFilter !== "all" && (
              <>
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/30 hidden sm:inline-flex"
                >
                  {totalItems} Items
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSetMovieGenreFilter("all")}
                  className="glass-card"
                >
                  Clear
                </Button>
              </>
            )}
          </div>

          {/* Sort Selector */}
          <SortSelector value={movieSort} onValueChange={onSetMovieSort} />

          {/* Add Button */}
          <AddMovieDialog onAddMovie={onAddMovie} />
        </div>
      </div>
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
        {showPlaceholder ? (
          <MoviePlaceholder />
        ) : filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard
              key={movie._id.toString()}
              movie={movie as Movie}
              onRemove={onRemove}
              onShowDetails={onShowDetails}
              onEdit={onEdit}
            />
          ))
        ) : (
          <div className="text-center py-12 col-span-full glass-card rounded-2xl">
            <p className="text-muted-foreground">
              No movies found for the selected genre.
            </p>
          </div>
        )}
      </div>

      {showPagination && (
        <div className="mt-8 flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
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
        </div>
      )}
    </section>
  );
};
