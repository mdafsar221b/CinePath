
"use client";

import { useCinePath } from "@/hooks/useCinePath";
import { Header } from "@/components/layout/Header";
import { DetailsDialog } from "@/components/modals/DetailsDialog";
import { EditMovieDialog } from "@/components/modals/EditMovieDialog";
import { EditTVShowDialog } from "@/components/modals/EditTVShowDialog";
import { WatchlistSection } from "@/components/sections/WatchlistSection";
import { MovieSection } from "@/components/sections/MovieSection";
import { TVShowSection } from "@/components/sections/TVShowSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { useState } from "react";
import { Loader2 } from "lucide-react"; 
import { StatsDashboardDialog } from "@/components/modals/StatsDashboardDialog";

import { SearchResult } from "@/lib/types"; 

const HomePage = () => {
    const {
        movies,
        tvShows,
        watchlist,
        filteredMovies,
        filteredTVShows,
        movieGenreFilter,
        tvGenreFilter,
        movieSort,
        tvShowSort,
        detailsOpen,
        editMovieOpen,
        editTVShowOpen,
        selectedContent,
        movieToEdit,
        tvShowToEdit,
        movieGenres,
        tvGenres,
        moviesByYear,
        setMovieGenreFilter,
        setTvGenreFilter,
        setMovieSort,
        setTvShowSort,
        setDetailsOpen,
        setEditMovieOpen,
        setEditTVShowOpen,
        handleAddMovie,
        handleRemoveMovie,
        handleEditMovie,
        handleUpdateMovie,
        handleAddTVShow,
        handleRemoveTVShow,
        handleEditTVShow,
        handleUpdateTVShow,
        handleRemoveFromWatchlist,
        handleShowMovieDetails,
        handleShowTVDetails,
        handleShowWatchlistDetails,
        handleMarkWatched,
        fetchWatchlist,
        handleSelectContent,
        handleAddToWatchlist,
        isLoggedIn, 
        isLoadingSession, 
        
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

    const loginPrompt = (
        <div className="text-center py-12 glass-card rounded-2xl shadow-2xl transition-all duration-500 w-full">
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Unlock Your Tracking Dashboard
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Please **Log In** or **Sign Up** to access your personal movie and TV show tracking dashboard and start curating your CinePath.
            </p>
        </div>
    );
  
    const dashboardStatsButton = isLoggedIn ? (
      <StatsDashboardDialog movies={movies} tvShows={tvShows} moviesByYear={moviesByYear} />
    ) : null;


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
                    loginPrompt={isLoggedIn || isLoadingSession ? null : loginPrompt}
                />

                <div className="container mx-auto px-4 md:px-8">
                    {isLoadingSession ? (
                        <div className="text-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                            <p className="mt-4 text-muted-foreground">Loading user data...</p>
                        </div>
                    ) : isLoggedIn ? (
                        <div className="smooth-fade">
                             <hr className="my-16 h-px border-0 bg-gradient-to-r from-transparent via-border to-transparent" /> 
                            
                            <WatchlistSection
                                watchlist={watchlist}
                                onRemove={handleRemoveFromWatchlist}
                                onShowDetails={handleShowWatchlistDetails}
                                onMarkWatched={handleMarkWatched}
                            />
                            <MovieSection
                                filteredMovies={filteredMovies}
                                movieGenres={movieGenres}
                                movieGenreFilter={movieGenreFilter}
                                movieSort={movieSort}
                                onSetMovieGenreFilter={setMovieGenreFilter}
                                onSetMovieSort={setMovieSort}
                                onRemove={handleRemoveMovie}
                                onShowDetails={handleShowMovieDetails}
                                onEdit={handleEditMovie}
                            />
                            <TVShowSection
                                filteredTVShows={filteredTVShows}
                                tvGenres={tvGenres}
                                tvGenreFilter={tvGenreFilter}
                                tvShowSort={tvShowSort}
                                onSetTvGenreFilter={setTvGenreFilter}
                                onSetTvShowSort={setTvShowSort}
                                onRemove={handleRemoveTVShow}
                                onShowDetails={handleShowTVDetails}
                                onEdit={handleEditTVShow}
                            />
                        </div>
                    ) : null}
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