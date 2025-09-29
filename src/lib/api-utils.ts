

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
        // console.log(`[Cache] HIT for ID: ${id}`);
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
    
    // Process and map the raw OMDb data to a cleaner structure
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
    
    // Cache the processed data
    detailCache.set(id, { data: itemToCache, expiry: now + CACHE_TTL });
    
    
    return itemToCache;
}
// ------------------------------------


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