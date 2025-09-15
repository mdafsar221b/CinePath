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
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { WatchedSeason } from "@/lib/types";
import { Search } from "lucide-react";
import Image from "next/image";

interface AddTVShowDialogProps {
  onAddTVShow: (title: string, poster_path: string | null, season: WatchedSeason) => void;
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
      
      // Try to get detailed information
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
        seasonsWatched: [{ season: seasonNumber, episodes: episodeCount }],
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
      
      // Call the parent callback
      onAddTVShow(selectedShow.name, selectedShow.poster_path, { season: seasonNumber, episodes: episodeCount });
      
      // Reset form
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
        <Button variant="outline" className="text-sm font-light px-4 py-2 border-primary hover:bg-muted/50 transition-colors duration-200">
          + Add TV Show
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border border-border text-foreground max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New TV Show</DialogTitle>
          <DialogDescription>
            Search for a TV show and manually add the seasons and episodes you have watched.
          </DialogDescription>
        </DialogHeader>

        {!selectedShow ? (
          <>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-background border-border"
                placeholder="Search for a TV show..."
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
                  {results.map((show) => (
                    <div
                      key={show.id}
                      className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedShow(show)}
                    >
                      {show.poster_path ? (
                        <div className="relative w-[50px] h-[75px]">
                          <Image
                            src={show.poster_path}
                            alt={`${show.name} poster`}
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
                        <h4 className="font-light">{show.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchTerm && !loading ? (
                <p className="text-center text-muted-foreground">No results found.</p>
              ) : (
                <p className="text-center text-muted-foreground">Start typing to search for a TV show.</p>
              )}
            </div>
          </>
        ) : (
          <form onSubmit={handleAdd} className="grid gap-4 py-4">
            <div className="flex items-center gap-4 p-2">
              {selectedShow.poster_path ? (
                <div className="relative w-[75px] h-[112px]">
                  <Image
                    src={selectedShow.poster_path}
                    alt={`${selectedShow.name} poster`}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-lg bg-muted-foreground/20 text-center text-[8px] text-muted-foreground w-[75px] h-[112px]">
                  Poster Not Available
                </div>
              )}
              <h3 className="text-xl font-light">{selectedShow.name}</h3>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="season" className="text-right">
                Season
              </Label>
              <Input
                id="season"
                type="number"
                value={seasonNumber ?? ""}
                onChange={(e) => setSeasonNumber(Number(e.target.value))}
                className="col-span-3 bg-background border-border"
                min="1"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="episodes" className="text-right">
                Episodes
              </Label>
              <Input
                id="episodes"
                type="number"
                value={episodeCount ?? ""}
                onChange={(e) => setEpisodeCount(Number(e.target.value))}
                className="col-span-3 bg-background border-border"
                min="1"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full mt-4 bg-primary text-primary-foreground hover:bg-muted transition-colors duration-200"
              disabled={adding || !seasonNumber || episodeCount === null}
            >
              {adding ? "Adding..." : "Add TV Show"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};