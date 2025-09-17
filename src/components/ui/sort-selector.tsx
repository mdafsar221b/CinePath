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
      <SelectTrigger className="w-[180px] glass-card">
        <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
        <SelectValue placeholder="Sort by" />
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