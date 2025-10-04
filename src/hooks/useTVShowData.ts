
"use client";

import { useState, useEffect } from "react";
import { TVShow } from "@/lib/types";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

/**
 * Custom hook for fetching and managing the list of watched TV shows.
 * @returns { fetchTVShows, tvShows, extendedTvGenres, totalEpisodesWatched, totalTVShowsTracked, totalSeasonsTracked }
 */
export const useTVShowData = () => {
    const { status } = useSession();
    const isLoggedIn = status === 'authenticated';
    
    const [tvShows, setTVShows] = useState<TVShow[]>([]);

    const fetchTVShows = async () => {
        if (!isLoggedIn) {
            setTVShows([]);
            return;
        }
        try {
            const res = await fetch("/api/tv-shows");
            if (!res.ok) throw new Error("Failed to fetch TV shows");
            const rawShows = await res.json() as TVShow[];
            
            // Client-side enrichment logic removed: Data is now fully enriched on the server (see /api/tv-shows/route.ts POST method).
            setTVShows(rawShows);

        } catch (e) {
            console.error("Error fetching TV shows:", e);
            toast.error("Failed to load TV shows.");
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchTVShows();
        } else if (status === 'unauthenticated') {
            setTVShows([]);
        }
    }, [isLoggedIn, status]);

    // --- Derived State & Stats Calculation ---
    
    const rawTvGenres = tvShows.flatMap(show => show.genre ? show.genre.split(', ').map(g => g.trim()) : []);
    const uniqueTvGenres = Array.from(new Set(rawTvGenres)).sort();
    const extendedTvGenres = ['favorites', ...uniqueTvGenres];
    
    const totalEpisodesWatched = tvShows.reduce((total, show) => total + (show.watchedEpisodeIds?.length || 0), 0);
    const totalTVShowsTracked = tvShows.length;
    const totalSeasonsTracked = tvShows.reduce((total, show) => total + (show.trackedSeasonCount || 0), 0);

    return {
        fetchTVShows,
        tvShows,
        extendedTvGenres,
        totalEpisodesWatched, 
        totalTVShowsTracked, 
        totalSeasonsTracked,
        setTVShows 
    };
};