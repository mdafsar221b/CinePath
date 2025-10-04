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
        
        const { 
            id, 
            title, 
            poster_path, 
            watchedEpisodeIds = [], 
            favoriteEpisodeIds = [], 
            totalEpisodes, 
            trackedSeasonCount, 
            genre, 
            plot, 
            rating, 
            actors, 
            imdbRating, 
            myRating, 
            personalNotes, 
            isFavorite,
            userCategory // ADDED
        } = body;

        if (!id) {
            return NextResponse.json({ error: "TV Show requires a unique ID." }, { status: 400 });
        }

        const findQuery = { id, userId };
        const existingShow = await db.collection("tv_shows").findOne(findQuery);

        const updateFields = {
            title, 
            poster_path, 
            genre,
            plot,
            rating,
            actors,
            imdbRating,
            ...(totalEpisodes !== undefined && { totalEpisodes }), 
            ...(trackedSeasonCount !== undefined && { trackedSeasonCount }),
            ...(myRating !== undefined && { myRating }),
            ...(personalNotes !== undefined && { personalNotes }),
            isFavorite: isFavorite !== undefined ? isFavorite : existingShow?.isFavorite || false,
            userCategory: userCategory !== undefined ? userCategory : (existingShow?.userCategory || 'Regular Series'), // ADDED: Use incoming, existing, or default
        };

        if (existingShow) {
          
            const existingWatchedIds = existingShow.watchedEpisodeIds || [];
            const mergedWatchedIds = Array.from(new Set([...existingWatchedIds, ...watchedEpisodeIds]));
            
            const existingFavoriteIds = existingShow.favoriteEpisodeIds || []; 
            const mergedFavoriteIds = Array.from(new Set([...existingFavoriteIds, ...favoriteEpisodeIds])); 

            await db.collection("tv_shows").updateOne(
                { _id: existingShow._id, userId },
                { 
                    $set: { 
                        ...updateFields,
                        watchedEpisodeIds: mergedWatchedIds,
                        favoriteEpisodeIds: mergedFavoriteIds, 
                    }
                }
            );
            return NextResponse.json({ message: "TV show updated" });
        } else {
            // Create new TV show
            const result = await db.collection("tv_shows").insertOne({ 
                ...updateFields,
                id,
                watchedEpisodeIds,
                favoriteEpisodeIds, 
                addedAt: new Date(),
                userId,
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
        // ADDED: userCategory to destructuring
        const { _id, myRating, personalNotes, isFavorite, watchedEpisodeIds, favoriteEpisodeIds, totalEpisodes, trackedSeasonCount, userCategory } = body; 

        if (!_id) {
            return NextResponse.json({ error: "ID is required to update" }, { status: 400 });
        }

        const updateData: any = {
            myRating,
            personalNotes,
            isFavorite
        };
        
        if (watchedEpisodeIds !== undefined) {
             updateData.watchedEpisodeIds = watchedEpisodeIds;
        }
        
        if (favoriteEpisodeIds !== undefined) { 
             updateData.favoriteEpisodeIds = favoriteEpisodeIds;
        }
        
        if (totalEpisodes !== undefined) { 
             updateData.totalEpisodes = totalEpisodes;
        }
        
        if (trackedSeasonCount !== undefined) { 
             updateData.trackedSeasonCount = trackedSeasonCount;
        }

        if (userCategory !== undefined) { // ADDED
            updateData.userCategory = userCategory;
        }

        const result = await db.collection("tv_shows").updateOne(
            { _id: new ObjectId(_id), userId },
            {
                $set: updateData
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
        const result = await db.collection("tv_shows").deleteOne({ _id: new ObjectId(id), userId });
        return NextResponse.json(result);
    } catch (e) {
        if (e instanceof Error && e.message === "User not authenticated.") {
            return NextResponse.json({ error: e.message }, { status: 401 });
        }
        return NextResponse.json({ error: "Failed to delete TV show" }, { status: 500 });
    }
}