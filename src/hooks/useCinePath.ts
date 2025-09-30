// mdafsar221b/cinepath/CinePath-8b5b9760d0bd1328fe99387f613f7cf7af56ed45/src/hooks/useCinePath.ts

"use client";

import { useEffect, useState } from "react";
import { Movie, TVShow, WatchedSeason, NewMovie, DetailedContent, WatchlistItem, SortOption, SearchResult } from "@/lib/types";
import { sortContent } from "@/lib/utils";
import { useSession } from "next-auth/react"; 

const ITEMS_PER_PAGE = 15;

export const useCinePath = () => {
    const { data: session, status } = useSession(); 
    const isLoggedIn = status === 'authenticated';
    const isLoadingSession = status === 'loading';
    
    const [movies, setMovies] = useState<Movie[]>([]);
    const [tvShows, setTVShows] = useState<TVShow[]>([]);
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    
    const [sortedMovies, setSortedMovies] = useState<Movie[]>([]);
    const [sortedTVShows, setSortedTVShows] = useState<TVShow[]>([]);

    const [paginatedMovies, setPaginatedMovies] = useState<Movie[]>([]);
    const [paginatedTVShows, setPaginatedTVShows] = useState<TVShow[]>([]);
    
    const [moviesPage, setMoviesPage] = useState<number>(1);
    const [tvShowsPage, setTvShowsPage] = useState<number>(1);

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
    }, [isLoggedIn, status]);

    // 1. Filter and Sort Movies
    useEffect(() => {
        let newSortedMovies = movieGenreFilter === "all"
            ? movies
            : movies.filter(movie =>
                movie.genre && movie.genre.toLowerCase().includes(movieGenreFilter.toLowerCase())
            );
        setSortedMovies(sortContent(newSortedMovies, movieSort));
        setMoviesPage(1);
    }, [movies, movieGenreFilter, movieSort]);
    
    // 2. Paginate Movies
    useEffect(() => {
        const startIndex = (moviesPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setPaginatedMovies(sortedMovies.slice(startIndex, endIndex));
    }, [sortedMovies, moviesPage]);

    // 1. Filter and Sort TV Shows
    useEffect(() => {
        let newSortedTVShows = tvGenreFilter === "all"
            ? tvShows
            : tvShows.filter(show =>
                show.genre && show.genre.toLowerCase().includes(tvGenreFilter.toLowerCase())
            );
        setSortedTVShows(sortContent(newSortedTVShows, tvShowSort));
        setTvShowsPage(1);
    }, [tvShows, tvGenreFilter, tvShowSort]);

    // 2. Paginate TV Shows
    useEffect(() => {
        const startIndex = (tvShowsPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setPaginatedTVShows(sortedTVShows.slice(startIndex, endIndex));
    }, [sortedTVShows, tvShowsPage]);

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

    // --- NEW HELPER FUNCTION: Fetches details from API if they are missing ---
    const fetchAndEnrichContentDetails = async (item: WatchlistItem | SearchResult) => {
        // If it already has IMDb details (like genre and plot), skip the API call
        if (item.genre && item.plot && item.imdbRating) {
            return item;
        }
        
        const type = item.type === 'movie' ? 'movie' : 'series';

        try {
            const detailsRes = await fetch(`/api/details?id=${item.id}&type=${type}`);
            if (detailsRes.ok) {
                const details = await detailsRes.json();
                // Merge the new details while preserving the core data
                return {
                    ...item,
                    ...details,
                    id: item.id, 
                    title: item.title,
                };
            }
        } catch (error) {
            console.error(`Failed to fetch details for ${item.title}:`, error);
        }

        return item; // Return original item on failure
    };
    // ------------------------------------------------------------------------

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
        // Fetch missing details right before opening the dialog
        const enrichedItem = await fetchAndEnrichContentDetails(item);

        const detailedContent: DetailedContent = {
            id: enrichedItem.id,
            title: enrichedItem.title,
            year: parseInt(enrichedItem.year || "0") || 0,
            poster_path: enrichedItem.poster_path || null,
            genre: enrichedItem.genre || "N/A",
            plot: enrichedItem.plot || "N/A",
            rating: enrichedItem.rating || "N/A",
            actors: enrichedItem.actors || "N/A",
            director: enrichedItem.director || "N/A",
            imdbRating: enrichedItem.imdbRating || "N/A",
            type: enrichedItem.type
        };
        setSelectedContent(detailedContent);
        setDetailsOpen(true);
    };

    const handleMarkWatched = async (item: WatchlistItem) => {
        if (!isLoggedIn) return; 

        // FETCH FIX: Ensure the item has all details before marking it watched
        const enrichedItem = await fetchAndEnrichContentDetails(item);

        if (enrichedItem.type === 'movie') {
            const movieData = {
                id: enrichedItem.id,
                title: enrichedItem.title,
                year: parseInt(enrichedItem.year || "0"),
                poster_path: enrichedItem.poster_path,
                genre: enrichedItem.genre,
                plot: enrichedItem.plot,
                rating: enrichedItem.rating,
                actors: enrichedItem.actors,
                director: enrichedItem.director,
                imdbRating: enrichedItem.imdbRating,
            };
            await fetch("/api/movies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(movieData),
            });
            fetchMovies();
        } else {
            const tvShowData = {
                id: enrichedItem.id,
                title: enrichedItem.title,
                poster_path: enrichedItem.poster_path,
                genre: enrichedItem.genre,
                plot: enrichedItem.plot,
                rating: enrichedItem.rating,
                actors: enrichedItem.actors,
                imdbRating: enrichedItem.imdbRating,
                seasonsWatched: [{ season: 1, watchedEpisodes: [1] }],
            };
            await fetch("/api/tv-shows", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tvShowData),
            });
            fetchTVShows();
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
      
        // The result from global search is minimal, so we fetch details on selection
        const enrichedResult = await fetchAndEnrichContentDetails(result);

        const contentForDetails: (DetailedContent & Partial<Movie> & Partial<TVShow>) = {
            id: enrichedResult.id,
            title: enrichedResult.title,
            year: parseInt(enrichedResult.year || "0") || 0,
            poster_path: enrichedResult.poster_path || null,
            genre: enrichedResult.genre || "N/A", 
            plot: enrichedResult.plot || "N/A",
            rating: enrichedResult.rating || "N/A",
            actors: enrichedResult.actors || "N/A",
            director: (enrichedResult as any).director || "N/A",
            imdbRating: enrichedResult.imdbRating || "N/A",
            type: enrichedResult.type,
        };

        setSelectedContent(contentForDetails);
        setDetailsOpen(true);
       
    };
    

    const handleAddToWatchlist = async (item: any) => {
        if (!isLoggedIn) { 
            alert("Please log in to add items to your watchlist.");
            return;
        } 

        // FETCH FIX: Ensure the item has all details before saving to watchlist
        const enrichedItem = await fetchAndEnrichContentDetails(item);

        try {
            console.log("Adding to watchlist:", enrichedItem);
            const res = await fetch("/api/watchlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(enrichedItem),
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
        
        filteredMovies: paginatedMovies,
        filteredTVShows: paginatedTVShows,
        
        totalFilteredMovies: sortedMovies.length, 
        totalFilteredTVShows: sortedTVShows.length,
        itemsPerPage: ITEMS_PER_PAGE,
        
        moviesPage,
        setMoviesPage,
        tvShowsPage,
        setTvShowsPage,

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