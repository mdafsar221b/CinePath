// src/lib/tmdb-mapper.ts
import { SearchResult, DetailedContent } from "./types";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";
const TMDB_IMAGE_DETAIL_URL = "https://image.tmdb.org/t/p/w500";

// --- TMDB Fetch Helper ---
export async function tmdbFetch(path: string, query?: string) {
    const accessToken = process.env.TMDB_ACCESS_TOKEN;
    if (!accessToken) {
        throw new Error("TMDB_ACCESS_TOKEN is not set");
    }
    
    let url = `https://api.themoviedb.org/3${path}`;
    const params = new URLSearchParams({ language: "en-US" });
    if (query) {
        params.append("query", query);
    }
    
    const separator = path.includes('?') ? '&' : '?';
    url += `${separator}${params.toString()}`;

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        let errorBody;
        try {
            errorBody = await res.json();
        } catch {}
        console.error("TMDB API Error:", res.status, errorBody);
        const message = errorBody?.status_message || `TMDB API call failed for path: ${path}`;
        throw new Error(message);
    }

    return res.json();
}

// --- Mapper Functions ---

export function mapSearchResult(item: any): SearchResult | null {
    if (item.media_type !== "movie" && item.media_type !== "tv") {
        return null;
    }

    const title = item.title || item.name || "N/A";
    const releaseDate = item.release_date || item.first_air_date;
    const imdbRating = item.vote_average ? item.vote_average.toFixed(1).toString() : "N/A";

    return {
        tmdbId: item.id,
        title: title,
        year: releaseDate ? new Date(releaseDate).getFullYear().toString() : "N/A",
        poster_path: item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : null,
        type: item.media_type === "movie" ? "movie" : "tv",
        imdbRating: imdbRating
    };
}

export async function mapDetailedContent(
    tmdbId: number, 
    type: 'movie' | 'tv'
): Promise<Partial<DetailedContent> & { imdbId?: string }> {
    
    // 1. Fetch main details and credits
    const detailsPath = type === 'movie' ? `/movie/${tmdbId}?append_to_response=credits` : `/tv/${tmdbId}?append_to_response=credits`;
    const detailsData = await tmdbFetch(detailsPath);

    // 2. Fetch external IDs (to get imdbId)
    const externalIdsPath = type === 'movie' ? `/movie/${tmdbId}/external_ids` : `/tv/${tmdbId}/external_ids`;
    const externalIdsData = await tmdbFetch(externalIdsPath);

    // 3. Map fields
    const releaseDate = detailsData.release_date || detailsData.first_air_date;
    const year = releaseDate ? new Date(releaseDate).getFullYear() : 0;
    
    const genres = detailsData.genres?.map((g: any) => g.name).join(", ") || "N/A";
    
    const imdbRating = detailsData.vote_average ? detailsData.vote_average.toFixed(1).toString() : "N/A";
    
    let director = "N/A";
    if (type === 'movie' && detailsData.credits?.crew) {
        const directorCrew = detailsData.credits.crew.find((c: any) => c.job === "Director");
        if (directorCrew) {
            director = directorCrew.name;
        }
    } else if (type === 'tv' && detailsData.created_by && detailsData.created_by.length > 0) {
        director = detailsData.created_by[0].name;
    }
    
    const actors = detailsData.credits?.cast?.slice(0, 5).map((c: any) => c.name).join(", ") || "N/A";

    // 4. Return the mapped object
    return {
        tmdbId: tmdbId,
        imdbId: externalIdsData.imdb_id || undefined,
        title: detailsData.title || detailsData.name,
        year: year,
        poster_path: detailsData.poster_path ? `${TMDB_IMAGE_DETAIL_URL}${detailsData.poster_path}` : null,
        genre: genres,
        plot: detailsData.overview || "N/A",
        rating: detailsData.certification || "N/A", // Using Certification as a proxy for Rating
        actors: actors,
        director: director, 
        imdbRating: imdbRating,
        type: type,
    };
}

export async function fetchTMDBSeriesStructure(tmdbId: number) {
    // 1. Fetch main details to get total number of seasons
    const detailsPath = `/tv/${tmdbId}`;
    const detailsData = await tmdbFetch(detailsPath);
    
    const totalSeasons = detailsData.number_of_seasons || 0;
    const seasons = [];
    
    // 2. Fetch episodes for each season
    for (let i = 1; i <= totalSeasons; i++) {
        const seasonPath = `/tv/${tmdbId}/season/${i}?append_to_response=external_ids`;
        const seasonData = await tmdbFetch(seasonPath);
        
        const episodes = (seasonData.episodes || []).map((ep: any) => ({
            // Use IMDb ID if available, otherwise fallback to TMDB episode ID (as a string)
            id: ep.external_ids?.imdb_id || ep.id.toString(), 
            title: ep.name,
            episodeNumber: ep.episode_number,
            rating: ep.vote_average ? ep.vote_average.toFixed(1).toString() : "N/A",
            released: ep.air_date,
        }));
        
        seasons.push({
            seasonNumber: seasonData.season_number,
            episodes: episodes,
        });
    }
    
    return {
        totalSeasons,
        seasons: seasons.sort((a, b) => a.seasonNumber - b.seasonNumber),
    };
}