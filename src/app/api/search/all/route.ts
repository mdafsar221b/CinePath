// mdafsar221b/cinepath/CinePath-8b5b9760d0bd1328fe99387f613f7cf7af56ed45/src/app/api/search/all/route.ts

import { NextRequest, NextResponse } from "next/server";
import { fetchOmdbData } from "@/lib/api-utils"; 

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    try {
        // Fetch initial search results (minimal data)
        const movieResults = await fetchOmdbData(query, 'movie');
        const tvResults = await fetchOmdbData(query, 'series');

        const movies = movieResults.Search?.map((item: any) => ({
            id: item.imdbID,
            title: item.Title,
            year: item.Year,
            poster_path: item.Poster !== "N/A" ? item.Poster : null,
            type: 'movie'
        })) || [];

        const tvShows = tvResults.Search?.map((item: any) => ({
            id: item.imdbID,
            title: item.Title,
            year: item.Year,
            poster_path: item.Poster !== "N/A" ? item.Poster : null,
            type: 'tv'
        })) || [];

        let all = [...movies, ...tvShows];
        
        // Removed the previous logic that fetched full details (including plot) and merged them.

        return NextResponse.json({
            movies: all.filter(item => item.type === 'movie'),
            tvShows: all.filter(item => item.type === 'tv'),
            all: all
        });
    } catch (e) {
        console.error("Global search error:", e);
        return NextResponse.json({ error: "Failed to perform search" }, { status: 500 });
    }
}