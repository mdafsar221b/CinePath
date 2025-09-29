
import { NextRequest, NextResponse } from "next/server";
import { fetchOmdbData } from "@/lib/api-utils"; 

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    try {
        // 1. Fetch initial search results (minimal data)
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
        
       
        const topResultsToEnrich = all.slice(0, 10);
        const detailPromises = topResultsToEnrich.map(item => 
            fetchOmdbData(null, item.type === 'movie' ? 'movie' : 'series', item.id)
                .catch(e => {
                    console.error(`Failed to enrich details for ${item.title}:`, e.message);
                    return item; 
                })
        );
        
        const enrichedResults = await Promise.allSettled(detailPromises);
        
     
        const enrichedMap = new Map(enrichedResults
            .filter(r => r.status === 'fulfilled' && r.value?.id)
            .map(r => [(r as PromiseFulfilledResult<any>).value.id, (r as PromiseFulfilledResult<any>).value])
        );

        all = all.map(item => enrichedMap.get(item.id) || item);
     
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