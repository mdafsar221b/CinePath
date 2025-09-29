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
import { NewMovie } from "@/lib/types";
import { Search, Plus } from "lucide-react";
import Image from "next/image";

interface AddMovieDialogProps {
  onAddMovie: (movie: NewMovie) => void;
}

interface SearchResult {
  id: string; 
  title: string;
  year: string; 
  poster_path: string | null; 
}

export const AddMovieDialog = ({ onAddMovie }: AddMovieDialogProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
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
      const res = await fetch(`/api/search/movies?query=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error("Search error:", e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFromSearch = async (movie: SearchResult) => {
    try {
      const detailsRes = await fetch(`/api/details?id=${movie.id}&type=movie`);
      if (!detailsRes.ok) throw new Error("Failed to fetch movie details");
      
      const details = await detailsRes.json();
      
      const movieToAdd: NewMovie = {
        title: details.title,
        year: parseInt(details.year) || 0,
        poster_path: details.poster_path,
        genre: details.genre,
        plot: details.plot,
        rating: details.rating,
        actors: details.actors,
        director: details.director,
        imdbRating: details.imdbRating,
      };
      
      onAddMovie(movieToAdd);
      setOpen(false);
      setSearchTerm("");
      setResults([]);
    } catch (error) {
      console.error("Error adding movie:", error);
      const movieToAdd: NewMovie = {
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
        <Button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-105">
          <Plus className="w-4 h-4 mr-2" />
          Add Movie
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
                      key={movie.id}
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