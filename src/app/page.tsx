"use client";

import { useEffect, useState } from "react";
import { Movie, TVShow, WatchedSeason } from "@/lib/types";
import { getMovies, saveMovies, getTVShows, saveTVShows } from "@/lib/localStorage";
import { AddMovieDialog } from "@/components/modals/AddMovieDialog";
import { StatCard } from "@/components/core/StatCard";
import { AddTVShowDialog } from "@/components/modals/AddTVShowDialog";
import { MovieCard } from "@/components/core/MovieCard";
import { TVShowCard } from "@/components/core/TVShowCard";
import { Badge } from "@/components/ui/badge";
import { v4 as uuidv4 } from "uuid";

const HomePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);

  useEffect(() => {
    setMovies(getMovies());
    setTVShows(getTVShows());
  }, []);

  const handleAddMovie = (newMovie: Movie) => {
    const updatedMovies = [...movies, newMovie];
    setMovies(updatedMovies);
    saveMovies(updatedMovies);
  };

  const handleRemoveMovie = (id: string) => {
    const updatedMovies = movies.filter(movie => movie.id !== id);
    setMovies(updatedMovies);
    saveMovies(updatedMovies);
  };

  const handleAddTVShow = (title: string, newSeason: WatchedSeason) => {
    const existingShowIndex = tvShows.findIndex(show => show.title.toLowerCase() === title.toLowerCase());

    let updatedShows: TVShow[];

    if (existingShowIndex > -1) {
      // Find the existing show
      const existingShow = tvShows[existingShowIndex];
      // Check if the season is already in the list
      const seasonExists = existingShow.seasonsWatched.some(s => s.season === newSeason.season);

      if (seasonExists) {
        // If season exists, update episode count
        const updatedSeasons = existingShow.seasonsWatched.map(s =>
          s.season === newSeason.season
            ? { ...s, episodes: s.episodes + newSeason.episodes }
            : s
        );
        updatedShows = [...tvShows];
        updatedShows[existingShowIndex] = { ...existingShow, seasonsWatched: updatedSeasons };
      } else {
        // If season doesn't exist, add it
        const updatedSeasons = [...existingShow.seasonsWatched, newSeason];
        updatedShows = [...tvShows];
        updatedShows[existingShowIndex] = { ...existingShow, seasonsWatched: updatedSeasons };
      }
    } else {
      // If the show doesn't exist, create a new one
      const newShow: TVShow = {
        id: uuidv4(),
        title,
        seasonsWatched: [newSeason],
        addedAt: Date.now(),
      };
      updatedShows = [...tvShows, newShow];
    }

    setTVShows(updatedShows);
    saveTVShows(updatedShows);
  };

  const handleRemoveTVShow = (id: string) => {
    const updatedShows = tvShows.filter(show => show.id !== id);
    setTVShows(updatedShows);
    saveTVShows(updatedShows);
  };

  const moviesWatchedCount = movies.length;
  // Fix: Use optional chaining to safely access seasonsWatched
  const tvShowsWatchedCount = tvShows.length;
  const seasonsWatchedCount = tvShows.reduce((acc, show) => acc + (show.seasonsWatched?.length || 0), 0);
  const episodesWatchedCount = tvShows.reduce((acc, show) => acc + (show.seasonsWatched?.reduce((sum, season) => sum + season.episodes, 0) || 0), 0);

  const moviesByYear = movies.reduce((acc, movie) => {
    const year = movie.year.toString();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen font-sans antialiased text-foreground">
      <header className="flex flex-col items-start md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-light tracking-tight">
          CinePath 🎬
        </h1>
        <div className="flex gap-2">
          <AddMovieDialog onAddMovie={handleAddMovie} />
          <AddTVShowDialog onAddTVShow={handleAddTVShow} />
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Movies Watched" value={moviesWatchedCount} />
        <StatCard title="TV Shows Watched" value={tvShowsWatchedCount} />
        <StatCard title="Seasons Watched" value={seasonsWatchedCount} />
        <StatCard title="Episodes Watched" value={episodesWatchedCount} />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4">Movies Watched</h2>
        <div className="grid gap-2">
          {movies.length > 0 ? (
            movies.sort((a,b) => b.addedAt - a.addedAt).map((movie) => (
              <MovieCard key={movie.id} movie={movie} onRemove={handleRemoveMovie} />
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No movies added yet. Add one to get started!</p>
          )}
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4">TV Shows Watched</h2>
        <div className="grid gap-2">
          {tvShows.length > 0 ? (
            tvShows.sort((a,b) => b.addedAt - a.addedAt).map((show) => (
              <TVShowCard key={show.id} show={show} onRemove={handleRemoveTVShow} />
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No TV shows added yet. Add one to get started!</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-light mb-4">Yearly Movie Tracker</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(moviesByYear).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA)).map(([year, count]) => (
            <Badge key={year} className="bg-primary text-primary-foreground rounded-full px-4 py-1 font-normal text-sm">
              {year}: {count}
            </Badge>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;