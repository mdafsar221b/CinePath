
import { NextRequest, NextResponse } from "next/server";
import { fetchOmdbData } from "@/lib/api-utils";
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    try {
        const data = await fetchOmdbData(query, 'movie');
        let movies = data.Search?.map((item: any) => ({
            id: item.imdbID,
            title: item.Title,
            year: item.Year,
            poster_path: item.Poster !== "N/A" ? item.Poster : null,
        })) || [];
        
        
        const topResultsToEnrich = movies.slice(0, 10);
        const detailPromises = topResultsToEnrich.map((item: any) => 
            fetchOmdbData(null, 'movie', item.id)
                .catch(e => item)
        );
        
        const enrichedResults = await Promise.allSettled(detailPromises);
        
        const enrichedMap = new Map(enrichedResults
            .filter(r => r.status === 'fulfilled' && r.value?.id)
            .map(r => [(r as PromiseFulfilledResult<any>).value.id, (r as PromiseFulfilledResult<any>).value])
        );

        movies = movies.map((item: any) => enrichedMap.get(item.id) || item);
        

        return NextResponse.json(movies);
    } catch (e) {
        console.error("API Search error:", e);
        return NextResponse.json({ error: "Failed to perform movie search" }, { status: 500 });
    }
}