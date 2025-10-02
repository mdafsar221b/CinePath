// src/hooks/useContentCRUD.ts
"use client";

import { Movie, TVShow, NewMovie } from "@/lib/types";
import toast from "react-hot-toast";

// Interface for dependencies needed from the master hook
interface ContentCRUDFunctions {
    isLoggedIn: boolean;
    fetchMovies: () => Promise<void>;
    fetchTVShows: () => Promise<void>;
    setTVShows: React.Dispatch<React.SetStateAction<TVShow[]>>;
    setMovieToEdit: (movie: Movie | null) => void;
    setEditMovieOpen: (open: boolean) => void;
    setTvShowToEdit: (show: TVShow | null) => void;
    setEditTVShowOpen: (open: boolean) => void;
}

/**
 * Custom hook encapsulating all Create, Read, Update, Delete (CRUD) operations
 * for Movies and TV Shows.
 */
export const useContentCRUD = ({ 
    isLoggedIn, 
    fetchMovies, 
    fetchTVShows, 
    setTVShows,
    setMovieToEdit,
    setEditMovieOpen,
    setTvShowToEdit,
    setEditTVShowOpen
}: ContentCRUDFunctions) => {

    // --- MOVIE HANDLERS ---
    
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

    // --- TV SHOW HANDLERS ---
    
    const handleAddTVShow = async (id: string, title: string, poster_path: string | null) => {
        if (!isLoggedIn) return; 
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
        // Optimistic update for immediate visual feedback
        if (updatedShow) {
             setTVShows(prev => prev.map(s => s._id === updatedShow._id ? updatedShow : s));
             setTvShowToEdit(updatedShow);
        }
        fetchTVShows();
    };
    
    return {
        handleAddMovie,
        handleRemoveMovie,
        handleEditMovie,
        handleUpdateMovie,
        handleAddTVShow,
        handleRemoveTVShow,
        handleEditTVShow,
        handleUpdateTVShow,
    };
};