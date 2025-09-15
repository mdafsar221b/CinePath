// src/components/modals/GlobalSearchDialog.tsx
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
import { Search } from "lucide-react";
import Image from "next/image";

interface SearchResult {
  id: string;
  title: string;
  year: string;
  poster_path: string | null;
  type: 'movie' | 'tv';
}

interface GlobalSearchDialogProps {
  onSelectContent: (id: string, type: 'movie' | 'tv') => void;
}

export const GlobalSearchDialog = ({ onSelectContent }: GlobalSearchDialogProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Search className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border border-border text-foreground max-w-2xl">
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
        
        <div className="mt-4 max-h-[400px] overflow-y-auto">
          {loading ? (
            <p className="text-center text-muted-foreground">Searching...</p>
          ) : results.length > 0 ? (
            <div className="grid gap-2">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleSelectContent(result)}
                >
                  {result.poster_path ? (
                    <div className="relative w-[50px] h-[75px]">
                      <Image
                        src={result.poster_path}
                        alt={`${result.title} poster`}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center rounded-lg bg-muted-foreground/20 text-center text-[8px] text-muted-foreground w-[50px] h-[75px]">
                      Poster Not Available
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-light">{result.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {result.year} • {result.type === 'movie' ? 'Movie' : 'TV Show'}
                    </p>
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