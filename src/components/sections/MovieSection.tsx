import { Film, ChevronLeft, ChevronRight } from "lucide-react";
import { Movie, SortOption } from "@/lib/types";
import { MovieCard } from "@/components/core/MovieCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddMovieDialog } from "@/components/modals/AddMovieDialog";
import { ContentSectionSkeleton } from "@/components/ui/SkeletonCard";
import { SortSelector } from "@/components/ui/sort-selector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  isLoading: boolean;
}

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

  if (isLoading) {
    return (
      <section id="movies" className="mb-16">
        <div className="mb-8 h-8 w-40 animate-pulse rounded-lg bg-muted/50" />
        <ContentSectionSkeleton />
      </section>
    );
  }

  return (
    <section id="movies" className="mb-16">
      <div className="section-shell">
        <div className="relative z-10">
          <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">Library section</p>
              <h2 className="font-display text-5xl text-primary sm:text-6xl">Movies Watched</h2>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                A poster-led archive for everything you have finished, rated, and want to remember.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline">{totalItems} titles</Badge>
              <Select value={movieGenreFilter} onValueChange={onSetMovieGenreFilter}>
                <SelectTrigger className="w-[150px]">
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
              <SortSelector value={movieSort} onValueChange={onSetMovieSort} />
              <AddMovieDialog onAddMovie={onAddMovie} />
            </div>
          </div>

          {filteredMovies.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie._id.toString()}
                  movie={movie}
                  onRemove={onRemove}
                  onShowDetails={onShowDetails}
                  onEdit={onEdit}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card flex flex-col items-center rounded-[1.5rem] px-6 py-14 text-center">
              <Film className="h-10 w-10 text-primary" />
              <h3 className="mt-4 text-2xl font-semibold text-white">Your movie shelf is still empty</h3>
              <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
                Start by adding a film you have already seen. The archive gets dramatically better once the posters start stacking up.
              </p>
              <div className="mt-6">
                <AddMovieDialog onAddMovie={onAddMovie} />
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
