"use client";

import { useCinePath } from "@/hooks/useCinePath";
import { Header } from "@/components/layout/Header";
import { DetailsDialog } from "@/components/modals/DetailsDialog";
import { EditMovieDialog } from "@/components/modals/EditMovieDialog";
import { EditTVShowDialog } from "@/components/modals/EditTVShowDialog";
import { StatsSection } from "@/components/sections/StatsSection";
import { WatchlistSection } from "@/components/sections/WatchlistSection";
import { MovieSection } from "@/components/sections/MovieSection";
import { TVShowSection } from "@/components/sections/TVShowSection";
import { YearlyProgressSection } from "@/components/sections/YearlyProgressSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { useState } from "react";

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
    } = useCinePath();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
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

    return (
        <>
            <Header />
            <main className="min-h-screen landing-background">
                <HeroSection
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    searchResults={searchResults}
                    loading={loading}
                    addingToWatchlist={addingToWatchlist}
                    onSearchSubmit={handleSearch}
                    onAddMovie={handleAddMovie}
                    onAddTVShow={handleAddTVShow}
                    onSelectContent={handleSelectContent}
                    onAddToWatchlist={handleAddToWatchlistAndFeedback}
                />

                <div className="container mx-auto px-4 md:px-8">
                    <hr className="my-16 h-px border-0 bg-gradient-to-r from-transparent via-border to-transparent" />
                    <div className="smooth-fade">
                        <StatsSection
                            moviesWatchedCount={movies.length}
                            tvShowsWatchedCount={tvShows.length}
                            seasonsWatchedCount={tvShows.reduce((acc, show) => acc + (show.seasonsWatched?.length || 0), 0)}
                            episodesWatchedCount={tvShows.flatMap(show => show.seasonsWatched ?? []).reduce((acc, season) => acc + (season.watchedEpisodes?.length || 0), 0)}
                        />
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
                        <YearlyProgressSection moviesByYear={moviesByYear} />
                    </div>
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