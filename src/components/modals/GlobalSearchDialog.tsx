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
        <Button variant="outline" size="icon" className="glass-card hover:bg-muted/20 transition-all duration-300 hover:scale-105 rounded-xl">
          <Search className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border/50 text-foreground max-w-4xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Discover Movies & TV Shows</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSearch} className="flex gap-3">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for movies and TV shows..."
            className="flex-1 glass-card border-border/50 rounded-xl"
          />
          <Button type="submit" size="icon" disabled={loading} className="rounded-xl">
            <Search className="w-4 h-4" />
          </Button>
        </form>
        
        <div className="mt-6 max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-muted-foreground">Discovering content...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="glass-card rounded-xl p-4 hover:bg-muted/10 transition-colors duration-300 flex items-center gap-4"
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
                    <div className="flex items-center justify-center rounded-lg bg-muted/20 text-center text-xs text-muted-foreground w-[60px] h-[90px] flex-shrink-0">
                      No Poster
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-lg truncate mb-2">{result.title}</h4>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {result.year}
                      </Badge>
                      <Badge 
                        className={`text-xs ${
                          result.type === 'movie' 
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                            : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                        }`}
                      >
                        {result.type === 'movie' ? 'Movie' : 'TV Show'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleSelectContent(result)}
                      variant="outline"
                      size="sm"
                      className="glass-card hover:bg-muted/20 transition-colors duration-300 rounded-lg"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    <Button
                      onClick={() => handleAddToWatchlist(result)}
                      size="sm"
                      className="transition-colors duration-300 rounded-lg"
                      disabled={addingToWatchlist === result.id}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {addingToWatchlist === result.id ? "Adding..." : "Watchlist"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm && !loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No results found. Try a different search term.</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Start typing to discover amazing movies and TV shows.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};