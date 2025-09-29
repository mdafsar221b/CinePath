
"use client";

import { useEffect, useState } from "react";
import { Movie, TVShow, WatchedSeason, NewMovie, DetailedContent, WatchlistItem, SortOption } from "@/lib/types";
import { sortContent } from "@/lib/utils";
import { useSession } from "next-auth/react"; 
export const useCinePath = () => {
    const { data: session, status } = useSession(); 
    const isLoggedIn = status === 'authenticated';
    const isLoadingSession = status === 'loading';
    
    const [movies, setMovies] = useState<Movie[]>([]);
    const [tvShows, setTVShows] = useState<TVShow[]>([]);
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [filteredTVShows, setFilteredTVShows] = useState<TVShow[]>([]);
    const [movieGenreFilter, setMovieGenreFilter] = useState<string>("all");
    const [tvGenreFilter, setTvGenreFilter] = useState<string>("all");
    const [movieSort, setMovieSort] = useState<SortOption>("addedAt_desc");
    const [tvShowSort, setTvShowSort] = useState<SortOption>("addedAt_desc");
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [editMovieOpen, setEditMovieOpen] = useState(false);
    const [editTVShowOpen, setEditTVShowOpen] = useState(false);
    const [selectedContent, setSelectedContent] = useState<(DetailedContent & Partial<Movie> & Partial<TVShow>) | null>(null);
    const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);
    const [tvShowToEdit, setTvShowToEdit] = useState<TVShow | null>(null);

    const fetchMovies = async () => {
        if (!isLoggedIn) {
            setMovies([]);
            return;
        }
        try {
            const res = await fetch("/api/movies");
            if (!res.ok) throw new Error("Failed to fetch movies");
            const data = await res.json();
            setMovies(data);
        } catch (e) {
            console.error("Error fetching movies:", e);
        }
    };

    const fetchTVShows = async () => {
        if (!isLoggedIn) {
            setTVShows([]);
            return;
        }
        try {
            const res = await fetch("/api/tv-shows");
            if (!res.ok) throw new Error("Failed to fetch TV shows");
            const data = await res.json();
            setTVShows(data);
        } catch (e) {
            console.error("Error fetching TV shows:", e);
        }
    };

    const fetchWatchlist = async () => {
        if (!isLoggedIn) {
            setWatchlist([]);
            return;
        }
        try {
            const res = await fetch("/api/watchlist");
            if (!res.ok) throw new Error("Failed to fetch watchlist");
            const data = await res.json();
            setWatchlist(data);
        } catch (e) {
            console.error("Error fetching watchlist:", e);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchMovies();
            fetchTVShows();
            fetchWatchlist();
        } else if (status === 'unauthenticated') {
             setMovies([]);
             setTVShows([]);
             setWatchlist([]);
        }
    }, [isLoggedIn, status]); // DEPEND ON isLoggedIn/status

    useEffect(() => {
        let newFilteredMovies = movieGenreFilter === "all"
            ? movies
            : movies.filter(movie =>
                movie.genre && movie.genre.toLowerCase().includes(movieGenreFilter.toLowerCase())
            );
        setFilteredMovies(sortContent(newFilteredMovies, movieSort));
    }, [movies, movieGenreFilter, movieSort]);

    useEffect(() => {
        let newFilteredTVShows = tvGenreFilter === "all"
            ? tvShows
            : tvShows.filter(show =>
                show.genre && show.genre.toLowerCase().includes(tvGenreFilter.toLowerCase())
            );
        setFilteredTVShows(sortContent(newFilteredTVShows, tvShowSort));
    }, [tvShows, tvGenreFilter, tvShowSort]);

    const handleAddMovie = async (newMovie: NewMovie) => {
        if (!isLoggedIn) return; 
        await fetch("/api/movies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMovie),
        });
        fetchMovies();
    };

    const handleRemoveMovie = async (_id: string) => {
        if (!isLoggedIn) return;
        await fetch(`/api/movies?id=${_id}`, { method: "DELETE" });
        fetchMovies();
    };

    const handleEditMovie = (movie: Movie) => {
        if (!isLoggedIn) return; 
        setMovieToEdit(movie);
        setEditMovieOpen(true);
    };

    const handleUpdateMovie = async () => {
        if (!isLoggedIn) return; 
        fetchMovies();
    };

    const handleAddTVShow = async (title: string, poster_path: string | null, seasonsWatched: WatchedSeason[]) => {
        if (!isLoggedIn) return; 
        await fetchTVShows();
    };

    const handleRemoveTVShow = async (_id: string) => {
        if (!isLoggedIn) return; 
        await fetch(`/api/tv-shows?id=${_id}`, { method: "DELETE" });
        fetchTVShows();
    };

    const handleEditTVShow = (show: TVShow) => {
      if (!isLoggedIn) return; 
      setTvShowToEdit(show);
      setEditTVShowOpen(true);
    };

    const handleUpdateTVShow = async () => {
        if (!isLoggedIn) return; 
        fetchTVShows();
    };

    const handleRemoveFromWatchlist = async (_id: string) => {
        if (!isLoggedIn) return; 
        try {
            await fetch(`/api/watchlist?id=${_id}`, { method: "DELETE" });
            fetchWatchlist();
        } catch (error) {
            console.error("Error removing from watchlist:", error);
        }
    };

    const handleShowMovieDetails = async (movie: Movie) => {
        const detailedContent = {
            id: movie.id || movie._id,
            title: movie.title,
            year: movie.year,
            poster_path: movie.poster_path || null,
            genre: movie.genre || "N/A",
            plot: movie.plot || "N/A",
            rating: movie.rating || "N/A",
            actors: movie.actors || "N/A",
            director: movie.director || "N/A",
            imdbRating: movie.imdbRating || "N/A",
            type: 'movie' as 'movie',
            myRating: movie.myRating,
            personalNotes: movie.personalNotes,
        };
        setSelectedContent(detailedContent);
        setDetailsOpen(true);
    };

    const handleShowTVDetails = async (show: TVShow) => {
        const detailedContent = {
            id: show.id || show._id,
            title: show.title,
            year: new Date(show.addedAt).getFullYear(),
            poster_path: show.poster_path || null,
            genre: show.genre || "N/A",
            plot: show.plot || "N/A",
            rating: show.rating || "N/A",
            actors: show.actors || "N/A",
            imdbRating: show.imdbRating || "N/A",
            type: 'tv' as 'tv',
            myRating: show.myRating,
            personalNotes: show.personalNotes,
            isFavorite: show.isFavorite,
        };
        setSelectedContent(detailedContent);
        setDetailsOpen(true);
    };

    const handleShowWatchlistDetails = async (item: WatchlistItem) => {
        const detailedContent: DetailedContent = {
            id: item.id,
            title: item.title,
            year: parseInt(item.year || "0") || 0,
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
        if (!isLoggedIn) return; // ADDED AUTH CHECK
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
    
    const movieGenres = Array.from(new Set(movies.flatMap(movie => movie.genre ? movie.genre.split(', ').map(g => g.trim()) : []))).sort();
    const tvGenres = Array.from(new Set(tvShows.flatMap(show => show.genre ? show.genre.split(', ').map(g => g.trim()) : []))).sort();
    const moviesByYear = movies.reduce((acc, movie) => {
        const year = new Date(movie.addedAt).getFullYear().toString();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    
     
    const handleSelectContent = async (result: any) => {
      
        const contentForDetails: (DetailedContent & Partial<Movie> & Partial<TVShow>) = {
            id: result.id,
            title: result.title,
            year: parseInt(result.year || "0") || 0,
            poster_path: result.poster_path || null,
            genre: result.genre || "N/A", 
            plot: result.plot || "N/A",
            rating: result.rating || "N/A",
            actors: result.actors || "N/A",
            director: result.director || "N/A",
            imdbRating: result.imdbRating || "N/A",
            type: result.type,
        };

        setSelectedContent(contentForDetails);
        setDetailsOpen(true);
       
    };
    

    const handleAddToWatchlist = async (item: any) => {
        if (!isLoggedIn) { 
            alert("Please log in to add items to your watchlist.");
            return;
        } 

        try {
            console.log("Adding to watchlist:", item);
            const res = await fetch("/api/watchlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
            const responseData = await res.json();
            console.log("Watchlist API response:", responseData);
            if (res.status === 409) {
                alert(responseData.error);
                return;
            }
            if (!res.ok) {
                console.error("Failed to add to watchlist:", responseData);
                throw new Error("Failed to add to watchlist");
            }
            alert(`${item.title} added to watchlist!`);
            fetchWatchlist();
        } catch (error) {
            console.error("Error adding to watchlist:", error);
            alert("Failed to add to watchlist");
        }
    };

    return {
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
        isLoadingSession 
    };
};