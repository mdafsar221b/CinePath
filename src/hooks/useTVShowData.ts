// src/hooks/useTVShowData.ts
"use client";

import { useState, useEffect } from "react";
import { TVShow } from "@/lib/types";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { mapDetailedContent } from "@/lib/tmdb-mapper";

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
            
            const enrichedShowsPromises = rawShows.map(async (show) => {
                const isDetailsMissing = !show.genre || show.genre === 'N/A' || !show.actors || show.actors === 'N/A' || !show.imdbRating || show.imdbRating === 'N/A';
                
                if (isDetailsMissing && show.tmdbId) { 
                     try {
                        const details = await mapDetailedContent(show.tmdbId, 'tv');
                        return {
                            ...show,
                            ...details,
                            tmdbId: show.tmdbId, 
                        } as TVShow;
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