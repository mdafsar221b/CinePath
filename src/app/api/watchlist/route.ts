// mdafsar221b/cinepath/CinePath-171babe307d46bb864042c512eef13a22b0b192f/src/app/api/watchlist/route.ts
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/auth-utils";

export async function GET() {
    try {
        const userId = await getUserIdFromSession();
        const client = await clientPromise;
        const db = client.db("cinepath");
        const watchlist = await db.collection("watchlist").find({ userId }).sort({ addedAt: -1 }).toArray();
        return NextResponse.json(watchlist);
    } catch (e) {
        if (e instanceof Error && e.message === "User not authenticated.") {
            return NextResponse.json({ error: e.message }, { status: 401 });
        }
        return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const userId = await getUserIdFromSession();
        const client = await clientPromise;
        const db = client.db("cinepath");
        const body = await request.json();
        const { tmdbId, imdbId, title, year, poster_path, type, genre, plot, rating, actors, director, imdbRating } = body;

        if (!tmdbId) {
            return NextResponse.json({ error: "Watchlist item requires a unique TMDB ID." }, { status: 400 });
        }

        // Check if item already exists in watchlist for this user (using tmdbId)
        const existingItem = await db.collection("watchlist").findOne({ tmdbId: tmdbId, userId });
        if (existingItem) {
            return NextResponse.json({ error: "Item already in watchlist" }, { status: 409 });
        }

        // Check if item is already watched by this user (using tmdbId)
        const collectionName = type === 'movie' ? 'movies' : 'tv_shows';
        const watchedItem = await db.collection(collectionName).findOne({ 
            tmdbId: tmdbId,
            userId 
        });
        
        if (watchedItem) {
            return NextResponse.json({ error: "Item already watched" }, { status: 409 });
        }

        const result = await db.collection("watchlist").insertOne({
            tmdbId,
            imdbId,
            title,
            year,
            poster_path,
            type,
            genre,
            plot,
            rating,
            actors,
            director,
            imdbRating,
            addedAt: new Date(),
            userId, 
        });

        return NextResponse.json(result, { status: 201 });
    } catch (e) {
        if (e instanceof Error && e.message === "User not authenticated.") {
            return NextResponse.json({ error: e.message }, { status: 401 });
        }
        console.error("Watchlist add error:", e);
        return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const userId = await getUserIdFromSession();
        const client = await clientPromise;
        const db = client.db("cinepath");
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const result = await db.collection("watchlist").deleteOne({ _id: new ObjectId(id), userId });
        return NextResponse.json(result);
    } catch (e) {
        if (e instanceof Error && e.message === "User not authenticated.") {
            return NextResponse.json({ error: e.message }, { status: 401 });
        }
        return NextResponse.json({ error: "Failed to remove from watchlist" }, { status: 500 });
    }
}