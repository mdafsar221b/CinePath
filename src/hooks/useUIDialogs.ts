// src/hooks/useUIDialogs.ts
"use client";

import { useState } from "react";
import { Movie, TVShow, DetailedContent, WatchlistItem, SearchResult, TmdbDetailedContent } from "@/lib/types";

interface UIDialogDependencies {
    fetchAndEnrichContentDetails: (item: WatchlistItem | SearchResult) => Promise<any>;
}

export const useUIDialogs = ({ fetchAndEnrichContentDetails }: UIDialogDependencies) => {
    
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [tmdbDetailsOpen, setTmdbDetailsOpen] = useState(false); // NEW STATE
    const [editMovieOpen, setEditMovieOpen] = useState(false);
    const [editTVShowOpen, setEditTVShowOpen] = useState(false);
    
    // OMDb/Internal Content for Edit/Details
    const [selectedContent, setSelectedContent] = useState<(DetailedContent & Partial<Movie> & Partial<TVShow> & {
        seriesStructure?: any; 
        favoriteEpisodeIds?: string[];
    }) | null>(null);
    
    // TMDb Content for Details Dialog
    const [selectedTmdbContent, setSelectedTmdbContent] = useState<TmdbDetailedContent | null>(null); // NEW STATE
    
    const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);
    const [tvShowToEdit, setTvShowToEdit] = useState<TVShow | null>(null);

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
        let enrichedShow = show;
        const isDetailsMissing = !show.genre || show.genre === 'N/A' || !show.actors || show.actors === 'N/A' || !show.imdbRating || show.imdbRating === 'N/A';
         
        if (isDetailsMissing && show.id) {
             try {
                const detailsRes = await fetch(`/api/details?id=${show.id}&type=series`);
                if (detailsRes.ok) {
                    const details = await detailsRes.json();
                    enrichedShow = {
                        ...show,
                        ...details,
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
        // OMDb-based flow (for existing Watchlist items)
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

    const handleSelectContent = async (result: SearchResult | TmdbDetailedContent) => {
        // Check if the content is from TMDb (Trending/Popular) or OMDb (Search)
        if ('voteAverage' in result) {
            // TMDb ISOLATED FLOW
            setSelectedTmdbContent(result as TmdbDetailedContent);
            setTmdbDetailsOpen(true);
        } else {
            // OMDb/Search FLOW (relies on fetchAndEnrichContentDetails)
            const enrichedResult = await fetchAndEnrichContentDetails(result as SearchResult);

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
        }
       
    };

    return {
        detailsOpen,
        setDetailsOpen,
        tmdbDetailsOpen, // NEW EXPORT
        setTmdbDetailsOpen, // NEW EXPORT
        selectedTmdbContent, // NEW EXPORT
        editMovieOpen,
        setEditMovieOpen,
        editTVShowOpen,
        setEditTVShowOpen,
        selectedContent,
        movieToEdit,
        setMovieToEdit,
        tvShowToEdit,
        setTvShowToEdit,
        handleShowMovieDetails,
        handleShowTVDetails,
        handleShowWatchlistDetails,
        handleSelectContent,
    };
};