// src/app/api/details/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
        return NextResponse.json({ error: "ID and type parameters are required" }, { status: 400 });
    }

    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "OMDB_API_KEY is not set" }, { status: 500 });
    }

    try {
        const apiResponse = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${id}&plot=full`);
        if (!apiResponse.ok) {
            throw new Error(`API call failed with status: ${apiResponse.status}`);
        }
        const data = await apiResponse.json();

        if (data.Response === "False") {
            return NextResponse.json({ error: "Content not found" }, { status: 404 });
        }

        const detailedContent = {
            id: data.imdbID,
            title: data.Title,
            year: data.Year,
            poster_path: data.Poster !== "N/A" ? data.Poster : null,
            genre: data.Genre || "N/A",
            plot: data.Plot || "N/A",
            rating: data.Rated || "N/A",
            actors: data.Actors || "N/A",
            director: data.Director || "N/A",
            imdbRating: data.imdbRating || "N/A",
            type: type === 'series' ? 'tv' : 'movie'
        };

        return NextResponse.json(detailedContent);
    } catch (e) {
        console.error("API Details error:", e);
        return NextResponse.json({ error: "Failed to fetch details" }, { status: 500 });
    }
}