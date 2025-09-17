
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
        const { title, poster_path, seasonsWatched, genre, plot, rating, actors, imdbRating, myRating, personalNotes, isFavorite } = body;

        const existingShow = await db.collection("tv_shows").findOne({ title: { $regex: new RegExp(`^${title}$`, 'i') } });

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
                    { _id: existingShow._id },
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
                    { _id: existingShow._id },
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
                addedAt: new Date() 
            });
            return NextResponse.json(result, { status: 201 });
        }
    } catch (e) {
        console.error("TV Show API error:", e);
        return NextResponse.json({ error: "Failed to add/update TV show" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("cinepath");
        const body = await request.json();
        const { _id, myRating, personalNotes, isFavorite } = body;

        if (!_id) {
            return NextResponse.json({ error: "ID is required to update" }, { status: 400 });
        }

        const result = await db.collection("tv_shows").updateOne(
            { _id: new ObjectId(_id) },
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
        console.error("Failed to update TV show:", e);
        return NextResponse.json({ error: "Failed to update TV show" }, { status: 500 });
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