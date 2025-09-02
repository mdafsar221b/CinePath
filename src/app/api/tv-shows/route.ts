import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("cinepath");
        const tvShows = await db.collection("tv_shows").find({}).sort({ addedAt: -1 }).toArray();
        return NextResponse.json(tvShows);
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch TV shows" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("cinepath");
        const body = await request.json();
        const { title, seasonsWatched } = body;

        // Find existing TV show with the same title
        const existingShow = await db.collection("tv_shows").findOne({ title: { $regex: new RegExp(`^${title}$`, 'i') } });

        if (existingShow) {
            const newSeason = seasonsWatched[0];
            const seasonExists = existingShow.seasonsWatched.some((s: any) => s.season === newSeason.season);

            if (seasonExists) {
                const updatedSeasons = existingShow.seasonsWatched.map((s: any) =>
                    s.season === newSeason.season
                        ? { ...s, episodes: s.episodes + newSeason.episodes }
                        : s
                );
                await db.collection("tv_shows").updateOne(
                    { _id: existingShow._id },
                    { $set: { seasonsWatched: updatedSeasons } }
                );
            } else {
                await db.collection("tv_shows").updateOne(
                    { _id: existingShow._id },
                    { $push: { seasonsWatched: newSeason } }
                );
            }
            return NextResponse.json({ message: "TV show updated" });
        } else {
            const result = await db.collection("tv_shows").insertOne({ ...body, addedAt: new Date() });
            return NextResponse.json(result, { status: 201 });
        }
    } catch (e) {
        return NextResponse.json({ error: "Failed to add/update TV show" }, { status: 500 });
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
        const result = await db.collection("tv_shows").deleteOne({ _id: new ObjectId(id) });
        return NextResponse.json(result);
    } catch (e) {
        return NextResponse.json({ error: "Failed to delete TV show" }, { status: 500 });
    }
}