import { Movie, SortOption } from "@/lib/types";
import { MovieCard } from "@/components/core/MovieCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortSelector } from "@/components/ui/sort-selector";
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import { Badge } from "@/components/ui/badge"; // Ensure Badge is imported

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
}: MovieSectionProps) => {
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const showPagination = totalPages > 1;

  return (
    <section className="mb-16">
     
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-3">
          Movies Watched 
          <Badge variant="outline" className="text-sm font-medium ml-1">
            {totalItems}
          </Badge>
        </h2>
        
      
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:block">Filter by genre:</span>
          
        
          <div className="flex flex-wrap items-center gap-2">
            <Select value={movieGenreFilter} onValueChange={onSetMovieGenreFilter}>
              <SelectTrigger className="w-[150px] sm:w-[180px] glass-card">
                <SelectValue placeholder="All genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All genres</SelectItem>
                {movieGenres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {movieGenreFilter !== "all" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSetMovieGenreFilter("all")}
                className="glass-card"
              >
                Clear
              </Button>
            )}
          </div>
          
       
          <SortSelector value={movieSort} onValueChange={onSetMovieSort} />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard
              key={movie._id.toString()}
              movie={movie as Movie}
              onRemove={onRemove}
              onShowDetails={onShowDetails}
              onEdit={onEdit}
            />
          ))
        ) : movieGenreFilter !== "all" ? (
          <div className="text-center py-12 col-span-full glass-card rounded-2xl">
            <p className="text-muted-foreground">No movies found for the selected genre.</p>
          </div>
        ) : (
          <div className="text-center py-12 col-span-full glass-card rounded-2xl">
            <p className="text-muted-foreground">No movies added yet. Add one to get started!</p>
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
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => onSetPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="glass-card"
          >
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </section>
  );
};