
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { TrendingContent } from "./types";

const CACHE_TTL_HOURS = 168;
const CACHE_TTL_MS = CACHE_TTL_HOURS * 60 * 60 * 1000;

export function handleServerError(message: string, error: unknown) {
    console.error(message, error);
    return NextResponse.json({ error: message }, { status: 500 });
}

export function handleClientError(message: string, status: number) {
    return NextResponse.json({ error: message }, { status });
}

async function fetchAndCacheOmdbDetails(id: string, apiKey: string) {
    const client = await clientPromise;
    const db = client.db("cinepath");
    const cacheCollection = db.collection("omdb_cache");

    const now = Date.now();

    const cachedItem = await cacheCollection.findOne({
        imdbID: id,
        expiresAt: { $gt: new Date(now) }
    });

    if (cachedItem) {
        const { _id, expiresAt, ...data } = cachedItem;
        return data;
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

    const expiresAt = new Date(now + CACHE_TTL_MS);

    const itemToCache = {
        imdbID: data.imdbID,
        title: data.Title,
        year: data.Year,
        poster_path: data.Poster !== "N/A" ? data.Poster : null,
        genre: data.Genre && data.Genre !== "N/A" ? data.Genre : null,
        plot: data.Plot && data.Plot !== "N/A" ? data.Plot : null,
        rating: data.Rated && data.Rated !== "N/A" ? data.Rated : null,
        actors: data.Actors && data.Actors !== "N/A" ? data.Actors : null,
        director: data.Director && data.Director !== "N/A" ? data.Director : null,
        imdbRating: data.imdbRating && data.imdbRating !== "N/A" ? data.imdbRating : null,
        type: data.Type === 'series' ? 'tv' : 'movie',

        cachedAt: new Date(now),
        expiresAt: expiresAt,
    };

    await cacheCollection.replaceOne(
        { imdbID: id },
        itemToCache,
        { upsert: true }
    );

    return itemToCache;
}

export async function fetchOmdbSeriesStructure(id: string, apiKey: string) {
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

/**
 * Fetches data from the TMDb API using the Read Access Token.
 * Returns richer data (including overview and voteAverage) for isolation.
 */
export async function fetchTmdbData(listType: 'trending' | 'popular'): Promise<TrendingContent[]> {
    const accessToken = process.env.TMDB_READ_ACCESS_TOKEN;
    if (!accessToken) {
        throw new Error("TMDB_READ_ACCESS_TOKEN is not set. Cannot fetch trending data.");
    }

    const data = await apiResponse.json();

    if (!data.results || !Array.isArray(data.results)) {
        return [];
    }

    const content: TrendingContent[] = data.results
        .filter((item: any) => item.media_type !== 'person')
        .map((item: any) => ({
            id: item.id.toString(),
            title: item.title || item.name,
            year: (item.release_date || item.first_air_date)?.substring(0, 4) || 'N/A',
            poster_path: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
            type: item.media_type === 'tv' ? 'tv' : 'movie',
            overview: item.overview || 'No overview available from TMDb.',
            voteAverage: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0,
            genreIds: item.genre_ids || [],
            releaseDate: item.release_date || item.first_air_date || 'N/A'
        }));

    return content.filter(item => item.title);
}