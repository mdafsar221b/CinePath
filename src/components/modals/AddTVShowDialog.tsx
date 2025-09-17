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
import { WatchedSeason } from "@/lib/types";
import { Search, Plus } from "lucide-react";
import Image from "next/image";

interface AddTVShowDialogProps {
  onAddTVShow: (title: string, poster_path: string | null, seasonsWatched: WatchedSeason[]) => void;
}

interface SearchResult {
  id: string;
  name: string;
  poster_path: string | null;
}

export const AddTVShowDialog = ({ onAddTVShow }: AddTVShowDialogProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedShow, setSelectedShow] = useState<SearchResult | null>(null);
  const [seasonNumber, setSeasonNumber] = useState<number | null>(null);
  const [episodeCount, setEpisodeCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;

    setLoading(true);
    setResults([]);
    setSelectedShow(null);
    try {
      const res = await fetch(`/api/search/tv-shows?query=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await res.json();
      console.log("TV Search Results:", data);
      setResults(data);
    } catch (e) {
      console.error("Search error:", e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShow || !seasonNumber || episodeCount === null) return;

    setAdding(true);
    try {
      let showDetails = null;

      try {
        const detailsRes = await fetch(`/api/details?id=${selectedShow.id}&type=series`);
        if (detailsRes.ok) {
          showDetails = await detailsRes.json();
          console.log("TV Show Details:", showDetails);
        }
      } catch (error) {
        console.log("Could not fetch details, using basic info");
      }

      const body = {
        title: selectedShow.name,
        poster_path: selectedShow.poster_path,
        seasonsWatched: [{ season: seasonNumber, watchedEpisodes: Array.from({ length: episodeCount }, (_, i) => i + 1) }],
        genre: showDetails?.genre || null,
        plot: showDetails?.plot || null,
        rating: showDetails?.rating || null,
        actors: showDetails?.actors || null,
        imdbRating: showDetails?.imdbRating || null,
      };

      console.log("Adding TV Show with data:", body);

      const response = await fetch("/api/tv-shows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to add TV show");
      }

      const result = await response.json();
      console.log("TV Show added successfully:", result);

      onAddTVShow(selectedShow.name, selectedShow.poster_path, [{ season: seasonNumber, watchedEpisodes: Array.from({ length: episodeCount }, (_, i) => i + 1) }]);

      setOpen(false);
      setSearchTerm("");
      setResults([]);
      setSelectedShow(null);
      setSeasonNumber(null);
      setEpisodeCount(null);

    } catch (error) {
      console.error("Error adding TV show:", error);
    } finally {
      setAdding(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearchTerm("");
      setResults([]);
      setSelectedShow(null);
      setSeasonNumber(null);
      setEpisodeCount(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="px-6 py-3 glass-card border-primary/30 text-foreground rounded-xl font-medium hover:bg-primary/10 transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add TV Show
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border/50 text-foreground max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add TV Show</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Search for a TV show and add the seasons you've watched.
          </DialogDescription>
        </DialogHeader>

        {!selectedShow ? (
          <>
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 glass-card border-border/50 rounded-xl"
                placeholder="Search for a TV show..."
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
                  {results.map((show) => (
                    <div
                      key={show.id}
                      className="glass-card rounded-xl p-4 hover:bg-muted/10 transition-colors duration-300 cursor-pointer flex items-center gap-4"
                      onClick={() => setSelectedShow(show)}
                    >
                      {show.poster_path ? (
                        <div className="relative w-[50px] h-[75px] flex-shrink-0">
                          <Image
                            src={show.poster_path}
                            alt={`${show.name} poster`}
                            fill
                            className="rounded-lg object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center rounded-lg bg-muted/20 text-center text-xs text-muted-foreground w-[50px] h-[75px] flex-shrink-0">
                          No Poster
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{show.name}</h4>
                      </div>
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
          </>
        ) : (
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="glass-card rounded-xl p-4 flex items-center gap-4">
              {selectedShow.poster_path ? (
                <div className="relative w-[60px] h-[90px] flex-shrink-0">
                  <Image
                    src={selectedShow.poster_path}
                    alt={`${selectedShow.name} poster`}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-lg bg-muted/20 text-center text-xs text-muted-foreground w-[60px] h-[90px] flex-shrink-0">
                  No Poster
                </div>
              )}
              <h3 className="text-lg font-semibold">{selectedShow.name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="season" className="text-sm font-medium">
                  Season *
                </Label>
                <Input
                  id="season"
                  type="number"
                  value={seasonNumber ?? ""}
                  onChange={(e) => setSeasonNumber(Number(e.target.value))}
                  className="glass-card border-border/50 rounded-xl"
                  min="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="episodes" className="text-sm font-medium">
                  Episodes *
                </Label>
                <Input
                  id="episodes"
                  type="number"
                  value={episodeCount ?? ""}
                  onChange={(e) => setEpisodeCount(Number(e.target.value))}
                  className="glass-card border-border/50 rounded-xl"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedShow(null)}
                className="flex-1 glass-card rounded-xl"
              >
                Back to Search
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-xl"
                disabled={adding || !seasonNumber || episodeCount === null}
              >
                {adding ? "Adding..." : "Add TV Show"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};