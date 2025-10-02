// src/hooks/useCinePath.ts


"use client";

import { useEffect, useState } from "react";
import { Movie, TVShow, NewMovie, DetailedContent, WatchlistItem, SortOption, SearchResult } from "@/lib/types";
import { sortContent } from "@/lib/utils";
import { useSession } from "next-auth/react"; 
import toast from "react-hot-toast";

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
    
    // Updated type to also accommodate TVShow-specific structure data
    const [selectedContent, setSelectedContent] = useState<(DetailedContent & Partial<Movie> & Partial<TVShow> & {
        seriesStructure?: any; 
        favoriteEpisodeIds?: string[];
    }) | null>(null);
    
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
            toast.error("Failed to load movies.");
        }
    };

    // FIX: Enhanced fetchTVShows to enrich metadata if missing
    const fetchTVShows = async () => {
        if (!isLoggedIn) {
            setTVShows([]);
            return;
        }
        try {
            const res = await fetch("/api/tv-shows");
            if (!res.ok) throw new Error("Failed to fetch TV shows");
            const rawShows = await res.json() as TVShow[];
            
            // Map over shows to check and fetch missing metadata (Genre/Rating/Actors)
            const enrichedShowsPromises = rawShows.map(async (show) => {
                const isDetailsMissing = !show.genre || show.genre === 'N/A' || !show.actors || show.actors === 'N/A' || !show.imdbRating || show.imdbRating === 'N/A';
                
                if (isDetailsMissing && show.id) {
                     try {
                        const detailsRes = await fetch(`/api/details?id=${show.id}&type=series`);
                        if (detailsRes.ok) {
                            const details = await detailsRes.json();
                            return {
                                ...show,
                                ...details,
                                id: show.id, // Ensure original ID is preserved
                            } as TVShow;
                        }
                     } catch (error) {
                         // Gracefully fail enrichment, return original show
                         console.error(`Failed to enrich details for ${show.title}:`, error);
                     }
                }
                return show;
            });
            
            const enrichedShows = await Promise.all(enrichedShowsPromises);
            setTVShows(enrichedShows);

        } catch (e) {
            console.error("Error fetching TV shows:", e);
            toast.error("Failed to load TV shows.");
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
            toast.error("Failed to load watchlist.");
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
        let newSortedMovies = movies;
        
        // FIX: Correct genre filtering logic
        if (movieGenreFilter !== "all") {
            newSortedMovies = movies.filter(movie =>
                movie.genre?.toLowerCase().includes(movieGenreFilter.toLowerCase())
            );
        }
            
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
        let newSortedTVShows = tvShows;

        // FIX: Correct genre filtering logic and add "favorites" filter
        if (tvGenreFilter === "favorites") {
            newSortedTVShows = tvShows.filter(show => show.isFavorite);
        } else if (tvGenreFilter !== "all") {
            // FIX: Ensure 'show.genre' exists before calling toLowerCase
            newSortedTVShows = tvShows.filter(show =>
                show.genre?.toLowerCase().includes(tvGenreFilter.toLowerCase())
            );
        }
        
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
        try {
            await fetch("/api/movies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMovie),
            });
            toast.success(`'${newMovie.title}' added to your Movies Watched list!`);
            fetchMovies();
        } catch (error) {
            console.error("Error adding movie:", error);
            toast.error(`Failed to add '${newMovie.title}'.`);
        }
    };

    const handleRemoveMovie = async (_id: string) => {
        if (!isLoggedIn) return;
        try {
            await fetch(`/api/movies?id=${_id}`, { method: "DELETE" });
            toast.success("Movie removed.");
            fetchMovies();
        } catch (error) {
            console.error("Error removing movie:", error);
            toast.error("Failed to remove movie.");
        }
    };

    const handleEditMovie = (movie: Movie) => {
        if (!isLoggedIn) return; 
        setMovieToEdit(movie);
        setEditMovieOpen(true);
    };

    const handleUpdateMovie = async (updatedMovie?: Movie) => {
        if (!isLoggedIn) return; 
        fetchMovies();
        if (updatedMovie) {
             toast.success(`'${updatedMovie.title}' details updated.`);
        }
    };

    const handleAddTVShow = async (id: string, title: string, poster_path: string | null) => {
        if (!isLoggedIn) return; 
         // Initial add with empty watchedEpisodeIds and favoriteEpisodeIds
        const tvShowData = {
            id,
            title,
            poster_path,
            watchedEpisodeIds: [] as string[],
            favoriteEpisodeIds: [] as string[],
            totalEpisodes: 0,
        };
        const res = await fetch("/api/tv-shows", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tvShowData),
        });

        if (!res.ok) {
            console.error("Failed to add TV show:", await res.json());
        }

        fetchTVShows();
    };

    const handleRemoveTVShow = async (_id: string) => {
        if (!isLoggedIn) return; 
        try {
            await fetch(`/api/tv-shows?id=${_id}`, { method: "DELETE" });
            toast.success("TV Show removed.");
            fetchTVShows();
        } catch (error) {
            console.error("Error removing TV Show:", error);
            toast.error("Failed to remove TV show.");
        }
    };

    const handleEditTVShow = (show: TVShow) => {
      if (!isLoggedIn) return; 
      setTvShowToEdit(show);
      setEditTVShowOpen(true);
    };

    const handleUpdateTVShow = async (updatedShow?: TVShow) => {
        if (!isLoggedIn) return; 
        // If an updated show object is passed, update the local state to instantly reflect changes
        if (updatedShow) {
             setTVShows(prev => prev.map(s => s._id === updatedShow._id ? updatedShow : s));
             setTvShowToEdit(updatedShow);
             // Note: We don't toast here as the EditTVShowDialog handles its own "Save Progress" toast
        }
        // Then re-fetch all shows in the background to ensure consistency
        fetchTVShows();
    };

    const handleRemoveFromWatchlist = async (_id: string) => {
        if (!isLoggedIn) return; 
        try {
            await fetch(`/api/watchlist?id=${_id}`, { method: "DELETE" });
            toast.success("Item removed from watchlist.");
            fetchWatchlist();
        } catch (error) {
            console.error("Error removing from watchlist:", error);
            toast.error("Failed to remove item from watchlist.");
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
        // NEW: Fetch base OMDb fields if missing for details dialog (Genre, Actors, IMDb Rating)
        let enrichedShow = show;
        const isDetailsMissing = !show.genre || show.genre === 'N/A' || !show.actors || show.actors === 'N/A' || !show.imdbRating || show.imdbRating === 'N/A';
         
        if (isDetailsMissing && show.id) {
             try {
                // Fetch generic OMDb details
                const detailsRes = await fetch(`/api/details?id=${show.id}&type=series`);
                if (detailsRes.ok) {
                    const details = await detailsRes.json();
                    
                    // Merge details but prioritize existing personal data
                    enrichedShow = {
                        ...show,
                        ...details,
                        // Ensure we use the existing personal fields
                        myRating: show.myRating,
                        personalNotes: show.personalNotes,
                        isFavorite: show.isFavorite,
                        favoriteEpisodeIds: show.favoriteEpisodeIds,
                        id: show.id, 
                    };
                }
             } catch (error) {
                 console.error("Error fetching missing TV show details:", error);
             }
         }
        
        // Fetch the full series structure for displaying favorite episodes (SXXEYY)
        let seriesStructure = null;
        if (enrichedShow.id) {
            try {
                const res = await fetch(`/api/details/series/${enrichedShow.id}`);
                if (res.ok) {
                    seriesStructure = await res.json();
                }
            } catch (error) {
                console.error("Error fetching series structure for details:", error);
            }
        }
        
        // Use the fetched year if available, otherwise default to addedAt year
        const releaseYear = (enrichedShow as any).year && (enrichedShow as any).year > 0 ? (enrichedShow as any).year : new Date(enrichedShow.addedAt).getFullYear();
        
        const detailedContent = {
            id: enrichedShow.id || enrichedShow._id,
            title: enrichedShow.title,
            year: releaseYear, 
            poster_path: enrichedShow.poster_path || null,
            genre: enrichedShow.genre || "N/A",
            plot: enrichedShow.plot || "N/A",
            rating: enrichedShow.rating || "N/A",
            actors: enrichedShow.actors || "N/A",
            imdbRating: enrichedShow.imdbRating || "N/A",
            type: 'tv' as 'tv',
            myRating: enrichedShow.myRating,
            personalNotes: enrichedShow.personalNotes,
            isFavorite: enrichedShow.isFavorite,
            favoriteEpisodeIds: enrichedShow.favoriteEpisodeIds, 
            seriesStructure: seriesStructure, 
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
            director: (enrichedItem as any).director || "N/A",
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

        try {
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
                toast.success(`'${item.title}' marked as watched and added to Movies!`);
                fetchMovies();
            } else {
                 // For TV, add the series with empty watchedEpisodeIds
                const tvShowData = {
                    id: enrichedItem.id,
                    title: enrichedItem.title,
                    poster_path: enrichedItem.poster_path,
                    genre: enrichedItem.genre,
                    plot: enrichedItem.plot,
                    rating: enrichedItem.rating,
                    actors: enrichedItem.actors,
                    imdbRating: enrichedItem.imdbRating,
                    watchedEpisodeIds: [] as string[], 
                    favoriteEpisodeIds: [] as string[],
                };
                await fetch("/api/tv-shows", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(tvShowData),
                });
                toast.success(`'${item.title}' marked as watched and added to TV Shows!`);
                fetchTVShows();
            }
            await fetch(`/api/watchlist?id=${item._id}`, { method: "DELETE" });
            fetchWatchlist();
        } catch (error) {
            console.error("Error marking watched:", error);
            toast.error(`Failed to mark '${item.title}' as watched. It may already be in your watched lists.`);
        }
    };
    
    // NEW LOGIC: We include "favorites" as a pseudo-genre option
    const rawTvGenres = tvShows.flatMap(show => show.genre ? show.genre.split(', ').map(g => g.trim()) : []);
    const uniqueTvGenres = Array.from(new Set(rawTvGenres)).sort();
    const extendedTvGenres = ['favorites', ...uniqueTvGenres];
    
    const movieGenres = Array.from(new Set(movies.flatMap(movie => movie.genre ? movie.genre.split(', ').map(g => g.trim()) : []))).sort();
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
            toast.error("Please log in to add items to your watchlist.");
            return;
        } 

        // FETCH FIX: Ensure the item has all details before saving to watchlist
        const enrichedItem = await fetchAndEnrichContentDetails(item);

        try {
            const res = await fetch("/api/watchlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(enrichedItem),
            });
            const responseData = await res.json();
            if (res.status === 409) {
                toast.error(responseData.error);
                return;
            }
            if (!res.ok) {
                console.error("Failed to add to watchlist:", responseData);
                throw new Error("Failed to add to watchlist");
            }
            toast.success(`${item.title} added to watchlist!`);
            fetchWatchlist();
        } catch (error) {
            console.error("Error adding to watchlist:", error);
            toast.error("Failed to add to watchlist");
        }
    };

    // Dashboard Stats: Pass the two accurate stats and rename stat cards.
    const totalEpisodesWatched = tvShows.reduce((total, show) => total + (show.watchedEpisodeIds?.length || 0), 0);
    const totalTVShowsTracked = tvShows.length;
    
    // FIX: Sum the new, accurately calculated trackedSeasonCount from the stored TVShow objects
    const totalSeasonsTracked = tvShows.reduce((total, show) => total + (show.trackedSeasonCount || 0), 0);


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
        tvGenres: extendedTvGenres, // Use extended list for TV
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
        isLoadingSession,
        totalEpisodesWatched, 
        totalTVShowsTracked, 
        totalSeasonsTracked, 
    };
};