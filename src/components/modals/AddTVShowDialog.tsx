// src/components/modals/AddTVShowDialog.tsx

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
import { useState } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { mapSearchResult } from "@/lib/tmdb-mapper";
import { SearchResult } from "@/lib/types";


interface AddTVShowDialogProps {
  onAddTVShow: (tmdbId: number, title: string, poster_path: string | null) => Promise<void>;
}

interface TVShowSearchResult extends SearchResult {}

export const AddTVShowDialog = ({ onAddTVShow }: AddTVShowDialogProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<TVShowSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;

    setLoading(true);
    setResults([]);
    try {
      const res = await fetch(`/api/tmdb-proxy?path=/search/tv&query=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await res.json();
      
      const mappedResults = data.results
        .map((item: any) => mapSearchResult({...item, media_type: 'tv'}))
        .filter((result: SearchResult | null) => result !== null && result.type === 'tv') as TVShowSearchResult[];
      
      setResults(mappedResults);
    } catch (e) {
      console.error("Search error:", e);
      setResults([]);
      toast.error("Failed to perform TV show search.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (show: TVShowSearchResult) => {
    setAddingId(show.tmdbId);
    try {
    
      await onAddTVShow(show.tmdbId, show.title, show.poster_path);
      
      toast.success(`${show.title} added! You can now edit it to track episodes.`);

      setOpen(false);
      setSearchTerm("");
      setResults([]);

    } catch (error) {
      console.error("Error adding TV show:", error);
      toast.error("Failed to add TV show.");
    } finally {
      setAddingId(null);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearchTerm("");
      setResults([]);
      setAddingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>

        <Button
            variant="outline"
            className="rounded-xl"
            size="icon" 
        >
            <Plus className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border/50 text-foreground max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle id="add-tv-show-title" className="text-xl font-semibold">Add TV Show</DialogTitle>
          <DialogDescription id="add-tv-show-description" className="text-muted-foreground">
            Search for a TV show to add it to your watched list.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 glass-card border-border/50 rounded-xl"
              placeholder="Search for a TV show..."
            />
            <Button type="submit" size="icon" disabled={loading} className="rounded-xl">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
        </form>
        
        <div className="mt-2 max-h-[400px] overflow-y-auto">
            {results.length > 0 ? (
              <div className="space-y-3">
                {results.map((show) => (
                  <div
                    key={show.tmdbId}
                    className="glass-card rounded-xl p-4 hover:bg-muted/10 transition-colors duration-300 flex items-center gap-4"
                  >
                    {show.poster_path ? (
                      <div className="relative w-[50px] h-[75px] flex-shrink-0">
                        <Image
                          src={show.poster_path}
                          alt={`${show.title} poster`} 
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
                    <div className="flex-1">
                      <h4 className="font-medium">{show.title}</h4>
                    </div>
                    <Button
                        onClick={() => handleAdd(show)}
                        disabled={addingId === show.tmdbId}
                        className="rounded-lg"
                    >
                        {addingId === show.tmdbId ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Add"}
                    </Button>
                  </div>
                ))}
              </div>
            ) : searchTerm && !loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No results found.</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Start typing to search for a TV show.</p>
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};