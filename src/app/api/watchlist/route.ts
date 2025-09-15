
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("cinepath");
        const watchlist = await db.collection("watchlist").find({}).sort({ addedAt: -1 }).toArray();
        return NextResponse.json(watchlist);
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("cinepath");
        const body = await request.json();
        const { id, title, year, poster_path, type, genre, plot, rating, actors, director, imdbRating } = body;

        // Check if item already exists in watchlist
        const existingItem = await db.collection("watchlist").findOne({ id: id });
        if (existingItem) {
            return NextResponse.json({ error: "Item already in watchlist" }, { status: 409 });
        }

        // Check if item is already watched
        const collectionName = type === 'movie' ? 'movies' : 'tv_shows';
        const watchedItem = await db.collection(collectionName).findOne({ 
            title: { $regex: new RegExp(`^${title}$`, 'i') } 
        });
        
        if (watchedItem) {
            return NextResponse.json({ error: "Item already watched" }, { status: 409 });
        }

        const result = await db.collection("watchlist").insertOne({
            id,
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
            addedAt: new Date()
        });

        return NextResponse.json(result, { status: 201 });
    } catch (e) {
        console.error("Watchlist add error:", e);
        return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("cinepath");
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const result = await db.collection("watchlist").deleteOne({ _id: new ObjectId(id) });
        return NextResponse.json(result);
    } catch (e) {
        return NextResponse.json({ error: "Failed to remove from watchlist" }, { status: 500 });
    }
}