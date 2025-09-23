"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  loading: boolean;
}

export const SearchInput = ({ searchTerm, onSearchChange, onSearchSubmit, onClear, loading }: SearchInputProps) => {
  return (
    <div className="glass-card rounded-2xl p-6">
      <form onSubmit={onSearchSubmit} className="flex gap-3 items-center">
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search for movies and TV shows..."
          className="flex-1 rounded-xl"
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="rounded-full text-muted-foreground hover:bg-muted/30"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
        <Button type="submit" size="icon" disabled={loading} className="rounded-xl">
          <Search className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};