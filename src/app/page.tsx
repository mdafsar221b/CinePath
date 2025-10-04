// src/app/page.tsx
"use client";

import { useCinePath } from "@/hooks/useCinePath";
import { Header } from "@/components/layout/Header";
import { DetailsDialog } from "@/components/modals/DetailsDialog";
import { EditMovieDialog } from "@/components/modals/EditMovieDialog";
import { EditTVShowDialog } from "@/components/modals/EditTVShowDialog";
import { HeroSection } from "@/components/sections/HeroSection";
import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react"; 
import { StatsDashboardDialog } from "@/components/modals/StatsDashboardDialog";
import { TrendingSection } from "@/components/sections/TrendingSection";
import { LoggedOutFeatureShowcase } from "@/components/sections/LoggedOutFeatureShowcase";
import { Button } from "@/components/ui/button"; 
import Link from "next/link"; 
import { Card } from "@/components/ui/card"; 


import { SearchResult } from "@/lib/types"; 


const HomePage = () => {
    const {
        movies,
        tvShows,
        watchlist, 
        
        detailsOpen,
        editMovieOpen,
        editTVShowOpen,
        selectedContent,
        movieToEdit,
        tvShowToEdit,
        
        moviesByYear,
        
        setDetailsOpen,
        setEditMovieOpen,
        setEditTVShowOpen,
        handleAddMovie,
        handleAddTVShow,
        handleSelectContent,
        handleAddToWatchlist,
        isLoggedIn, 
        isLoadingSession, 
        
        totalEpisodesWatched, 
        totalTVShowsTracked, 
        totalSeasonsTracked, 
        
        handleUpdateMovie, 
        handleUpdateTVShow,
    } = useCinePath();
    const [searchTerm, setSearchTerm] = useState("");
   
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
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
          setSearchResults(data.all || []);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
    };
    
    const handleAddToWatchlistAndFeedback = async (item: any) => {
        setAddingToWatchlist(item.id);
        await handleAddToWatchlist(item);
        setAddingToWatchlist(null);
    };

    const dashboardStatsButton = isLoggedIn ? (
      <StatsDashboardDialog 
          movies={movies} 
          moviesByYear={moviesByYear} 
          totalEpisodesWatched={totalEpisodesWatched} 
          totalTVShowsTracked={totalTVShowsTracked} 
          totalSeasonsTracked={totalSeasonsTracked}
      />
    ) : null;
    
    const isInitialDataLoading = isLoggedIn && (movies.length === 0 && tvShows.length === 0 && watchlist.length === 0);
    const isSectionLoading = isLoadingSession || isInitialDataLoading;


    return (
        <>
            <Header dashboardButton={dashboardStatsButton} />
            <main className="min-h-screen landing-background">
                <HeroSection
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    setSearchResults={setSearchResults} 
                    searchResults={searchResults}
                    loading={loading}
                    addingToWatchlist={addingToWatchlist}
                    onSearchSubmit={handleSearch}
                    onAddMovie={handleAddMovie}
                    onAddTVShow={handleAddTVShow}
                    onSelectContent={handleSelectContent}
                    onAddToWatchlist={handleAddToWatchlistAndFeedback}
                    isLoggedIn={isLoggedIn}
                />

                <div className="container mx-auto px-4 md:px-8">
                    
                    {isLoggedIn && !isLoadingSession && (
                        <div className="text-center pt-10 pb-16">
                            <Card className="glass-card border-primary/20 bg-primary/5 p-6 md:p-10 max-w-2xl mx-auto">
                                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                                    Continue Your Journey
                                </h2>
                                <p className="text-lg text-muted-foreground mb-6">
                                    Jump back into your Watchlist and manage all your tracked movies and shows.
                                </p>
                                <Button asChild>
                                    <Link href="/dashboard">
                                        Go to My Dashboard
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            </Card>
                        </div>
                    )}

                    {!isLoadingSession ? (
                        <TrendingSection 
                            onSelectContent={handleSelectContent}
                            onAddToWatchlist={handleAddToWatchlistAndFeedback}
                            addingToWatchlist={addingToWatchlist}
                            isLoggedIn={isLoggedIn}
                        />
                    ) : null}


                    {!isLoggedIn && !isLoadingSession && (
                        <div className="pt-16">
                            <hr className="mb-16 h-px border-0 bg-gradient-to-r from-transparent via-border to-transparent" /> 
                            <LoggedOutFeatureShowcase />
                        </div>
                    )}

                    
                </div>
                <DetailsDialog
                    open={detailsOpen}
                    onOpenChange={setDetailsOpen}
                    content={selectedContent}
                />
                <EditMovieDialog
                    open={editMovieOpen}
                    onOpenChange={setEditMovieOpen}
                    movie={movieToEdit}
                    onEditMovie={handleUpdateMovie}
                />
                <EditTVShowDialog
                    open={editTVShowOpen}
                    onOpenChange={setEditTVShowOpen}
                    show={tvShowToEdit}
                    onEditTVShow={handleUpdateTVShow}
                />
            </main>
        </>
    );
};

export default HomePage;