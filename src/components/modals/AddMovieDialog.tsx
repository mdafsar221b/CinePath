// src/components/modals/AddMovieDialog.tsx

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { NewMovie, SearchResult } from "@/lib/types";
import { Search, Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { mapDetailedContent, mapSearchResult } from "@/lib/tmdb-mapper";

interface AddMovieDialogProps {
  onAddMovie: (movie: NewMovie) => void;
}

interface MovieSearchResult extends SearchResult {}

export const AddMovieDialog = ({ onAddMovie }: AddMovieDialogProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<MovieSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualTitle, setManualTitle] = useState("");
  const [manualYear, setManualYear] = useState<number | null>(null);
  const [manualPoster, setManualPoster] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;

    setLoading(true);
    setResults([]);
    try {
      const res = await fetch(`/api/tmdb-proxy?path=/search/movie&query=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await res.json();
      
      const mappedResults = data.results
        .map((item: any) => mapSearchResult({...item, media_type: 'movie'}))
        .filter((result: SearchResult | null) => result !== null && result.type === 'movie') as MovieSearchResult[];
        
      setResults(mappedResults);
    } catch (e) {
      console.error("Search error:", e);
      setResults([]);
      toast.error("Failed to perform movie search.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFromSearch = async (movie: MovieSearchResult) => {
    try {
      const tmdbDetails = await mapDetailedContent(movie.tmdbId, 'movie');
      
      const movieToAdd: NewMovie = {
        tmdbId: movie.tmdbId,
        imdbId: tmdbDetails.imdbId,
        title: tmdbDetails.title!, // Use non-null assertion
        year: tmdbDetails.year!, // Use non-null assertion
        poster_path: tmdbDetails.poster_path,
        genre: tmdbDetails.genre,
        plot: tmdbDetails.plot,
        rating: tmdbDetails.rating,
        actors: tmdbDetails.actors,
        director: tmdbDetails.director,
        imdbRating: tmdbDetails.imdbRating,
      };
      
      onAddMovie(movieToAdd);
      setOpen(false);
      setSearchTerm("");
      setResults([]);
    } catch (error) {
      console.error("Error adding movie:", error);
      const movieToAdd: NewMovie = {
        tmdbId: movie.tmdbId,
        title: movie.title,
        year: parseInt(movie.year) || 0,
        poster_path: movie.poster_path,
      };
      onAddMovie(movieToAdd);
      setOpen(false);
      setSearchTerm("");
      setResults([]);
    }
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualTitle && manualYear) {
      const movieToAdd: NewMovie = {
        tmdbId: 0, // Fallback for manual entry
        title: manualTitle,
        year: manualYear,
        poster_path: manualPoster || null,
      };
      onAddMovie(movieToAdd);
      setOpen(false);
      setManualTitle("");
      setManualYear(null);
      setManualPoster("");
      setIsManualEntry(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearchTerm("");
      setResults([]);
      setIsManualEntry(false);
      setManualTitle("");
      setManualYear(null);
      setManualPoster("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
      
        <Button 
            className="rounded-xl"
            size="icon" 
        >
            <Plus className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border/50 text-foreground max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle id="add-movie-title" className="text-xl font-semibold">Add Movie</DialogTitle>
          <DialogDescription id="add-movie-description" className="text-muted-foreground">
            {isManualEntry ? "Enter movie details manually." : "Search for a movie to add it to your collection."}
          </DialogDescription>
        </DialogHeader>

        {!isManualEntry ? (
          <>
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 glass-card border-border/50 rounded-xl"
                placeholder="Search for a movie..."
              />
              <Button type="submit" size="icon" disabled={loading} className="rounded-xl">
                <Search className="w-4 h-4" />
              </Button>
            </form>
            <div className="mt-6 max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Searching...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-3">
                  {results.map((movie) => (
                    <div
                      key={movie.tmdbId}
                      className="glass-card rounded-xl p-4 hover:bg-muted/10 transition-colors duration-300 flex items-center gap-4"
                    >
                      {movie.poster_path ? (
                        <div className="relative w-[50px] h-[75px] flex-shrink-0">
                          <Image
                            src={movie.poster_path}
                            alt={`${movie.title} poster`}
                            fill
                            sizes="50px"
                            className="rounded-lg object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center rounded-lg bg-muted/20 text-center text-xs text-muted-foreground w-[50px] h-[75px] flex-shrink-0">
                          No Poster
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{movie.title}</h4>
                        <p className="text-sm text-muted-foreground">{movie.year}</p>
                      </div>
                      <Button 
                        onClick={() => handleAddFromSearch(movie)}
                        className="rounded-lg"
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              ) : searchTerm && !loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No results found.</p>
                  <Button variant="outline" onClick={() => setIsManualEntry(true)} className="glass-card">
                    Add Manually Instead
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Start typing to search for a movie.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <form onSubmit={handleManualAdd} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title *
              </Label>
              <Input
                id="title"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                className="glass-card border-border/50 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm font-medium">
                Year *
              </Label>
              <Input
                id="year"
                type="number"
                value={manualYear ?? ""}
                onChange={(e) => setManualYear(Number(e.target.value))}
                className="glass-card border-border/50 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="poster" className="text-sm font-medium">
                Poster URL (Optional)
              </Label>
              <Input
                id="poster"
                type="url"
                value={manualPoster}
                onChange={(e) => setManualPoster(e.target.value)}
                className="glass-card border-border/50 rounded-xl"
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsManualEntry(false)}
                className="flex-1 glass-card rounded-xl"
              >
                Back to Search
              </Button>
              <Button 
                type="submit" 
                className="flex-1 rounded-xl"
              >
                Add Movie
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
      </Dialog>
    );
};