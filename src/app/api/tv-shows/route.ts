// mdafsar221b/cinepath/CinePath-171babe307d46bb864042c512eef13a22b0b192f/src/app/api/tv-shows/route.ts
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/auth-utils";

export async function GET() {
    try {
        const userId = await getUserIdFromSession();
        const client = await clientPromise;
        const db = client.db("cinepath");
        const tvShows = await db.collection("tv_shows").find({ userId }).sort({ addedAt: -1 }).toArray();
        return NextResponse.json(tvShows);
    } catch (e) {
        if (e instanceof Error && e.message === "User not authenticated.") {
            return NextResponse.json({ error: e.message }, { status: 401 });
        }
        return NextResponse.json({ error: "Failed to fetch TV shows" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const userId = await getUserIdFromSession();
        const client = await clientPromise;
        const db = client.db("cinepath");
        const body = await request.json();
        const { title, poster_path, seasonsWatched, genre, plot, rating, actors, imdbRating, myRating, personalNotes, isFavorite } = body;

        // Check for existing show *for this user*
        const existingShow = await db.collection("tv_shows").findOne({ 
            title: { $regex: new RegExp(`^${title}$`, 'i') },
            userId // FILTER BY userId
        });

        if (existingShow) {
            const newSeason = seasonsWatched[0];
            const seasonIndex = existingShow.seasonsWatched.findIndex((s: any) => s.season === newSeason.season);

            if (seasonIndex !== -1) {
                // Update existing season's watched episodes
                const updatedSeasons = [...existingShow.seasonsWatched];
                updatedSeasons[seasonIndex] = {
                    ...updatedSeasons[seasonIndex],
                    watchedEpisodes: [...new Set([...updatedSeasons[seasonIndex].watchedEpisodes, ...newSeason.watchedEpisodes])]
                };
                await db.collection("tv_shows").updateOne(
                    { _id: existingShow._id, userId }, // FILTER BY userId
                    { 
                        $set: { 
                            seasonsWatched: updatedSeasons,
                            ...(genre && { genre }),
                            ...(plot && { plot }),
                            ...(rating && { rating }),
                            ...(actors && { actors }),
                            ...(imdbRating && { imdbRating }),
                            ...(myRating && { myRating }),
                            ...(personalNotes && { personalNotes }),
                            isFavorite: isFavorite !== undefined ? isFavorite : existingShow.isFavorite,
                        }
                    }
                );
            } else {
                // Add new season
                await db.collection("tv_shows").updateOne(
                    { _id: existingShow._id, userId }, // FILTER BY userId
                    { 
                        $push: { seasonsWatched: newSeason },
                        $set: {
                            ...(genre && { genre }),
                            ...(plot && { plot }),
                            ...(rating && { rating }),
                            ...(actors && { actors }),
                            ...(imdbRating && { imdbRating }),
                            ...(myRating && { myRating }),
                            ...(personalNotes && { personalNotes }),
                            isFavorite: isFavorite !== undefined ? isFavorite : existingShow.isFavorite,
                        }
                    }
                );
            }
            return NextResponse.json({ message: "TV show updated" });
        } else {
            // Create new TV show
            const result = await db.collection("tv_shows").insertOne({ 
                title, 
                poster_path, 
                seasonsWatched, 
                genre,
                plot,
                rating,
                actors,
                imdbRating,
                myRating,
                personalNotes,
                isFavorite,
                addedAt: new Date(),
                userId, // ADDED userId
            });
            return NextResponse.json(result, { status: 201 });
        }
    } catch (e) {
        if (e instanceof Error && e.message === "User not authenticated.") {
            return NextResponse.json({ error: e.message }, { status: 401 });
        }
        console.error("TV Show API error:", e);
        return NextResponse.json({ error: "Failed to add/update TV show" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const userId = await getUserIdFromSession();
        const client = await clientPromise;
        const db = client.db("cinepath");
        const body = await request.json();
        const { _id, myRating, personalNotes, isFavorite } = body;

        if (!_id) {
            return NextResponse.json({ error: "ID is required to update" }, { status: 400 });
        }

        const result = await db.collection("tv_shows").updateOne(
            { _id: new ObjectId(_id), userId }, // FILTER BY userId
            {
                $set: {
                    myRating,
                    personalNotes,
                    isFavorite
                }
            }
        );
        return NextResponse.json(result);
    } catch (e) {
        if (e instanceof Error && e.message === "User not authenticated.") {
            return NextResponse.json({ error: e.message }, { status: 401 });
        }
        console.error("Failed to update TV show:", e);
        return NextResponse.json({ error: "Failed to update TV show" }, { status: 500 });
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
        const result = await db.collection("tv_shows").deleteOne({ _id: new ObjectId(id), userId }); // FILTER BY userId
        return NextResponse.json(result);
    } catch (e) {
        if (e instanceof Error && e.message === "User not authenticated.") {
            return NextResponse.json({ error: e.message }, { status: 401 });
        }
        return NextResponse.json({ error: "Failed to delete TV show" }, { status: 500 });
    }
}