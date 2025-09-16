
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, Plus, Eye } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  id: string;
  title: string;
  year: string;
  poster_path: string | null;
  type: 'movie' | 'tv';
  genre?: string;
  plot?: string;
  rating?: string;
  actors?: string;
  director?: string;
  imdbRating?: string;
}

interface GlobalSearchDialogProps {
  onSelectContent: (id: string, type: 'movie' | 'tv') => void;
  onAddToWatchlist: (item: SearchResult) => void;
}

export const GlobalSearchDialog = ({ onSelectContent, onAddToWatchlist }: GlobalSearchDialogProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingToWatchlist, setAddingToWatchlist] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/search/all?query=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) throw new Error("Failed to search");
      
      const data = await res.json();
      setResults(data.all || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectContent = (result: SearchResult) => {
    onSelectContent(result.id, result.type);
    setOpen(false);
    setSearchTerm("");
    setResults([]);
  };

  const handleAddToWatchlist = async (result: SearchResult) => {
    setAddingToWatchlist(result.id);
    try {
      // First get detailed info
      const detailsRes = await fetch(`/api/details?id=${result.id}&type=${result.type === 'tv' ? 'series' : 'movie'}`);
      let itemData: SearchResult = {
        id: result.id,
        title: result.title,
        year: result.year,
        poster_path: result.poster_path,
        type: result.type,
      };

      if (detailsRes.ok) {
        const details = await detailsRes.json();
        itemData = {
          ...itemData,
          genre: details.genre,
          plot: details.plot,
          rating: details.rating,
          actors: details.actors,
          director: details.director,
          imdbRating: details.imdbRating,
        };
      }

      await onAddToWatchlist(itemData as SearchResult);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    } finally {
      setAddingToWatchlist(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Search className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border border-border text-foreground max-w-3xl">
        <DialogHeader>
          <DialogTitle>Search Movies & TV Shows</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for movies and TV shows..."
            className="flex-1 bg-background border-border"
          />
          <Button type="submit" size="icon" disabled={loading}>
            <Search />
          </Button>
        </form>
        
        <div className="mt-4 max-h-[500px] overflow-y-auto">
          {loading ? (
            <p className="text-center text-muted-foreground">Searching...</p>
          ) : results.length > 0 ? (
            <div className="grid gap-3">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center gap-4 p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
                >
                  {result.poster_path ? (
                    <div className="relative w-[60px] h-[90px] flex-shrink-0">
                      <Image
                        src={result.poster_path}
                        alt={`${result.title} poster`}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center rounded-lg bg-muted-foreground/20 text-center text-[8px] text-muted-foreground w-[60px] h-[90px] flex-shrink-0">
                      Poster Not Available
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-light text-lg truncate">{result.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-muted-foreground">{result.year}</p>
                      <Badge variant="outline" className="text-xs">
                        {result.type === 'movie' ? 'Movie' : 'TV Show'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleSelectContent(result)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                    <Button
                      onClick={() => handleAddToWatchlist(result)}
                      variant="default"
                      size="sm"
                      className="flex items-center gap-2"
                      disabled={addingToWatchlist === result.id}
                    >
                      <Plus className="h-4 w-4" />
                      {addingToWatchlist === result.id ? "Adding..." : "Add to Watchlist"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm && !loading ? (
            <p className="text-center text-muted-foreground">No results found.</p>
          ) : (
            <p className="text-center text-muted-foreground">Start typing to search.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};