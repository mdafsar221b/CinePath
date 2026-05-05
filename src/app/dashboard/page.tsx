"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCinePath } from "@/hooks/useCinePath";
import { Header } from "@/components/layout/Header";
import { AuditCommandCenter } from "@/components/sections/AuditCommandCenter";
import { ViewingAnalyticsSection } from "@/components/sections/ViewingAnalyticsSection";
import { WatchlistSection } from "@/components/sections/WatchlistSection";
import { MovieSection } from "@/components/sections/MovieSection";
import { TVShowSection } from "@/components/sections/TVShowSection";
import { DetailsDialog } from "@/components/modals/DetailsDialog";
import { EditMovieDialog } from "@/components/modals/EditMovieDialog";
import { EditTVShowDialog } from "@/components/modals/EditTVShowDialog";
import { StatsDashboardDialog } from "@/components/modals/StatsDashboardDialog";

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
      tvShows={tvShows}
      watchlist={watchlist}
      totalEpisodesWatched={totalEpisodesWatched}
      totalTVShowsTracked={totalTVShowsTracked}
      totalSeasonsTracked={totalSeasonsTracked}
    />
  ) : null;

  const isInitialDataLoading = isLoggedIn && movies.length === 0 && tvShows.length === 0 && watchlist.length === 0;
  const isSectionLoading = isLoadingSession || isInitialDataLoading;

  if (isLoadingSession || !isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <Header dashboardButton={dashboardStatsButton} />
        <div className="flex flex-grow items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 mt-4 text-muted-foreground">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header dashboardButton={dashboardStatsButton} />
      <main className="landing-background min-h-screen">
        <div className="container mx-auto px-4 pb-20 pt-10 md:px-8 md:pt-14">
          <AuditCommandCenter
            movies={movies}
            tvShows={tvShows}
            watchlist={watchlist}
            totalEpisodesWatched={totalEpisodesWatched}
            totalSeasonsTracked={totalSeasonsTracked}
            totalTVShowsTracked={totalTVShowsTracked}
            onAddMovie={handleAddMovie}
            onAddTVShow={handleAddTVShow}
            statsButton={dashboardStatsButton}
          />

          <ViewingAnalyticsSection movies={movies} tvShows={tvShows} watchlist={watchlist} />

          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Discovery
            </Link>
          </div>

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

        <DetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} content={selectedContent} />
        <EditMovieDialog open={editMovieOpen} onOpenChange={setEditMovieOpen} movie={movieToEdit} onEditMovie={handleUpdateMovie} />
        <EditTVShowDialog open={editTVShowOpen} onOpenChange={setEditTVShowOpen} show={tvShowToEdit} onEditTVShow={handleUpdateTVShow} />
      </main>
    </>
  );
};

export default DashboardPage;
