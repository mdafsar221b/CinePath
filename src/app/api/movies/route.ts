// mdafsar221b/cinepath/CinePath-171babe307d46bb864042c512eef13a22b0b192f/src/app/api/movies/route.ts
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/auth-utils";

export async function GET() {
    try {
        const userId = await getUserIdFromSession(); 
        const client = await clientPromise;
        const db = client.db("cinepath"); 
        // FILTER BY userId
        const movies = await db.collection("movies").find({ userId }).sort({ addedAt: -1 }).toArray(); 
        return NextResponse.json(movies);
    } catch (e) {
        if (e instanceof Error && e.message === "User not authenticated.") {
            return NextResponse.json({ error: e.message }, { status: 401 });
        }
        return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const userId = await getUserIdFromSession(); 
        const client = await clientPromise;
        const db = client.db("cinepath");
        const body = await request.json();
        const { title, year, poster_path, genre, plot, rating, actors, director, imdbRating, myRating, personalNotes } = body;
        const result = await db.collection("movies").insertOne({ 
            title, 
            year, 
            poster_path, 
            genre,
            plot,
            rating,
            actors,
            director,
            imdbRating,
            myRating,
            personalNotes,
            addedAt: new Date(),
            userId, // ADDED userId
        });
        return NextResponse.json(result, { status: 201 });
    } catch (e) {
        if (e instanceof Error && e.message === "User not authenticated.") {
            return NextResponse.json({ error: e.message }, { status: 401 });
        }
        return NextResponse.json({ error: "Failed to add movie" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const userId = await getUserIdFromSession(); 
        const client = await clientPromise;
        const db = client.db("cinepath");
        const body = await request.json();
        const { _id, myRating, personalNotes } = body;

        if (!_id) {
            return NextResponse.json({ error: "ID is required to update" }, { status: 400 });
        }

        const result = await db.collection("movies").updateOne(
            { _id: new ObjectId(_id), userId }, // FILTER BY userId
            { 
                $set: {
                    myRating,
                    personalNotes
                }
            }
        );
        return NextResponse.json(result);
    } catch (e) {
        if (e instanceof Error && e.message === "User not authenticated.") {
            return NextResponse.json({ error: e.message }, { status: 401 });
        }
        console.error("Failed to update movie:", e);
        return NextResponse.json({ error: "Failed to update movie" }, { status: 500 });
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
        const result = await db.collection("movies").deleteOne({ _id: new ObjectId(id), userId }); // FILTER BY userId
        return NextResponse.json(result);
    } catch (e) {
        if (e instanceof Error && e.message === "User not authenticated.") {
            return NextResponse.json({ error: e.message }, { status: 401 });
        }
        return NextResponse.json({ error: "Failed to delete movie" }, { status: 500 });
    }
}