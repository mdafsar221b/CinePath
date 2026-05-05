"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useCinePath } from "@/hooks/useCinePath";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrendingSection } from "@/components/sections/TrendingSection";
import { CinematicShowcaseSection } from "@/components/sections/CinematicShowcaseSection";
import { LoggedOutFeatureShowcase } from "@/components/sections/LoggedOutFeatureShowcase";
import { DetailsDialog } from "@/components/modals/DetailsDialog";
import { TmdbDetailsDialog } from "@/components/modals/TmdbDetailsDialog";
import { EditMovieDialog } from "@/components/modals/EditMovieDialog";
import { EditTVShowDialog } from "@/components/modals/EditTVShowDialog";
import { StatsDashboardDialog } from "@/components/modals/StatsDashboardDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchResult } from "@/lib/types";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const {
    movies,
    tvShows,
    watchlist,
    detailsOpen,
    tmdbDetailsOpen,
    editMovieOpen,
    editTVShowOpen,
    selectedContent,
    selectedTmdbContent,
    movieToEdit,
    tvShowToEdit,
    setDetailsOpen,
    setTmdbDetailsOpen,
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
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingToWatchlist, setAddingToWatchlist] = useState<string | null>(null);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/search/all?query=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error("Failed to search");

      const data = await response.json();
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
      tvShows={tvShows}
      watchlist={watchlist}
      totalEpisodesWatched={totalEpisodesWatched}
      totalTVShowsTracked={totalTVShowsTracked}
      totalSeasonsTracked={totalSeasonsTracked}
    />
  ) : null;

  useEffect(() => {
    if (!isLoadingSession && isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [isLoadingSession, isLoggedIn, router]);

  if (isLoadingSession || isLoggedIn) {
    return (
      <>
        <Header dashboardButton={dashboardStatsButton} />
        <main className="landing-background min-h-screen" />
      </>
    );
  }

  return (
    <>
      <Header dashboardButton={dashboardStatsButton} />
      <main className="landing-background min-h-screen">
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
          {!isLoadingSession ? <CinematicShowcaseSection /> : null}

          {isLoggedIn && !isLoadingSession ? (
            <div className="pb-4">
              <Card className="section-shell">
                <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">Personal hub</p>
                    <h2 className="font-display text-5xl text-primary sm:text-6xl">Jump Back Into Your Library</h2>
                    <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                      Your watchlist, watched films, and TV progress are all ready inside the dashboard with the new poster-first layout.
                    </p>
                  </div>
                  <Button asChild size="lg">
                    <Link href="/dashboard">
                      Go to My Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          ) : null}

          {!isLoadingSession ? (
            <TrendingSection
              onSelectContent={handleSelectContent}
              onAddToWatchlist={handleAddToWatchlistAndFeedback}
              addingToWatchlist={addingToWatchlist}
              isLoggedIn={isLoggedIn}
            />
          ) : null}

          {!isLoggedIn && !isLoadingSession ? (
            <div className="pb-20 pt-4">
              <LoggedOutFeatureShowcase />
            </div>
          ) : null}
        </div>

        <DetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} content={selectedContent} />
        <TmdbDetailsDialog open={tmdbDetailsOpen} onOpenChange={setTmdbDetailsOpen} content={selectedTmdbContent} />
        <EditMovieDialog open={editMovieOpen} onOpenChange={setEditMovieOpen} movie={movieToEdit} onEditMovie={handleUpdateMovie} />
        <EditTVShowDialog open={editTVShowOpen} onOpenChange={setEditTVShowOpen} show={tvShowToEdit} onEditTVShow={handleUpdateTVShow} />
      </main>
    </>
  );
};

export default HomePage;
