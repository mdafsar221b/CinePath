

import { NextRequest, NextResponse } from "next/server";
import { fetchTmdbData } from "@/lib/api-utils";
import { TrendingContent } from "@/lib/types";

export async function GET(
    request: NextRequest,
    { params }: { params: { list: 'trending' | 'popular' } }
) {
    const listType = params.list;

    if (listType !== 'trending' && listType !== 'popular') {
        return NextResponse.json({ error: "Invalid list type. Must be 'trending' or 'popular'." }, { status: 400 });
    }

    try {
        const content = await fetchTmdbData(listType);
        return NextResponse.json(content);
    } catch (e) {
        console.error(`TMDb API error for ${listType}:`, e);
        if (e instanceof Error && e.message.includes("401")) {
            return NextResponse.json({ error: "TMDb Authentication Failed. Check TMDB_READ_ACCESS_TOKEN." }, { status: 401 });
        }
        return NextResponse.json({ error: `Failed to fetch ${listType} content.` }, { status: 500 });
    }
}