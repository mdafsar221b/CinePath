
"use client";

import { useEffect, useState } from "react";
import { Movie, TVShow, WatchlistItem, SortOption } from "@/lib/types";
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

        // Special handling for 'favorites' on TV Shows
        if (filterKey === 'isFavorite' && filter === 'favorites') {
            return (item as TVShow).isFavorite === true;
        }

        // Standard genre matching
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