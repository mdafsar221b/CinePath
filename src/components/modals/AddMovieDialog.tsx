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
import { Search } from "lucide-react";
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

  const handleAddFromSearch = (movie: SearchResult) => {
    const movieToAdd: NewMovie = {
      title: movie.title,
      year: parseInt(movie.year) || 0,
      poster_path: movie.poster_path,
    };
    onAddMovie(movieToAdd);
    setOpen(false);
    setSearchTerm("");
    setResults([]);
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
        <Button variant="outline" className="text-sm font-light px-4 py-2 border-primary hover:bg-muted/50 transition-colors duration-200">
          + Add Movie
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border border-border text-foreground max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add a Movie</DialogTitle>
          <DialogDescription>
            {isManualEntry ? "Enter movie details manually." : "Search for a movie to add it to your list."}
          </DialogDescription>
        </DialogHeader>

        {!isManualEntry ? (
          <>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-background border-border"
                placeholder="Search for a movie..."
              />
              <Button type="submit" size="icon" disabled={loading}>
                <Search />
              </Button>
            </form>
            <div className="mt-4 max-h-[400px] overflow-y-auto">
              {loading ? (
                <p className="text-center text-muted-foreground">Searching...</p>
              ) : results.length > 0 ? (
                <div className="grid gap-2">
                  {results.map((movie) => (
                    <div
                      key={movie.id}
                      className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      {movie.poster_path ? (
                       <div className="relative w-[50px] h-[75px]">
                            <Image
                              src={movie.poster_path}
                              alt={`${movie.title} poster`}
                              fill
                              className="rounded-lg object-cover"
                            />
                          </div>

                      ) : (
                        <div className="flex h-[75px] w-[50px] items-center justify-center rounded-lg bg-muted-foreground/20 text-center text-[8px] text-muted-foreground">
                          Poster Not Available
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-light">{movie.title}</h4>
                        <p className="text-sm text-muted-foreground">{movie.year}</p>
                      </div>
                      <Button onClick={() => handleAddFromSearch(movie)}>Add</Button>
                    </div>
                  ))}
                </div>
              ) : searchTerm && !loading ? (
                <p className="text-center text-muted-foreground">No results found. <Button variant="link" onClick={() => setIsManualEntry(true)}>Can't find it?</Button></p>
              ) : (
                <p className="text-center text-muted-foreground">Start typing to search for a movie.</p>
              )}
            </div>
          </>
        ) : (
          <form onSubmit={handleManualAdd} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                className="col-span-3 bg-background border-border"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year" className="text-right">
                Year
              </Label>
              <Input
                id="year"
                type="number"
                value={manualYear ?? ""}
                onChange={(e) => setManualYear(Number(e.target.value))}
                className="col-span-3 bg-background border-border"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="poster" className="text-right">
                Poster URL
              </Label>
              <Input
                id="poster"
                type="url"
                value={manualPoster}
                onChange={(e) => setManualPoster(e.target.value)}
                className="col-span-3 bg-background border-border"
                placeholder="Optional"
              />
            </div>
            <Button type="submit" className="w-full mt-4 bg-primary text-primary-foreground hover:bg-muted transition-colors duration-200">
              Add Movie
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};