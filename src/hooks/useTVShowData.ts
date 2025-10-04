
"use client";

import { useState, useEffect } from "react";
import { TVShow, TVShowCategory } from "@/lib/types"; // ADDED TVShowCategory
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

/**
 * Custom hook for fetching and managing the list of watched TV shows.
 * Includes logic for enriching metadata (genre, actors, etc.) if missing.
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
            
            // Logic to enrich metadata (Genre/Rating/Actors) if missing
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
                                id: show.id, 
                            } as TVShow;
                        }
                     } catch (error) {
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
    
    // ADDED: Explicitly define categories to filter on
    const explicitCategories: TVShowCategory[] = ['Regular Series', 'Miniseries', 'Hindi Tv shows'];
    
    // The filter list now includes 'favorites', explicit categories, and unique genres.
    const extendedTvGenres = ['favorites', ...explicitCategories, ...uniqueTvGenres].filter(Boolean);
    
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