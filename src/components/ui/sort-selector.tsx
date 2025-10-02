
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption } from "@/lib/types";
import { ArrowUpDown } from "lucide-react";

interface SortSelectorProps {
  value: SortOption;
  onValueChange: (value: SortOption) => void;
}

export const SortSelector = ({ value, onValueChange }: SortSelectorProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[120px] sm:w-[180px] glass-card">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground sm:mr-2" />
        {/* Only show text on desktop/tablet screens */}
        <span className="hidden sm:inline">
            <SelectValue placeholder="Sort by" />
        </span>
        {/* Use a short placeholder for mobile for better spacing */}
        <span className="sm:hidden">
            <SelectValue placeholder="Sort" />
        </span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="addedAt_desc">Added-Newest</SelectItem>
        <SelectItem value="addedAt_asc">Added-Oldest</SelectItem>
        <SelectItem value="title_asc">A-Z</SelectItem>
        <SelectItem value="title_desc">Z-A</SelectItem>
        <SelectItem value="imdbRating_desc">Rating-Highest</SelectItem>
        <SelectItem value="imdbRating_asc">Rating-Lowest</SelectItem>
        <SelectItem value="year_desc">Newest</SelectItem>
        <SelectItem value="year_asc">Oldest</SelectItem>
      </SelectContent>
    </Select>
  );
};