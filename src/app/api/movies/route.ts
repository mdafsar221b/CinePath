import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("cinepath"); 
        const movies = await db.collection("movies").find({}).sort({ addedAt: -1 }).toArray();
        return NextResponse.json(movies);
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("cinepath");
        const body = await request.json();
        const { title, year, poster_path } = body;
        const result = await db.collection("movies").insertOne({ title, year, poster_path, addedAt: new Date() });
        return NextResponse.json(result, { status: 201 });
    } catch (e) {
        return NextResponse.json({ error: "Failed to add movie" }, { status: 500 });
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
        const result = await db.collection("movies").deleteOne({ _id: new ObjectId(id) });
        return NextResponse.json(result);
    } catch (e) {
        return NextResponse.json({ error: "Failed to delete movie" }, { status: 500 });
    }
}