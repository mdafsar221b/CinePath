// src/app/dashboard/page.tsx
"use client";

import { useCinePath } from "@/hooks/useCinePath";
import { Header } from "@/components/layout/Header";
import { DetailsDialog } from "@/components/modals/DetailsDialog";
import { EditMovieDialog } from "@/components/modals/EditMovieDialog";
import { EditTVShowDialog } from "@/components/modals/EditTVShowDialog";
import { WatchlistSection } from "@/components/sections/WatchlistSection";
import { MovieSection } from "@/components/sections/MovieSection";
import { TVShowSection } from "@/components/sections/TVShowSection";
import { StatsDashboardDialog } from "@/components/modals/StatsDashboardDialog";
import { Loader2, ArrowLeft } from "lucide-react"; 
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const DashboardPage = () => {
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

    const router = useRouter();

    useEffect(() => {
        if (!isLoadingSession && !isLoggedIn) {
            router.replace("/");
        }
    }, [isLoadingSession, isLoggedIn, router]);

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

    if (isLoadingSession || !isLoggedIn) {
        return (
             <div className="flex flex-col min-h-screen items-center justify-center bg-background text-foreground">
                <Header dashboardButton={dashboardStatsButton} />
                <div className="flex-grow flex items-center justify-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground ml-4">Loading user content...</p>
                </div>
            </div>
        );
    }


    return (
        <>
            <Header dashboardButton={dashboardStatsButton} />
            <main className="min-h-screen landing-background">
                <div className="container mx-auto px-4 md:px-8 pt-16">
                    
                    {/* UI/Layout Enhancements: Back Button and Title */}
                    <div className="flex flex-col mb-10">
                        <Link href="/" passHref>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-sm font-medium text-primary hover:bg-primary/10 transition-colors duration-200 p-0 h-auto"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Discovery
                            </Button>
                        </Link>
                        
                        <h1 className="text-4xl md:text-5xl font-bold mt-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                            My Content Dashboard
                        </h1>
                    </div>
                    
                    <div className="smooth-fade">
                        <WatchlistSection
                            watchlist={watchlist}
                            onRemove={handleRemoveFromWatchlist}
                            onShowDetails={handleShowWatchlistDetails}
                            onMarkWatched={handleMarkWatched}
                            isLoading={isSectionLoading}
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
                            isLoading={isSectionLoading}
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
                            onAddTVShow={handleAddTVShow}
                            isLoading={isSectionLoading}
                        />
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

export default DashboardPage;