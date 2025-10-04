// src/hooks/useCinePath.ts


"use client";

import { useSession } from "next-auth/react"; 
import { useContentFilter } from "./useContentFilter"; 
import { useTVShowData } from "./useTVShowData";
import { useMovieData } from "./useMovieData";
import { useWatchlistData } from "./useWatchlistData"; 
import { useContentCRUD } from "./useContentCRUD";    
import { useUIDialogs } from "./useUIDialogs";         
import { Movie, TVShow } from "@/lib/types";

// The master orchestrator hook
export const useCinePath = () => {
    const { status } = useSession(); 
    const isLoggedIn = status === 'authenticated';
    const isLoadingSession = status === 'loading';
    
    // --- 1. DELEGATED DATA & FETCHERS ---
    
    const { fetchMovies, movies, movieGenres, moviesByYear, setMovies } = useMovieData();
    
    const { 
        fetchTVShows, 
        tvShows, 
        extendedTvGenres: tvGenres, 
        totalEpisodesWatched, 
        totalTVShowsTracked, 
        totalSeasonsTracked, 
        setTVShows,
    } = useTVShowData();
    
    const {
        watchlist,
        fetchWatchlist,
        handleAddToWatchlist,
        handleRemoveFromWatchlist,
        handleMarkWatched,
        fetchAndEnrichContentDetails, 
    } = useWatchlistData({ isLoggedIn, fetchMovies, fetchTVShows });


    // --- 2. DELEGATED UI STATE & HANDLERS ---
    
    const {
        detailsOpen, setDetailsOpen,
        tmdbDetailsOpen, setTmdbDetailsOpen, // NEW
        selectedTmdbContent, // NEW
        editMovieOpen, setEditMovieOpen,
        editTVShowOpen, setEditTVShowOpen,
        selectedContent,
        movieToEdit, setMovieToEdit,
        tvShowToEdit, setTvShowToEdit,
        handleShowMovieDetails,
        handleShowTVDetails,
        handleShowWatchlistDetails,
        handleSelectContent,
    } = useUIDialogs({ fetchAndEnrichContentDetails });

    
    // --- 3. DELEGATED CRUD HANDLERS ---

    const {
        handleAddMovie, handleRemoveMovie, handleUpdateMovie,
        handleAddTVShow, handleRemoveTVShow, handleUpdateTVShow,
        handleEditMovie, handleEditTVShow,
    } = useContentCRUD({ 
        isLoggedIn, 
        fetchMovies, fetchTVShows, 
        setTVShows,
        setMovieToEdit, setEditMovieOpen,
        setTvShowToEdit, setEditTVShowOpen,
    });


    // --- 4. FILTER & SORT LOGIC (Uses imported data) ---
    
    const {
        paginatedContent: filteredMovies,
        totalFilteredItems: totalFilteredMovies,
        page: moviesPage, setPage: setMoviesPage,
        filter: movieGenreFilter, setFilter: setMovieGenreFilter,
        sort: movieSort, setSort: setMovieSort,
        itemsPerPage,
    } = useContentFilter<Movie>({ initialContent: movies, initialFilter: "all", initialSort: "addedAt_desc", filterKey: 'genre' });

    const {
        paginatedContent: filteredTVShows,
        totalFilteredItems: totalFilteredTVShows,
        page: tvShowsPage, setPage: setTvShowsPage,
        filter: tvGenreFilter, setFilter: setTvGenreFilter,
        sort: tvShowSort, setSort: setTvShowSort,
    } = useContentFilter<TVShow>({ initialContent: tvShows, initialFilter: "all", initialSort: "addedAt_desc", filterKey: 'isFavorite' });


    // --- 5. RETURNED STATE AND HANDLERS (Master Interface) ---

    return {
        // Data & Core State
        movies, tvShows, watchlist,
        isLoggedIn, isLoadingSession,
        
        // Filtered Lists & Pagination
        filteredMovies, filteredTVShows,
        totalFilteredMovies, totalFilteredTVShows,
        moviesPage, setMoviesPage,
        tvShowsPage, setTvShowsPage,
        itemsPerPage,
        
        // Filter/Sort State
        movieGenreFilter, setMovieGenreFilter,
        tvGenreFilter, setTvGenreFilter,
        movieSort, setMovieSort,
        tvShowSort, setTvShowSort,
        
        // Derived Data (Genres/Stats)
        movieGenres, tvGenres, moviesByYear,
        totalEpisodesWatched, totalTVShowsTracked, totalSeasonsTracked,
        
        // UI Dialogs & Editor State
        detailsOpen, setDetailsOpen,
        tmdbDetailsOpen, setTmdbDetailsOpen, // NEW EXPORT
        selectedTmdbContent, // NEW EXPORT
        editMovieOpen, setEditMovieOpen,
        editTVShowOpen, setEditTVShowOpen,
        selectedContent, movieToEdit, tvShowToEdit,

        // Handlers (CRUD, Watchlist, UI)
        handleAddMovie, handleRemoveMovie, handleEditMovie, handleUpdateMovie,
        handleAddTVShow, handleRemoveTVShow, handleEditTVShow, handleUpdateTVShow,
        handleAddToWatchlist, handleRemoveFromWatchlist, handleMarkWatched,
        handleShowMovieDetails, handleShowTVDetails, handleShowWatchlistDetails, handleSelectContent,
        fetchWatchlist,
    };
};