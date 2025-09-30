import { NextRequest, NextResponse } from "next/server";
import { fetchOmdbData } from "@/lib/api-utils"; 

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }
    
    try {
        const data = await fetchOmdbData(query, 'series');
        
        let tvShows = data.Search?.map((item: any) => ({
            id: item.imdbID,
            title: item.Title,
            year: item.Year,
            poster_path: item.Poster !== "N/A" ? item.Poster : null,
        })) || [];

        // Removed inefficient detail enrichment logic
        
        return NextResponse.json(tvShows);
    } catch (e) {
        console.error("API Search error:", e);
        return NextResponse.json({ error: "Failed to perform TV show search" }, { status: 500 });
    }
}