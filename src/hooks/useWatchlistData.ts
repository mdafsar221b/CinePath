// src/hooks/useWatchlistData.ts
"use client";

import { useState, useEffect } from "react";
import { WatchlistItem, SearchResult, NewMovie } from "@/lib/types";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { mapDetailedContent } from "@/lib/tmdb-mapper";

interface WatchlistDependencies {
    isLoggedIn: boolean;
    fetchMovies: () => Promise<void>;
    fetchTVShows: () => Promise<void>;
}

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

    const fetchAndEnrichContentDetails = async (item: WatchlistItem | SearchResult) => {
        // This check is now explicitly type-safe due to the fix in types.ts
        if (item.genre && item.plot && item.imdbRating) { 
            return item;
        }
        
        try {
            const { mapDetailedContent } = await import('@/lib/tmdb-mapper');
            const details = await mapDetailedContent(item.tmdbId, item.type);

            return {
                ...item,
                ...details,
                tmdbId: item.tmdbId, 
                title: item.title,
            };
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
    
    const handleMarkWatched = async (item: WatchlistItem) => {
        if (!isLoggedIn) return; 

        const enrichedItem = await fetchAndEnrichContentDetails(item);
        const eItem = enrichedItem as any; 

        try {
            if (eItem.type === 'movie') {
                const movieData: NewMovie = {
                    tmdbId: eItem.tmdbId,
                    imdbId: eItem.imdbId,
                    title: eItem.title,
                    year: parseInt(eItem.year || "0"),
                    poster_path: eItem.poster_path,
                    genre: eItem.genre,
                    plot: eItem.plot,
                    rating: eItem.rating,
                    actors: eItem.actors,
                    director: eItem.director,
                    imdbRating: eItem.imdbRating,
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
                    tmdbId: eItem.tmdbId,
                    imdbId: eItem.imdbId,
                    title: eItem.title,
                    poster_path: eItem.poster_path,
                    genre: eItem.genre,
                    plot: eItem.plot,
                    rating: eItem.rating,
                    actors: eItem.actors,
                    imdbRating: eItem.imdbRating,
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
            await handleRemoveFromWatchlist(item._id);
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