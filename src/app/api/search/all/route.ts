// src/app/api/search/all/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "OMDB_API_KEY is not set" }, { status: 500 });
    }

    try {
        const movieResponse = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}&type=movie`);
        const tvResponse = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}&type=series`);

        const movieData = await movieResponse.json();
        const tvData = await tvResponse.json();

        const movies = movieData.Response !== "False" ? movieData.Search.map((item: any) => ({
            id: item.imdbID,
            title: item.Title,
            year: item.Year,
            poster_path: item.Poster !== "N/A" ? item.Poster : null,
            type: 'movie'
        })) : [];

        const tvShows = tvData.Response !== "False" ? tvData.Search.map((item: any) => ({
            id: item.imdbID,
            title: item.Title,
            year: item.Year,
            poster_path: item.Poster !== "N/A" ? item.Poster : null,
            type: 'tv'
        })) : [];

        return NextResponse.json({
            movies,
            tvShows,
            all: [...movies, ...tvShows]
        });
    } catch (e) {
        console.error("Global search error:", e);
        return NextResponse.json({ error: "Failed to perform search" }, { status: 500 });
    }
}