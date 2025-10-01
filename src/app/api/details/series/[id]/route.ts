
import { NextRequest, NextResponse } from "next/server";
import { fetchOmdbSeriesStructure } from "@/lib/api-utils";
import { OMDBSingleSeason } from "@/lib/types";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;

    if (!id) {
        return NextResponse.json({ error: "Series ID parameter is required" }, { status: 400 });
    }

    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "OMDB_API_KEY is not set" }, { status: 500 });
    }

    try {
     
        const data = await fetchOmdbSeriesStructure(id, apiKey);

        // Format the data to be easier to consume by the frontend
        const seasonsWithDetails = data.seasons.map((season: { season: number; episodes: OMDBSingleSeason['Episodes'] }) => ({
            seasonNumber: season.season,
            episodes: season.episodes.map(ep => ({
                id: ep.id, 
                title: ep.title,
                episodeNumber: parseInt(ep.episode),
                rating: ep.rating,
                released: ep.released,
            }))
        }));

        return NextResponse.json({ 
            totalSeasons: data.totalSeasons,
            seasons: seasonsWithDetails 
        });

    } catch (e) {
        console.error("Series Details error:", e);
        const errorMessage = e instanceof Error ? e.message : "Failed to fetch full series details";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}