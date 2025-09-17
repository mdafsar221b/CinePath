"use client";

import { useEffect, useState } from "react";
import { Movie, TVShow, WatchedSeason, NewMovie, DetailedContent, WatchlistItem } from "@/lib/types";
import { AddMovieDialog } from "@/components/modals/AddMovieDialog";
import { StatCard } from "@/components/core/StatCard";
import { AddTVShowDialog } from "@/components/modals/AddTVShowDialog";
import { MovieCard } from "@/components/core/MovieCard";
import { TVShowCard } from "@/components/core/TVShowCard";
import { WatchlistCard } from "@/components/core/WatchlistCard";
import { DetailsDialog } from "@/components/modals/DetailsDialog";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const HomePage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [tvShows, setTVShows] = useState<TVShow[]>([]);
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
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

    const fetchWatchlist = async () => {
        try {
            console.log("Fetching watchlist...");
            const res = await fetch("/api/watchlist");
            if (!res.ok) {
                throw new Error("Failed to fetch watchlist");
            }
            const data = await res.json();
            console.log("Fetched watchlist data:", data);
            setWatchlist(data);
        } catch (e) {
            console.error("Error fetching watchlist:", e);
        }
    };

    useEffect(() => {
        fetchMovies();
        fetchTVShows();
        fetchWatchlist();
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
        console.log("handleAddTVShow called with:", { title, poster_path, newSeason });
        await fetchTVShows();
    };

    const handleRemoveTVShow = async (_id: string) => {
        await fetch(`/api/tv-shows?id=${_id}`, { method: "DELETE" });
        fetchTVShows();
    };

    const handleRemoveFromWatchlist = async (_id: string) => {
        try {
            await fetch(`/api/watchlist?id=${_id}`, { method: "DELETE" });
            fetchWatchlist();
        } catch (error) {
            console.error("Error removing from watchlist:", error);
        }
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

    const handleShowWatchlistDetails = async (item: WatchlistItem) => {
        const detailedContent: DetailedContent = {
            id: item.id,
            title: item.title,
            year: item.year || "Unknown",
            poster_path: item.poster_path || null,
            genre: item.genre || "N/A",
            plot: item.plot || "N/A",
            rating: item.rating || "N/A",
            actors: item.actors || "N/A",
            director: item.director || "N/A",
            imdbRating: item.imdbRating || "N/A",
            type: item.type
        };
        setSelectedContent(detailedContent);
        setDetailsOpen(true);
    };

    const handleMarkWatched = async (item: WatchlistItem) => {
        if (item.type === 'movie') {
            const movieData = {
                title: item.title,
                year: parseInt(item.year || "0"),
                poster_path: item.poster_path,
                genre: item.genre,
                plot: item.plot,
                rating: item.rating,
                actors: item.actors,
                director: item.director,
                imdbRating: item.imdbRating,
            };
            await fetch("/api/movies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(movieData),
            });
            fetchMovies();
        } else {
            alert("TV show functionality: Please add this manually for now by selecting season and episodes.");
        }
        
        await fetch(`/api/watchlist?id=${item._id}`, { method: "DELETE" });
        fetchWatchlist();
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

                    <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        <StatCard title="Movies Watched" value={moviesWatchedCount} />
                        <StatCard title="TV Shows Watched" value={tvShowsWatchedCount} />
                        <StatCard title="Seasons Watched" value={seasonsWatchedCount} />
                        <StatCard title="Episodes Watched" value={episodesWatchedCount} />
                    </section>

                    {watchlist.length > 0 && (
                        <section className="mb-16">
                            <h2 className="text-2xl md:text-3xl font-semibold mb-8 flex items-center gap-3">
                                Watchlist
                                <Badge variant="outline" className="ml-2 text-xs">
                                    {watchlist.length}
                                </Badge>
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {watchlist.map((item) => (
                                    <WatchlistCard 
                                        key={item._id} 
                                        item={item} 
                                        onRemove={handleRemoveFromWatchlist}
                                        onShowDetails={handleShowWatchlistDetails}
                                        onMarkWatched={handleMarkWatched}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="mb-16">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                            <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-3">
                                Movies Watched
                            </h2>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground whitespace-nowrap">Filter by genre:</span>
                                <Select value={movieGenreFilter} onValueChange={setMovieGenreFilter}>
                                    <SelectTrigger className="w-[180px] glass-card">
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
                                        className="glass-card"
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
                                <div className="text-center py-12 col-span-full glass-card rounded-2xl">
                                    <p className="text-muted-foreground">No movies found for the selected genre.</p>
                                </div>
                            ) : (
                                <div className="text-center py-12 col-span-full glass-card rounded-2xl">
                                    <p className="text-muted-foreground">No movies added yet. Add one to get started!</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="mb-16">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                            <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-3">
                                TV Shows Watched
                            </h2>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground whitespace-nowrap">Filter by genre:</span>
                                <Select value={tvGenreFilter} onValueChange={setTvGenreFilter}>
                                    <SelectTrigger className="w-[180px] glass-card">
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
                                        className="glass-card"
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
                                <div className="text-center py-12 glass-card rounded-2xl">
                                    <p className="text-muted-foreground">No TV shows found for the selected genre.</p>
                                </div>
                            ) : (
                                <div className="text-center py-12 glass-card rounded-2xl">
                                    <p className="text-muted-foreground">No TV shows added yet. Add one to get started!</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-8 flex items-center gap-3">
                            Yearly Progress
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(moviesByYear).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA)).map(([year, count]) => (
                                <Badge 
                                    key={year} 
                                    className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors px-6 py-2 text-sm font-medium cursor-default"
                                >
                                    {year}: {count}
                                </Badge>
                            ))}
                        </div>
                    </section>
                </div>

                <DetailsDialog 
                    open={detailsOpen} 
                    onOpenChange={setDetailsOpen} 
                    content={selectedContent} 
                />
            </main>
        </>
    );
};

export default HomePage;