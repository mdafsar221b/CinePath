// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Movie, TVShow, WatchedSeason, NewMovie, DetailedContent } from "@/lib/types";
import { AddMovieDialog } from "@/components/modals/AddMovieDialog";
import { StatCard } from "@/components/core/StatCard";
import { AddTVShowDialog } from "@/components/modals/AddTVShowDialog";
import { MovieCard } from "@/components/core/MovieCard";
import { TVShowCard } from "@/components/core/TVShowCard";
import { DetailsDialog } from "@/components/modals/DetailsDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const HomePage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [tvShows, setTVShows] = useState<TVShow[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [filteredTVShows, setFilteredTVShows] = useState<TVShow[]>([]);
    const [movieGenreFilter, setMovieGenreFilter] = useState<string>("all");
    const [tvGenreFilter, setTvGenreFilter] = useState<string>("all");
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedContent, setSelectedContent] = useState<DetailedContent | null>(null);

    const fetchMovies = async () => {
        try {
            const res = await fetch("/api/movies");
            if (!res.ok) {
                throw new Error("Failed to fetch movies");
            }
            const data = await res.json();
            setMovies(data);
            setFilteredMovies(data);
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
            setFilteredTVShows(data);
        } catch (e) {
            console.error("Error fetching TV shows:", e);
        }
    };

    useEffect(() => {
        fetchMovies();
        fetchTVShows();
    }, []);

    useEffect(() => {
        if (movieGenreFilter === "all") {
            setFilteredMovies(movies);
        } else {
            setFilteredMovies(movies.filter(movie => 
                movie.genre && movie.genre.toLowerCase().includes(movieGenreFilter.toLowerCase())
            ));
        }
    }, [movies, movieGenreFilter]);

    useEffect(() => {
        if (tvGenreFilter === "all") {
            setFilteredTVShows(tvShows);
        } else {
            setFilteredTVShows(tvShows.filter(show => 
                show.genre && show.genre.toLowerCase().includes(tvGenreFilter.toLowerCase())
            ));
        }
    }, [tvShows, tvGenreFilter]);

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

    const handleShowMovieDetails = async (movie: Movie) => {
        if (movie.genre && movie.plot) {
            const detailedContent: DetailedContent = {
                id: movie.id || movie._id,
                title: movie.title,
                year: movie.year.toString(),
                poster_path: movie.poster_path || null,
                genre: movie.genre,
                plot: movie.plot,
                rating: movie.rating || "N/A",
                actors: movie.actors || "N/A",
                director: movie.director || "N/A",
                imdbRating: movie.imdbRating || "N/A",
                type: 'movie'
            };
            setSelectedContent(detailedContent);
            setDetailsOpen(true);
        }
    };

    const handleShowTVDetails = async (show: TVShow) => {
        if (show.genre && show.plot) {
            const detailedContent: DetailedContent = {
                id: show.id || show._id,
                title: show.title,
                year: new Date(show.addedAt).getFullYear().toString(),
                poster_path: show.poster_path || null,
                genre: show.genre,
                plot: show.plot,
                rating: show.rating || "N/A",
                actors: show.actors || "N/A",
                imdbRating: show.imdbRating || "N/A",
                type: 'tv'
            };
            setSelectedContent(detailedContent);
            setDetailsOpen(true);
        }
    };

    const moviesWatchedCount = movies.length;
    const tvShowsWatchedCount = tvShows.length;
    const seasonsWatchedCount = tvShows.reduce((acc, show) => acc + (show.seasonsWatched?.length || 0), 0);
    const episodesWatchedCount = tvShows.reduce((acc, show) => acc + (show.seasonsWatched?.reduce((sum, season) => sum + (season.episodes || 0), 0) || 0), 0);

    const moviesByYear = movies.reduce((acc, movie) => {
        const year = new Date(movie.addedAt).getFullYear().toString();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const movieGenres = Array.from(new Set(
        movies.flatMap(movie => 
            movie.genre ? movie.genre.split(', ').map(g => g.trim()) : []
        )
    )).sort();

    const tvGenres = Array.from(new Set(
        tvShows.flatMap(show => 
            show.genre ? show.genre.split(', ').map(g => g.trim()) : []
        )
    )).sort();

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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <h2 className="text-2xl font-light">Movies Watched</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Filter by genre:</span>
                        <Select value={movieGenreFilter} onValueChange={setMovieGenreFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All genres" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All genres</SelectItem>
                                {movieGenres.map(genre => (
                                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {movieGenreFilter !== "all" && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setMovieGenreFilter("all")}
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                </div>
                <div className="grid gap-2">
                    {filteredMovies.length > 0 ? (
                        filteredMovies.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()).map((movie: any) => (
                            <MovieCard 
                                key={movie._id.toString()} 
                                movie={movie as Movie} 
                                onRemove={handleRemoveMovie}
                                onShowDetails={handleShowMovieDetails}
                            />
                        ))
                    ) : movieGenreFilter !== "all" ? (
                        <p className="text-muted-foreground text-sm">No movies found for the selected genre.</p>
                    ) : (
                        <p className="text-muted-foreground text-sm">No movies added yet. Add one to get started!</p>
                    )}
                </div>
            </section>

            <section className="mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <h2 className="text-2xl font-light">TV Shows Watched</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Filter by genre:</span>
                        <Select value={tvGenreFilter} onValueChange={setTvGenreFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All genres" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All genres</SelectItem>
                                {tvGenres.map(genre => (
                                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {tvGenreFilter !== "all" && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setTvGenreFilter("all")}
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                </div>
                <div className="grid gap-2">
                    {filteredTVShows.length > 0 ? (
                        filteredTVShows.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()).map((show: any) => (
                            <TVShowCard 
                                key={show._id.toString()} 
                                show={show as TVShow} 
                                onRemove={handleRemoveTVShow}
                                onShowDetails={handleShowTVDetails}
                            />
                        ))
                    ) : tvGenreFilter !== "all" ? (
                        <p className="text-muted-foreground text-sm">No TV shows found for the selected genre.</p>
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

            <DetailsDialog 
                open={detailsOpen} 
                onOpenChange={setDetailsOpen} 
                content={selectedContent} 
            />
        </main>
    );
};

export default HomePage;