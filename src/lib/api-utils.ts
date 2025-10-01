import { NextResponse } from "next/server";

export function handleServerError(message: string, error: unknown) {
    console.error(message, error);
    return NextResponse.json({ error: message }, { status: 500 });
}

export function handleClientError(message: string, status: number) {
    return NextResponse.json({ error: message }, { status });
}

const detailCache = new Map<string, { data: any, expiry: number }>();
const CACHE_TTL = 3600000; //

async function fetchAndCacheOmdbDetails(id: string, apiKey: string) {
    const cachedItem = detailCache.get(id);
    const now = Date.now();

    if (cachedItem && cachedItem.expiry > now) {
        return cachedItem.data;
    }

    const url = `http://www.omdbapi.com/?apikey=${apiKey}&i=${id}&plot=full`;
    const apiResponse = await fetch(url);
    
    if (!apiResponse.ok) {
        throw new Error(`API call failed with status: ${apiResponse.status}`);
    }
    const data = await apiResponse.json();

    if (data.Response === "False") {
        throw new Error(data.Error);
    }
    
    const itemToCache = {
        id: data.imdbID,
        title: data.Title,
        year: data.Year,
        poster_path: data.Poster !== "N/A" ? data.Poster : null,
        genre: data.Genre && data.Genre !== "N/A" ? data.Genre : null,
        plot: data.Plot && data.Plot !== "N/A" ? data.Plot : null,
        rating: data.Rated && data.Rated !== "N/A" ? data.Rated : null,
        actors: data.Actors && data.Actors !== "N/A" ? data.Actors : null,
        director: data.Director && data.Director !== "N/A" ? data.Director : null,
        imdbRating: data.imdbRating && data.imdbRating !== "N/A" ? data.imdbRating : null,
        type: data.Type === 'series' ? 'tv' : 'movie'
    };
    
    detailCache.set(id, { data: itemToCache, expiry: now + CACHE_TTL });
    
    
    return itemToCache;
}
// ------------------------------------

// NEW: Function to fetch all season/episode data for a series
export async function fetchOmdbSeriesStructure(id: string, apiKey: string) {
    // 1. Get total seasons (using the first API call structure)
    const summaryUrl = `http://www.omdbapi.com/?apikey=${apiKey}&i=${id}`;
    const summaryResponse = await fetch(summaryUrl);
    if (!summaryResponse.ok) {
        throw new Error(`Summary API call failed with status: ${summaryResponse.status}`);
    }
    const summaryData = await summaryResponse.json();

    if (summaryData.Response === "False") {
        throw new Error(summaryData.Error || "Series not found for summary.");
    }

    const totalSeasons = parseInt(summaryData.totalSeasons || "0");
    if (totalSeasons === 0) {
        return { totalSeasons: 0, seasons: [] };
    }

    // 2. Loop for each season to get episodes
    const seasonPromises = [];
    for (let i = 1; i <= totalSeasons; i++) {
        const seasonUrl = `http://www.omdbapi.com/?apikey=${apiKey}&i=${id}&season=${i}`;
        seasonPromises.push(fetch(seasonUrl).then(res => {
            if (!res.ok) throw new Error(`Season ${i} API call failed with status: ${res.status}`);
            return res.json();
        }));
    }

    const seasonResponses = await Promise.all(seasonPromises);

    const seasons = seasonResponses.map(data => ({
        season: parseInt(data.Season),
        episodes: (data.Episodes || []).map((ep: any) => ({
            id: ep.imdbID,
            title: ep.Title,
            episode: ep.Episode,
            rating: ep.imdbRating,
            released: ep.Released,
        }))
    }));

    return { totalSeasons, seasons: seasons.sort((a, b) => a.season - b.season) };
}


export async function fetchOmdbData(query: string | null, type: 'movie' | 'series' | null = null, id: string | null = null) {
    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) {
        throw new Error("OMDB_API_KEY is not set");
    }

  
    if (id) {
        return fetchAndCacheOmdbDetails(id, apiKey);
    }
    
    // 2. Handle Search lookup
    let url = `http://www.omdbapi.com/?apikey=${apiKey}`;
    
    if (query) {
        url += `&s=${encodeURIComponent(query)}`;
    }
    if (type) {
        url += `&type=${type}`;
    } else {
        
        if (!query) throw new Error("Query is required for search mode.");
    }
    
    const apiResponse = await fetch(url);
    if (!apiResponse.ok) {
        throw new Error(`API call failed with status: ${apiResponse.status}`);
    }
    const data = await apiResponse.json();

    if (data.Response === "False") {
        throw new Error(data.Error);
    }

    return data;
}