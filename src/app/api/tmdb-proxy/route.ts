
import { NextRequest, NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb-mapper";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const query = searchParams.get('query');

    if (!path) {
        return NextResponse.json({ error: "Path parameter is required" }, { status: 400 });
    }
    
    try {
        const data = await tmdbFetch(path, query || undefined);
        return NextResponse.json(data);
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Failed to fetch data from TMDB proxy";
        
        if (errorMessage.includes("404")) {
             return NextResponse.json({ error: errorMessage }, { status: 404 });
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}