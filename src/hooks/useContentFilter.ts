
"use client";

import { useEffect, useState } from "react";
import { Movie, TVShow, WatchlistItem, SortOption, TVShowCategory } from "@/lib/types"; // IMPORTED TVShowCategory
import { sortContent } from "@/lib/utils";


type Content = Movie | TVShow | WatchlistItem;
type GenreFilter = string;

const ITEMS_PER_PAGE = 15;

interface UseContentFilterProps<T extends Content> {
  
    initialContent: T[];
   
    initialFilter: GenreFilter;
   
    initialSort: SortOption;
    
    filterKey: 'genre' | 'isFavorite';
}
export const useContentFilter = <T extends Content>({
    initialContent,
    initialFilter,
    initialSort,
    filterKey,
}: UseContentFilterProps<T>) => {
    const [page, setPage] = useState<number>(1);
    const [filter, setFilter] = useState<GenreFilter>(initialFilter);
    const [sort, setSort] = useState<SortOption>(initialSort);

    const filteredContent = initialContent.filter(item => {
        if (filter === "all") {
            return true;
        }

        // --- TV SHOW SPECIFIC FILTERING (filterKey: 'isFavorite' used to denote TV show filtering) ---
        if (filterKey === 'isFavorite') {
            const tvShow = item as TVShow;
            
            // 1. Filter by 'favorites'
            if (filter === 'favorites') {
                return tvShow.isFavorite === true;
            }
            
            // 2. Filter by explicit categories (Miniseries, Hindi Tv shows, Regular Series)
            const categoryFilters: TVShowCategory[] = ['Miniseries', 'Hindi Tv shows', 'Regular Series'];
            
            if (categoryFilters.includes(filter as TVShowCategory)) {
                const categoryFilter = filter as TVShowCategory;
                
                // Explicit categories: must match exactly
                if (categoryFilter === 'Miniseries' || categoryFilter === 'Hindi Tv shows') {
                    return tvShow.userCategory === categoryFilter;
                }
                
                // Regular Series: includes explicitly set or undefined/null (default)
                if (categoryFilter === 'Regular Series') {
                    return tvShow.userCategory === 'Regular Series' || tvShow.userCategory === undefined || tvShow.userCategory === null;
                }
            }
            
            // 3. Fallback to standard genre matching (for other filters like 'Action', 'Drama', etc.)
            return tvShow.genre?.toLowerCase().includes(filter.toLowerCase());
        }

        // Standard genre matching (for Movies)
        if (filterKey === 'genre') {
            return item.genre?.toLowerCase().includes(filter.toLowerCase());
        }
        
        return true;
    });

    // 2. Sorting Logic
    const sortedContent = sortContent(filteredContent, sort);
    const totalFilteredItems = sortedContent.length;

    // Reset page to 1 whenever filtering or sorting changes
    useEffect(() => {
        setPage(1);
    }, [filter, sort, initialContent]);


    // 3. Pagination Logic
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedContent = sortedContent.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return {
        paginatedContent,
        totalFilteredItems,
        page,
        setPage,
        filter,
        setFilter,
        sort,
        setSort,
        itemsPerPage: ITEMS_PER_PAGE,
    };
};