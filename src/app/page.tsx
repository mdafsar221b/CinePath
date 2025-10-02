// src/app/page.tsx


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
import { Card } from "@/components/ui/card"; // ADDED
import { Badge } from "@/components/ui/badge"; // ADDED
import Image from "next/image"; // ADDED


import { SearchResult } from "@/lib/types"; 

// NEW: Component to showcase app features when logged out
const LoggedOutFeatureShowcase = () => (
    <div className="container mx-auto px-4 md:px-8 py-16 space-y-20">
        <h2 className="text-3xl md:text-5xl font-bold text-center bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent">
            Your Cinema Journey, Tracked.
        </h2>

        {/* Feature 1: Movie Tracking */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-4">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    Movies Watched
                </Badge>
                <h3 className="text-2xl md:text-4xl font-bold">
                    Log Your Movie History
                </h3>
                <p className="text-lg text-muted-foreground">
                    Easily search for any film from the IMDb database and log it with the year, rating, and your personal notes. Never forget what you've seen.
                </p>
            </div>
            <Card className="order-1 md:order-2 overflow-hidden border-border/50 shadow-2xl">
                <Image
                    src="/Screenshot 2025-10-01 004655.png" // Desktop Movie List
                    alt="Movie tracking screenshot"
                    width={800}
                    height={500}
                    className="object-cover w-full h-auto"
                />
            </Card>
        </div>

        {/* Feature 2: TV Show Tracking */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card className="overflow-hidden border-border/50 shadow-2xl">
                <Image
                    src="/Screenshot 2025-10-01 004817.png" // Desktop TV Show List
                    alt="TV show tracking screenshot"
                    width={800}
                    height={500}
                    className="object-cover w-full h-auto"
                />
            </Card>
            <div className="space-y-4">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    TV Show Progress
                </Badge>
                <h3 className="text-2xl md:text-4xl font-bold">
                    Track Season & Episode Progress
                </h3>
                <p className="text-lg text-muted-foreground">
                    CinePath automatically fetches the entire series structure. Mark episodes as watched, track seasons, and mark your favorite episodes.
                </p>
            </div>
        </div>
        
        {/* Feature 3: Statistics Dashboard */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Insights
                </Badge>
                <h3 className="text-2xl md:text-4xl font-bold">
                    Analyze Your Viewing Habits
                </h3>
                <p className="text-lg text-muted-foreground">
                    Get a clear dashboard showing your total movies watched, episodes tracked, and yearly progress. Understand your history at a glance.
                </p>
            </div>
            <Card className="order-1 md:order-2 overflow-hidden border-border/50 shadow-2xl">
                <Image
                    src="/Screenshot 2025-10-01 004837.png" // Desktop Dashboard Stats
                    alt="Dashboard statistics screenshot"
                    width={800}
                    height={500}
                    className="object-cover w-full h-auto"
                />
            </Card>
        </div>
        
    </div>
);


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
        
        totalFilteredMovies,
        totalFilteredTVShows,
        itemsPerPage,
        moviesPage,
        setMoviesPage,
        tvShowsPage,
        setTvShowsPage,
        
        totalEpisodesWatched, 
        totalTVShowsTracked, 
        totalSeasonsTracked, 
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
                    // Updated prop signature for handleAddTVShow
                    onAddTVShow={(id, title, poster_path) => handleAddTVShow(id, title, poster_path)}
                    onSelectContent={handleSelectContent}
                    onAddToWatchlist={handleAddToWatchlistAndFeedback}
                    isLoggedIn={isLoggedIn}
                />

                <div className="container mx-auto px-4 md:px-8">
                    {/* NEW: Show Feature Showcase when logged out */}
                    {!isLoggedIn && !isLoadingSession && (
                        <LoggedOutFeatureShowcase />
                    )}

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
                                currentPage={moviesPage}
                                totalItems={totalFilteredMovies}
                                itemsPerPage={itemsPerPage}
                                onSetPage={setMoviesPage}
                                onAddMovie={handleAddMovie}
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
                                currentPage={tvShowsPage}
                                totalItems={totalFilteredTVShows}
                                itemsPerPage={itemsPerPage}
                                onSetPage={setTvShowsPage}
                               
                                onAddTVShow={(id, title, poster_path) => handleAddTVShow(id, title, poster_path)}
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