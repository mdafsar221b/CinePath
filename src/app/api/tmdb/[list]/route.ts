// src/app/api/tmdb/[list]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { fetchTmdbData } from "@/lib/api-utils";
import { TrendingContent } from "@/lib/types";

const CACHE_TTL = 30 * 60 * 1000; 
let trendingCache: { data: TrendingContent[]; timestamp: number } | null = null;
let popularCache: { data: TrendingContent[]; timestamp: number } | null = null;

export async function GET(
    request: NextRequest, 
    { params }: { params: { list: 'trending' | 'popular' } }
) {
    const listType = params.list;

    if (listType !== 'trending' && listType !== 'popular') {
        return NextResponse.json({ error: "Invalid list type. Must be 'trending' or 'popular'." }, { status: 400 });
    }
    
    const now = Date.now();
    let cache = listType === 'trending' ? trendingCache : popularCache;
    
    if (cache && now - cache.timestamp < CACHE_TTL) {
        return NextResponse.json(cache.data);
    }
    
    try {
        const content = await fetchTmdbData(listType);
        
        if (listType === 'trending') {
            trendingCache = { data: content, timestamp: now };
        } else {
            popularCache = { data: content, timestamp: now };
        }

        return NextResponse.json(content);
    } catch (e) {
        console.error(`TMDb API error for ${listType}:`, e);
        if (cache) {
             console.log(`Serving stale cache for ${listType}`);
             return NextResponse.json(cache.data);
        }
        if (e instanceof Error && e.message.includes("401")) {
            return NextResponse.json({ error: "TMDb Authentication Failed. Check TMDB_READ_ACCESS_TOKEN." }, { status: 401 });
        }
        return NextResponse.json({ error: `Failed to fetch ${listType} content.` }, { status: 500 });
    }
}