// src/hooks/useWatchlistData.ts
"use client";

import { useState, useEffect } from "react";
import { WatchlistItem, SearchResult, NewMovie } from "@/lib/types";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

// Interface for helpers needed from the master hook's environment
interface WatchlistDependencies {
    isLoggedIn: boolean;
    fetchMovies: () => Promise<void>;
    fetchTVShows: () => Promise<void>;
}

/**
 * Custom hook for fetching, managing, and performing CRUD on the Watchlist.
 */
export const useWatchlistData = ({ isLoggedIn, fetchMovies, fetchTVShows }: WatchlistDependencies) => {
    const { status } = useSession();
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

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
            fetchWatchlist();
        } else if (status === 'unauthenticated') {
            setWatchlist([]);
        }
    }, [isLoggedIn, status]);

    // Helper to fetch/enrich content details from OMDb API (moved from master hook)
    const fetchAndEnrichContentDetails = async (item: WatchlistItem | SearchResult) => {
        if (item.genre && item.plot && item.imdbRating) {
            return item;
        }
        
        const type = item.type === 'movie' ? 'movie' : 'series';

        try {
            const detailsRes = await fetch(`/api/details?id=${item.id}&type=${type}`);
            if (detailsRes.ok) {
                const details = await detailsRes.json();
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

        return item;
    };


    const handleAddToWatchlist = async (item: SearchResult) => {
        if (!isLoggedIn) { 
            toast.error("Please log in to add items to your watchlist.");
            return;
        } 

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
    
    // Handler for marking item watched and moving it from watchlist to main list
    const handleMarkWatched = async (item: WatchlistItem) => {
        if (!isLoggedIn) return; 

        const enrichedItem = await fetchAndEnrichContentDetails(item);

        try {
            if (enrichedItem.type === 'movie') {
                const movieData: NewMovie = {
                    title: enrichedItem.title,
                    year: parseInt(enrichedItem.year || "0"),
                    poster_path: enrichedItem.poster_path,
                    genre: enrichedItem.genre,
                    plot: enrichedItem.plot,
                    rating: enrichedItem.rating,
                    actors: enrichedItem.actors,
                    director: (enrichedItem as any).director,
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


    return {
        watchlist,
        fetchWatchlist,
        handleAddToWatchlist,
        handleRemoveFromWatchlist,
        handleMarkWatched,
        fetchAndEnrichContentDetails,
    };
};