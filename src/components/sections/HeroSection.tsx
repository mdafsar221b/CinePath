
"use client";

import { motion } from "framer-motion";
import { SearchInput } from "@/components/core/SearchInput";
import { AddMovieDialog } from "@/components/modals/AddMovieDialog";
import { AddTVShowDialog } from "@/components/modals/AddTVShowDialog";
import { DetailedContent, Movie, TVShow, WatchlistItem } from "@/lib/types";
import { Eye, Plus } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

interface HeroSectionProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setSearchResults: (value: SearchResult[]) => void; 
  searchResults: SearchResult[];
  loading: boolean;
  addingToWatchlist: string | null;
  onSearchSubmit: (e: React.FormEvent) => void;
  onAddMovie: (movie: any) => void;
  onAddTVShow: (title: string, poster_path: string | null, seasonsWatched: any[]) => void;
  onSelectContent: (result: SearchResult) => void;
  onAddToWatchlist: (item: SearchResult) => Promise<void>;
  isLoggedIn: boolean; 
  loginPrompt: React.ReactNode;
}

export const HeroSection = ({
  searchTerm,
  setSearchTerm,
  setSearchResults, 
  searchResults,
  loading,
  addingToWatchlist,
  onSearchSubmit,
  onAddMovie,
  onAddTVShow,
  onSelectContent,
  onAddToWatchlist,
  isLoggedIn, 
  loginPrompt,
}: HeroSectionProps) => {

  const handleClearResults = () => {
    setSearchTerm("");
    setSearchResults([]); 

  const handleAddToWatchlistAndFeedback = async (result: SearchResult) => {
    try {
      await onAddToWatchlist(result);
    } finally {
      handleClearResults(); 
    }
  };

  const handleSelectContentAndClear = (result: SearchResult) => {
    onSelectContent(result);
    handleClearResults(); 
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <motion.section 
          className="text-center w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
      >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
              Your Personal Cinema Journey
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Track movies, discover shows, and curate your perfect watchlist
          </p>
      </motion.section>
      <motion.div 
          className="w-full max-w-2xl mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
      >
        {isLoggedIn ? ( 
          <>
            <SearchInput
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearchSubmit={onSearchSubmit}
                onClear={handleClearResults}
                loading={loading}
            />
            {searchResults.length > 0 && (
              <div className="mt-6 glass-card rounded-2xl p-6 max-h-[500px] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Search Results</h3>
                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="bg-card rounded-xl p-4 hover:bg-muted/10 transition-colors duration-300 flex items-center gap-4"
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
                          onClick={() => handleSelectContentAndClear(result)}
                          variant="outline"
                          size="sm"
                          className="glass-card hover:bg-muted/20 transition-colors duration-300 rounded-lg"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                        <Button
                          onClick={() => handleAddToWatchlistAndFeedback(result)}
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
                
                <div className="mt-6 pt-4 border-t border-border/50">
                    <Button 
                        onClick={handleClearResults} 
                        variant="outline" 
                        className="w-full glass-card rounded-xl"
                    >
                        Close Results
                    </Button>
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                <AddMovieDialog onAddMovie={onAddMovie} />
                <AddTVShowDialog onAddTVShow={onAddTVShow} />
            </div>
          </>
        ) : (
            loginPrompt
        )}
      </motion.div>
    </div>
  );
};