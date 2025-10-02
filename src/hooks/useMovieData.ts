// src/hooks/useMovieData.ts
"use client";

import { useState, useEffect } from "react";
import { Movie } from "@/lib/types";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

/**
 * Custom hook for fetching and managing the list of watched Movies.
 * @returns { fetchMovies, movies, movieGenres, moviesByYear }
 */
export const useMovieData = () => {
    const { status } = useSession();
    const isLoggedIn = status === 'authenticated';
    
    const [movies, setMovies] = useState<Movie[]>([]);

    const fetchMovies = async () => {
        if (!isLoggedIn) {
            setMovies([]);
            return;
        }
        try {
            const res = await fetch("/api/movies");
            if (!res.ok) throw new Error("Failed to fetch movies");
            const data = await res.json();
            setMovies(data);
        } catch (e) {
            console.error("Error fetching movies:", e);
            toast.error("Failed to load movies.");
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchMovies();
        } else if (status === 'unauthenticated') {
            setMovies([]);
        }
    }, [isLoggedIn, status]);

    // --- Derived State & Stats Calculation ---
    
    // Calculate unique genres for filtering
    const movieGenres = Array.from(new Set(movies.flatMap(movie => movie.genre ? movie.genre.split(', ').map(g => g.trim()) : []))).sort();
    
    // Calculate movies watched per year for the dashboard
    const moviesByYear = movies.reduce((acc, movie) => {
        const year = new Date(movie.addedAt).getFullYear().toString();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return {
        fetchMovies,
        movies,
        movieGenres,
        moviesByYear,
        setMovies // Export setter (optional, but good for local updates if needed)
    };
};