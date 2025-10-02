// src/app/api/details/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchOmdbData } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
        return NextResponse.json({ error: "ID and type parameters are required" }, { status: 400 });
    }
    
    try {
        const data = await fetchOmdbData(null, type as 'movie' | 'series', id); 
        
        const detailedContent = {
            id: data.imdbID,
            title: data.title,
            year: data.year ? parseInt(data.year) : 0,
            poster_path: data.poster_path,
            genre: data.genre || "N/A",
            plot: data.plot || "N/A",
            rating: data.rating || "N/A",
            actors: data.actors || "N/A",
            director: data.director || "N/A",
            imdbRating: data.imdbRating || "N/A",
            type: data.type
        };

        return NextResponse.json(detailedContent);
    } catch (e) {
        console.error("API Details error:", e);
        const errorMessage = e instanceof Error ? e.message : "Failed to fetch details";
        
        if (errorMessage.includes("not found")) {
             return NextResponse.json({ error: errorMessage }, { status: 404 });
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}