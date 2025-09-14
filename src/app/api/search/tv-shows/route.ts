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
        const apiResponse = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}&type=series`);
        if (!apiResponse.ok) {
            throw new Error(`API call failed with status: ${apiResponse.status}`);
        }
        const data = await apiResponse.json();
        
        
        if (data.Response === "False") {
            return NextResponse.json({ results: [] });
        }

        
        const tvShows = data.Search.map((item: any) => ({
            id: item.imdbID,
            name: item.Title,
            poster_path: item.Poster !== "N/A" ? item.Poster : null,
        }));

        return NextResponse.json(tvShows);
    } catch (e) {
        console.error("API Search error:", e);
        return NextResponse.json({ error: "Failed to perform TV show search" }, { status: 500 });
    }
}