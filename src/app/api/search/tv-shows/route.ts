
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
            name: item.Title,
            poster_path: item.Poster !== "N/A" ? item.Poster : null,
        })) || [];

       
        const topResultsToEnrich = tvShows.slice(0, 10);
        const detailPromises = topResultsToEnrich.map((item: any) => 
            fetchOmdbData(null, 'series', item.id)
                .catch(e => item)
        );
        
        const enrichedResults = await Promise.allSettled(detailPromises);
        
        const enrichedMap = new Map(enrichedResults
            .filter(r => r.status === 'fulfilled' && r.value?.id)
            .map(r => [(r as PromiseFulfilledResult<any>).value.id, (r as PromiseFulfilledResult<any>).value])
        );

        tvShows = tvShows.map((item: any) => enrichedMap.get(item.id) || item);
        

        return NextResponse.json(tvShows);
    } catch (e) {
        console.error("API Search error:", e);
        return NextResponse.json({ error: "Failed to perform TV show search" }, { status: 500 });
    }
}