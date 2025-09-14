import { NextRequest, NextResponse } from "next/server";
import { handleServerError, handleClientError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return handleClientError("ID parameter is required", 400);
    }

    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) {
        return handleServerError("OMDB_API_KEY is not set", null);
    }

    try {
        const apiResponse = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${encodeURIComponent(id)}&plot=full`);
        if (!apiResponse.ok) {
            throw new Error(`API call failed with status: ${apiResponse.status}`);
        }
        const data = await apiResponse.json();

        if (data.Response === "False") {
            return handleClientError(data.Error, 404);
        }

        const details = {
            title: data.Title,
            year: parseInt(data.Year),
            imdbID: data.imdbID,
            poster_path: data.Poster !== "N/A" ? data.Poster : null,
            plot: data.Plot !== "N/A" ? data.Plot : "No plot available.",
            genre: data.Genre !== "N/A" ? data.Genre : "N/A",
            imdbRating: data.imdbRating !== "N/A" ? data.imdbRating : "N/A",
            director: data.Director !== "N/A" ? data.Director : "N/A",
            actors: data.Actors !== "N/A" ? data.Actors : "N/A",
            runtime: data.Runtime !== "N/A" ? data.Runtime : "N/A",
        };

        return NextResponse.json(details);
    } catch (e) {
        return handleServerError("Failed to fetch details", e);
    }
}