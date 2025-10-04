// src/components/sections/HeroSection.tsx
"use client";

import { motion } from "framer-motion";
import { SearchInput } from "@/components/core/SearchInput";
import { LoginDialog } from "@/components/auth/LoginDialog"; 

import { DetailedContent, Movie, TVShow, WatchlistItem, SearchResult } from "@/lib/types"; 
import { Eye, Plus } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

interface HeroSectionProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setSearchResults: (value: SearchResult[]) => void; 
  searchResults: SearchResult[];
  loading: boolean;
  addingToWatchlist: number | null;
  onSearchSubmit: (e: React.FormEvent) => void;
  onAddMovie: (movie: any) => void;
  onAddTVShow: (tmdbId: number, title: string, poster_path: string | null) => void;
  onSelectContent: (result: SearchResult) => void;
  onAddToWatchlist: (item: SearchResult) => Promise<void>;
  isLoggedIn: boolean; 
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
}: HeroSectionProps) => {

  const { data: session } = useSession(); 
  
 
  const rawName = session?.user?.name || session?.user?.email || "User";
  const firstName = rawName.split(' ')[0].split('@')[0];
  
  const handleClearResults = () => {
    setSearchTerm("");
    setSearchResults([]); 
  }; 

  const handleSearch = (e: React.FormEvent) => {
    onSearchSubmit(e);
  };
  
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
  
  const loggedOutContent = (
      <div className="flex flex-col items-center justify-center pt-24 pb-32 p-4 md:p-8">
          <motion.section 
              className="text-center w-full max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
          >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
                  Your Personal Cinema Journey
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
                  Log in or sign up to save your viewing progress and curate your perfect watchlist.
              </p>
               <LoginDialog /> 
               
          </motion.section>
        
      </div>
  );
  
  const loggedInContent = (
    <div className="flex flex-col items-center justify-center min-h-[85vh] p-4 md:p-8">
        <motion.section 
            className="text-center w-full max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
           
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
                {`Welcome Back, ${firstName}`}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
                Track movies, discover shows, and curate your perfect watchlist
            </p>
        </motion.section>
        <motion.div 
            className="w-full max-w-2xl mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
        >
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
                    key={result.tmdbId}
                    className="bg-card rounded-xl p-4 hover:bg-muted/10 transition-colors duration-300 flex flex-col gap-4"
                  >
                    <div className="flex gap-4 items-start">
                      {result.poster_path ? (
                        <div className="relative w-[80px] h-[120px] flex-shrink-0">
                          <Image
                            src={result.poster_path}
                            alt={`${result.title} poster`}
                            fill
                            sizes="80px"
                            className="rounded-lg object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center rounded-lg bg-muted/20 text-center text-xs text-muted-foreground w-[80px] h-[120px] flex-shrink-0">
                          No Poster
                        </div>
                      )}
                      <div className="flex-1 min-w-0 pt-1">
                        <h4 className="font-semibold text-lg line-clamp-2 mb-2">{result.title}</h4>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
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
                          {result.imdbRating && result.imdbRating !== "N/A" && (
                            <Badge variant="outline" className="text-xs">
                              ⭐ {result.imdbRating}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full pt-4 border-t border-border/50">
                      <Button
                        onClick={() => handleSelectContentAndClear(result)}
                        variant="outline"
                        size="sm"
                        className="glass-card hover:bg-muted/20 transition-colors duration-300 rounded-lg flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                      <Button
                        onClick={() => handleAddToWatchlistAndFeedback(result)}
                        size="sm"
                        className="transition-colors duration-300 rounded-lg flex-1"
                        disabled={addingToWatchlist === result.tmdbId}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {addingToWatchlist === result.tmdbId ? "Adding..." : "Watchlist"}
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
         
        </motion.div>
    </div>
  );
  
  return isLoggedIn ? loggedInContent : loggedOutContent;
};