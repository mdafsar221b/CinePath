"use client";

import { ArrowUpDown } from "lucide-react";
import { SortOption } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SortSelectorProps {
  value: SortOption;
  onValueChange: (value: SortOption) => void;
}

export const SortSelector = ({ value, onValueChange }: SortSelectorProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[145px]">
        <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="addedAt_desc">Newest Added</SelectItem>
        <SelectItem value="addedAt_asc">Oldest Added</SelectItem>
        <SelectItem value="title_asc">Title A-Z</SelectItem>
        <SelectItem value="title_desc">Title Z-A</SelectItem>
        <SelectItem value="imdbRating_desc">Top Rated</SelectItem>
        <SelectItem value="imdbRating_asc">Low Rated</SelectItem>
        <SelectItem value="year_desc">Newest Year</SelectItem>
        <SelectItem value="year_asc">Oldest Year</SelectItem>
        <SelectItem value="category_asc">Category A-Z</SelectItem>
        <SelectItem value="category_desc">Category Z-A</SelectItem>
      </SelectContent>
    </Select>
  );
};
