"use client";

import { useEffect, useState } from "react";
import { Movie, TVShow, WatchedSeason, NewMovie } from "@/lib/types";
import { AddMovieDialog } from "@/components/modals/AddMovieDialog";
import { StatCard } from "@/components/core/StatCard";
import { AddTVShowDialog } from "@/components/modals/AddTVShowDialog";
import { MovieCard } from "@/components/core/MovieCard";
import { TVShowCard } from "@/components/core/TVShowCard";
import { Badge } from "@/components/ui/badge";

const HomePage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [tvShows, setTVShows] = useState<TVShow[]>([]);

    const fetchMovies = async () => {
        try {
            const res = await fetch("/api/movies");
            if (!res.ok) {
                throw new Error("Failed to fetch movies");
            }
            const data = await res.json();
            setMovies(data);
            console.log("Fetched Movies:", data);
        } catch (e) {
            console.error("Error fetching movies:", e);
        }
    };

    const fetchTVShows = async () => {
        try {
            const res = await fetch("/api/tv-shows");
            if (!res.ok) {
                throw new Error("Failed to fetch TV shows");
            }
            const data = await res.json();
            setTVShows(data);
            console.log("Fetched TV shows:", data);
        } catch (e) {
            console.error("Error fetching TV shows:", e);
        }
    };

    useEffect(() => {
        fetchMovies();
        fetchTVShows();
    }, []);

    const handleAddMovie = async (newMovie: NewMovie) => {
        await fetch("/api/movies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMovie),
        });
        fetchMovies();
    };

    const handleRemoveMovie = async (_id: string) => {
        await fetch(`/api/movies?id=${_id}`, { method: "DELETE" });
        fetchMovies();
    };

    const handleAddTVShow = async (title: string, poster_path: string | null, newSeason: WatchedSeason) => {
        const body = {
            title,
            poster_path,
            seasonsWatched: [newSeason],
        };
        await fetch("/api/tv-shows", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        fetchTVShows();
    };

    const handleRemoveTVShow = async (_id: string) => {
        await fetch(`/api/tv-shows?id=${_id}`, { method: "DELETE" });
        fetchTVShows();
    };

    const moviesWatchedCount = movies.length;
    const tvShowsWatchedCount = tvShows.length;
    const seasonsWatchedCount = tvShows.reduce((acc, show) => acc + (show.seasonsWatched?.length || 0), 0);
    const episodesWatchedCount = tvShows.reduce((acc, show) => acc + (show.seasonsWatched?.reduce((sum, season) => sum + (season.episodes || 0), 0) || 0), 0);

    const moviesByYear = movies.reduce((acc, movie) => {
        const year = movie.year?.toString() || 'Unknown';
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
                        movies.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()).map((movie: any) => (
                            <MovieCard key={movie._id.toString()} movie={movie as Movie} onRemove={handleRemoveMovie} />
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
                        tvShows.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()).map((show: any) => (
                            <TVShowCard key={show._id.toString()} show={show as TVShow} onRemove={handleRemoveTVShow} />
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