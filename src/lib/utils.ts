import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Movie, TVShow, WatchlistItem, SortOption } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sortContent = <T extends Movie | TVShow | WatchlistItem>(content: T[], sortOption: SortOption): T[] => {
    return [...content].sort((a, b) => {
        switch (sortOption) {
            case "addedAt_desc":
                return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
            case "addedAt_asc":
                return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
            case "title_asc":
                return a.title.localeCompare(b.title);
            case "title_desc":
                return b.title.localeCompare(a.title);
            case "imdbRating_desc":
                // FIX: Robustly parse rating, defaulting to 0 for N/A or missing values
                const aRatingDesc = parseFloat(a.imdbRating || "0");
                const bRatingDesc = parseFloat(b.imdbRating || "0");
                return bRatingDesc - aRatingDesc;
            case "imdbRating_asc":
                // FIX: Robustly parse rating, defaulting to 0 for N/A or missing values
                const aRatingAsc = parseFloat(a.imdbRating || "0");
                const bRatingAsc = parseFloat(b.imdbRating || "0");
                return aRatingAsc - bRatingAsc;
            case "year_desc":
                const aYearDesc = 'year' in a && typeof a.year === 'number' ? a.year : new Date(a.addedAt).getFullYear();
                const bYearDesc = 'year' in b && typeof b.year === 'number' ? b.year : new Date(b.addedAt).getFullYear();
                return (bYearDesc ?? 0) - (aYearDesc ?? 0);
            case "year_asc":
                const aYearAsc = 'year' in a && typeof a.year === 'number' ? a.year : new Date(a.addedAt).getFullYear();
                const bYearAsc = 'year' in b && typeof b.year === 'number' ? b.year : new Date(b.addedAt).getFullYear();
                return (aYearAsc ?? 0) - (bYearAsc ?? 0);
            case "category_asc": // ADDED
                // Sort by userCategory, treating null/undefined as 'Regular Series'
                const aCatAsc = ('userCategory' in a && a.userCategory) ? a.userCategory : 'Regular Series';
                const bCatAsc = ('userCategory' in b && b.userCategory) ? b.userCategory : 'Regular Series';
                return aCatAsc.localeCompare(bCatAsc);
            case "category_desc": // ADDED
                // Sort by userCategory, treating null/undefined as 'Regular Series'
                const aCatDesc = ('userCategory' in a && a.userCategory) ? a.userCategory : 'Regular Series';
                const bCatDesc = ('userCategory' in b && b.userCategory) ? b.userCategory : 'Regular Series';
                return bCatDesc.localeCompare(aCatDesc);
            default:
                return 0;
        }
    });
};