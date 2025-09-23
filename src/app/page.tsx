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
import { AddMovieDialog } from "@/components/modals/AddMovieDialog";
import { AddTVShowDialog } from "@/components/modals/AddTVShowDialog";

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
    } = useCinePath();

    return (
        <>
            <Header onWatchlistUpdate={fetchWatchlist} />
            <main className="container mx-auto px-4 md:px-8 min-h-screen">
                <div className="smooth-fade">
                    <section className="text-center py-16">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
                            Your Personal Cinema Journey
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                            Track movies, discover shows, and curate your perfect watchlist
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <AddMovieDialog onAddMovie={handleAddMovie} />
                            <AddTVShowDialog onAddTVShow={handleAddTVShow} />
                        </div>
                    </section>
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